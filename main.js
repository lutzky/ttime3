'use strict';

/**
 * @typedef {{
 *   course: Course,
 *   events: Array<AcademicEvent>,
 *   id: number,
 *   type: string,
 *   teachers: Array<string>,
 * }}
 */
let Group;
/* exported Group */

/**
 * @typedef {{
 *   name: string,
 *   academicPoints: number,
 *   id: number,
 *   groups: Array<Group>,
 * }}
 */
let Course;
/* exported Course */

/**
 * @typedef {{
 *   name: string,
 *   semester: string,
 *   courses: Array<Course>
 *  }}
 */
let Faculty;
/* exported Faculty */

/**
 * @typedef {Array<Faculty>}
 */
let Catalog;
/* exported Catalog */

/**
 * Settings to be saved. Note that this must be serializable directly as JSON,
 * so Settings and all of the types of its member variables can't have maps
 * nor sets.
 *
 * @typedef {{
 *   selectedCourses: Array<number>,
 *   catalogUrl: string,
 *   filterSettings: FilterSettings,
 * }}
 */
let Settings;
/* exported Settings */

const defaultCatalogUrl =
  'https://storage.googleapis.com/repy-176217.appspot.com/latest.json';

/**
 * Set the given catalog URL and save settings. For use from HTML.
 *
 * @param {string} url - URL to set
 */
function setCatalogUrl(url) {
  /* exported setCatalogUrl */
  $('#catalog-url').val(url);
  catalogUrlChanged();
}

/**
 * Handler for changes to the catalog URL field
 */
function catalogUrlChanged() {
  /* exported catalogUrlChanged */
  saveSettings();
}

let selectedCourses = new Set();

/**
 * Catalog of all courses
 * @type {Catalog}
 */
let currentCatalog = null;

/**
 * Mapping from course IDs to courses
 * @type {Map<number, Course>}
 */
let currentCatalogByCourseID = null;

/**
 * Creates an element with the given HTML.
 *
 * TODO(lutzky): There must be some builtin that does this...
 *
 * @param {string} tagName - Tag to build
 * @param {string} innerHTML - HTML to fill tag with
 *
 * @returns {!Element}
 */
function elementWithHTML(tagName, innerHTML) {
  let elem = document.createElement(tagName);
  elem.innerHTML = innerHTML;
  return elem;
}

/**
 * Updates forblink according to its data('forbidden')
 *
 * @param {jQuery} fl - forbidLink
 */
function updateForbidLinkText(fl) {
  console.info(
    'updateForbidLinkText for',
    fl.data('groupID'),
    'which has forbidden',
    fl.data('forbidden')
  );
  fl.text(fl.data('forbidden') ? '[unforbid]' : '[forbid]');
}

/**
 * Creates a header for the given group, for displaying in the catalog
 *
 * @param {Group} group - Group to create header for
 *
 * @returns {!jQuery}
 */
function groupHeaderForCatalog(group) {
  let result = $('<li>');
  let groupNameText = `Group ${group.id} (${group.type}) `;
  if (group.teachers.length > 0) {
    groupNameText += `(${group.teachers.join(', ')}) `;
  }

  let groupName = $('<b>', {
    text: groupNameText,
  });
  result.append(groupName);

  let forbidLink = $('<a>', {
    class: 'forbid-link',
    href: '#/',
    data: { forbidden: isGroupForbidden(group), groupID: groupIDString(group) },
  });

  updateForbidLinkText(forbidLink);

  forbidLink.on('click', function() {
    if (forbidLink.data('forbidden')) {
      delForbiddenGroup(group);
    } else {
      addForbiddenGroup(group);
    }
  });
  result.append(forbidLink);

  return result;
}

/**
 * Forbidden groups, as formatted using groupIDString
 *
 * @type {!Set<string>}
 */
let forbiddenGroups = new Set();

/**
 * A string identifier representing a given group. Used in forbiddenGroups.
 *
 * Format: 'course_id.group_id'
 *
 * @param {Group} group - Group to represent
 *
 * @returns {string}
 */
