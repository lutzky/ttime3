import {AcademicEvent} from './common';
import {sortEvents} from './common';

/**
 * earliestStart and latestFinish are in hours (e.g. 1:30PM is 13.5).
 *
 * numRuns is the amount of occurences where two adjacent events (endMinute
 * of the first one equals startMinute of the second, same day) are in the
 * same room.
 *
 * freeDays is the number of days in Sun-Thu with no events.
 */
export class ScheduleRating {
  public earliestStart: number;
  public latestFinish: number;
  public numRuns: number;
  public freeDays: number;
}

/**
 * Rate the given events as a schedule
 */
export default function rate(events: AcademicEvent[]): ScheduleRating {
  return {
    earliestStart: Math.min(...events.map((e) => e.startMinute / 60.0)),
    freeDays: countFreeDays(events),
    latestFinish: Math.max(...events.map((e) => e.endMinute / 60.0)),
    numRuns: countRuns(events),
  };
}

/**
 * Return the building in which ev happens
 */
function eventBuilding(ev: AcademicEvent): string {
  if (ev.location) {
    return ev.location.split(' ')[0];
  } else {
    return ev.location;
  }
}

/**
 * Count instances in which events involve running between different buildings
 * in adjacent classes.
 */
function countRuns(events: AcademicEvent[]): number {
  const e = events.slice();
  let result = 0;
  sortEvents(e);
  for (let i = 0; i < e.length - 1; i++) {
    if (e[i].day === e[i + 1].day) {
      if (e[i + 1].startMinute === e[i].endMinute) {
        const b1 = eventBuilding(e[i]);
        const b2 = eventBuilding(e[i + 1]);
        if (b1 && b2 && b1 !== b2) {
          result++;
        }
      }
    }
  }
  return result;
}

/**
 * Returns the number of free days given an event set
 */
function countFreeDays(events: AcademicEvent[]): number {
  const hasClasses = [false, false, false, false, false];

  events.forEach((event) => {
    hasClasses[event.day] = true;
  });

  return hasClasses.filter((x) => x === false).length;
}
