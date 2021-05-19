import { expect } from "chai";

import { Course } from "../src/common";
import DateSet from "../src/dateset";

// https://mochajs.org/#arrow-functions
/* tslint:disable:only-arrow-functions */

function courseWithTest(dObj: Date): Course {
  return { testDates: [dObj] } as Course;
}

describe("DateSet", function () {
  it("should know if they have a minimal existing interval", function () {
    const d1 = courseWithTest(new Date(2006, 4, 1));
    // 2 days interval
    const d2 = courseWithTest(new Date(2006, 4, 3));
    // 3 days interval
    const d3 = courseWithTest(new Date(2006, 4, 6));

    const ds = new DateSet([d1, d2, d3]);

    /* tslint:disable:no-unused-expression */
    expect(ds.hasMinDistance(1)).to.be.true;
    expect(ds.hasMinDistance(2)).to.be.true;
    expect(ds.hasMinDistance(3)).to.be.false;
    /* tslint:enable:no-unused-expression */
  });
  it("should have an interval of 0 for one or no events", function () {
    const d1 = courseWithTest(new Date(2006, 4, 1));

    const ds0 = new DateSet([]);
    const ds1 = new DateSet([d1]);

    /* tslint:disable:no-unused-expression */
    expect(ds0.hasMinDistance(0)).to.be.true;
    expect(ds1.hasMinDistance(0)).to.be.true;
    /* tslint:enable:no-unused-expression */
  });
  it("indicate the correct interval for adding dates", function () {
    const d1 = courseWithTest(new Date(2006, 4, 1));
    const d2 = courseWithTest(new Date(2006, 4, 5));

    const ds = new DateSet([d1, d2]);

    // c1 is on the same day as d1, so only fits with distance 0
    const c1 = new Date(2006, 4, 1);
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c1, 0)).to.be.true;
    expect(ds.fitsWithDistance(c1, 1)).to.be.false;
    /* tslint:enable:no-unused-expression */

    // c2 is a day after d1
    const c2 = new Date(2006, 4, 2);
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c2, 1)).to.be.true;
    expect(ds.fitsWithDistance(c2, 2)).to.be.false;
    /* tslint:enable:no-unused-expression */

    // two days after d1, two days before d2
    const c3 = new Date(2006, 4, 3);
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c3, 1)).to.be.true;
    expect(ds.fitsWithDistance(c3, 2)).to.be.true;
    expect(ds.fitsWithDistance(c3, 3)).to.be.false;
    /* tslint:enable:no-unused-expression */

    // one day before d2
    const c4 = new Date(2006, 4, 4);
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c4, 1)).to.be.true;
    expect(ds.fitsWithDistance(c4, 2)).to.be.false;
    /* tslint:enable:no-unused-expression */
  });
});
