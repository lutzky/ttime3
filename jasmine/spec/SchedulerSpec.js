const algebraCourseID = 104166;

if (typeof require == 'undefined') {
  // Not running in Node
  loadTestCatalog = () => loadCatalog('../testdata.json');
} else {
  // loadTestCatalog is defined in NodeHelpers.js.
}

describe('Scheduler', function() {
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
    xit('should not crash with large inputs', function() {
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
      let schedules = generateSchedules([algebra], {
        noCollisions: true,
        freeDays: {},
      });
      expect(schedules.length).toBe(33);
    });

    it('should have one lecture and one tutorial in each schedule', function() {
      let schedules = generateSchedules([algebra], {
        noCollisions: true,
        freeDays: {},
      });
      let want = new Map([['lecture', 1], ['tutorial', 1]]);
      schedules.forEach(function(schedule) {
        expect(schedule.events.length).toBe(2);
        typeCounts = new Map();
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

  describe('no-running filter', function() {
    let eventA = { startMinute: 0, endMinute: 60, location: 'Ulman 105' };
    let eventB = { startMinute: 60, endMinute: 120, location: 'Ulman 350' };
    let eventC = { startMinute: 120, endMinute: 180, location: 'Meyer 750' };
    let eventD = { startMinute: 120, endMinute: 180, location: 'Ulman 200' };
    let eventE = { startMinute: 120, endMinute: 180 /* no location */ };
    it('should return false if events have different buildings', function() {
      expect(filterNoRunning({ events: [eventA, eventB, eventC] })).toBe(false);
    });
    it('should return true if everything is in the same building', function() {
      expect(filterNoRunning({ events: [eventA, eventB, eventD] })).toBe(true);
    });
    it('should not count missing locations as different', function() {
      expect(filterNoRunning({ events: [eventA, eventB, eventE] })).toBe(true);
    });
  });
});
