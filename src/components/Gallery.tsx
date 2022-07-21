import React, { useState, useLayoutEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import Photo from './Photo';
import { css } from 'goober'
import type { IPhoto } from "../types"
import { computeColumnLayout } from '../layouts/columns';
import { computeRowLayout } from '../layouts/justified';
import { findIdealNodeSearch } from '../utils/findIdealNodeSearch';
import cx from 'classnames'
import { setup } from "goober";

setup(React.createElement);
export interface IGallery {
  photos: IPhoto[]
  direction: string
  galleryOnClickHandler: (e: MouseEvent | TouchEvent | PointerEvent, { photo, index, previous, next}: { photo: IPhoto, index: number, previous: IPhoto, next: IPhoto}) => void;
  columns: number,
  targetRowHeight: number
  limitNodeSearch: number
  margin: number,
  renderImage: () => JSX.Element,
};

const Gallery = React.memo(function Gallery({
  photos,
  galleryOnClickHandler,
  direction = "row",
  margin = 2,
  limitNodeSearch,
  targetRowHeight = 300,
  columns
}: IGallery) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [galleryHeight, setGalleryHeight] = useState(0);
  const galleryRef = useRef(null);

  useLayoutEffect(() => {
    let animationFrameID: number | null = null;
    const observer = new ResizeObserver(entries => {
      // only do something if width changes
      const newWidth = entries[0].contentRect.width;
      if (containerWidth !== newWidth) {
        // put in an animation frame to stop "benign errors" from
        // ResizObserver https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
        if(animationFrameID !== null) {
          animationFrameID = window.requestAnimationFrame(() => {
            setContainerWidth(Math.floor(newWidth));
          });
        }
      }
    });

    if(animationFrameID === null) {
      throw new Error('animationFrameID is null');
    }

    if(galleryRef.current === null) {
      throw new Error('Gallery element is null');
    }

    observer.observe(galleryRef.current);
    return () => {
      observer.disconnect();
      if(animationFrameID !== null) {
        window.cancelAnimationFrame(animationFrameID);
      }
    };
  }, [galleryRef]);

  const handleClick = (e: MouseEvent | TouchEvent | PointerEvent, { index }: { index: number}) => {
    return (    galleryOnClickHandler(e, {
      index,
      photo: photos[index],
      previous: photos[index - 1] || null,
      next: photos[index + 1] || null,
    }))
  }

  // no containerWidth until after first render with refs, skip calculations and render nothing
  if (!containerWidth) return <div ref={galleryRef}>&nbsp;</div>;
  // subtract 1 pixel because the browser may round up a pixel
  const width = containerWidth - 1;
  let thumbnails;

  if (direction === 'row') {
    // // allow user to calculate limitNodeSearch from containerWidth
    // if (typeof limitNodeSearch === 'function') {
    //   limitNodeSearch = limitNodeSearch(containerWidth);
    // }
    // if (typeof targetRowHeight === 'function') {
    //   targetRowHeight = targetRowHeight(containerWidth);
    // }
    // set how many neighboring nodes the graph will visit
    if (limitNodeSearch === undefined) {
      limitNodeSearch = 2;
      if (containerWidth >= 450) {
        limitNodeSearch = findIdealNodeSearch({ containerWidth, targetRowHeight });
      }
    }

    thumbnails = computeRowLayout({ containerWidth: width, limitNodeSearch, targetRowHeight, margin, photos });
  }
  if (direction === 'column') {
    // allow user to calculate columns from containerWidth
    // if (typeof columns === 'function') {
    //   columns = columns(containerWidth);
    // }
    // set default breakpoints if user doesn't specify columns prop
    if (columns === undefined) {
      columns = 1;
      if (containerWidth >= 500) columns = 2;
      if (containerWidth >= 900) columns = 3;
      if (containerWidth >= 1500) columns = 4;
    }

    thumbnails = computeColumnLayout({ containerWidth: width, columns, margin, photos });
    if(thumbnails === null) {
      throw new Error('thumbnails is null');
    }
    if(thumbnails.length === 0) {
      throw new Error('thumbnails is empty');
    }
    if(thumbnails[thumbnails.length - 1] === undefined) {
      throw new Error('thumbnails[thumbnails.length - 1].containerHeight is undefined');
    }
    if(thumbnails[thumbnails.length - 1].containerHeight === undefined) {
      throw new Error('thumbnails[thumbnails.length - 1].containerHeight is undefined');
    }
    if(typeof thumbnails[thumbnails.length - 1].containerHeight === 'number') {
  
      let galleryHeight = thumbnails[thumbnails.length - 1].containerHeight;

      if(galleryHeight !== undefined && galleryHeight > 0) {
        setGalleryHeight(galleryHeight);
      }
    }
  }

  return (
    <div className="react-photo-gallery--gallery">
      <div ref={galleryRef} data-containerheight={galleryHeight} className={cx(direction=== "column" ? DirectionColumn : DirectionRow)}>
        {thumbnails?.map((thumbnail, index) => {
          const { left, top, containerHeight, ...photo } = thumbnail;
          return (<Photo index={index} onClickHandler={handleClick} photo={photo} margin={margin} direction={direction} top={top} left={left}  />)
        })}
      </div>
    </div> );
});

const DirectionRow = css`
  display: flex; 
  flexWrap: wrap; 
  flexDirection: row;
`;
const DirectionColumn = css`
  position: relative;
`;

export { Photo };
export default Gallery
