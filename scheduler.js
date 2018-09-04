'use strict';

/**
 * @typedef {{
 *   day: number,
 *   group: Group,
 *   startMinute: number,
 *   endMinute: number,
 *   location: string,
 * }}
 */
let AcademicEvent;
/* exported AcademicEvent */
// Called AcademicEvent because Event is a google-closure-compiler builtin

/**
 * @typedef {{
 *   events: Array<AcademicEvent>
 * }}
 */
let Schedule;
/* exported Schedule */

/**
 * Return course's groups as an array of arrays, split by type
 *
 * @param {Course} course - Course to get groups from
 *
 * @returns {Array<Array<Group>>}
 */
function groupsByType(course) {
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

/**
 * Return the building in which ev happens
 *
 * @param {AcademicEvent} ev - Event to consider
 *
 * @returns {string}
 */
function eventBuilding(ev) {
  if (ev.location) {
    return ev.location.split(' ')[0];
  } else {
    return ev.location;
  }
}

/**
 * Filter schedules in which events involve running between different buildings
 * in adjacent classes.
 *
 * @param {Schedule} schedule - Schedule to check for running
 *
 * @returns {boolean}
 */
function filterNoRunning(schedule) {
  let e = schedule.events.slice();
  sortEvents(e);
  for (let i = 0; i < e.length - 1; i++) {
    if (e[i].day == e[i + 1].day) {
      if (e[i + 1].startMinute == e[i].endMinute) {
        let b1 = eventBuilding(e[i]);
        let b2 = eventBuilding(e[i + 1]);
        if (b1 && b2 && b1 != b2) {
          return false;
        }
      }
    }
  }
  return true;
}

/**
 * Returns true iff schedule has no collisions
 *
 * @param {Schedule} schedule - Schedule to check for collisions
 * @returns {boolean}
 */
function filterNoCollisions(schedule) {
  return !eventsCollide(schedule.events);
}

/**
 * Return a cartesian product of arrays
 *
 * Note: If changing this method, reenable CARTESIAN_SLOW_TEST.
 *
 * @param {...Array<Object>} a - Arrays to multiply
 * @returns {Array.<Array.<Object>>}
 */
function cartesian(...a) {
  if (a.length == 0) {
    return [[]];
  }

  let subCart = cartesian(...a.slice(1));
  return a[0]
    .map(x => subCart.map(y => [x].concat(y)))
    .reduce((a, b) => a.concat(b));
}

/**
 * @typedef {{
 *   noRunning: boolean,
 *   noCollisions: boolean,
 *   forbiddenGroups: Array<string>,
 *   freeDays: {
 *     enabled: boolean,
 *     min: number,
 *     max: number,
 *   }
 * }}
 */
let FilterSettings;
/* exported FilterSettings */

/**
 * Return all possible schedules
 *
 * @param {!Set<Course>} courses - Courses to schedule from
 * @param {FilterSettings} settings - Settings for filters
 * TODO(lutzky): filterSettings should be a more specific type
 *
 * @returns {Array<Schedule>}
 */
function generateSchedules(courses, settings) {
  console.time('generateSchedules');
  let groupBins = Array.from(courses)
    .map(c => removeForbiddenGroups(c, settings))
    .map(groupsByType)
    .reduce((a, b) => a.concat(b), []);

  let groupProduct = cartesian(...groupBins);
  let schedules = groupProduct.map(groupsToSchedule);

  console.info(`${schedules.length} total schedules`);

  schedules = runAllFilters(schedules, settings);

  console.timeEnd('generateSchedules');
  return schedules;
}

/**
 * Remove forbidden groups from course. Modifies course and returns modified
 * course as well.
 *
 * @param {Course} course - Course to remove forbidden groups from
 * @param {FilterSettings} settings - Filter settings
 *
 * @returns {Course}
 */
function removeForbiddenGroups(course, settings) {
  course.groups = course.groups.filter(
    g => !settings.forbiddenGroups.includes(`${course.id}.${g.id}`)
  );
  return course;
}

/**
 * Filter src using filter (named filterName), logging how many schedules
 * it removed.
 *
 * @param {Array<Schedule>} src - Source schedules to filter
 * @param {function(Schedule): boolean} filter - Filter to use
 * @param {string} filterName - Display name of filter
 *
 * @returns {Array<Schedule>}
 */
function filterWithDelta(src, filter, filterName) {
  let result = src.filter(filter);
  console.info(
    `Filter ${filterName} removed ${src.length - result.length} schedules`
  );
  return result;
}

/**
 * Filter using all filters, according to settings
 *
 * @param {Array<Schedule>} schedules - Schedules to filter
 * @param {FilterSettings} settings - Filter settings
 *
 * @returns {Array<Schedule>}
 */
function runAllFilters(schedules, settings) {
  let result = schedules.slice();

  if (settings.noCollisions) {
    result = filterWithDelta(result, filterNoCollisions, 'noCollisions');
  }

  if (settings.noRunning) {
    result = filterWithDelta(result, filterNoRunning, 'noRunning');
  }

  if (settings.freeDays.enabled) {
    result = filterWithDelta(
      result,
      schedule => filterFreeDays(schedule, settings),
      'freeDays'
    );
  }

  return result;
}

/**
 * Returns true iff the schedule has free days within settings.freeDays
 *
 * @param {Schedule} schedule - Schedule to examine
 * @param {FilterSettings} settings - Fitler settings
 *
 * @returns {boolean}
 */
function filterFreeDays(schedule, settings) {
  let hasClasses = [false, false, false, false, false];

  schedule.events.forEach(function(event) {
    hasClasses[event.day] = true;
  });

  let numFreeDays = hasClasses.filter(x => x == false).length;

  return (
    numFreeDays >= settings.freeDays.min && numFreeDays <= settings.freeDays.max
  );
}

/**
 * Convert groups to a schedule
 *
 * @param {Array<Group>} groups - Groups to convert
 * @returns {Schedule}
 */
function groupsToSchedule(groups) {
  let e = groups.reduce((a, b) => a.concat(b.events), []);
  return { events: e };
}

if (typeof module != 'undefined') {
  module.exports = {
    generateSchedules: generateSchedules,
    cartesian: cartesian,
    filterNoRunning: filterNoRunning,
  };
}
