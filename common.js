/**
 * Sorts events by start time
 *
 * @param {Event[]} events - Events to sort
 */
function sortEvents(events) {
  /* exported sortEvents */
  events.sort(function(a, b) {
    if (a.day != b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });
}
