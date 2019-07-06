import {expect} from 'chai';
import {formatDate, minutesToTime} from '../src/formatting';

// https://mochajs.org/#arrow-functions
/* tslint:disable:only-arrow-functions */

describe('Formatting', function() {
  describe('time formatting', function() {
    const testCases = [
      {minutes: 0, time: '00:00'},
      {minutes: 59, time: '00:59'},
      {minutes: 60, time: '01:00'},
      {minutes: 90, time: '01:30'},
      {minutes: 600, time: '10:00'},
      {minutes: 600, time: '10:00'},
      {minutes: 720, time: '12:00'},
      {minutes: 780, time: '13:00'},
    ];
    testCases.forEach((tc) => {
      it('should format ' + tc.minutes + ' as ' + tc.time, function() {
        expect(minutesToTime(tc.minutes)).to.equal(tc.time);
      });
    });
  });

  describe('date formatting', function() {
    const testCases = [
      {d: {year: 2009, month: 7, day: 6}, want: 'Mon Jul 06 2009'},
      {d: {year: 2009, month: 1, day: 1}, want: 'Thu Jan 01 2009'},
      {d: {year: 1999, month: 12, day: 31}, want: 'Fri Dec 31 1999'},
    ];
    testCases.forEach((tc) => {
      it('should format ' + tc.d + ' as ' + tc.want, function() {
        expect(formatDate(tc.d)).to.equal(tc.want);
      });
    });
  });
});
