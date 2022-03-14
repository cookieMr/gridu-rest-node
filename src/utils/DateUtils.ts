export const epochToDateFormat = (epoch: number): string =>
  new Date(epoch).toISOString().split('T')[0];
