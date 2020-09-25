import {expect} from 'chai';
import {minutesToTime} from '../src/formatting';

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
      {minutes: 720, time: '12:00'},
      {minutes: 780, time: '13:00'},
    ];
    testCases.forEach((tc) => {
      it('should format ' + tc.minutes + ' as ' + tc.time, function() {
        expect(minutesToTime(tc.minutes)).to.equal(tc.time);
      });
    });
  });
});