function groupIDString(group) {
  return `${group.course.id}.${group.id}`;
}

/**
 * Add the given group to the forbidden groups
 *
 * @param {Group} group - Group to forbid
 */
function addForbiddenGroup(group) {
  forbiddenGroups.add(groupIDString(group));
  saveSettings();

  updateForbiddenGroups();
}

/**
 * Remove the given group from the forbidden groups
 *
 * @param {Group} group - Group to unforbid
 */
function delForbiddenGroup(group) {
  forbiddenGroups.delete(groupIDString(group));
  saveSettings();

  updateForbiddenGroups();
}

/**
 * Check whether group is forbidden
 *
 * @param {Group} group - Group to check
 *
 * @returns {boolean}
 */
function isGroupForbidden(group) {
  return forbiddenGroups.has(groupIDString(group));
}

/**
 * Update the list of currently forbidden groups
 */
function updateForbiddenGroups() {
  let ul = $('#forbidden-groups');
  ul.empty();

  forbiddenGroups.forEach(function(fg) {
    let li = $('<li>');
    li.text(fg + ' ');

    let unforbidLink = $('<a>', {
      href: '#/',
      text: '[unforbid]',
      click: function() {
        forbiddenGroups.delete(fg);
        saveSettings();
        updateForbiddenGroups();
      },
    });

    li.append(unforbidLink);
    ul.append(li);
  });

  $('a.forbid-link').each(
    /** @this {HTMLElement} */
    function() {
      let groupID = /** @type {string} */ ($(this).data('groupID'));

      let isForbidden = forbiddenGroups.has(groupID);
      $(this).data('forbidden', isForbidden);
      updateForbidLinkText($(this));
    }
  );
}

/**
 * Return an HTML description for a course
 *
 * @param {Course} course - Course to describe
 *
 * @returns {!Element}
 */
function htmlDescribeCourse(course) {
  let result = document.createElement('span');
  console.info('Rendering description of course:', course);
  let ul = document.createElement('ul');
  ul.appendChild(
    elementWithHTML('li', `<b>Full name</b> ${course.id} ${course.name}`)
  );
  ul.appendChild(
    elementWithHTML('li', `<b>Academic points:</b> ${course.academicPoints}`)
  );
  ul.appendChild(
    elementWithHTML(
      'li',
      `<b>Lecturer in charge:</b> ${rtlSpan(
        course.lecturerInCharge || '[unknown]'
      )}`
    )
  );
  ul.appendChild(elementWithHTML('li', '<b>Test dates:</b>'));
  let testDates = document.createElement('ul');
  if (course.testDates) {
    course.testDates.forEach(function(d) {
      testDates.appendChild(elementWithHTML('li', formatDate(d)));
    });
  } else {
    testDates.appendChild(elementWithHTML('li', '[unknown]'));
  }
  ul.appendChild(testDates);

  ul.appendChild(elementWithHTML('li', '<b>Groups:</b>'));
  let groups = document.createElement('ul');
  if (course.groups) {
    course.groups.forEach(function(g) {
      groups.appendChild(groupHeaderForCatalog(g)[0]);
      let events = document.createElement('ul');
      if (g.events) {
        g.events.forEach(function(e) {
          events.appendChild(
            elementWithHTML(
              'li',
              `${dayNames[e.day]}, ${minutesToTime(
                e.startMinute
              )}-${minutesToTime(e.endMinute)} at ${e.location || '[unknown]'}`
            )
          );
        });
      } else {
        events.appendChild(elementWithHTML('li', '[unknown]'));
      }
      groups.appendChild(events);
    });
  } else {
    groups.appendChild(elementWithHTML('li', '[unknown]'));
  }
  ul.appendChild(groups);

  result.appendChild(ul);
  return result;
}

const rightArrow = '&#9656;';
const downArrow = '&#9662;';

/**
 * Wrap s with a right-to-left span
 *
 * @param {string} s - String to wrap
 * @returns {string}
 */
