export const currentTimeToPollyMarkTime = (currentTime: number) => {
  return Math.round((currentTime + Number.EPSILON) * 100000) / 100000;
};
