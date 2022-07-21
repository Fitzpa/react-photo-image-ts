export interface IPhoto {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  srcSet: string[];
  sizes: string[];
  containerHeight?: number;
  top?: number;
  left?: number;
}
export interface IPhotoProps {
  index: number;
  onClickHandler: (e: MouseEvent | TouchEvent | PointerEvent, { photo, index}: { photo: IPhoto, index: number}) => void;
  photo: IPhoto;
  margin: number;
  direction: string;
  top?: number;
  left?: number;
}