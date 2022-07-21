export const round = (value: number, decimals?: number) => {
  if (!decimals) decimals = 0;
  return Number(Math.round(parseFloat(`${value}.${decimals}`)));
};
