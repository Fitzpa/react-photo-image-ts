import { round } from './round';

// return two decimal places rounded number
export const ratio = ({ width, height }: { width: number; height: number }) =>
  round(width / height, 2);
