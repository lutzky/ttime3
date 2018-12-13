
import {expect} from 'chai';

import {AcademicEvent} from '../src/common';
import {layoutLayeredEvents} from '../src/render';

describe('Render', function() {
  it('should correctly lay out layered events', function() {
    const events = [
      {day: 1, startMinute: 5, endMinute: 25},
      {day: 1, startMinute: 0, endMinute: 15},
      {day: 1, startMinute: 20, endMinute: 35},
      {day: 2, startMinute: 5, endMinute: 25},
      {day: 2, startMinute: 0, endMinute: 15},
      {day: 2, startMinute: 10, endMinute: 35},
    ] as AcademicEvent[];

    const result = layoutLayeredEvents(events);

    expect(result).to.deep.equal([
      {
        event: events[0],
        layer: 0,
        numLayers: 2,
      },
      {
        event: events[1],
        layer: 1,
        numLayers: 2,
      },
      {
        event: events[2],
        layer: 1,
        numLayers: 2,
      },
      {
        event: events[3],
        layer: 0,
        numLayers: 3,
      },
      {
        event: events[4],
        layer: 1,
        numLayers: 3,
      },
      {
        event: events[5],
        layer: 2,
        numLayers: 3,
      },
    ]);
  });
});
