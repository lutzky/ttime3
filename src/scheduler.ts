let schedulerDebugLogging = false;

export function setDebug(debugMode: boolean): void {
  if (debugMode) {
    console.info("Called scheduler.setDebug with", debugMode);
  }
  schedulerDebugLogging = debugMode;
}

import {
  AcademicEvent,
  Course,
  FilterSettings,
  Group,
  Schedule,
} from "./common";
import { eventsCollide, groupsByType } from "./common";

import cartesian from "./cartesian";
import rate from "./rating";

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
  courses: Set<Course>,
  settings: FilterSettings,
): Schedule[] {
  if (schedulerDebugLogging) {
    console.time("generateSchedules");
  }

  const groupBins = Array.from(courses)
    .map((c) => removeForbiddenGroups(c, settings))
    .map(groupsByType)
    .reduce((a, b) => a.concat(b), []);

  const groupProduct = cartesian(...groupBins);
  let schedules = groupProduct.map(groupsToSchedule);

  if (settings.noCollisions) {
    schedules = filterWithDelta(schedules, filterNoCollisions, "noCollisions");
  }

  if (schedulerDebugLogging) {
    console.info(`${schedules.length} total schedules`);
  }

  rateSchedules(schedules);

  schedules = runAllFilters(schedules, settings);

  if (schedulerDebugLogging) {
    console.timeEnd("generateSchedules");
  }
  return schedules;
}

/**
 * Remove forbidden groups from course. Modifies course and returns modified
 * course as well.
 */
function removeForbiddenGroups(
  course: Course,
  settings: FilterSettings,
): Course {
  if (course.groups == null) {
    console.warn("Scheduling with groupless course", course);
    return course;
  }
  course.groups = course.groups.filter(
    (g) => !settings.forbiddenGroups.includes(`${course.id}.${g.id}`),
  );
  return course;
}

/**
 * Filter src using filter (named filterName), logging how many schedules
 * it removed.
 */
function filterWithDelta(
  src: Schedule[],
  filter: (s: Schedule) => boolean,
  filterName: string,
): Schedule[] {
  const result = src.filter(filter);
  if (schedulerDebugLogging) {
    console.info(
      `Filter ${filterName} removed ${src.length - result.length} schedules`,
    );
  }
  return result;
}

/**
 * Filter using all filters, according to settings
 */
function runAllFilters(
  schedules: Schedule[],
  settings: FilterSettings,
): Schedule[] {
  let result = schedules.slice();

  if (settings.noCollisions) {
    result = filterWithDelta(result, filterNoCollisions, "noCollisions");
  }

  result = filterByRatings(result, settings);

  return result;
}

/**
 * Filter schedules by ratingMin and ratingMax
 */
function filterByRatings(
  schedules: Schedule[],
  settings: FilterSettings,
): Schedule[] {
  Object.keys(settings.ratingMin).forEach(
    (r: keyof typeof settings.ratingMin) => {
      if (settings.ratingMin[r] == null && settings.ratingMax[r] == null) {
        return;
      }

      schedules = filterWithDelta(
        schedules,
        (schedule) => {
          if (
            settings.ratingMin[r] != null &&
            schedule.rating[r] < settings.ratingMin[r]
          ) {
            return false;
          }
          if (
            settings.ratingMax[r] != null &&
            schedule.rating[r] > settings.ratingMax[r]
          ) {
            return false;
          }

          return true;
        },
        `Rating '${r}'`,
      );
    },
  );

  return schedules;
}

/**
 * Convert groups to a schedule
 */
function groupsToSchedule(groups: Group[]): Schedule {
  const e = groups.reduce<AcademicEvent[]>((a, b) => a.concat(b.events), []);
  return {
    events: e,
    rating: null,
  };
}

function rateSchedules(schedules: Schedule[]) {
  for (const schedule of schedules) {
    schedule.rating = rate(schedule.events);
  }
}
