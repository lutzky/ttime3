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

  it('should detect when events collide', function() {
    let events = [
      { day: 1, startMinute: 10, endMinute: 20 },
      { day: 1, startMinute: 19, endMinute: 29 },
      { day: 1, startMinute: 28, endMinute: 38 },
    ];

    expect(eventsCollide([events[0], events[1]])).toBe(true);
    expect(eventsCollide([events[1], events[2]])).toBe(true);
    expect(eventsCollide([events[0], events[2]])).toBe(false);
    expect(eventsCollide(events)).toBe(true);
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
      let schedules = generateSchedules([algebra]);
      expect(schedules.length).toBe(33);
    });

    it('should have one lecture and one tutorial in each schedule', function() {
      let schedules = generateSchedules([algebra]);
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
});
