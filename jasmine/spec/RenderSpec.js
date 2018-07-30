describe('Render', function() {
  it('should correctly lay out layered events', function() {
    let events = {
      A: { day: 1, startMinute: 5, endMinute: 25 },
      B: { day: 1, startMinute: 0, endMinute: 15 },
      C: { day: 1, startMinute: 20, endMinute: 35 },
    };

    // TODO(lutzky): We should actually be testing something about the return
    // value of layoutLayeredEvents.
    layoutLayeredEvents([events.A, events.B, events.C]);

    console.info(events);

    expect(events).toBe(null);
  });
});
