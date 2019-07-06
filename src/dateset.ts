import {Course} from './common';

export default class DateSet {
  private dates: Array<[Date, Course]>;
  constructor(courses: Course[]) {
    this.dates = [];
    for (const course of courses) {
      if (course.testDates) {
        for (const testDate of course.testDates) {
          this.dates.push([testDate, course]);
        }
      }
    }

    this.dates.sort((a, b) => (a[0].getTime() - b[0].getTime()));
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
      const distance =
          this.dates[i + 1][0].getTime() - this.dates[i][0].getTime();
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
  public fitsWithDistance(date: Date, days: number): boolean {
    const dInMillisecs = days * 24 * 3600 * 1000;

    for (const existingDate of this.dates) {
      if (Math.abs(date.getTime() - existingDate[0].getTime()) < dInMillisecs) {
        return false;
      }
    }

    return true;
  }

  public getDatesAndDistances(): Array<[number, Date, Course]> {
    if (this.dates.length === 0) {
      return [];
    }

    const result: Array<[number, Date, Course]> =
        [[0, this.dates[0][0], this.dates[0][1]]];

    for (let i = 1; i < this.dates.length; i++) {
      const distance =
          this.dates[i][0].getTime() - this.dates[i - 1][0].getTime();
      const dInDays = Math.ceil(distance / (24 * 3600 * 1000));

      result.push([dInDays, this.dates[i][0], this.dates[i][1]]);
    }

    return result;
  }
}
