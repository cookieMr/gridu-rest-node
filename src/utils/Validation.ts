import { Log } from './Logger';

export class Validation {
  // source of this regex: https://stackoverflow.com/a/22061879/2873858
  private static readonly dateRegexp = /^\\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$'/;

  private static readonly limitRegexp = /^[1-9]\\d*$/;

  @Log()
  public static isValidDate(date: string | undefined): number | undefined {
    if (!date) {
      return undefined;
    }

    if (!Validation.dateRegexp.test(date)) {
      throw new Error(`The input date does not match a regexp for YYYY-MM-DD: [${date}]`);
    }

    return Date.parse(date);
  }

  @Log()
  public static isValidLimit(limit: string | undefined): number | undefined {
    if (!limit) {
      return undefined;
    }

    if (!Validation.limitRegexp.test(limit)) {
      throw new Error(`The input limit is not a number: [${limit}]`);
    }

    const nrLimit = +limit;
    if (nrLimit <= 0) {
      throw new Error(`The input limit is expected to be a positive (non-zero) number: [${nrLimit}]`);
    }

    return nrLimit;
  }

  @Log()
  public static is1stDateBefore2ndDate(date1st: number, date2nd: number): void {
    if (date1st > date2nd) {
      throw new Error(
        `The first date (epoch: ${date1st}) is expected to be before the second date (epoch ${date2nd}).`
      );
    }
  }
}
