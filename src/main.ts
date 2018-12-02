// To enable debugging, type the following into your Javascript console:
//
//   mainDebugLogging = true
let mainDebugLogging = false;

import {renderSchedule} from './render';
import {groupsByType, sortEvents, loadCatalog} from './common';
import {Schedule, Course, Group, Catalog, ScheduleRating, FilterSettings, AcademicEvent} from './common';
import {displayName, formatDate, minutesToTime} from './formatting';

/**
 * Settings to be saved. Note that this must be serializable directly as JSON,
 * so Settings and all of the types of its member variables can't have maps
 * nor sets.
 */
class Settings {
  selectedCourses: number[];
  forbiddenGroups: string[];
  customEvents: string;
  catalogUrl: string;
  filterSettings: FilterSettings;
}

const defaultCatalogUrl =
    'https://storage.googleapis.com/repy-176217.appspot.com/latest.json';

/**
 * Set the given catalog URL and save settings. For use from HTML.
 */
export function setCatalogUrl(url: string) {
  $('#catalog-url').val(url);
  catalogUrlChanged();
}

/**
 * Handler for changes to the catalog URL field
 */
function catalogUrlChanged() {
  saveSettings();
}

let selectedCourses = new Set();

/**
 * Catalog of all courses
 */
let currentCatalog: Catalog = null;

/**
 * Mapping from course IDs to courses
 */
let currentCatalogByCourseID: Map<number, Course> = null;

/**
 * Updates forblink according to its data('forbidden')
 */
function updateForbidLinkText(fl: JQuery) {
  fl.text(fl.data('forbidden') ? '[unforbid]' : '[forbid]');
}

/**
 * Creates a header for the given group, for displaying in the catalog
 */
