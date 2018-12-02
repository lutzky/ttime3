// To enable debugging, go to your JavaScript console, switch the "JavaScript
// context" to scheduler_worker.js, and type the following into the console:
//
//   schedulerDebugLogging = true;
let schedulerDebugLogging = false;

import {Schedule, Group, AcademicEvent, Course, ScheduleRating, FilterSettings} from './common';
import {groupsByType, sortEvents, eventsCollide} from './common';

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
  let e = events.slice();
  let result = 0;
  sortEvents(e);
  for (let i = 0; i < e.length - 1; i++) {
    if (e[i].day == e[i + 1].day) {
      if (e[i + 1].startMinute == e[i].endMinute) {
        let b1 = eventBuilding(e[i]);
        let b2 = eventBuilding(e[i + 1]);
        if (b1 && b2 && b1 != b2) {
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
 * Return a cartesian product of arrays
 *
 * Note: If changing this method, reenable CARTESIAN_SLOW_TEST.
 *
 * TODO(lutzky): cartesian is exported for testing purposes
 */
export function cartesian<T>(...a: T[][]): T[][] {
  if (a.length == 0) {
    return [[]];
  }

  let subCart = cartesian(...a.slice(1));
  return a[0]
      .map(x => subCart.map(y => [x].concat(y)))
      .reduce((a, b) => a.concat(b));
}

/**
 * Return all possible schedules
 */
export function generateSchedules(
    courses: Set<Course>, settings: FilterSettings): Schedule[] {
  if (schedulerDebugLogging) {
    console.time('generateSchedules');
  }

  let groupBins = Array.from(courses)
                      .map(c => removeForbiddenGroups(c, settings))
                      .map(groupsByType)
                      .reduce((a, b) => a.concat(b), []);

  let groupProduct = cartesian(...groupBins);
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
      g => !settings.forbiddenGroups.includes(`${course.id}.${g.id}`));
  return course;
}

/**
 * Filter src using filter (named filterName), logging how many schedules
 * it removed.
 */
function filterWithDelta(
    src: Schedule[], filter: (s: Schedule) => boolean,
    filterName: string): Schedule[] {
  let result = src.filter(filter);
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
  Object.keys(settings.ratingMin).forEach(function(r) {
    // @ts-ignore: allRatings
    if (settings.ratingMin[r] == null && settings.ratingMax[r] == null) {
      return;
    }

    schedules = filterWithDelta(schedules, function(schedule) {
      if (
          // @ts-ignore: allRatings
          settings.ratingMin[r] != null &&
          // @ts-ignore: allRatings
          schedule.rating[r] < settings.ratingMin[r]) {
        return false;
      }
      if (
          // @ts-ignore: allRatings
          settings.ratingMax[r] != null &&
          // @ts-ignore: allRatings
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
  let hasClasses = [false, false, false, false, false];

  events.forEach(function(event) {
    hasClasses[event.day] = true;
  });

  return hasClasses.filter(x => x == false).length;
}

/**
 * Rate the given events as a schedule
 */
function rate(events: AcademicEvent[]): ScheduleRating {
  return {
    earliestStart: Math.min(...events.map(e => e.startMinute / 60.0)),
    latestFinish: Math.max(...events.map(e => e.endMinute / 60.0)),
    numRuns: countRuns(events),
    freeDays: countFreeDays(events),
  };
}

/**
 * Convert groups to a schedule
 */
function groupsToSchedule(groups: Group[]): Schedule {
  let e = groups.reduce((a, b) => a.concat(b.events), []);
  return {
    events: e,
    rating: rate(e),
  };
}
