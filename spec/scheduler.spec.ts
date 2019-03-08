import {expect} from 'chai';

import {AcademicEvent, Catalog, Course, FilterSettings} from '../src/common';
import {fixRawCatalog} from '../src/common';
import {ScheduleRating} from '../src/rating';
import rate from '../src/rating';
import {generateSchedules} from '../src/scheduler';

const algebraCourseID = 104166;

import * as testData from '../testdata.json';

export function loadTestCatalog(): Promise<Catalog> {
  return new Promise((resolve, _ /* reject */) => {
    const testDataCopy = JSON.parse(JSON.stringify(testData));
    const result: Catalog = testDataCopy as any as Catalog;
    fixRawCatalog(result);
    resolve(result);
  });
}

describe('Scheduler', () => {
  /**
   * Return a copy of default filter settings
   */
  function getDefaultFilterSettings(): FilterSettings {
    const nullRating = {
      earliestStart: null,
      freeDays: null,
      latestFinish: null,
      numRuns: null,
    } as ScheduleRating;

    return {
      forbiddenGroups: [],
      noCollisions: false,
      ratingMax: nullRating,
      ratingMin: nullRating,
    };
  }

  it('should have one faculty', () => {
    return loadTestCatalog().then((catalog) => {
      expect(catalog.length).to.equal(1);
    });
  });

  describe('when scheduling for just Algebra A', () => {
    let catalog: Catalog = null;
    let algebra: Course = null;
    beforeEach((done) => {
      loadTestCatalog().then((c) => {
        catalog = c;
        algebra =
            catalog[0].courses.find((course) => course.id === algebraCourseID);
        expect(algebra).to.not.equal(undefined);
        done();
      });
    });

    it('should get the right amount of different schedules', () => {
      const settings = getDefaultFilterSettings();
      settings.noCollisions = true;

      const schedules = generateSchedules(new Set([algebra]), settings);
      expect(schedules.length).to.equal(33);
    });

    it('should have one lecture and one tutorial in each schedule', () => {
      const settings = getDefaultFilterSettings();
      settings.noCollisions = true;

      const schedules = generateSchedules(new Set([algebra]), settings);
      const want = new Map([['lecture', 1], ['tutorial', 1]]);
      schedules.forEach((schedule) => {
        expect(schedule.events.length).to.equal(2);
        const typeCounts = new Map();
        schedule.events.forEach((ev) => {
          const type = ev.group.type;
          if (!typeCounts.has(type)) {
            typeCounts.set(type, 0);
          }
          typeCounts.set(type, typeCounts.get(type) + 1);
        });
        expect(typeCounts).to.deep.equal(want);
      });
    });

    it('should have the expected number of schdules', () => {
      const settings = getDefaultFilterSettings();
      settings.noCollisions = true;

      const schedules = generateSchedules(new Set([algebra]), settings);
      expect(schedules.length).to.equal(33);
    });

    it('should schedule with 104166.11 if not forbidden', () => {
      const settings = getDefaultFilterSettings();
      settings.noCollisions = true;
      const schedules = generateSchedules(new Set([algebra]), settings);

      const schedulesWithGroup = schedules.filter(
          (schedule) => schedule.events.map((x) => x.group.id).includes(11));

      expect(schedulesWithGroup.length).to.be.greaterThan(0);
    });

    it('should not schedule with 104166.11 if not forbidden', () => {
      const settings = getDefaultFilterSettings();
      settings.noCollisions = true;
      settings.forbiddenGroups = ['104166.11'];
      const schedules = generateSchedules(new Set([algebra]), settings);

      const schedulesWithGroup = schedules.filter(
          (schedule) => schedule.events.map((x) => x.group.id).includes(11));

      expect(schedulesWithGroup.length).to.equal(0);
    });

    it('should schedule just lectures if all tutorials forbidden', () => {
      const settings = getDefaultFilterSettings();
      settings.noCollisions = true;
      settings.forbiddenGroups = [
        '104166.11',
        '104166.12',
        '104166.13',
        '104166.14',
        '104166.21',
        '104166.22',
        '104166.23',
        '104166.24',
        '104166.31',
        '104166.32',
        '104166.33',
        '104166.34',
      ];

      const schedules = generateSchedules(new Set([algebra]), settings);
      expect(schedules.length).to.equal(3);
      expect(schedules.map((x) => x.events.length)).to.deep.equal([1, 1, 1]);
    });
  });

  describe('schedule ratings', () => {
    describe('numRuns', () => {
      const eventA = {startMinute: 0, endMinute: 60, location: 'Ulman 105'} as
          AcademicEvent;
      const eventB = {startMinute: 60, endMinute: 120, location: 'Ulman 350'} as
          AcademicEvent;
      const eventC = {
        endMinute: 180,
        startMinute: 120,

        location: 'Meyer 750',
      } as AcademicEvent;
      const eventD = {
        endMinute: 180,
        startMinute: 120,

        location: 'Ulman 200',
      } as AcademicEvent;
      const eventE = {startMinute: 120, endMinute: 180 /* no location */} as
          AcademicEvent;
      const eventF = {startMinute: 180, endMinute: 240, location: 'Taub 1'} as
          AcademicEvent;
      it('should count if events have different buildings', () => {
        expect(rate([eventA, eventB, eventC]).numRuns).to.equal(1);
      });
      it('should count 0 if everything is in the same building', () => {
        expect(rate([eventA, eventB, eventD]).numRuns).to.equal(0);
      });
      it('should not count missing locations as different', () => {
        expect(rate([eventA, eventB, eventE]).numRuns).to.equal(0);
      });
      it('should count multiple runs', () => {
        expect(rate([eventB, eventC, eventF]).numRuns).to.equal(2);
      });
    });
    describe('freeDays', () => {
      const evA = {day: 0} as AcademicEvent;
      const evAA = {day: 0} as AcademicEvent;
      const evB = {day: 1} as AcademicEvent;
      const evC = {day: 2} as AcademicEvent;
      const evD = {day: 3} as AcademicEvent;
      const evE = {day: 4} as AcademicEvent;
      it('should have 5 free days for no events', () => {
        expect(rate([]).freeDays).to.equal(5);
      });
      it('should have 0 free days for one event per day', () => {
        expect(rate([evA, evB, evC, evD, evE]).freeDays).to.equal(0);
      });
      it('should have 3 free days for two events, one per day', () => {
        expect(rate([evD, evE]).freeDays).to.equal(3);
      });
      it('should have 1 free days for 5 events over 4 days', () => {
        expect(rate([evA, evAA, evC, evD, evE]).freeDays).to.equal(1);
      });
    });
    describe('earliestStart and latestFinish', () => {
      const evA = {day: 0, startMinute: 30, endMinute: 60} as AcademicEvent;
      const evAA = {day: 0, startMinute: 120, endMinute: 190} as AcademicEvent;
      const evB = {day: 1, startMinute: 150, endMinute: 300} as AcademicEvent;
      const evC = {day: 2, startMinute: 120, endMinute: 190} as AcademicEvent;
      const evD = {day: 4, startMinute: 30, endMinute: 31} as AcademicEvent;
      it('should correctly compute earliestStart', () => {
        expect(rate([evA, evAA, evB, evC, evD]).earliestStart).to.equal(0.5);
      });
      it('should correctly compute latestFinish', () => {
        expect(rate([evA, evAA, evB, evC, evD]).latestFinish).to.equal(5);
      });
    });
  });
});
