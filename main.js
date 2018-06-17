'use strict';

/**
 * @typedef {Object} Course
 * @property {string} name
 * @property {number} academicPoints - Number of academic points
 * @property {number} id - Course ID
 * @
 */

/**
 * @typedef {Object} Faculty
 * @property {string} name
 * @property {Course[]} courses
 */

/**
 * @typedef {Faculty[]} Catalog
 */

const catalogUrl =
  'https://storage.googleapis.com/repy-176217.appspot.com/latest.json';

let selectedCourses = new Set();

/**
 * Load the catalog object from url.
 *
 * @param {string} url - URL to download catalog from.
 *
 * @returns {Promise<Catalog>}
 */
function loadCatalog(url) {
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('GET', catalogUrl);
    req.onload = function() {
      if (req.status == 200) {
        resolve(JSON.parse(req.response));
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error('Network Error'));
    };

    console.info('Sending XHR');
    req.send();
  });
}

/**
 * Write catalog selector to page.
 *
 * @param {Catalog} catalog - Catalog of faculties.
 */
function writeCatalogSelector(catalog) {
  let facultiesDiv = document.getElementById('catalog');
  let facultyList = document.createElement('ul');

  facultiesDiv.innerHTML = '';
  facultiesDiv.appendChild(facultyList);
  catalog.forEach(function(faculty) {
    let li = document.createElement('li');
    li.textContent = faculty.name;
    let courseList = document.createElement('ul');
    li.appendChild(courseList);
    facultyList.appendChild(li);

    faculty.courses.forEach(function(course) {
      let btn = document.createElement('button');
      let nameSpan = document.createElement('span');
      btn.textContent = '+';
      nameSpan.textContent = ' ' + course.name;
      let courseLi = document.createElement('li');
      courseLi.appendChild(btn);
      courseLi.appendChild(nameSpan);
      courseList.appendChild(courseLi);

      btn.onclick = function() {
        addSelectedCourse(course);
      };
    });
  });
}

/**
 * Mark course as selected.
 *
 * @param {Course} course - Course to select
 */
function addSelectedCourse(course) {
  console.info('Selected', course);
  selectedCourses.add(course);
  refreshSelectedCourses();
}

/**
 * Mark course as unselected.
 *
 * @param {Course} course - Course to unselect
 */
function delSelectedCourse(course) {
  console.info('Unselected', course);
  selectedCourses.delete(course);
  refreshSelectedCourses();
}

/**
 * Redraw the list of selected courses
 *
 * TODO(lutzky): This is actually a bad idea and would cause flicker, better do
 * something neater.
 */
function refreshSelectedCourses() {
  let div = document.getElementById('selected-courses');
  div.innerHTML = '';
  let ul = document.createElement('ul');
  div.appendChild(ul);
  selectedCourses.forEach(function(course) {
    let li = document.createElement('li');
    let nameSpan = document.createElement('span');
    let btn = document.createElement('button');
    btn.innerText = '-';
    btn.onclick = function() {
      delSelectedCourse(course);
    };
    nameSpan.innerText = ' ' + course.name;
    li.appendChild(btn);
    li.appendChild(nameSpan);
    ul.appendChild(li);
  });
}

/**
 * Start a worker to generate schedules
 */
function getSchedules() {
  /* exported getSchedules */
  let genButton = document.getElementById('generate-schedules');
  genButton.disabled = true;
  let w = new Worker('scheduler.js');
  // TODO(lutzky): Wrap worker with a Promise
  w.onmessage = function(e) {
    console.info('Received message from worker:', e);
    genButton.disabled = false;
    w.terminate();
    setPossibleSchedules(e.data);
  };
  w.postMessage(selectedCourses);
}

let possibleSchedules = [];
let currentSchedule = 0;

/**
 * Set the collection of possible schedules
 *
 * @param {Schedule[]} schedules - Possible schedules
 */
function setPossibleSchedules(schedules) {
  possibleSchedules = schedules;
  currentSchedule = 0;
  let div = document.getElementById('schedule-browser');
  document.getElementById('num-schedules').textContent = schedules.length;
  if (schedules.length > 0) {
    div.style.display = 'block';
  } else {
    div.style.display = 'none';
  }
  goToSchedule(0);
}

/**
 * Increment the current displayed schedule
 */
function nextSchedule() {
  /* exported nextSchedule */
  goToSchedule(currentSchedule + 1);
}

/**
 * Decrement the current displayed schedule
 */
function prevSchedule() {
  /* exported prevSchedule */
  goToSchedule(currentSchedule - 1);
}

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Display schedule i, modulo the possible range 0-(numSchedules - 1)
 *
 * @param {number} i - schedule to show
 */
function goToSchedule(i) {
  let max = possibleSchedules.length;
  i = (i + max) % max;
  currentSchedule = i;
  document.getElementById('current-schedule-id').textContent = i + 1;
  let days = byDay(possibleSchedules[i]);

  let scheduleContents = document.getElementById('schedule-contents');
  scheduleContents.innerHTML = '';

  days.forEach(function(dayEvents) {
    let dayEntry = document.createElement('li');
    scheduleContents.appendChild(dayEntry);
    dayEntry.textContent = dayNames[dayEvents[0].day];
    let eventList = document.createElement('ul');
    dayEntry.appendChild(eventList);
    dayEvents.forEach(function(e) {
      let eventEntry = document.createElement('li');
      let startTime = minutesToTime(e.startMinute);
      let endTime = minutesToTime(e.endMinute);
      eventEntry.textContent = `${startTime}-${endTime} something at ${
        e.location
      }`;
      eventList.appendChild(eventEntry);
    });
  });
}

/**
 * Convert minutes-from-midnight to HH:MM
 *
 * @param {number} minutes - Minutes from midnight
 * @returns {string} - HH:MM
 */
function minutesToTime(minutes) {
  let hourString = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  let minuteString = (minutes % 60).toString().padStart(2, '0');
  return hourString + ':' + minuteString;
}

/**
 * Get events for schedule split into per-day arrays
 *
 * @param {Schedule} schedule - Schedule to split into days
 * @returns {Array.<Array.<Event>>} - Each entry is an array of Events with the
 *                                    same day, sorted ascending.
 */
function byDay(schedule) {
  let events = schedule.events.slice();
  let result = [[]];

  events.sort(function(a, b) {
    // TODO(lutzky): Reuse sorting function from events.js
    if (a.day != b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });

  let currentDay = events[0].day;

  events.forEach(function(e) {
    if (e.day != currentDay) {
      result.push([]);
      currentDay = e.day;
    }
    result[result.length - 1].push(e);
  });

  return result;
}

loadCatalog(catalogUrl).then(
  function(catalog) {
    console.log('Loaded catalog:', catalog);
    writeCatalogSelector(catalog);
  },
  function(error) {
    console.error('Failed!', error);
  }
);
