import {DateObj} from './common';

export default class DateSet {
  private dates: Date[];
  constructor(dateObjs: DateObj[]) {
    this.dates = dateObjs.map(
        (dObj: DateObj) => new Date(dObj.year, dObj.month, dObj.day));
    this.dates.sort((a, b) => (a.getTime() - b.getTime()));
  }

  /**
   * Returns false iff there are 2 dates in the DateSet with a distance of less
   * than the given number of days.
   *
   * Returns true i there are fewer than 2 dates in the DateSet.
   */
  public hasMinDistance(days: number): boolean {
    if (this.dates.length < 2) {
      return true;
    }

    const dInMillisecs = days * 24 * 3600 * 1000;

    for (let i = 0; i < this.dates.length - 1; i++) {
      const distance = this.dates[i + 1].getTime() - this.dates[i].getTime();
      if (distance < dInMillisecs) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns false iff there is a date in the DateSet less than the given number
   * of days away from the given date.
   *
   * Returns true if DateSet is empty.
   */
  public fitsWithDistance(date: DateObj, days: number): boolean {
    const dInMillisecs = days * 24 * 3600 * 1000;

    const dateAsObj = new Date(date.year, date.month, date.day);

    for (const existingDate of this.dates) {
      if (Math.abs(dateAsObj.getTime() - existingDate.getTime()) <
          dInMillisecs) {
        return false;
      }
    }

    return true;
  }
}
