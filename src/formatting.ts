import {DateObj, Group} from './common';

/**
 * Convert minutes-from-midnight to HH:MM
 */
export function minutesToTime(minutes: number): string {
  let hourString = Math.floor(minutes / 60).toString().padStart(2, '0');
  let minuteString = (minutes % 60).toString().padStart(2, '0');
  return hourString + ':' + minuteString;
}

/**
 * Format a DateObj as a string
 */
export function formatDate(dateObj: DateObj): string {
  return new Date(dateObj.year, dateObj.month, dateObj.day).toDateString();
}

/**
 * Return the appropriate display name for the group
 */
export function displayName(group: Group): string {
  return group.description || group.course.name;
}
