// To enable debugging, go to your JavaScript console, switch the "JavaScript
// context" to scheduler_worker.js, and type the following into the console:
//
//   schedulerDebugLogging = true;
const schedulerDebugLogging = false;

import {AcademicEvent, Course, FilterSettings, Group, Schedule, ScheduleRating} from './common';
import {eventsCollide, groupsByType, sortEvents} from './common';

import cartesian from './cartesian';

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
 * Returns true iff schedule has no collisions
 */
function filterNoCollisions(schedule: Schedule): boolean {
  return !eventsCollide(schedule.events);
}

/**
 * Return all possible schedules
 */
export function generateSchedules(
    courses: Set<Course>, settings: FilterSettings): Schedule[] {
  if (schedulerDebugLogging) {
    console.time('generateSchedules');
  }

  const groupBins = Array.from(courses)
                        .map((c) => removeForbiddenGroups(c, settings))
                        .map(groupsByType)
                        .reduce((a, b) => a.concat(b), []);

  const groupProduct = cartesian(...groupBins);
  let schedules = groupProduct.map(groupsToSchedule);

  if (schedulerDebugLogging) {
    console.info(`${schedules.length} total schedules`);
  }

  schedules = runAllFilters(schedules, settings);

  if (schedulerDebugLogging) {
    console.timeEnd('generateSchedules');
  }
  return schedules;
}

/**
 * Remove forbidden groups from course. Modifies course and returns modified
 * course as well.
 */
function removeForbiddenGroups(
    course: Course, settings: FilterSettings): Course {
  if (course.groups == null) {
    console.warn('Scheduling with groupless course', course);
    return course;
  }
  course.groups = course.groups.filter(
      (g) => !settings.forbiddenGroups.includes(`${course.id}.${g.id}`));
  return course;
}

/**
 * Filter src using filter (named filterName), logging how many schedules
 * it removed.
 */
function filterWithDelta(
    src: Schedule[], filter: (s: Schedule) => boolean,
    filterName: string): Schedule[] {
  const result = src.filter(filter);
  if (schedulerDebugLogging) {
    console.info(
        `Filter ${filterName} removed ${src.length - result.length} schedules`);
  }
  return result;
}

/**
 * Filter using all filters, according to settings
 */
function runAllFilters(
    schedules: Schedule[], settings: FilterSettings): Schedule[] {
  let result = schedules.slice();

  if (settings.noCollisions) {
    result = filterWithDelta(result, filterNoCollisions, 'noCollisions');
  }

  result = filterByRatings(result, settings);

  return result;
}

/**
 * Filter schedules by ratingMin and ratingMax
 */
function filterByRatings(
    schedules: Schedule[], settings: FilterSettings): Schedule[] {
  Object.keys(settings.ratingMin)
      .forEach((r: keyof typeof settings.ratingMin) => {
        if (settings.ratingMin[r] == null && settings.ratingMax[r] == null) {
          return;
        }

        schedules = filterWithDelta(schedules, (schedule) => {
          if (settings.ratingMin[r] != null &&
              schedule.rating[r] < settings.ratingMin[r]) {
            return false;
          }
          if (settings.ratingMax[r] != null &&
              schedule.rating[r] > settings.ratingMax[r]) {
            return false;
          }

          return true;
        }, `Rating '${r}'`);
      });

  return schedules;
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

/**
 * Rate the given events as a schedule
 *
 * TODO(lutzky): rate is exported for testing purposes
 */
export function rate(events: AcademicEvent[]): ScheduleRating {
  return {
    earliestStart: Math.min(...events.map((e) => e.startMinute / 60.0)),
    freeDays: countFreeDays(events),
    latestFinish: Math.max(...events.map((e) => e.endMinute / 60.0)),
    numRuns: countRuns(events),
  };
}

/**
 * Convert groups to a schedule
 */
function groupsToSchedule(groups: Group[]): Schedule {
  const e = groups.reduce((a, b) => a.concat(b.events), []);
  return {
    events: e,
    rating: rate(e),
  };
}
