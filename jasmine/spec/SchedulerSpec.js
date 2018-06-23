describe('Scheduler', function() {
  /*
  beforeEach(function() {
    player = new Player();
    song = new Song();
  });
  */

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
});
