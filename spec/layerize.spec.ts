import { expect } from "chai";

import { AcademicEvent, eventsCollide } from "../src/common";
import layerize from "../src/layerize";

describe("Render", function () {
  it("should correctly lay out layered events", function () {
    const events = [
      { day: 1, startMinute: 5, endMinute: 25 },
      { day: 1, startMinute: 0, endMinute: 15 },
      { day: 1, startMinute: 20, endMinute: 35 },
      { day: 2, startMinute: 5, endMinute: 25 },
      { day: 2, startMinute: 0, endMinute: 15 },
      { day: 2, startMinute: 10, endMinute: 35 },
    ] as AcademicEvent[];

    const result = layerize(events, eventsCollide);

    expect(result).to.deep.equal([
      {
        obj: events[0],

        layer: 0,
        numLayers: 2,
      },
      {
        obj: events[1],

        layer: 1,
        numLayers: 2,
      },
      {
        obj: events[2],

        layer: 1,
        numLayers: 2,
      },
      {
        obj: events[3],

        layer: 0,
        numLayers: 3,
      },
      {
        obj: events[4],

        layer: 1,
        numLayers: 3,
      },
      {
        obj: events[5],

        layer: 2,
        numLayers: 3,
      },
    ]);
  });
});
