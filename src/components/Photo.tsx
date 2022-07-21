import React, {Suspense} from 'react';
import { useImage } from 'react-image';
import { styled } from 'goober';
import type { IPhotoProps } from "../types"

function PhotoChild({
  // @ts-ignore
  index,
  onClickHandler,
  photo,
  // @ts-ignore
  margin,
  // @ts-ignore
  direction,
  // @ts-ignore
  top,
  // @ts-ignore
  left,
}: IPhotoProps) {

  const {src} = useImage({
    srcList: photo.srcSet ? [photo.src, ...photo.srcSet] : photo.src,
  })
 
  return <img key={photo.key} onClick={()=>onClickHandler} loading="lazy" src={src} />
}

const StyledImage = styled(PhotoChild)(
  props => `
  cursor: 'pointer',
  margin: ${props.margin},
  display: 'block',
  position: ${props.direction === 'column' ? 'absolute' : 'relative'},
  left: ${props.direction === 'column' ? props.left : 'unset'},
  top: ${props.direction === 'column' ? props.top : 'unset'},
`
);

export default function Photo({
  index,
  onClickHandler,
  photo,
  margin,
  direction,
  top,
  left,
}: IPhotoProps) {
  return (
    <Suspense>
      <StyledImage index={index} onClickHandler={onClickHandler} photo={photo} margin={margin} direction={direction} top={top} left={left}/>
    </Suspense>
  )
}
