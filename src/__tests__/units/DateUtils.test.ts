import { epochToDateFormat } from '../../utils/DateUtils';

describe('Epoch to Date Format', (): void => {
  it.each([
    { epoch: 1643760000000, expectedStr: '2022-02-02' },
    { epoch: 0, expectedStr: '1970-01-01' },
    { epoch: -1643760000000, expectedStr: '1917-11-30' }
  ])('Epoch to Date Format', ({ epoch, expectedStr }): void => {
    expect(epochToDateFormat(epoch)).toEqual(expectedStr);
  });
});