function rtlSpan(s) {
  return `<span dir="rtl">${s}</span>`;
}

/**
 * Create a span for a course label, including info button
 *
 * @param {Course} course - Course to create label for
 *
 * @returns {!Element}
 */
function courseLabel(course) {
  let span = document.createElement('span');
  let infoLink = document.createElement('a');
  infoLink.innerHTML = rightArrow;
  infoLink.className = 'expando';
  infoLink.href = '#/';
  span.innerHTML = ` ${course.id} ${rtlSpan(course.name)} `;
  infoLink.onclick = function() {
    if (!span.ttime3_expanded) {
      let infoDiv = document.createElement('div');
      span.infoDiv = infoDiv;
      infoDiv.appendChild(htmlDescribeCourse(course));
      // showCourseDebugInfo(course);
      span.appendChild(infoDiv);
      infoLink.innerHTML = downArrow;
      span.ttime3_expanded = true;
    } else {
      infoLink.innerHTML = rightArrow;
      span.ttime3_expanded = false;
      span.removeChild(span.infoDiv);
    }
  };
  span.appendChild(infoLink);
  return span;
}

let courseAddButtons = new Map();
let courseAddLabels = new Map();

/**
 * Write catalog selector to page.
 */
function writeCatalogSelector() {
  let facultiesDiv = $('#catalog');

  facultiesDiv.empty();
  currentCatalog.forEach(function(faculty) {
    let facultyDetails = $('<details>');

    let summary = $('<summary>');
    summary.html(`<strong>${faculty.name}</strong> `);
    let semesterTag = $('<span>', {
      class: 'badge badge-secondary',
      text: faculty.semester,
    });
    summary.append(semesterTag);
    facultyDetails.append(summary);
    facultiesDiv.append(facultyDetails);

    let courseList = $('<ul>', { class: 'course-list' });
    facultyDetails.append(courseList);

    faculty.courses.forEach(function(course) {
      let btn = $('<button>', {
        text: '+',
        click: function() {
          addSelectedCourse(course);
        },
      });
      courseAddButtons.set(course.id, btn);
      let label = courseLabel(course);
      courseAddLabels.set(course.id, label);
      let courseLi = $('<li>');
      courseLi.append(btn).append(label);
      courseList.append(courseLi);
    });
  });
}

/**
 * Returns whether or not a checkbox with the given ID is checked
 *
 * @param {string} id - ID of checkbox
 *
 * @returns {boolean}
 */
function getCheckboxValueById(id) {
  return document.getElementById(id).checked;
}

/**
 * Sets whether or not a checkbox with the given ID is checked
 *
 * @param {string} id - ID of checkbox
 * @param {boolean} checked - Whether or not checkbox should be checked
 */
function setCheckboxValueById(id, checked) {
  document.getElementById(id).checked = checked;
}

/**
 * Save all settings to localStorage
 */
function saveSettings() {
  settings.selectedCourses = Array.from(selectedCourses).map(c => c.id);
  settings.catalogUrl = /** @type {string} */ ($('#catalog-url').val());
  settings.filterSettings = {
    forbiddenGroups: Array.from(forbiddenGroups),
    noCollisions: getCheckboxValueById('filter.noCollisions'),
    noRunning: getCheckboxValueById('filter.noRunning'),
    freeDays: {
      enabled: getCheckboxValueById('filter.freeDays'),
      min: getNumInputValueWithDefault($('#filter\\.freeDays\\.min')[0], 0),
      max: getNumInputValueWithDefault($('#filter\\.freeDays\\.max')[0], 5),
    },
  };

  window.localStorage.ttime3_settings = JSON.stringify(settings);

  console.info('Saved settings:', settings);
}

/**
 * Get the numeric value in the given field, or return the default if
 * it's empty.
 *
 * @param {Element} input - Input field containing the number
 * @param {number} defaultValue - Number to return if input is empty
 *
 * @returns {number}
 */
function getNumInputValueWithDefault(input, defaultValue) {
  if (input.value == '') {
    return defaultValue;
  }
  return Number(input.value);
}

