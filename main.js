'use strict';

/**
 * @typedef {Object} Course
 * @property {string} name
 * @property {number} academicPoints - Number of academic points
 * @property {number} id - Course ID
 * @property {Group[]} groups
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
 * Catalog of all courses
 * @type {Catalog}
 */
let currentCatalog = null;

/**
 * Add back-links to catalog objects (course -> faculty, group -> course, etc.)
 *
 * @param {Catalog} catalog - Catalog to add back-links to
 */
function fixRawCatalog(catalog) {
  catalog.forEach(function(faculty) {
    faculty.courses.forEach(function(course) {
      course.faculty = faculty;
      if (course.groups) {
        course.groups.forEach(function(group) {
          group.course = course;
          if (group.events) {
            group.events.forEach(function(event) {
              event.group = group;
            });
          }
        });
      }
    });
  });
}

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
        let result /** Catalog */ = JSON.parse(req.response);
        fixRawCatalog(result);
        resolve(result);
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
 * Show debug information about a course
 *
 * @param {Course} course - Course to show information about
 */
function showCourseDebugInfo(course) {
  let infoDiv = document.getElementById('course-extra-info');
  infoDiv.innerHTML =
    '<pre>' +
    JSON.stringify(
      course,
      function(key, value) {
        if (['course', 'group', 'faculty'].includes(key)) {
          return undefined;
        } else {
          return value;
        }
      },
      4
    ) +
    '</pre>';
  infoDiv.style.visibility = 'visible';
}

/**
 * Write catalog selector to page.
 */
function writeCatalogSelector() {
  let facultiesDiv = document.getElementById('catalog');
  let facultyList = document.createElement('ul');

  facultiesDiv.innerHTML = '';
  facultiesDiv.appendChild(facultyList);
  currentCatalog.forEach(function(faculty) {
    let li = document.createElement('li');
    li.textContent = faculty.name + ' ';
    let semesterTag = document.createElement('span');
    semesterTag.className = 'semester-tag';
    semesterTag.textContent = faculty.semester;
    li.appendChild(semesterTag);

    let courseList = document.createElement('ul');
    li.appendChild(courseList);
    facultyList.appendChild(li);

    faculty.courses.forEach(function(course) {
      let btn = document.createElement('button');
      let nameSpan = document.createElement('span');
      btn.textContent = '+';
      nameSpan.textContent = ' ' + course.id + ' ' + course.name;
      nameSpan.onmouseover = () => showCourseDebugInfo(course);
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
 * Add a course with a given ID
 *
 * @param {number} id - Course ID
 */
function addSelectedCourseByID(id) {
  /* exported addSelectedCourseByID */
  let found = false;
  currentCatalog.forEach(function(faculty) {
    if (!found) {
      faculty.courses.forEach(function(course) {
        if (course.id == id) {
          addSelectedCourse(course);
          found = true;
          return;
        }
      });
    }
  });
  if (!found) {
    throw new Error('No course with ID ' + id);
  }
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
    nameSpan.innerText = ' ' + course.id + ' ' + course.name;
    nameSpan.onmouseover = () => showCourseDebugInfo(course);
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
  let w = new Worker('scheduler_worker.js');
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
      eventEntry.textContent = `${startTime}-${endTime} ${
        e.group.course.name
      } at ${e.location}`;
      eventList.appendChild(eventEntry);
    });
  });
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

  sortEvents(events);

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
    currentCatalog = catalog;
    writeCatalogSelector();
    [104166, 104018, 234114, 234145].forEach(function(id) {
      addSelectedCourseByID(id);
    });
  },
  function(error) {
    console.error('Failed!', error);
  }
);
