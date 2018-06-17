/**
 * @typedef {Object} Event
 * @property {number} day - Day of week
 * @property {number} startMinute - Minutes since midnight for start
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
  m = new Map();
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
 * Sorts events by start time
 *
 * @param {Event[]} events - Events to sort
 */
function sortEvents(events) {
  events.sort(function(a, b) {
    if (a.day != b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });
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

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

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

  let groupProduct = cartesian(groupBins);
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

onmessage = function(e) {
  console.log('Message received from main script:', e.data);

  let courses = Array.from(e.data);

  let schedules = generateSchedules(courses);
  postMessage(schedules);
};