/**
 * Mark course as selected.
 *
 * @param {Course} course - Course to select
 */
function addSelectedCourse(course) {
  console.info('Selected', course);
  selectedCourses.add(course);
  courseAddButtons.get(course.id).disabled = true;
  courseAddLabels.get(course.id).classList.add('disabled-course-label');
  saveSettings();
  refreshSelectedCourses();
}

/**
 * Add a course with a given ID
 *
 * @param {...number} ids - Course IDS
 */
function addSelectedCourseByID(...ids) {
  /* exported addSelectedCourseByID */
  ids.forEach(function(id) {
    let course = getCourseByID(id);

    if (course) {
      addSelectedCourse(course);
    } else {
      throw new Error('No course with ID ' + id);
    }
  });
}

/**
 * Mark course as unselected.
 *
 * @param {Course} course - Course to unselect
 */
function delSelectedCourse(course) {
  console.info('Unselected', course);
  selectedCourses.delete(course);
  courseAddButtons.get(course.id).disabled = false;
  courseAddLabels.get(course.id).classList.remove('disabled-course-label');
  saveSettings();
  refreshSelectedCourses();
}

/**
 * Redraw the list of selected courses
 *
 * TODO(lutzky): This is actually a bad idea and would cause flicker, better do
 * something neater.
 */
function refreshSelectedCourses() {
  let div = $('#selected-courses');
  div.empty();
  let ul = $('<ul>', { class: 'course-list' });
  div.append(ul);
  selectedCourses.forEach(function(course) {
    let li = $('<li>');
    let label = courseLabel(course);
    let btn = $('<button>', {
      text: '-',
      click: function() {
        delSelectedCourse(course);
      },
    });
    li.append(btn).append(label);
    ul.append(li);
  });
}

let schedulerWorker = new Worker('scheduler_worker.js');

/**
 * Respond to scheduling result from worker
 *
 * @param {MessageEvent} e - blabbity boop
 */
schedulerWorker.onmessage = function(e) {
  console.info('Received message from worker:', e);
  $('#generate-schedules').prop('disabled', false);
  $('#spinner').hide();
  if (e.data == null) {
    $('#exception-occurred').show();
  }
  setPossibleSchedules(e.data);
};

/**
 * Start a worker to generate schedules
 */
function getSchedules() {
  /* exported getSchedules */
  $('#generate-schedules').prop('disabled', true);
  $('#spinner').show();
  $('#exception-occurred').hide();
  $('#no-schedules').hide();

  schedulerWorker.postMessage({
    courses: selectedCourses,
    filterSettings: settings.filterSettings,
  });
}

/** @type {Array<Schedule>} */
let possibleSchedules = [];

/** @type {number} */
let currentSchedule = 0;

/**
 * Set the collection of possible schedules
 *
 * @param {Array<Schedule>} schedules - Possible schedules
 */
function setPossibleSchedules(schedules) {
  possibleSchedules = schedules;
  currentSchedule = 0;
  let divs = $('#schedule-browser, #rendered-schedule-container');
  $('#num-schedules').text(schedules.length);
  if (
    schedules.length == 0 ||
    (schedules.length == 1 && schedules[0].events.length == 0)
  ) {
    divs.hide();
    $('#no-schedules').show();
  } else {
    divs.show();
    goToSchedule(0);
  }
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
  $('#current-schedule-id').text(i + 1);
  let schedule = possibleSchedules[i];
  let days = byDay(possibleSchedules[i]);

  writeScheduleContents($('#schedule-contents'), days);
  renderSchedule($('#rendered-schedule')[0], schedule);
}

/**
 * Write the schedule contents, as described by days, to target
 *
 * @param {jQuery} target - Target to write schedule to
 * @param {Array<Array<AcademicEvent>>} days - List of events for each day
 */
