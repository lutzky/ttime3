
import {expect} from 'chai';

import {AcademicEvent, eventsCollide} from '../src/common';

describe('Common functions', function() {
  it('should detect when events collide', function() {
    const events = [
      {day: 1, startMinute: 10, endMinute: 20},
      {day: 1, startMinute: 19, endMinute: 29},
      {day: 1, startMinute: 28, endMinute: 38},
    ] as AcademicEvent[];

    expect(eventsCollide([events[0], events[1]])).to.equal(true);
    expect(eventsCollide([events[1], events[2]])).to.equal(true);
    expect(eventsCollide([events[0], events[2]])).to.equal(false);
    expect(eventsCollide(events)).to.equal(true);
  });
});
