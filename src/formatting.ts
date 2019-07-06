import {Group} from './common';

/**
 * Convert minutes-from-midnight to HH:MM
 */
export function minutesToTime(minutes: number): string {
  const hourString = Math.floor(minutes / 60).toString().padStart(2, '0');
  const minuteString = (minutes % 60).toString().padStart(2, '0');
  return hourString + ':' + minuteString;
}

/**
 * Return the appropriate display name for the group
 */
export function displayName(group: Group): string {
  return group.description || group.course.name;
}
