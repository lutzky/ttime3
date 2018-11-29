// To enable debugging, go to your JavaScript console, switch the "JavaScript
// context" to scheduler_worker.js, and type the following into the console:
//
//   schedulerDebugLogging = true;
let schedulerDebugLogging = false;

class AcademicEvent {
    day: number;
    group: Group;
    startMinute: number;
    endMinute: number;
    location: string;
}

class Schedule {
  events: AcademicEvent[];
  rating: ScheduleRating;
}

/**
 * earliestStart and latestFinish are in hours (e.g. 1:30PM is 13.5).
 *
 * numRuns is the amount of occurences where two adjacent events (endMinute
 * of the first one equals startMinute of the second, same day) are in the
 * same room.
 *
 * freeDays is the number of days in Sun-Thu with no events.
 */
class ScheduleRating {
  earliestStart: number;
  latestFinish: number;
  numRuns: number;
  freeDays: number;
};

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
 */
function cartesian<T>(...a: T[][]): T[][] {
  if (a.length == 0) {
    return [[]];
  }

  let subCart = cartesian(...a.slice(1));
  return a[0]
    .map(x => subCart.map(y => [x].concat(y)))
    .reduce((a, b) => a.concat(b));
}

class FilterSettings {
  noCollisions: boolean;
  forbiddenGroups: string[];
  ratingMin: ScheduleRating;
  ratingMax: ScheduleRating;
}

/**
 * Return all possible schedules
 */
function generateSchedules(courses: Set<Course>, settings: FilterSettings): Schedule[] {
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
  course: Course,
  settings: FilterSettings
): Course {
  if (course.groups == null) {
    console.warn('Scheduling with groupless course', course);
    return course;
  }
  course.groups = course.groups.filter(
    g => !settings.forbiddenGroups.includes(`${course.id}.${g.id}`)
  );
  return course;
}

/**
 * Filter src using filter (named filterName), logging how many schedules
 * it removed.
 */
function filterWithDelta(
  src: Schedule[],
  filter: (Schedule) => boolean,
  filterName: string
): Schedule[] {
  let result = src.filter(filter);
  if (schedulerDebugLogging) {
    console.info(
      `Filter ${filterName} removed ${src.length - result.length} schedules`
    );
  }
  return result;
}

/**
 * Filter using all filters, according to settings
 */
function runAllFilters(
  schedules: Schedule[],
  settings: FilterSettings
): Schedule[] {
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
  schedules: Schedule[],
  settings: FilterSettings
): Schedule[] {
  Object.keys(settings.ratingMin).forEach(function(r) {
    if (settings.ratingMin[r] == null && settings.ratingMax[r] == null) {
      return;
    }

    schedules = filterWithDelta(
      schedules,
      function(schedule) {
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
      `Rating '${r}'`
    );
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

///////////////////////////////////////////////////////////////////////////////
// TODO(lutzky): These are from main.js, should be moved out

class Group {
  course: Course;
  description: string;
  events: AcademicEvent[];
  id: number;
  type: string;
  teachers: Array<string>;
}

class Course {
  name: string;
  academicPoints: number;
  id: number;
  groups: Array<Group>;
  lecturerInCharge: string;
  testDates: Date[];
}

///////////////////////////////////////////////////////////////////////////////
// TODO(lutzky): Everything below should be in common.js


/**
 * Sorts events by start time
 */
function sortEvents(events: AcademicEvent[]) {
  events.sort(function(a, b) {
    if (a.day != b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });
}

/**
 * Returns false iff two entries in events overlap
 */
function eventsCollide(events: AcademicEvent[]): boolean {
  let e = events.slice();
  sortEvents(e);

  for (let i = 0; i < e.length - 1; i++) {
    if (e[i].day == e[i + 1].day) {
      if (e[i + 1].startMinute < e[i].endMinute) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Return course's groups as an array of arrays, split by type
 */
function groupsByType(course: Course): Group[][] {
  let m = new Map();
  if (!course.groups) {
    return [];
  }

  course.groups.forEach(function(group) {
    if (!m.has(group.type)) {
      m.set(group.type, []);
    }
    m.get(group.type).push(group);
  });

  return Array.from(m.values());
}

function displayName(group: Group): string {
  return group.description || group.course.name;
}
