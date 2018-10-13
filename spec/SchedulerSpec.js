const algebraCourseID = 104166;

if (typeof require != 'undefined') {
  let common = require('../common');
  let formatting = require('../formatting');
  let render = require('../render');
  let scheduler = require('../scheduler');

  cartesian = scheduler.cartesian;
  eventsCollide = common.eventsCollide;
  rate = scheduler.rate;
  generateSchedules = scheduler.generateSchedules;
  groupsByType = common.groupsByType;
  layoutLayeredEvents = render.layoutLayeredEvents;
  loadTestCatalog = common.loadTestCatalog;
  minutesToTime = formatting.minutesToTime;
  sortEvents = common.sortEvents;
}

const THOROUGH_TEST_MODE = false;

describe('Scheduler', function() {
  /**
   * Return a copy of default filter settings
   *
   * @returns {FilterSettings}
   */
  function getDefaultFilterSettings() {
    let nullRating = {
      earliestStart: null,
      freeDays: null,
      latestFinish: null,
      numRuns: null,
    };

    return {
      forbiddenGroups: [],
      ratingMin: nullRating,
      ratingMax: nullRating,
      noCollisions: false,
    };
  }

  describe('Cartesian products', function() {
    it('should calculate correctly in trivial cases', function() {
      let a = [[1, 2]];
      expect(cartesian(...a)).toEqual([[1], [2]]);
      let b = [[1, 2, 3]];
      expect(cartesian(...b)).toEqual([[1], [2], [3]]);
    });
    it('should caculate correctly in nontrivial cases', function() {
      let a = [[1, 2], [3, 4, 6]];
      expect(cartesian(...a)).toEqual([
        [1, 3],
        [1, 4],
        [1, 6],
        [2, 3],
        [2, 4],
        [2, 6],
      ]);
    });
    if (THOROUGH_TEST_MODE) {
      it('should not crash with large inputs', function() {
        // Disabled because this is a slow test. CARTESIAN_SLOW_TEST
        let a = [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ];
        expect(() => cartesian(...a)).not.toThrow();
      });
    }
  });

  it('should have one faculty', function(done) {
    loadTestCatalog().then(catalog => {
      expect(catalog.length).toBe(1);
      done();
    });
  });

  describe('when scheduling for just Algebra A', function() {
    let catalog = null;
    let algebra = null;
    beforeEach(function(done) {
      loadTestCatalog().then(function(c) {
        catalog = c;
        algebra = catalog[0].courses.find(
          course => course.id == algebraCourseID
        );
        expect(algebra).toBeDefined();
        done();
      });
    });

    it('should get the right amount of different schedules', function() {
      let settings = getDefaultFilterSettings();
      settings.noCollisions = true;

      let schedules = generateSchedules(new Set([algebra]), settings);
      expect(schedules.length).toBe(33);
    });

    it('should have one lecture and one tutorial in each schedule', function() {
      let settings = getDefaultFilterSettings();
      settings.noCollisions = true;

      let schedules = generateSchedules(new Set([algebra]), settings);
      let want = new Map([['lecture', 1], ['tutorial', 1]]);
      schedules.forEach(function(schedule) {
        expect(schedule.events.length).toBe(2);
        let typeCounts = new Map();
        schedule.events.forEach(function(ev) {
          let type = ev.group.type;
          if (!typeCounts.has(type)) {
            typeCounts.set(type, 0);
          }
          typeCounts.set(type, typeCounts.get(type) + 1);
        });
        expect(typeCounts).toEqual(want);
      });
    });

    it('should have the expected number of schdules', function() {
      let settings = getDefaultFilterSettings();
      settings.noCollisions = true;

      let schedules = generateSchedules(new Set([algebra]), settings);
      expect(schedules.length).toEqual(33);
    });

    it('should schedule with 104166.11 if not forbidden', function() {
      let settings = getDefaultFilterSettings();
      settings.noCollisions = true;
      let schedules = generateSchedules(new Set([algebra]), settings);

      let schedulesWithGroup = schedules.filter(schedule =>
        schedule.events.map(x => x.group.id).includes(11)
      );

      expect(schedulesWithGroup.length).toBeGreaterThan(0);
    });

    it('should not schedule with 104166.11 if not forbidden', function() {
      let settings = getDefaultFilterSettings();
      settings.noCollisions = true;
      settings.forbiddenGroups = ['104166.11'];
      let schedules = generateSchedules(new Set([algebra]), settings);

      let schedulesWithGroup = schedules.filter(schedule =>
        schedule.events.map(x => x.group.id).includes(11)
      );

      expect(schedulesWithGroup.length).toBe(0);
    });

    it('should schedule just lectures if all tutorials forbidden', function() {
      let settings = getDefaultFilterSettings();
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

      let schedules = generateSchedules(new Set([algebra]), settings);
      expect(schedules.length).toEqual(3);
      expect(schedules.map(x => x.events.length)).toEqual([1, 1, 1]);
    });
  });

  describe('schedule ratings', function() {
    describe('numRuns', function() {
      let eventA = { startMinute: 0, endMinute: 60, location: 'Ulman 105' };
      let eventB = { startMinute: 60, endMinute: 120, location: 'Ulman 350' };
      let eventC = { startMinute: 120, endMinute: 180, location: 'Meyer 750' };
      let eventD = { startMinute: 120, endMinute: 180, location: 'Ulman 200' };
      let eventE = { startMinute: 120, endMinute: 180 /* no location */ };
      let eventF = { startMinute: 180, endMinute: 240, location: 'Taub 1' };
      it('should count if events have different buildings', function() {
        expect(rate([eventA, eventB, eventC]).numRuns).toEqual(1);
      });
      it('should count 0 if everything is in the same building', function() {
        expect(rate([eventA, eventB, eventD]).numRuns).toEqual(0);
      });
      it('should not count missing locations as different', function() {
        expect(rate([eventA, eventB, eventE]).numRuns).toEqual(0);
      });
      it('should count multiple runs', function() {
        expect(rate([eventB, eventC, eventF]).numRuns).toEqual(2);
      });
    });
    describe('freeDays', function() {
      let evA = { day: 0 };
      let evAA = { day: 0 };
      let evB = { day: 1 };
      let evC = { day: 2 };
      let evD = { day: 3 };
      let evE = { day: 4 };
      it('should have 5 free days for no events', function() {
        expect(rate([]).freeDays).toEqual(5);
      });
      it('should have 0 free days for one event per day', function() {
        expect(rate([evA, evB, evC, evD, evE]).freeDays).toEqual(0);
      });
      it('should have 3 free days for two events, one per day', function() {
        expect(rate([evD, evE]).freeDays).toEqual(3);
      });
      it('should have 1 free days for 5 events over 4 days', function() {
        expect(rate([evA, evAA, evC, evD, evE]).freeDays).toEqual(1);
      });
    });
    describe('earliestStart and latestFinish', function() {
      let evA = { day: 0, startMinute: 30, endMinute: 60 };
      let evAA = { day: 0, startMinute: 120, endMinute: 190 };
      let evB = { day: 1, startMinute: 150, endMinute: 300 };
      let evC = { day: 2, startMinute: 120, endMinute: 190 };
      let evD = { day: 4, startMinute: 30, endMinute: 31 };
      it('should correctly compute earliestStart', function() {
        expect(rate([evA, evAA, evB, evC, evD]).earliestStart).toEqual(0.5);
      });
      it('should correctly compute latestFinish', function() {
        expect(rate([evA, evAA, evB, evC, evD]).latestFinish).toEqual(5);
      });
    });
  });
});
