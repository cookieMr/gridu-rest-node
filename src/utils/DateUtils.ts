export const epochToDateFormat = (epoch: number): string => {
  return new Date(epoch).toISOString().split('T')[0];
};