function writeScheduleContents(target, days) {
  target.empty();

  days.forEach(function(dayEvents) {
    let dayEntry = $('<li>');
    target.append(dayEntry);
    dayEntry.text(dayNames[dayEvents[0].day]);
    let eventList = $('<ul>');
    dayEntry.append(eventList);
    dayEvents.forEach(function(e) {
      let eventEntry = $('<li>');
      let startTime = minutesToTime(e.startMinute);
      let endTime = minutesToTime(e.endMinute);
      eventEntry.html(
        `${startTime}-${endTime} ${rtlSpan(e.group.course.name)} at ${rtlSpan(
          e.location || '[unknown]'
        )} with ${rtlSpan(e.group.teachers.join(',')) || '[unknown]'}`
      );
      eventList.append(eventEntry);
    });
  });
}

/**
 * Get events for schedule split into per-day arrays
 *
 * @param {Schedule} schedule - Schedule to split into days
 * @returns {Array<Array<AcademicEvent>>} - Each entry is an array of Events
 *                                          with the same day, sorted ascending.
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

/**
 * Find a course by its ID
 *
 * @param {number} id - Course ID
 *
 * @returns {Course}
 */
function getCourseByID(id) {
  return currentCatalogByCourseID.get(id);
}

/**
 * Set up the course selection selectize.js box
 */
function coursesSelectizeSetup() {
  let selectBox = $('#courses-selectize');
  currentCatalog.forEach(function(faculty) {
    let grp = $('<optgroup>', { label: faculty.name });
    selectBox.append(grp);
    faculty.courses.forEach(function(course) {
      grp.append(
        $('<option>', {
          value: course.id,
          text: `${course.id} - ${course.name}`,
        })
      );
    });
  });
  selectBox.selectize({
    onItemAdd: function(courseID) {
      if (courseID == '') {
        return;
      }
      let course = getCourseByID(Number(courseID));
      addSelectedCourse(course);
      selectBox[0].selectize.clear();
    },
  });
}

/**
 * Load settings from localStorage
 *
 * @param {Object} s - The window.localStorage object to load from
 * @returns {Settings}
 */
function loadSettings(s) {
  /** @type {Settings} */
  let result = {
    catalogUrl: defaultCatalogUrl,
    selectedCourses: [],
    forbiddenGroups: [],
    filterSettings: {
      forbiddenGroups: [],
      noCollisions: true,
      noRunning: false,
      freeDays: {
        enabled: false,
        min: 0,
        max: 5,
      },
    },
  };

  if (s.ttime3_settings) {
    result = /** @type {Settings} */ (Object.assign(
      result,
      /** @type {Settings} */ (JSON.parse(s.ttime3_settings))
    ));
  }

  console.info('Loaded settings:', result);

  $('#catalog-url').val(result.catalogUrl);

  {
    let fs = result.filterSettings;
    setCheckboxValueById('filter.noCollisions', fs.noCollisions);
    setCheckboxValueById('filter.noRunning', fs.noRunning);
    setCheckboxValueById('filter.freeDays', fs.freeDays.enabled);
    $('#filter\\.freeDays\\.min').val(String(fs.freeDays.min));
    $('#filter\\.freeDays\\.max').val(String(fs.freeDays.max));
  }

  return result;
}

let settings = loadSettings(window.localStorage);

forbiddenGroups = new Set(settings.filterSettings.forbiddenGroups);
updateForbiddenGroups();

loadCatalog(settings.catalogUrl, /* isLocal= */ false).then(
  function(catalog) {
    console.log('Loaded catalog:', catalog);
    currentCatalog = catalog;
    currentCatalogByCourseID = new Map();

    currentCatalog.forEach(function(faculty) {
      faculty.courses.forEach(function(course) {
        currentCatalogByCourseID.set(course.id, course);
      });
    });

    writeCatalogSelector();
    settings.selectedCourses.forEach(function(id) {
      try {
        addSelectedCourseByID(id);
      } catch (error) {
        console.error(`Failed to add course ${id}:`, error);
      }
    });
    coursesSelectizeSetup();
  },
  function(error) {
    console.error('Failed!', error);
  }
);