function groupHeaderForCatalog(group: Group): JQuery {
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
    data: {forbidden: isGroupForbidden(group), groupID: groupIDString(group)},
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
 */
let forbiddenGroups: Set<string> = new Set();

/**
 * A string identifier representing a given group. Used in forbiddenGroups.
 *
 * Format: 'course_id.group_id'
 */
function groupIDString(group: Group): string {
  return `${group.course.id}.${group.id}`;
}

/**
 * Add the given group to the forbidden groups
 */
function addForbiddenGroup(group: Group) {
  forbiddenGroups.add(groupIDString(group));
  saveSettings();

  updateForbiddenGroups();
}

/**
 * Remove the given group from the forbidden groups
 */
function delForbiddenGroup(group: Group) {
  forbiddenGroups.delete(groupIDString(group));
  saveSettings();

  updateForbiddenGroups();
}

/**
 * Check whether group is forbidden
 */
function isGroupForbidden(group: Group): boolean {
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

  $('a.forbid-link').each(function() {
    let groupID: string = $(this).data('groupID');

    let isForbidden = forbiddenGroups.has(groupID);
    $(this).data('forbidden', isForbidden);
    updateForbidLinkText($(this));
  });
}

/**
 * Format a course ID as a 6-digit number
 *
 * For example, 18420 should be presented (and searchable) as 018420.
 */
function formatCourseId(id: number): string {
  return String(id).padStart(6, '0');
}

/**
 * Return an HTML description for a course
 */
function htmlDescribeCourse(course: Course): HTMLElement {
  let result = $('<span>');
  let ul = $('<ul>');
  ul.append($('<li>', {
    html: `<b>Full name</b> ${formatCourseId(course.id)} ${course.name}`,
  }));
  ul.append(
      $('<li>', {html: `<b>Academic points:</b> ${course.academicPoints}`}));
  ul.append($('<li>', {
    html: `<b>Lecturer in charge:</b> ${
        rtlSpan(course.lecturerInCharge || '[unknown]')}`,
  }));
  ul.append($('<li>', {html: '<b>Test dates:</b>'}));
  let testDates = $('<ul>');
  if (course.testDates) {
    course.testDates.forEach(function(d) {
      testDates.append($('<li>', {text: formatDate(d)}));
    });
  } else {
    testDates.append($('<li>', {text: '[unknown]'}));
  }
  ul.append(testDates);

  ul.append($('<li>', {html: '<b>Groups:</b>'}));
  let groups = $('<ul>');
  if (course.groups) {
    course.groups.forEach(function(g) {
      groups.append(groupHeaderForCatalog(g)[0]);
      let events = $('<ul>');
      if (g.events) {
        g.events.forEach(function(e) {
          events.append($('<li>', {
            text: `${dayNames[e.day]}, ` + minutesToTime(e.startMinute) + '-' +
                minutesToTime(e.endMinute) + ` at ${e.location || '[unknown]'}`,
          }));
        });
      } else {
        events.append($('<li>', {text: '[unknown]'}));
      }
      groups.append(events);
    });
  } else {
    groups.append($('<li>', {text: '[unknown]'}));
  }
  ul.append(groups);

  result.append(ul);
  return result[0];
}

const expandInfoSymbol = '<i class="fas fa-info-circle"></i>';
const collapseInfoSymbol = '<i class="fas fa-minus-circle"></i>';

/**
 * Wrap s with a right-to-left span
 */
function rtlSpan(s: string): string {
  return `<span dir="rtl">${s}</span>`;
}

/**
 * Create a span for a course label, including info button
 */
function courseLabel(course: Course): HTMLElement {
  // TODO(lutzky): This function is full of DOM misuse, hence the ts-ignore
  // symbols.
  let span = document.createElement('span');
  let infoLink = document.createElement('a');
  infoLink.innerHTML = expandInfoSymbol;
  infoLink.className = 'expando';
  infoLink.href = '#/';
  span.innerHTML = ` ${formatCourseId(course.id)} ${rtlSpan(course.name)} `;
  infoLink.onclick = function() {
    // @ts-ignore: dom-misuse
    if (!span.ttime3_expanded) {
      let infoDiv = document.createElement('div');
      // @ts-ignore: dom-misuse
      span.infoDiv = infoDiv;
      infoDiv.appendChild(htmlDescribeCourse(course));
      // showCourseDebugInfo(course);
      span.appendChild(infoDiv);
      infoLink.innerHTML = collapseInfoSymbol;
      // @ts-ignore: dom-misuse
      span.ttime3_expanded = true;
    } else {
      infoLink.innerHTML = expandInfoSymbol;
      // @ts-ignore: dom-misuse
      span.ttime3_expanded = false;
      // @ts-ignore: dom-misuse
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

    let courseList = $('<ul>', {class: 'course-list'});
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
 */
function getCheckboxValueById(id: string): boolean {
  return (document.getElementById(id) as HTMLInputElement).checked;
}

/**
 * Sets whether or not a checkbox with the given ID is checked
 */
function setCheckboxValueById(id: string, checked: boolean) {
  (document.getElementById(id) as HTMLInputElement).checked = checked;
}

/**
 * Save all settings to localStorage
 */
function saveSettings() {
  settings.selectedCourses = Array.from(selectedCourses).map(c => c.id);
  settings.customEvents = $('#custom-events-textarea').val() as string;
  settings.catalogUrl = $('#catalog-url').val() as string;
  settings.filterSettings = {
    forbiddenGroups: Array.from(forbiddenGroups),
    noCollisions: getCheckboxValueById('filter.noCollisions'),
    ratingMax: getNullRating(),
    ratingMin: getNullRating(),
  };

  Object.keys(allRatings).forEach(function(r) {
    // @ts-ignore: allRatings
    settings.filterSettings.ratingMin[r] = getNumInputValueWithDefault(
        ($(`#rating-${r}-min`)[0]) as HTMLInputElement, null);
    // @ts-ignore: allRatings
    settings.filterSettings.ratingMax[r] = getNumInputValueWithDefault(
        ($(`#rating-${r}-max`)[0]) as HTMLInputElement, null);
  });

  window.localStorage.setItem('ttime3_settings', JSON.stringify(settings));

  if (mainDebugLogging) {
    console.info('Saved settings:', settings);
  }
}

/**
 * Get the numeric value in the given field, or return the default if
 * it's empty.
 */
function getNumInputValueWithDefault(
    input: HTMLInputElement, defaultValue: number): number {
  if (input.value == '') {
    return defaultValue;
  }
  return Number(input.value);
}

/**
 * Mark course as selected.
 */
function addSelectedCourse(course: Course) {
  if (mainDebugLogging) {
    console.info('Selected', course);
  }
  selectedCourses.add(course);
  courseAddButtons.get(course.id).disabled = true;
  courseAddLabels.get(course.id).classList.add('disabled-course-label');
  saveSettings();
  refreshSelectedCourses();
}

/**
 * Add a course with a given ID
 */
export function addSelectedCourseByID(...ids: number[]) {
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
 */
function delSelectedCourse(course: Course) {
  if (mainDebugLogging) {
    console.info('Unselected', course);
  }
  selectedCourses.delete(course);
  courseAddButtons.get(course.id).disabled = false;
  courseAddLabels.get(course.id).classList.remove('disabled-course-label');
  saveSettings();
  refreshSelectedCourses();
}

/**
 * Redraw the list of selected courses
 */
function refreshSelectedCourses() {
  let nscheds = Number(totalPossibleSchedules(selectedCourses));
  $('#possible-schedules')
      .text(`${nscheds.toLocaleString()} (${nscheds.toExponential(2)})`);
  $('#generate-schedules').prop('disabled', selectedCourses.size == 0);
  let div = $('#selected-courses');
  div.empty();
  let ul = $('<ul>', {class: 'list-group'});
  div.append(ul);
  selectedCourses.forEach(function(course) {
    let li = $('<li>', {class: 'list-group-item'});
    let label = courseLabel(course);
    let btn = $('<button>', {
      class: 'btn btn-sm btn-danger float-right',
      html: '<i class="fas fa-trash-alt"></i>',
      click: function() {
        delSelectedCourse(course);
      },
    });
    li.append(label);

    if (course.groups == null || course.groups.length == 0) {
      li.append($('<i>', {
        class: 'text-warning fas fa-exclamation-triangle',
        title: 'Course has no groups',
      }));
    }

    li.append(btn);
    ul.append(li);
  });
}

import SchedulerWorker = require('worker-loader?name=[name].js!./scheduler_worker');
let schedulerWorker = new SchedulerWorker();

/**
 * Respond to scheduling result from worker
 */
schedulerWorker.onmessage = function(e: MessageEvent) {
  if (mainDebugLogging) {
    console.info('Received message from worker:', e);
  }
  $('#generate-schedules').prop('disabled', false);
  $('#spinner').hide();
  if (e.data == null) {
    $('#exception-occurred-scheduling').show();
  } else {
    setPossibleSchedules(e.data);
  }
};

/**
 * Check if custom-events-textarea has valid events
 */
export function checkCustomEvents() {
  let elem = $('#custom-events-textarea');
  elem.removeClass('is-invalid');
  elem.removeClass('is-valid');

  try {
    let courses = buildCustomEventsCourses(elem.val() as string);
    if (courses.length > 0) {
      elem.addClass('is-valid');
    }
  } catch (e) {
    elem.addClass('is-invalid');
  }
}

const customEventRegex = new RegExp([
  /(Sun|Mon|Tue|Wed|Thu|Fri|Sat) /,
  /([0-9]{2}):([0-9]{2})-([0-9]{2}):([0-9]{2}) /,
  /(.*)/,
].map(x => x.source).join(''));

// TODO(lutzky): inverseDayIndex is causing type problems, making us use
// some ts-ignore.
const inverseDayIndex = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * Create a course with a single event
 */
function createSingleEventCourse(
    name: string, day: number, startMinute: number, endMinute: number): Course {
  let c: Course = {
    academicPoints: 0,
    id: 0,
    lecturerInCharge: '',
    name: name,
    testDates: [],
    groups: [],
  };

  let g: Group = {
    course: c,
    description: '',
    id: 0,
    teachers: [],
    type: 'lecture',
    events: [],
  };

  c.groups.push(g);

  let e: AcademicEvent = {
    day: day,
    startMinute: startMinute,
    endMinute: endMinute,
    location: '',
    group: g,
  };

  g.events.push(e);

  return c;
}

/**
 * Build courses with the configured custom events
 *
 * @param s - Custom events, lines matching customEventRegex
 */
function buildCustomEventsCourses(s: string): Course[] {
  let result: Course[] = [];

  if (s == '') {
    return result;
  }

  s.split('\n').forEach(function(line) {
    let m = customEventRegex.exec(line);
    if (m == null) {
      throw Error('Invalid custom event line: ' + line);
    }

    // @ts-ignore: inverseDayIndex
    let day: number = inverseDayIndex[m[1]];
    let startMinute = Number(Number(m[2]) * 60 + Number(m[3]));
    let endMinute = Number(Number(m[4]) * 60 + Number(m[5]));
    let desc = m[6];

    result.push(createSingleEventCourse(desc, day, startMinute, endMinute));
  });

  return result;
}

/**
 * Start a worker to generate schedules
 */
export function getSchedules() {
  $('#generate-schedules').prop('disabled', true);
  $('#spinner').show();
  $('#exception-occurred').hide();
  $('#no-schedules').hide();
  $('#initial-instructions').hide();

  let coursesToSchedule = new Set(selectedCourses);
  try {
    let courses = buildCustomEventsCourses(settings.customEvents);
    courses.forEach(c => coursesToSchedule.add(c));
  } catch (error) {
    console.error('Failed to build custom events course:', error);
  }

  schedulerWorker.postMessage({
    courses: coursesToSchedule,
    filterSettings: settings.filterSettings,
  });
}

let possibleSchedules: Schedule[] = [];

let currentSchedule = 0;

/**
 * Set the collection of possible schedules
 */
function setPossibleSchedules(schedules: Schedule[]) {
  possibleSchedules = schedules;
  currentSchedule = 0;
  let divs = $('#schedule-browser, #rendered-schedule-container');
  $('#num-schedules').text(schedules.length);
  if (schedules.length == 0 ||
      (schedules.length == 1 && schedules[0].events.length == 0)) {
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
export function nextSchedule() {
  goToSchedule(currentSchedule + 1);
}

/**
 * Decrement the current displayed schedule
 */
export function prevSchedule() {
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

// Colors are taken from this page, but reordered to maximize contrast:
// https://getbootstrap.com/docs/4.1/getting-started/theming/
const courseColors = [
  ['#007bff', '#fff'],  // blue
  ['#e83e8c', '#fff'],  // pink
  ['#ffc107', '#000'],  // yellow
  ['#6610f2', '#fff'],  // indigo
  ['#dc3545', '#fff'],  // red
  ['#28a745', '#fff'],  // green
  ['#6f42c1', '#fff'],  // purple
  ['#fd7e14', '#000'],  // orange
  ['#20c997', '#fff'],  // teal
  ['#17a2b8', '#fff'],  // cyan
  ['#6c757d', '#fff'],  // gray
  ['#343a40', '#fff'],  // dark-gray
];

/**
 * Get appropriate colors for courses
 */
function getCourseColorMap(courses: Set<Course>): Map<number, string[]> {
  let numbers = Array.from(courses.values()).map(c => c.id).sort();

  // 0 course ID is for custom events
  numbers.push(0);

  let numsAndColors =
      numbers.map((num, i) => [num, courseColors[i]]) as [number, string[]][];

  return new Map(numsAndColors);
}

/**
 * Display schedule i, modulo the possible range 0-(numSchedules - 1)
 */
function goToSchedule(i: number) {
  let max = possibleSchedules.length;
  i = (i + max) % max;
  currentSchedule = i;
  $('#current-schedule-id').text(i + 1);
  let schedule = possibleSchedules[i];

  writeScheduleContents($('#schedule-contents'), schedule);
  renderSchedule(
      $('#rendered-schedule')[0], schedule, getCourseColorMap(selectedCourses));
}

let sortedByRating = '';

let sortedByRatingAsc = true;

// TODO(lutzky): allRatings breaks typescript type checks and forces us to
// use a lot of ts-ignore comments.
const allRatings = {
  earliestStart: {
    name: 'Earliest start',
    explanation: 'Hour at which the earliest class of the week start',
    badgeTextFunc: (s: number) => `Earliest start: ${s}`,
  },
  latestFinish: {
    name: 'Latest finish',
    explanation: 'Hour at which the latest class of the week finishes',
    badgeTextFunc: (s: number) => `Latest finish: ${s}`,
  },
  numRuns: {
    name: 'Number of runs',
    explanation: 'Number of adjacent classes in different buildings',
    badgeTextFunc: (s: number) => `${s} runs`,
  },
  freeDays: {
    name: 'Free days',
    explanation: 'Number of days with no classes',
    badgeTextFunc: (s: number) => `${s} free days`,
  },
};

/**
 * Sort current schedule by rating
 */
function sortByRating(rating: string) {
  if (sortedByRating == rating) {
    sortedByRatingAsc = !sortedByRatingAsc;
  }

  sortedByRating = rating;
  possibleSchedules.sort(function(a, b) {
    // @ts-ignore: allRatings
    return (sortedByRatingAsc ? 1 : -1) * (a.rating[rating] - b.rating[rating]);
  });

  goToSchedule(0);
  Object.keys(allRatings).forEach(function(rating) {
    $(`#rating-badge-${rating}`)
        .replaceWith(getRatingBadge(rating, possibleSchedules[0]));
  });
}

/**
 * Get a badge for the given rating according to the schedule type
 */
function getRatingBadge(rating: string, schedule: Schedule): JQuery {
  let result = $('<a>', {
    class: 'badge badge-info',
    id: `rating-badge-${rating}`,
    // @ts-ignore: allRatings
    text: allRatings[rating].badgeTextFunc(schedule.rating[rating]),
    // @ts-ignore: allRatings
    title: allRatings[rating].explanation,
    href: '#/',
    click: function() {
      sortByRating(rating);
    },
  });

  if (sortedByRating == rating) {
    let icon = sortedByRatingAsc ? 'fa-sort-up' : 'fa-sort-down';
    result.append(` <i class="fas ${icon}"></i>`);
  }

  return result;
}

/**
 * Write the schedule contents to target
 */
function writeScheduleContents(target: JQuery, schedule: Schedule) {
  target.empty();

  Object.keys(allRatings)
      .map(rating => getRatingBadge(rating, schedule))
      .forEach(function(badge) {
        target.append(badge).append(' ');
      });

  let ul = $('<ul>', {class: 'list-group'});
  target.append(ul);

  byDay(schedule).forEach(function(dayEvents) {
    let dayEntry = $('<li>', {
      class: 'list-group-item',
      css: {'padding-top': '2px', 'padding-bottom': '2px'},
      html: $('<small>', {
        class: 'font-weight-bold',
        text: dayNames[dayEvents[0].day],
      }),
    });
    ul.append(dayEntry);
    // let eventList = $('<ul>');
    //    dayEntry.append(eventList);
    dayEvents.forEach(function(e) {
      let eventEntry = $('<li>', {
        class: 'list-group-item',
      });
      let startTime = minutesToTime(e.startMinute);
      let location = e.location || '[unknown]';
      let endTime = minutesToTime(e.endMinute);
      let teachers = e.group.teachers.join(',') || '[unknown]';
      eventEntry.html(`
        <div class="d-flex w-100 justify-content-between">
           <small class="text-muted">
             <i class="far fa-clock"></i>
             ${startTime}-${endTime}
           </small>
           <small>
             <i class="fas fa-map-marker"></i>
             <span dir="rtl">${location}</span>
           </small>
        </div>
        <div dir="rtl">${displayName(e.group)}</div>
        <div class="d-flex w-100 justify-content-between">
          <small>
            <i class="fas fa-chalkboard-teacher"></i>
            <span dir="rtl">${teachers}</span>
          </small>
          <small class="text-muted">
            ${formatCourseId(e.group.course.id)}, group ${e.group.id}
          </small>
        </div>
        `);
      ul.append(eventEntry);
    });
  });
}

/**
 * Get events for schedule split into per-day arrays
 *
 * @returns An array of arrays of events, with entry is an array of events
 *          with the same day, sorted ascending.
 */
function byDay(schedule: Schedule): AcademicEvent[][] {
  let events = schedule.events.slice();
  let result: AcademicEvent[][] = [[]];

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
 */
function getCourseByID(id: number): Course {
  return currentCatalogByCourseID.get(id);
}

/**
 * Gets nicknames or abbreviations for a course
 */
function getNicknames(course: Course): string {
  let result = [];

  if (course.name.includes('חשבון דיפרנציאלי ואינטגרלי')) {
    result.push('חדוא', 'חדו"א');
  }
  if (course.name.includes('מדעי המחשב')) {
    result.push('מדמח', 'מדמ"ח');
  }
  if (course.name.includes('פיסיקה')) {
    result.push('פיזיקה');
  }
  if (course.name.includes('אנליזה נומרית')) {
    result.push('נומריזה');
  }

  return result.join(' ');
}

/**
 * Set up the course selection selectize.js box
 */
function coursesSelectizeSetup() {
  let selectBox = $('#courses-selectize');

  // Getting the types right for selectize is difficult :/

  let opts: any = [];
  let optgroups: any = [];

  currentCatalog.forEach(function(faculty) {
    optgroups.push({label: faculty.name, value: faculty.name});
    faculty.courses.forEach(function(course) {
      opts.push({
        optgroup: faculty.name,
        value: course.id,
        text: `${formatCourseId(course.id)} - ${course.name}`,
        nicknames: getNicknames(course),
      });
    });
  });

  selectBox.selectize({
    options: opts,
    optgroups: optgroups,
    searchField: ['text', 'nicknames'],
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
 * Get a null rating
 */
function getNullRating(): ScheduleRating {
  return {
    earliestStart: null,
    freeDays: null,
    latestFinish: null,
    numRuns: null,
  };
}

/**
 * Load settings from localStorage
 *
 * @param s - JSON form of settings
 */
function loadSettings(s: string): Settings {
  let result: Settings = {
    catalogUrl: defaultCatalogUrl,
    selectedCourses: [],
    forbiddenGroups: [],
    customEvents: '',
    filterSettings: {
      forbiddenGroups: [],
      noCollisions: true,
      ratingMin: getNullRating(),
      ratingMax: getNullRating(),
    },
  };

  if (s != '') {
    result = $.extend(true /* deep */, result, JSON.parse(s) as Settings) as
        Settings;
  }

  if (mainDebugLogging) {
    console.info('Loaded settings:', result);
  }

  $('#catalog-url').val(result.catalogUrl);
  $('#custom-events-textarea').val(result.customEvents);

  {
    let fs = result.filterSettings;
    setCheckboxValueById('filter.noCollisions', fs.noCollisions);

    Object.keys(allRatings).forEach(function(r) {
      // @ts-ignore: allRatings
      $(`#rating-${r}-min`).val(fs.ratingMin[r]);
      // @ts-ignore: allRatings
      $(`#rating-${r}-max`).val(fs.ratingMax[r]);
    });
  }

  return result;
}

/**
 * Figure out the total number of schedules possible for the set of courses,
 * disregarding filters.
 */
function totalPossibleSchedules(courses: Set<Course>): number {
  let k = Array.from(courses.values());

  return k
      .map(
          course => groupsByType(course)
                        .map(t => t.length)
                        .reduce((a, b) => a * b, 1))
      .reduce((a, b) => a * b, 1);
}

/**
 * Build the limit-by-ratings form for the settings subpage
 */
function buildRatingsLimitForm() {
  let form = $('#rating-limits-form');
  Object.keys(allRatings).forEach(function(r) {
    let row = $('<div>', {class: 'row'});
    form.append(row);
    row.append($('<div>', {
      class: 'col col-form-label',
      // @ts-ignore: allRatings
      text: allRatings[r].name,
      // @ts-ignore: allRatings
      title: allRatings[r].explanation,
    }));
    row.append($('<div>', {
      class: 'col',
      html: $('<input>', {
        id: `rating-${r}-min`,
        type: 'number',
        class: 'form-control',
        placeholder: '-∞',
        change: saveSettings,
      }),
    }));
    row.append($('<div>', {
      class: 'col',
      html: $('<input>', {
        id: `rating-${r}-max`,
        type: 'number',
        class: 'form-control',
        placeholder: '∞',
        change: saveSettings,
      }),
    }));
  });
}

buildRatingsLimitForm();

let settings = loadSettings(window.localStorage.getItem('ttime3_settings'));

forbiddenGroups = new Set(settings.filterSettings.forbiddenGroups);
updateForbiddenGroups();

loadCatalog(settings.catalogUrl, /* isLocal= */ false)
    .then(
        function(catalog) {
          if (mainDebugLogging) {
            console.log('Loaded catalog:', catalog);
          }
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
          $('#exception-occurred-catalog').show();
          console.error('Failed to load catalog:', error);
        });
