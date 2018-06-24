/**
 * Convert minutes-from-midnight to HH:MM
 *
 * @param {number} minutes - Minutes from midnight
 * @returns {string} - HH:MM
 */
function minutesToTime(minutes) {
  /* exported minutesToTime */
  let hourString = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  let minuteString = (minutes % 60).toString().padStart(2, '0');
  return hourString + ':' + minuteString;
}
