/**
 * Convert minutes-from-midnight to HH:MM
 */
function minutesToTime(minutes: number): string {
  let hourString = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  let minuteString = (minutes % 60).toString().padStart(2, '0');
  return hourString + ':' + minuteString;
}

class DateObj {
  year: number;
  month: number;
  day: number;
}

/**
 * Format a DateObj as a string
 */
function formatDate(dateObj: DateObj): string {
  return new Date(dateObj.year, dateObj.month, dateObj.day).toDateString();
}
