const testData = '../testdata.json';
const algebraCourseID = 104166;

describe('Scheduler', function() {
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
    loadCatalog(testData).then(catalog => {
      expect(catalog.length).toBe(1);
      done();
    });
  });

  describe('when scheduling for just Algebra A', function() {
    let catalog = null;
    let algebra = null;
    beforeEach(function(done) {
      loadCatalog(testData).then(function(c) {
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
