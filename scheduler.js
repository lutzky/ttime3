'use strict';

/**
 * @typedef {Object} Event
 * @property {number} day - Day of week
 * @property {number} startMinute - Minutes since midnight for start
 * @property {number} endMinute - Minutes since midnight for end
 * @property {string} location - Where the event happens
 */

/**
 * @typedef {Object} Schedule
 * @property {Event[]} events - Events in schedule
 */

/**
 * Return course's groups as an array of arrays, split by type
 *
 * @param {Course} course - Course to get groups from
 *
 * @returns {Array.<Array.<Group>>}
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
 * @param {Event} ev - Event to consider
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
 * @param {...Object[]} a - Arrays to multiply
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

let filterFunctions = {
  noRunning: filterNoRunning,
  noCollisions: filterNoCollisions,
};

/**
 * Return all possible schedules
 *
 * @param {Course[]} courses - Courses to schedule from
 * @param {string[]} filters - Filter names to apply
 * @returns {Schedule[]}
 */
function generateSchedules(courses, filters) {
  console.time('generateSchedules');
  let groupBins = courses
    .map(c => groupsByType(c))
    .reduce((a, b) => a.concat(b), []);

  let groupProduct = cartesian(...groupBins);
  let schedules = groupProduct.map(groupsToSchedule);

  console.info(`${schedules.length} total schedules`);

  filters.forEach(function(filterName) {
    let filter = filterFunctions[filterName];
    if (filter) {
      schedules = schedules.filter(filter);
      console.info(`After ${filterName} filter, ${schedules.length} schedules`);
    } else {
      console.error(`No such filter ${filterName}`);
    }
  });

  console.timeEnd('generateSchedules');
  return schedules;
}

/**
 * Convert groups to a schedule
 *
 * @param {Group[]} groups - Groups to convert
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
