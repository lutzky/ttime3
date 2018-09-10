const algebraCourseID = 104166;

if (typeof require != 'undefined') {
  let common = require('../common');
  let formatting = require('../formatting');
  let render = require('../render');
  let scheduler = require('../scheduler');

  cartesian = scheduler.cartesian;
  eventsCollide = common.eventsCollide;
  countRuns = scheduler.countRuns;
  generateSchedules = scheduler.generateSchedules;
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
    return {
      forbiddenGroups: [],
      freeDays: { enabled: false, max: 5, min: 0 },
      noRunning: false,
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
  });

  describe('run counter', function() {
    let eventA = { startMinute: 0, endMinute: 60, location: 'Ulman 105' };
    let eventB = { startMinute: 60, endMinute: 120, location: 'Ulman 350' };
    let eventC = { startMinute: 120, endMinute: 180, location: 'Meyer 750' };
    let eventD = { startMinute: 120, endMinute: 180, location: 'Ulman 200' };
    let eventE = { startMinute: 120, endMinute: 180 /* no location */ };
    let eventF = { startMinute: 180, endMinute: 240, location: 'Taub 1' };
    it('should count if events have different buildings', function() {
      expect(countRuns([eventA, eventB, eventC])).toEqual(1);
    });
    it('should count 0 if everything is in the same building', function() {
      expect(countRuns([eventA, eventB, eventD])).toEqual(0);
    });
    it('should not count missing locations as different', function() {
      expect(countRuns([eventA, eventB, eventE])).toEqual(0);
    });
    it('should count multiple runs', function() {
      expect(countRuns([eventB, eventC, eventF])).toEqual(2);
    });
  });
});
