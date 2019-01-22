import {expect} from 'chai';

import {DateObj} from '../src/common';
import DateSet from '../src/dateset';

describe('DateSet', () => {
  it('should know if they have a minimal existing interval', () => {
    const d1: DateObj = {year: 2006, month: 5, day: 1};
    // 2 days interval
    const d2: DateObj = {year: 2006, month: 5, day: 3};
    // 3 days interval
    const d3: DateObj = {year: 2006, month: 5, day: 6};

    const ds = new DateSet([d1, d2, d3]);

    /* tslint:disable:no-unused-expression */
    expect(ds.hasMinDistance(1)).to.be.true;
    expect(ds.hasMinDistance(2)).to.be.true;
    expect(ds.hasMinDistance(3)).to.be.false;
    /* tslint:enable:no-unused-expression */
  });
  it('should have an interval of 0 for one or no events', () => {
    const d1: DateObj = {year: 2006, month: 5, day: 1};

    const ds0 = new DateSet([]);
    const ds1 = new DateSet([d1]);

    /* tslint:disable:no-unused-expression */
    expect(ds0.hasMinDistance(0)).to.be.true;
    expect(ds1.hasMinDistance(0)).to.be.true;
    /* tslint:enable:no-unused-expression */
  });
  it('indicate the correct interval for adding dates', () => {
    const d1: DateObj = {year: 2006, month: 5, day: 1};
    const d2: DateObj = {year: 2006, month: 5, day: 5};

    const ds = new DateSet([d1, d2]);

    // c1 is on the same day as d1, so only fits with distance 0
    const c1: DateObj = {year: 2006, month: 5, day: 1};
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c1, 0)).to.be.true;
    expect(ds.fitsWithDistance(c1, 1)).to.be.false;
    /* tslint:enable:no-unused-expression */

    // c2 is a day after d1
    const c2: DateObj = {year: 2006, month: 5, day: 2};
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c2, 1)).to.be.true;
    expect(ds.fitsWithDistance(c2, 2)).to.be.false;
    /* tslint:enable:no-unused-expression */

    // two days after d1, two days before d2
    const c3: DateObj = {year: 2006, month: 5, day: 3};
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c3, 1)).to.be.true;
    expect(ds.fitsWithDistance(c3, 2)).to.be.true;
    expect(ds.fitsWithDistance(c3, 3)).to.be.false;
    /* tslint:enable:no-unused-expression */

    // one day before d2
    const c4: DateObj = {year: 2006, month: 5, day: 4};
    /* tslint:disable:no-unused-expression */
    expect(ds.fitsWithDistance(c4, 1)).to.be.true;
    expect(ds.fitsWithDistance(c4, 2)).to.be.false;
    /* tslint:enable:no-unused-expression */
  });
});
