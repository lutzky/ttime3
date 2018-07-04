/**
 * @typedef {Object} Event
 * @property {number} day - Day of week
 * @property {number} startMinute - Minutes since midnight for start
 * @property {number} endMinute - Minutes since midnight for end
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
 * Returns false iff two entries in events overlap
 *
 * @param {Event[]} events - Events to check for collisions
 *
 * @returns {boolean}
 */
function eventsCollide(events) {
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

/**
 * Return all possible schedules
 *
 * TODO(lutzky): Make filters configurable
 *
 * @param {Course[]} courses - Courses to schedule from
 * @returns {Schedule[]}
 */
function generateSchedules(courses) {
  console.time('generateSchedules');
  let groupBins = courses
    .map(c => groupsByType(c))
    .reduce((a, b) => a.concat(b), []);

  let groupProduct = cartesian(...groupBins);
  let schedules = groupProduct.map(groupsToSchedule);

  let numUnfilteredSchedules = schedules.length;
  schedules = schedules.filter(filterNoCollisions);
  console.info(
    `Filtered ${numUnfilteredSchedules -
      schedules.length} of ${numUnfilteredSchedules} schedules`
  );

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
    eventsCollide: eventsCollide,
  };
}
