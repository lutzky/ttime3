(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ttime"] = factory();
	else
		root["ttime"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/worker-loader/dist/cjs.js?name=[name].js!./src/scheduler_worker.ts":
/*!*****************************************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js?name=[name].js!./src/scheduler_worker.ts ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return new Worker(__webpack_require__.p + "scheduler_worker.js");
};

/***/ }),

/***/ "./src/cheesefork.ts":
/*!***************************!*\
  !*** ./src/cheesefork.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This module implements support for importing data from cheeseFork
 *
 * See https://github.com/michael-maltsev/cheese-fork
 */
/**
 * Parse a cheesefork-format hour
 *
 * @param s - "HH:M - HH:M", where M is tens of minutes
 *
 * @returns Minutes since midnight
 */
function parseCheeseForkHour(s) {
    return s.split(' - ').map(function (hhm) {
        let splitHour = hhm.split(':');
        let minute = Number(splitHour[0]) * 60;
        if (splitHour.length > 1) {
            minute += Number(splitHour[1]) * 10;
        }
        return minute;
    });
}
const dateRegex = /([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/;
/**
 * Parse a cheesefork-format test date
 *
 * @param s - "Bla bla bla DD.MM.YYYY Bla bla bla"
 */
function parseCheeseForkTestDate(s) {
    if (!s) {
        return null;
    }
    let r = dateRegex.exec(s);
    if (r == null) {
        console.warn('Failed to match date regex with: ', s);
        return null;
    }
    return { day: Number(r[1]), month: Number(r[2]), year: Number(r[3]) };
}
/**
 * Parse cheesefork data
 *
 * @param jsData - Cheesefork courses_*.js data
 */
function parseCheeseFork(jsData) {
    const cheeseForkPrefix = 'var courses_from_rishum = ';
    const hebrew = {
        academicPoints: 'נקודות',
        building: 'בניין',
        courseId: 'מספר מקצוע',
        courseName: 'שם מקצוע',
        day: 'יום',
        dayLetters: 'אבגדהוש',
        faculty: 'פקולטה',
        group: 'קבוצה',
        hour: 'שעה',
        lecturer_tutor: 'מרצה/מתרגל',
        moed_a: 'מועד א',
        moed_b: 'מועד ב',
        num: 'מס.',
        room: 'חדר',
        sport: 'ספורט',
        thoseInCharge: 'אחראים',
        type: 'סוג',
    };
    const typeMap = new Map([['הרצאה', 'lecture'], ['תרגול', 'tutorial']]);
    let facultiesByName = new Map();
    if (!jsData.startsWith(cheeseForkPrefix)) {
        throw new Error('Not valid cheesefork jsData - lacks expected prefix');
    }
    let data = JSON.parse(jsData.substring(cheeseForkPrefix.length));
    console.info('Experimental CheeseFork parser. First course: ', data[0]);
    data.forEach(function (dataCourse) {
        let facultyName = dataCourse['general'][hebrew.faculty];
        if (!facultiesByName.has(facultyName)) {
            facultiesByName.set(facultyName, {
                name: facultyName,
                semester: 'cheesefork-unknown-semester',
                courses: [],
            });
        }
        let faculty = facultiesByName.get(facultyName);
        let course = {
            academicPoints: Number(dataCourse['general'][hebrew.academicPoints]),
            faculty: faculty,
            name: dataCourse['general'][hebrew.courseName],
            id: Number(dataCourse['general'][hebrew.courseId]),
            lecturerInCharge: dataCourse['general'][hebrew.thoseInCharge],
            testDates: [
                dataCourse['general'][hebrew.moed_a],
                dataCourse['general'][hebrew.moed_b],
            ].map(parseCheeseForkTestDate)
                .filter(x => x != null),
            groups: [],
        };
        let groupFirstAppearedInMetagroup = new Map();
        let groupsById = new Map();
        dataCourse['schedule'].forEach(function (dataSchedule) {
            /*
             * In CheeseFork data, groups are repeated according to
             * "groups-you-should-sign-up-to". This is denoted as "group" in the data,
             * whereas what we would consider the actual group number is denoted as
             * "number". So, for example, "group" 11 might say you should register for
             * lecture 10 and tutorial 11, and "group" 12 would say you should
             * register for lecture 10 and tutorial 12. Lecture 10 would be repeated
             * in the data - once for each "group". So we call these "groups"
             * metaGroups here, and ignore subsequent instances of any "real group" -
             * that is, any group with a number we've seen before, but a metagroup we
             * haven't seen.
             */
            let metaGroupId = dataSchedule[hebrew.group];
            let groupId = dataSchedule[hebrew.num];
            if (!groupFirstAppearedInMetagroup.has(groupId)) {
                groupFirstAppearedInMetagroup.set(groupId, metaGroupId);
            }
            if (groupFirstAppearedInMetagroup.get(groupId) != metaGroupId) {
                return;
            }
            if (!groupsById.has(groupId)) {
                let type = '';
                let desc = '';
                if (facultyName == hebrew.sport) {
                    type = 'sport';
                    desc = dataSchedule[hebrew.type];
                }
                else {
                    type = typeMap.get(dataSchedule[hebrew.type]) ||
                        dataSchedule[hebrew.type];
                }
                groupsById.set(groupId, {
                    id: groupId,
                    description: desc,
                    course: course,
                    teachers: [],
                    type: type,
                    events: [],
                });
            }
            let group = groupsById.get(groupId);
            let times = parseCheeseForkHour(dataSchedule[hebrew.hour]);
            let event = {
                group: group,
                day: hebrew.dayLetters.indexOf(dataSchedule[hebrew.day]),
                startMinute: times[0],
                endMinute: times[1],
                location: dataSchedule[hebrew.building] + ' ' + dataSchedule[hebrew.room],
            };
            {
                let t = dataSchedule[hebrew.lecturer_tutor];
                if (t && !group.teachers.includes(t)) {
                    group.teachers.push(t);
                }
            }
            group.events.push(event);
        });
        groupsById.forEach(function (group, _) {
            course.groups.push(group);
        });
        faculty.courses.push(course);
    });
    return Array.from(facultiesByName.values());
}
exports.parseCheeseFork = parseCheeseFork;


/***/ }),

/***/ "./src/common.ts":
/*!***********************!*\
  !*** ./src/common.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cheesefork_1 = __webpack_require__(/*! ./cheesefork */ "./src/cheesefork.ts");
class Faculty {
}
exports.Faculty = Faculty;
class Group {
}
exports.Group = Group;
class Course {
}
exports.Course = Course;
class AcademicEvent {
}
exports.AcademicEvent = AcademicEvent;
class Schedule {
}
exports.Schedule = Schedule;
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
}
exports.ScheduleRating = ScheduleRating;
;
class FilterSettings {
}
exports.FilterSettings = FilterSettings;
class DateObj {
}
exports.DateObj = DateObj;
/**
 * Sorts events by start time
 */
function sortEvents(events) {
    events.sort(function (a, b) {
        if (a.day != b.day) {
            return a.day - b.day;
        }
        return a.startMinute - b.startMinute;
    });
}
exports.sortEvents = sortEvents;
/**
 * Returns false iff two entries in events overlap
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
exports.eventsCollide = eventsCollide;
/**
 * Load the catalog object from url.
 */
function loadCatalog(url) {
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                let result = null;
                try {
                    if (req.response[0] == '[') {
                        result = JSON.parse(req.response);
                    }
                    else {
                        result = cheesefork_1.parseCheeseFork(req.response);
                    }
                    fixRawCatalog(result);
                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(Error('Network Error'));
        };
        req.send();
    });
}
exports.loadCatalog = loadCatalog;
/**
 * Add back-links to catalog objects (course -> faculty, group -> course, etc.)
 */
function fixRawCatalog(catalog) {
    catalog.forEach(function (faculty) {
        faculty.courses.forEach(function (course) {
            course.faculty = faculty;
            if (course.groups) {
                course.groups.forEach(function (group) {
                    group.course = course;
                    if (group.events) {
                        group.events.forEach(function (event) {
                            event.group = group;
                        });
                    }
                });
            }
        });
    });
}
const testData = __webpack_require__(/*! ../testdata.json */ "./testdata.json");
function loadTestCatalog() {
    return new Promise(function (resolve, _reject) {
        let result = testData;
        fixRawCatalog(result);
        resolve(result);
    });
}
exports.loadTestCatalog = loadTestCatalog;
/**
 * Return course's groups as an array of arrays, split by type
 */
function groupsByType(course) {
    let m = new Map();
    if (!course.groups) {
        return [];
    }
    course.groups.forEach(function (group) {
        if (!m.has(group.type)) {
            m.set(group.type, []);
        }
        m.get(group.type).push(group);
    });
    return Array.from(m.values());
}
exports.groupsByType = groupsByType;


/***/ }),

/***/ "./src/formatting.ts":
/*!***************************!*\
  !*** ./src/formatting.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convert minutes-from-midnight to HH:MM
 */
function minutesToTime(minutes) {
    let hourString = Math.floor(minutes / 60).toString().padStart(2, '0');
    let minuteString = (minutes % 60).toString().padStart(2, '0');
    return hourString + ':' + minuteString;
}
exports.minutesToTime = minutesToTime;
/**
 * Format a DateObj as a string
 */
function formatDate(dateObj) {
    return new Date(dateObj.year, dateObj.month, dateObj.day).toDateString();
}
exports.formatDate = formatDate;
/**
 * Return the appropriate display name for the group
 */
function displayName(group) {
    return group.description || group.course.name;
}
exports.displayName = displayName;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// To enable debugging, type the following into your Javascript console:
//
//   mainDebugLogging = true
let mainDebugLogging = false;
const render_1 = __webpack_require__(/*! ./render */ "./src/render.ts");
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const formatting_1 = __webpack_require__(/*! ./formatting */ "./src/formatting.ts");
/**
 * Settings to be saved. Note that this must be serializable directly as JSON,
 * so Settings and all of the types of its member variables can't have maps
 * nor sets.
 */
class Settings {
}
const defaultCatalogUrl = 'https://storage.googleapis.com/repy-176217.appspot.com/latest.json';
/**
 * Set the given catalog URL and save settings. For use from HTML.
 */
function setCatalogUrl(url) {
    $('#catalog-url').val(url);
    catalogUrlChanged();
}
window.setCatalogUrl = setCatalogUrl;
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
let currentCatalog = null;
/**
 * Mapping from course IDs to courses
 */
let currentCatalogByCourseID = null;
/**
 * Updates forblink according to its data('forbidden')
 */
function updateForbidLinkText(fl) {
    fl.text(fl.data('forbidden') ? '[unforbid]' : '[forbid]');
}
/**
 * Creates a header for the given group, for displaying in the catalog
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
    forbidLink.on('click', function () {
        if (forbidLink.data('forbidden')) {
            delForbiddenGroup(group);
        }
        else {
            addForbiddenGroup(group);
        }
    });
    result.append(forbidLink);
    return result;
}
/**
 * Forbidden groups, as formatted using groupIDString
 */
let forbiddenGroups = new Set();
/**
 * A string identifier representing a given group. Used in forbiddenGroups.
 *
 * Format: 'course_id.group_id'
 */
function groupIDString(group) {
    return `${group.course.id}.${group.id}`;
}
/**
 * Add the given group to the forbidden groups
 */
function addForbiddenGroup(group) {
    forbiddenGroups.add(groupIDString(group));
    saveSettings();
    updateForbiddenGroups();
}
// TODO(lutzky): Making addForbiddenGroup available to render.ts in this way
// is an ugly hack.
window.addForbiddenGroup = addForbiddenGroup;
/**
 * Remove the given group from the forbidden groups
 */
function delForbiddenGroup(group) {
    forbiddenGroups.delete(groupIDString(group));
    saveSettings();
    updateForbiddenGroups();
}
/**
 * Check whether group is forbidden
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
    forbiddenGroups.forEach(function (fg) {
        let li = $('<li>');
        li.text(fg + ' ');
        let unforbidLink = $('<a>', {
            href: '#/',
            text: '[unforbid]',
            click: function () {
                forbiddenGroups.delete(fg);
                saveSettings();
                updateForbiddenGroups();
            },
        });
        li.append(unforbidLink);
        ul.append(li);
    });
    $('a.forbid-link').each(function () {
        let groupID = $(this).data('groupID');
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
function formatCourseId(id) {
    return String(id).padStart(6, '0');
}
/**
 * Return an HTML description for a course
 */
function htmlDescribeCourse(course) {
    let result = $('<span>');
    let ul = $('<ul>');
    ul.append($('<li>', {
        html: `<b>Full name</b> ${formatCourseId(course.id)} ${course.name}`,
    }));
    ul.append($('<li>', { html: `<b>Academic points:</b> ${course.academicPoints}` }));
    ul.append($('<li>', {
        html: `<b>Lecturer in charge:</b> ${rtlSpan(course.lecturerInCharge || '[unknown]')}`,
    }));
    ul.append($('<li>', { html: '<b>Test dates:</b>' }));
    let testDates = $('<ul>');
    if (course.testDates) {
        course.testDates.forEach(function (d) {
            testDates.append($('<li>', { text: formatting_1.formatDate(d) }));
        });
    }
    else {
        testDates.append($('<li>', { text: '[unknown]' }));
    }
    ul.append(testDates);
    ul.append($('<li>', { html: '<b>Groups:</b>' }));
    let groups = $('<ul>');
    if (course.groups) {
        course.groups.forEach(function (g) {
            groups.append(groupHeaderForCatalog(g)[0]);
            let events = $('<ul>');
            if (g.events) {
                g.events.forEach(function (e) {
                    events.append($('<li>', {
                        text: `${dayNames[e.day]}, ` + formatting_1.minutesToTime(e.startMinute) + '-' +
                            formatting_1.minutesToTime(e.endMinute) + ` at ${e.location || '[unknown]'}`,
                    }));
                });
            }
            else {
                events.append($('<li>', { text: '[unknown]' }));
            }
            groups.append(events);
        });
    }
    else {
        groups.append($('<li>', { text: '[unknown]' }));
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
function rtlSpan(s) {
    return `<span dir="rtl">${s}</span>`;
}
/**
 * Create a span for a course label, including info button
 */
function courseLabel(course) {
    // TODO(lutzky): This function is full of DOM misuse, hence the ts-ignore
    // symbols.
    let span = document.createElement('span');
    let infoLink = document.createElement('a');
    infoLink.innerHTML = expandInfoSymbol;
    infoLink.className = 'expando';
    infoLink.href = '#/';
    span.innerHTML = ` ${formatCourseId(course.id)} ${rtlSpan(course.name)} `;
    infoLink.onclick = function () {
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
        }
        else {
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
    currentCatalog.forEach(function (faculty) {
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
        faculty.courses.forEach(function (course) {
            let btn = $('<button>', {
                text: '+',
                click: function () {
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
function getCheckboxValueById(id) {
    return document.getElementById(id).checked;
}
/**
 * Sets whether or not a checkbox with the given ID is checked
 */
function setCheckboxValueById(id, checked) {
    document.getElementById(id).checked = checked;
}
/**
 * Save all settings to localStorage
 */
function saveSettings() {
    settings.selectedCourses = Array.from(selectedCourses).map(c => c.id);
    settings.customEvents = $('#custom-events-textarea').val();
    settings.catalogUrl = $('#catalog-url').val();
    settings.filterSettings = {
        forbiddenGroups: Array.from(forbiddenGroups),
        noCollisions: getCheckboxValueById('filter.noCollisions'),
        ratingMax: getNullRating(),
        ratingMin: getNullRating(),
    };
    Object.keys(allRatings).forEach(function (r) {
        // @ts-ignore: allRatings
        settings.filterSettings.ratingMin[r] = getNumInputValueWithDefault(($(`#rating-${r}-min`)[0]), null);
        // @ts-ignore: allRatings
        settings.filterSettings.ratingMax[r] = getNumInputValueWithDefault(($(`#rating-${r}-max`)[0]), null);
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
function getNumInputValueWithDefault(input, defaultValue) {
    if (input.value == '') {
        return defaultValue;
    }
    return Number(input.value);
}
/**
 * Mark course as selected.
 */
function addSelectedCourse(course) {
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
function addSelectedCourseByID(...ids) {
    ids.forEach(function (id) {
        let course = getCourseByID(id);
        if (course) {
            addSelectedCourse(course);
        }
        else {
            throw new Error('No course with ID ' + id);
        }
    });
}
window.addSelectedCourseByID = addSelectedCourseByID;
/**
 * Mark course as unselected.
 */
function delSelectedCourse(course) {
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
    let ul = $('<ul>', { class: 'list-group' });
    div.append(ul);
    selectedCourses.forEach(function (course) {
        let li = $('<li>', { class: 'list-group-item' });
        let label = courseLabel(course);
        let btn = $('<button>', {
            class: 'btn btn-sm btn-danger float-right',
            html: '<i class="fas fa-trash-alt"></i>',
            click: function () {
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
const SchedulerWorker = __webpack_require__(/*! worker-loader?name=[name].js!./scheduler_worker */ "./node_modules/worker-loader/dist/cjs.js?name=[name].js!./src/scheduler_worker.ts");
let schedulerWorker = new SchedulerWorker();
/**
 * Respond to scheduling result from worker
 */
schedulerWorker.onmessage = function (e) {
    if (mainDebugLogging) {
        console.info('Received message from worker:', e);
    }
    $('#generate-schedules').prop('disabled', false);
    $('#spinner').hide();
    if (e.data == null) {
        $('#exception-occurred-scheduling').show();
    }
    else {
        setPossibleSchedules(e.data);
    }
};
/**
 * Check if custom-events-textarea has valid events
 */
function checkCustomEvents() {
    let elem = $('#custom-events-textarea');
    elem.removeClass('is-invalid');
    elem.removeClass('is-valid');
    try {
        let courses = buildCustomEventsCourses(elem.val());
        if (courses.length > 0) {
            elem.addClass('is-valid');
        }
    }
    catch (e) {
        elem.addClass('is-invalid');
    }
}
window.checkCustomEvents = checkCustomEvents;
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
function createSingleEventCourse(name, day, startMinute, endMinute) {
    let c = {
        academicPoints: 0,
        id: 0,
        lecturerInCharge: '',
        name: name,
        testDates: [],
        groups: [],
    };
    let g = {
        course: c,
        description: '',
        id: 0,
        teachers: [],
        type: 'lecture',
        events: [],
    };
    c.groups.push(g);
    let e = {
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
function buildCustomEventsCourses(s) {
    let result = [];
    if (s == '') {
        return result;
    }
    s.split('\n').forEach(function (line) {
        let m = customEventRegex.exec(line);
        if (m == null) {
            throw Error('Invalid custom event line: ' + line);
        }
        // @ts-ignore: inverseDayIndex
        let day = inverseDayIndex[m[1]];
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
function getSchedules() {
    $('#generate-schedules').prop('disabled', true);
    $('#spinner').show();
    $('#exception-occurred').hide();
    $('#no-schedules').hide();
    $('#initial-instructions').hide();
    let coursesToSchedule = new Set(selectedCourses);
    try {
        let courses = buildCustomEventsCourses(settings.customEvents);
        courses.forEach(c => coursesToSchedule.add(c));
    }
    catch (error) {
        console.error('Failed to build custom events course:', error);
    }
    schedulerWorker.postMessage({
        courses: coursesToSchedule,
        filterSettings: settings.filterSettings,
    });
}
window.getSchedules = getSchedules;
let possibleSchedules = [];
let currentSchedule = 0;
/**
 * Set the collection of possible schedules
 */
function setPossibleSchedules(schedules) {
    possibleSchedules = schedules;
    currentSchedule = 0;
    let divs = $('#schedule-browser, #rendered-schedule-container');
    $('#num-schedules').text(schedules.length);
    if (schedules.length == 0 ||
        (schedules.length == 1 && schedules[0].events.length == 0)) {
        divs.hide();
        $('#no-schedules').show();
    }
    else {
        divs.show();
        goToSchedule(0);
    }
}
/**
 * Increment the current displayed schedule
 */
function nextSchedule() {
    goToSchedule(currentSchedule + 1);
}
window.nextSchedule = nextSchedule;
/**
 * Decrement the current displayed schedule
 */
function prevSchedule() {
    goToSchedule(currentSchedule - 1);
}
window.prevSchedule = prevSchedule;
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
    ['#007bff', '#fff'],
    ['#e83e8c', '#fff'],
    ['#ffc107', '#000'],
    ['#6610f2', '#fff'],
    ['#dc3545', '#fff'],
    ['#28a745', '#fff'],
    ['#6f42c1', '#fff'],
    ['#fd7e14', '#000'],
    ['#20c997', '#fff'],
    ['#17a2b8', '#fff'],
    ['#6c757d', '#fff'],
    ['#343a40', '#fff'],
];
/**
 * Get appropriate colors for courses
 */
function getCourseColorMap(courses) {
    let numbers = Array.from(courses.values()).map(c => c.id).sort();
    // 0 course ID is for custom events
    numbers.push(0);
    let numsAndColors = numbers.map((num, i) => [num, courseColors[i]]);
    return new Map(numsAndColors);
}
/**
 * Display schedule i, modulo the possible range 0-(numSchedules - 1)
 */
function goToSchedule(i) {
    let max = possibleSchedules.length;
    i = (i + max) % max;
    currentSchedule = i;
    $('#current-schedule-id').text(i + 1);
    let schedule = possibleSchedules[i];
    writeScheduleContents($('#schedule-contents'), schedule);
    render_1.renderSchedule($('#rendered-schedule')[0], schedule, getCourseColorMap(selectedCourses));
}
let sortedByRating = '';
let sortedByRatingAsc = true;
// TODO(lutzky): allRatings breaks typescript type checks and forces us to
// use a lot of ts-ignore comments.
const allRatings = {
    earliestStart: {
        name: 'Earliest start',
        explanation: 'Hour at which the earliest class of the week start',
        badgeTextFunc: (s) => `Earliest start: ${s}`,
    },
    latestFinish: {
        name: 'Latest finish',
        explanation: 'Hour at which the latest class of the week finishes',
        badgeTextFunc: (s) => `Latest finish: ${s}`,
    },
    numRuns: {
        name: 'Number of runs',
        explanation: 'Number of adjacent classes in different buildings',
        badgeTextFunc: (s) => `${s} runs`,
    },
    freeDays: {
        name: 'Free days',
        explanation: 'Number of days with no classes',
        badgeTextFunc: (s) => `${s} free days`,
    },
};
/**
 * Sort current schedule by rating
 */
function sortByRating(rating) {
    if (sortedByRating == rating) {
        sortedByRatingAsc = !sortedByRatingAsc;
    }
    sortedByRating = rating;
    possibleSchedules.sort(function (a, b) {
        // @ts-ignore: allRatings
        return (sortedByRatingAsc ? 1 : -1) * (a.rating[rating] - b.rating[rating]);
    });
    goToSchedule(0);
    Object.keys(allRatings).forEach(function (rating) {
        $(`#rating-badge-${rating}`)
            .replaceWith(getRatingBadge(rating, possibleSchedules[0]));
    });
}
/**
 * Get a badge for the given rating according to the schedule type
 */
function getRatingBadge(rating, schedule) {
    let result = $('<a>', {
        class: 'badge badge-info',
        id: `rating-badge-${rating}`,
        // @ts-ignore: allRatings
        text: allRatings[rating].badgeTextFunc(schedule.rating[rating]),
        // @ts-ignore: allRatings
        title: allRatings[rating].explanation,
        href: '#/',
        click: function () {
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
function writeScheduleContents(target, schedule) {
    target.empty();
    Object.keys(allRatings)
        .map(rating => getRatingBadge(rating, schedule))
        .forEach(function (badge) {
        target.append(badge).append(' ');
    });
    let ul = $('<ul>', { class: 'list-group' });
    target.append(ul);
    byDay(schedule).forEach(function (dayEvents) {
        let dayEntry = $('<li>', {
            class: 'list-group-item',
            css: { 'padding-top': '2px', 'padding-bottom': '2px' },
            html: $('<small>', {
                class: 'font-weight-bold',
                text: dayNames[dayEvents[0].day],
            }),
        });
        ul.append(dayEntry);
        // let eventList = $('<ul>');
        //    dayEntry.append(eventList);
        dayEvents.forEach(function (e) {
            let eventEntry = $('<li>', {
                class: 'list-group-item',
            });
            let startTime = formatting_1.minutesToTime(e.startMinute);
            let location = e.location || '[unknown]';
            let endTime = formatting_1.minutesToTime(e.endMinute);
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
        <div dir="rtl">${formatting_1.displayName(e.group)}</div>
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
function byDay(schedule) {
    let events = schedule.events.slice();
    let result = [[]];
    common_1.sortEvents(events);
    let currentDay = events[0].day;
    events.forEach(function (e) {
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
function getCourseByID(id) {
    return currentCatalogByCourseID.get(id);
}
/**
 * Gets nicknames or abbreviations for a course
 */
function getNicknames(course) {
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
    let opts = [];
    let optgroups = [];
    currentCatalog.forEach(function (faculty) {
        optgroups.push({ label: faculty.name, value: faculty.name });
        faculty.courses.forEach(function (course) {
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
        onItemAdd: function (courseID) {
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
function getNullRating() {
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
function loadSettings(s) {
    let result = {
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
        result = $.extend(true /* deep */, result, JSON.parse(s));
    }
    if (mainDebugLogging) {
        console.info('Loaded settings:', result);
    }
    $('#catalog-url').val(result.catalogUrl);
    $('#custom-events-textarea').val(result.customEvents);
    {
        let fs = result.filterSettings;
        setCheckboxValueById('filter.noCollisions', fs.noCollisions);
        Object.keys(allRatings).forEach(function (r) {
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
function totalPossibleSchedules(courses) {
    let k = Array.from(courses.values());
    return k
        .map(course => common_1.groupsByType(course)
        .map(t => t.length)
        .reduce((a, b) => a * b, 1))
        .reduce((a, b) => a * b, 1);
}
/**
 * Build the limit-by-ratings form for the settings subpage
 */
function buildRatingsLimitForm() {
    let form = $('#rating-limits-form');
    Object.keys(allRatings).forEach(function (r) {
        let row = $('<div>', { class: 'row' });
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
common_1.loadCatalog(settings.catalogUrl)
    .then(function (catalog) {
    if (mainDebugLogging) {
        console.log('Loaded catalog:', catalog);
    }
    currentCatalog = catalog;
    currentCatalogByCourseID = new Map();
    currentCatalog.forEach(function (faculty) {
        faculty.courses.forEach(function (course) {
            currentCatalogByCourseID.set(course.id, course);
        });
    });
    writeCatalogSelector();
    settings.selectedCourses.forEach(function (id) {
        try {
            addSelectedCourseByID(id);
        }
        catch (error) {
            console.error(`Failed to add course ${id}:`, error);
        }
    });
    coursesSelectizeSetup();
}, function (error) {
    $('#exception-occurred-catalog').show();
    console.error('Failed to load catalog:', error);
});


/***/ }),

/***/ "./src/render.ts":
/*!***********************!*\
  !*** ./src/render.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const formatting_1 = __webpack_require__(/*! ./formatting */ "./src/formatting.ts");
/**
 * Layered events for rendering on screen
 *
 * Explanation: Suppose you have events A, B, C, that collide like so (time
 * being horizontal):
 *
 *    [AAAAAAA]
 * [BBBBBB]
 *         [CCCCCC]
 *
 * Because the collisions are A-B and A-C (but never B-C), they can be laid
 * out, for example, like so:
 *
 * [BBBBBB][CCCCCC]
 *    [AAAAAAA]
 *
 * In this case, the numLayers for all events is 2, B and C are on layer 0, and
 * A is on layer 1. If C were to start a bit earlier, though, three layers would
 * be needed:
 *
 * [BBBBBB]
 *      [CCCCCC]
 *    [AAAAAAA]
 *
 * In this case the numLayers for all events is 3, and B, C, and A are on layers
 * 0, 1, and 2 respectively.
 */
class LayeredEvent {
}
/**
 * Sort events into buckets of colliding events.
 *
 * Shamelessly lifted from boazg at
 * https://github.com/lutzky/ttime/blob/master/lib/ttime/tcal/tcal.rb
 *
 * TODO(lutzky): This is exported for testing purposes only.
 */
function layoutLayeredEvents(events) {
    let result = [];
    let remaining = events.slice();
    while (remaining.length > 0) {
        let selected = new Set([remaining[0]]);
        let selectedMoreEvents = true;
        while (selectedMoreEvents) {
            selectedMoreEvents = false;
            let oldSelected = selected;
            selected = new Set();
            oldSelected.forEach(function (s) {
                selected.add(s);
                remaining.forEach(function (r) {
                    if (common_1.eventsCollide([r, s])) {
                        selected.add(r);
                        selectedMoreEvents = true;
                    }
                });
            });
            remaining = remaining.filter(x => !selected.has(x));
        }
        let layers = [];
        selected.forEach(function (s) {
            let assignedToLayer = false;
            layers.some(function (layer, _) {
                if (!common_1.eventsCollide(layer.concat([s]))) {
                    assignedToLayer = true;
                    layer.push(s);
                    return true;
                }
                return false;
            });
            if (!assignedToLayer) {
                // No layer has been assigned yet, so all layers must collide with
                // s. Create a new one.
                layers.push([s]);
            }
        });
        layers.forEach(function (l, i) {
            l.forEach(function (s) {
                result.push({
                    event: s,
                    layer: i,
                    numLayers: layers.length,
                });
            });
        });
    }
    return result;
}
exports.layoutLayeredEvents = layoutLayeredEvents;
/**
 * Get the start time of the earliest event in the schedule
 */
function getEarliest(schedule) {
    return Math.min(...schedule.events.map(x => x.startMinute));
}
/**
 * Get the end time of the latest event in the schedule
 */
function getLatest(schedule) {
    return Math.max(...schedule.events.map(x => x.endMinute));
}
/**
 * Render a schedule to target
 */
function renderSchedule(target, schedule, courseColors) {
    target.innerHTML = '';
    let earliest = getEarliest(schedule);
    let latest = getLatest(schedule);
    let scale = 100.0 / (latest - earliest);
    let layeredEvents = layoutLayeredEvents(schedule.events);
    layeredEvents.forEach(function (le) {
        let eventDiv = document.createElement('div');
        let event = le.event;
        eventDiv.className = 'event';
        let colors = courseColors.get(event.group.course.id);
        eventDiv.style.backgroundColor = colors[0];
        eventDiv.style.color = colors[1];
        positionElement(eventDiv, '%', 
        /* left   */ (100 / 6.0) * (1 + event.day + le.layer / le.numLayers), 
        /* top    */ scale * (event.startMinute - earliest), 
        /* width  */ 100 / 6.0 / le.numLayers, 
        /* height */ scale * (event.endMinute - event.startMinute));
        annotateEvent(eventDiv, event);
        target.appendChild(eventDiv);
    });
    addGridLines(target, schedule);
}
exports.renderSchedule = renderSchedule;
/**
 * Annotate the div with the actualy contents of the event
 */
function annotateEvent(target, event) {
    target.innerHTML = '';
    let courseName = document.createElement('span');
    courseName.className = 'course-name';
    courseName.innerText = formatting_1.displayName(event.group);
    target.appendChild(courseName);
    let eventType = document.createElement('span');
    eventType.className = 'event-type';
    eventType.innerText = event.group.type;
    target.appendChild(eventType);
    let location = document.createElement('div');
    location.className = 'location';
    location.innerText = event.location;
    target.appendChild(location);
    let forbidDiv = document.createElement('div');
    forbidDiv.className = 'forbid';
    let forbidLink = document.createElement('a');
    forbidLink.innerHTML = '<i class="fas fa-ban"></i>';
    forbidLink.href = '#/';
    forbidLink.title = 'Forbid this group';
    forbidLink.onclick = function () {
        $(forbidLink).fadeOut(100).fadeIn(100);
        window.addForbiddenGroup(event.group);
    };
    forbidDiv.appendChild(forbidLink);
    target.appendChild(forbidDiv);
}
const gridDensity = 30;
/**
 * Render grid lines on target
 */
function addGridLines(target, schedule) {
    let earliest = getEarliest(schedule);
    let latest = getLatest(schedule);
    let scale = 100.0 / (latest - earliest);
    let firstGridLine = Math.ceil(earliest / gridDensity) * gridDensity;
    let lastGridLine = Math.floor(latest / gridDensity) * gridDensity;
    for (let t = firstGridLine; t <= lastGridLine; t += gridDensity) {
        let gridDiv = document.createElement('div');
        gridDiv.className = 'grid-line';
        gridDiv.innerText = formatting_1.minutesToTime(t);
        positionElement(gridDiv, '%', 
        /* left    */ 0, 
        /* top     */ scale * (t - earliest), 
        /* width   */ 100, 
        /* height  */ scale * gridDensity);
        target.appendChild(gridDiv);
    }
}
/**
 * Position element using the given units
 */
function positionElement(element, units, left, top, width, height) {
    element.style.left = `${left}${units}`;
    element.style.top = `${top}${units}`;
    element.style.width = `${width}${units}`;
    element.style.height = `${height}${units}`;
}


/***/ }),

/***/ "./testdata.json":
/*!***********************!*\
  !*** ./testdata.json ***!
  \***********************/
/*! exports provided: 0, default */
/***/ (function(module) {

module.exports = [{"name":"פקולטה שקרית","courses":[{"id":104166,"name":"אלגברה א'","academicPoints":5.5,"lecturerInCharge":"","weeklyHours":{"lecture":4,"tutorial":3},"testDates":[{"year":2018,"month":2,"day":9},{"year":2018,"month":3,"day":8}],"groups":[{"id":10,"teachers":[],"events":[{"day":0,"location":"","startMinute":750,"endMinute":870}],"type":"lecture"},{"id":11,"teachers":[],"events":[{"day":1,"location":"","startMinute":630,"endMinute":750}],"type":"tutorial"},{"id":12,"teachers":[],"events":[{"day":1,"location":"","startMinute":870,"endMinute":990}],"type":"tutorial"},{"id":13,"teachers":[],"events":[{"day":1,"location":"","startMinute":570,"endMinute":630}],"type":"tutorial"},{"id":14,"teachers":[],"events":[{"day":1,"location":"","startMinute":870,"endMinute":930}],"type":"tutorial"},{"id":20,"teachers":[],"events":[{"day":0,"location":"","startMinute":750,"endMinute":870}],"type":"lecture"},{"id":21,"teachers":[],"events":[{"day":1,"location":"","startMinute":630,"endMinute":750}],"type":"tutorial"},{"id":22,"teachers":[],"events":[{"day":1,"location":"","startMinute":870,"endMinute":990}],"type":"tutorial"},{"id":23,"teachers":[],"events":[{"day":1,"location":"","startMinute":870,"endMinute":930}],"type":"tutorial"},{"id":30,"teachers":["פרופ/מ ר.בנד"],"events":[{"day":0,"location":"","startMinute":750,"endMinute":870}],"type":"lecture"},{"id":31,"teachers":[],"events":[{"day":1,"location":"","startMinute":930,"endMinute":990}],"type":"tutorial"},{"id":32,"teachers":[],"events":[{"day":1,"location":"","startMinute":510,"endMinute":630}],"type":"tutorial"},{"id":33,"teachers":[],"events":[{"day":2,"location":"","startMinute":630,"endMinute":690}],"type":"tutorial"},{"id":34,"teachers":[],"events":[{"day":2,"location":"","startMinute":630,"endMinute":690}],"type":"tutorial"}]},{"id":14003,"name":"סטטיסטיקה","academicPoints":3,"lecturerInCharge":"ב.פישביין","weeklyHours":{"lecture":2,"tutorial":2},"testDates":[{"year":2016,"month":1,"day":28},{"year":2016,"month":2,"day":26}],"groups":[{"id":10,"teachers":["פרופ/מ ב.פישביין"],"events":[{"day":2,"location":"רבין 206","startMinute":870,"endMinute":990}],"type":"lecture"}]},{"id":123,"name":"קורס ללא קבוצות","academicPoints":3,"lecturerInCharge":"","weeklyHours":{"lecture":2,"tutorial":1},"testDates":[{"year":2016,"month":2,"day":11},{"year":2016,"month":3,"day":8}],"groups":null},{"id":234322,"name":"מערכות אחסון מידע","academicPoints":3,"lecturerInCharge":"","weeklyHours":{"lecture":2,"tutorial":1},"testDates":[{"year":2016,"month":2,"day":11},{"year":2016,"month":3,"day":8}],"groups":[{"id":10,"teachers":["ד\"ר ג.ידגר"],"events":[{"day":2,"location":"טאוב 9","startMinute":630,"endMinute":750}],"type":"lecture"},{"id":11,"teachers":[],"events":[{"day":2,"location":"טאוב 5","startMinute":1050,"endMinute":1110}],"type":"tutorial"},{"id":12,"teachers":[],"events":[{"day":3,"location":"טאוב 6","startMinute":930,"endMinute":990}],"type":"tutorial"}]}]}];

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90dGltZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vdHRpbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHRpbWUvLi9zcmMvc2NoZWR1bGVyX3dvcmtlci50cyIsIndlYnBhY2s6Ly90dGltZS8uL3NyYy9jaGVlc2Vmb3JrLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL2NvbW1vbi50cyIsIndlYnBhY2s6Ly90dGltZS8uL3NyYy9mb3JtYXR0aW5nLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vdHRpbWUvLi9zcmMvcmVuZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7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SCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FDcEIsT0FBb0IsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEdBQVcsRUFDOUQsS0FBYSxFQUFFLE1BQWM7SUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDdkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDN0MsQ0FBQyIsImZpbGUiOiJ0dGltZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInR0aW1lXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInR0aW1lXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0L1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInNjaGVkdWxlcl93b3JrZXIuanNcIik7XG59OyIsImltcG9ydCB7QWNhZGVtaWNFdmVudCwgQ2F0YWxvZywgQ291cnNlLCBEYXRlT2JqLCBGYWN1bHR5LCBHcm91cH0gZnJvbSAnLi9jb21tb24nO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGltcGxlbWVudHMgc3VwcG9ydCBmb3IgaW1wb3J0aW5nIGRhdGEgZnJvbSBjaGVlc2VGb3JrXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNoYWVsLW1hbHRzZXYvY2hlZXNlLWZvcmtcbiAqL1xuXG4vKipcbiAqIFBhcnNlIGEgY2hlZXNlZm9yay1mb3JtYXQgaG91clxuICpcbiAqIEBwYXJhbSBzIC0gXCJISDpNIC0gSEg6TVwiLCB3aGVyZSBNIGlzIHRlbnMgb2YgbWludXRlc1xuICpcbiAqIEByZXR1cm5zIE1pbnV0ZXMgc2luY2UgbWlkbmlnaHRcbiAqL1xuZnVuY3Rpb24gcGFyc2VDaGVlc2VGb3JrSG91cihzOiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIHJldHVybiBzLnNwbGl0KCcgLSAnKS5tYXAoZnVuY3Rpb24oaGhtKSB7XG4gICAgbGV0IHNwbGl0SG91ciA9IGhobS5zcGxpdCgnOicpO1xuICAgIGxldCBtaW51dGUgPSBOdW1iZXIoc3BsaXRIb3VyWzBdKSAqIDYwO1xuICAgIGlmIChzcGxpdEhvdXIubGVuZ3RoID4gMSkge1xuICAgICAgbWludXRlICs9IE51bWJlcihzcGxpdEhvdXJbMV0pICogMTA7XG4gICAgfVxuICAgIHJldHVybiBtaW51dGU7XG4gIH0pO1xufVxuXG5jb25zdCBkYXRlUmVnZXggPSAvKFswLTldezEsMn0pXFwuKFswLTldezEsMn0pXFwuKFswLTldezR9KS87XG5cbi8qKlxuICogUGFyc2UgYSBjaGVlc2Vmb3JrLWZvcm1hdCB0ZXN0IGRhdGVcbiAqXG4gKiBAcGFyYW0gcyAtIFwiQmxhIGJsYSBibGEgREQuTU0uWVlZWSBCbGEgYmxhIGJsYVwiXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQ2hlZXNlRm9ya1Rlc3REYXRlKHM6IHN0cmluZyk6IERhdGVPYmoge1xuICBpZiAoIXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCByID0gZGF0ZVJlZ2V4LmV4ZWMocyk7XG4gIGlmIChyID09IG51bGwpIHtcbiAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBtYXRjaCBkYXRlIHJlZ2V4IHdpdGg6ICcsIHMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7ZGF5OiBOdW1iZXIoclsxXSksIG1vbnRoOiBOdW1iZXIoclsyXSksIHllYXI6IE51bWJlcihyWzNdKX07XG59XG5cbi8qKlxuICogUGFyc2UgY2hlZXNlZm9yayBkYXRhXG4gKlxuICogQHBhcmFtIGpzRGF0YSAtIENoZWVzZWZvcmsgY291cnNlc18qLmpzIGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ2hlZXNlRm9yayhqc0RhdGE6IHN0cmluZyk6IENhdGFsb2cge1xuICBjb25zdCBjaGVlc2VGb3JrUHJlZml4ID0gJ3ZhciBjb3Vyc2VzX2Zyb21fcmlzaHVtID0gJztcblxuICBjb25zdCBoZWJyZXcgPSB7XG4gICAgYWNhZGVtaWNQb2ludHM6ICfXoNen15XXk9eV16onLFxuICAgIGJ1aWxkaW5nOiAn15HXoNeZ15nXnycsXG4gICAgY291cnNlSWQ6ICfXnteh16TXqCDXnten16bXldeiJyxcbiAgICBjb3Vyc2VOYW1lOiAn16nXnSDXnten16bXldeiJyxcbiAgICBkYXk6ICfXmdeV150nLFxuICAgIGRheUxldHRlcnM6ICfXkNeR15LXk9eU15XXqScsXG4gICAgZmFjdWx0eTogJ9ek16fXldec15jXlCcsXG4gICAgZ3JvdXA6ICfXp9eR15XXpteUJyxcbiAgICBob3VyOiAn16nXoteUJyxcbiAgICBsZWN0dXJlcl90dXRvcjogJ9ee16jXpteUL9ee16rXqNeS15wnLFxuICAgIG1vZWRfYTogJ9ee15XXoteTINeQJyxcbiAgICBtb2VkX2I6ICfXnteV16LXkyDXkScsXG4gICAgbnVtOiAn157XoS4nLFxuICAgIHJvb206ICfXl9eT16gnLFxuICAgIHNwb3J0OiAn16HXpNeV16jXmCcsXG4gICAgdGhvc2VJbkNoYXJnZTogJ9eQ15fXqNeQ15nXnScsXG4gICAgdHlwZTogJ9eh15XXkicsXG4gIH07XG5cbiAgY29uc3QgdHlwZU1hcCA9IG5ldyBNYXAoW1sn15TXqNem15DXlCcsICdsZWN0dXJlJ10sIFsn16rXqNeS15XXnCcsICd0dXRvcmlhbCddXSk7XG5cbiAgbGV0IGZhY3VsdGllc0J5TmFtZTogTWFwPHN0cmluZywgRmFjdWx0eT4gPSBuZXcgTWFwKCk7XG5cbiAgaWYgKCFqc0RhdGEuc3RhcnRzV2l0aChjaGVlc2VGb3JrUHJlZml4KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IHZhbGlkIGNoZWVzZWZvcmsganNEYXRhIC0gbGFja3MgZXhwZWN0ZWQgcHJlZml4Jyk7XG4gIH1cblxuICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoanNEYXRhLnN1YnN0cmluZyhjaGVlc2VGb3JrUHJlZml4Lmxlbmd0aCkpO1xuXG4gIGNvbnNvbGUuaW5mbygnRXhwZXJpbWVudGFsIENoZWVzZUZvcmsgcGFyc2VyLiBGaXJzdCBjb3Vyc2U6ICcsIGRhdGFbMF0pO1xuXG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhQ291cnNlOiBhbnkpIHtcbiAgICBsZXQgZmFjdWx0eU5hbWUgPSBkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3LmZhY3VsdHldO1xuXG4gICAgaWYgKCFmYWN1bHRpZXNCeU5hbWUuaGFzKGZhY3VsdHlOYW1lKSkge1xuICAgICAgZmFjdWx0aWVzQnlOYW1lLnNldChmYWN1bHR5TmFtZSwge1xuICAgICAgICBuYW1lOiBmYWN1bHR5TmFtZSxcbiAgICAgICAgc2VtZXN0ZXI6ICdjaGVlc2Vmb3JrLXVua25vd24tc2VtZXN0ZXInLFxuICAgICAgICBjb3Vyc2VzOiBbXSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCBmYWN1bHR5ID0gZmFjdWx0aWVzQnlOYW1lLmdldChmYWN1bHR5TmFtZSk7XG5cbiAgICBsZXQgY291cnNlOiBDb3Vyc2UgPSB7XG4gICAgICBhY2FkZW1pY1BvaW50czogTnVtYmVyKGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcuYWNhZGVtaWNQb2ludHNdKSxcbiAgICAgIGZhY3VsdHk6IGZhY3VsdHksXG4gICAgICBuYW1lOiBkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3LmNvdXJzZU5hbWVdLFxuICAgICAgaWQ6IE51bWJlcihkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3LmNvdXJzZUlkXSksXG4gICAgICBsZWN0dXJlckluQ2hhcmdlOiBkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3LnRob3NlSW5DaGFyZ2VdLFxuICAgICAgdGVzdERhdGVzOiBbXG4gICAgICAgIGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcubW9lZF9hXSxcbiAgICAgICAgZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5tb2VkX2JdLFxuICAgICAgXS5tYXAocGFyc2VDaGVlc2VGb3JrVGVzdERhdGUpXG4gICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geCAhPSBudWxsKSxcbiAgICAgIGdyb3VwczogW10sXG4gICAgfTtcblxuICAgIGxldCBncm91cEZpcnN0QXBwZWFyZWRJbk1ldGFncm91cDogTWFwPG51bWJlciwgbnVtYmVyPiA9IG5ldyBNYXAoKTtcblxuICAgIGxldCBncm91cHNCeUlkOiBNYXA8bnVtYmVyLCBHcm91cD4gPSBuZXcgTWFwKCk7XG5cbiAgICBkYXRhQ291cnNlWydzY2hlZHVsZSddLmZvckVhY2goZnVuY3Rpb24oZGF0YVNjaGVkdWxlOiBhbnkpIHtcbiAgICAgIC8qXG4gICAgICAgKiBJbiBDaGVlc2VGb3JrIGRhdGEsIGdyb3VwcyBhcmUgcmVwZWF0ZWQgYWNjb3JkaW5nIHRvXG4gICAgICAgKiBcImdyb3Vwcy15b3Utc2hvdWxkLXNpZ24tdXAtdG9cIi4gVGhpcyBpcyBkZW5vdGVkIGFzIFwiZ3JvdXBcIiBpbiB0aGUgZGF0YSxcbiAgICAgICAqIHdoZXJlYXMgd2hhdCB3ZSB3b3VsZCBjb25zaWRlciB0aGUgYWN0dWFsIGdyb3VwIG51bWJlciBpcyBkZW5vdGVkIGFzXG4gICAgICAgKiBcIm51bWJlclwiLiBTbywgZm9yIGV4YW1wbGUsIFwiZ3JvdXBcIiAxMSBtaWdodCBzYXkgeW91IHNob3VsZCByZWdpc3RlciBmb3JcbiAgICAgICAqIGxlY3R1cmUgMTAgYW5kIHR1dG9yaWFsIDExLCBhbmQgXCJncm91cFwiIDEyIHdvdWxkIHNheSB5b3Ugc2hvdWxkXG4gICAgICAgKiByZWdpc3RlciBmb3IgbGVjdHVyZSAxMCBhbmQgdHV0b3JpYWwgMTIuIExlY3R1cmUgMTAgd291bGQgYmUgcmVwZWF0ZWRcbiAgICAgICAqIGluIHRoZSBkYXRhIC0gb25jZSBmb3IgZWFjaCBcImdyb3VwXCIuIFNvIHdlIGNhbGwgdGhlc2UgXCJncm91cHNcIlxuICAgICAgICogbWV0YUdyb3VwcyBoZXJlLCBhbmQgaWdub3JlIHN1YnNlcXVlbnQgaW5zdGFuY2VzIG9mIGFueSBcInJlYWwgZ3JvdXBcIiAtXG4gICAgICAgKiB0aGF0IGlzLCBhbnkgZ3JvdXAgd2l0aCBhIG51bWJlciB3ZSd2ZSBzZWVuIGJlZm9yZSwgYnV0IGEgbWV0YWdyb3VwIHdlXG4gICAgICAgKiBoYXZlbid0IHNlZW4uXG4gICAgICAgKi9cbiAgICAgIGxldCBtZXRhR3JvdXBJZCA9IGRhdGFTY2hlZHVsZVtoZWJyZXcuZ3JvdXBdO1xuICAgICAgbGV0IGdyb3VwSWQgPSBkYXRhU2NoZWR1bGVbaGVicmV3Lm51bV07XG5cbiAgICAgIGlmICghZ3JvdXBGaXJzdEFwcGVhcmVkSW5NZXRhZ3JvdXAuaGFzKGdyb3VwSWQpKSB7XG4gICAgICAgIGdyb3VwRmlyc3RBcHBlYXJlZEluTWV0YWdyb3VwLnNldChncm91cElkLCBtZXRhR3JvdXBJZCk7XG4gICAgICB9XG4gICAgICBpZiAoZ3JvdXBGaXJzdEFwcGVhcmVkSW5NZXRhZ3JvdXAuZ2V0KGdyb3VwSWQpICE9IG1ldGFHcm91cElkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFncm91cHNCeUlkLmhhcyhncm91cElkKSkge1xuICAgICAgICBsZXQgdHlwZSA9ICcnO1xuICAgICAgICBsZXQgZGVzYyA9ICcnO1xuICAgICAgICBpZiAoZmFjdWx0eU5hbWUgPT0gaGVicmV3LnNwb3J0KSB7XG4gICAgICAgICAgdHlwZSA9ICdzcG9ydCc7XG4gICAgICAgICAgZGVzYyA9IGRhdGFTY2hlZHVsZVtoZWJyZXcudHlwZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHlwZSA9IHR5cGVNYXAuZ2V0KGRhdGFTY2hlZHVsZVtoZWJyZXcudHlwZV0pIHx8XG4gICAgICAgICAgICAgIGRhdGFTY2hlZHVsZVtoZWJyZXcudHlwZV07XG4gICAgICAgIH1cblxuICAgICAgICBncm91cHNCeUlkLnNldChncm91cElkLCB7XG4gICAgICAgICAgaWQ6IGdyb3VwSWQsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGRlc2MsXG4gICAgICAgICAgY291cnNlOiBjb3Vyc2UsXG4gICAgICAgICAgdGVhY2hlcnM6IFtdLFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBncm91cCA9IGdyb3Vwc0J5SWQuZ2V0KGdyb3VwSWQpO1xuXG4gICAgICBsZXQgdGltZXMgPSBwYXJzZUNoZWVzZUZvcmtIb3VyKGRhdGFTY2hlZHVsZVtoZWJyZXcuaG91cl0pO1xuXG4gICAgICBsZXQgZXZlbnQ6IEFjYWRlbWljRXZlbnQgPSB7XG4gICAgICAgIGdyb3VwOiBncm91cCxcbiAgICAgICAgZGF5OiBoZWJyZXcuZGF5TGV0dGVycy5pbmRleE9mKGRhdGFTY2hlZHVsZVtoZWJyZXcuZGF5XSksXG4gICAgICAgIHN0YXJ0TWludXRlOiB0aW1lc1swXSxcbiAgICAgICAgZW5kTWludXRlOiB0aW1lc1sxXSxcbiAgICAgICAgbG9jYXRpb246XG4gICAgICAgICAgICBkYXRhU2NoZWR1bGVbaGVicmV3LmJ1aWxkaW5nXSArICcgJyArIGRhdGFTY2hlZHVsZVtoZWJyZXcucm9vbV0sXG4gICAgICB9O1xuXG4gICAgICB7XG4gICAgICAgIGxldCB0ID0gZGF0YVNjaGVkdWxlW2hlYnJldy5sZWN0dXJlcl90dXRvcl07XG4gICAgICAgIGlmICh0ICYmICFncm91cC50ZWFjaGVycy5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgIGdyb3VwLnRlYWNoZXJzLnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ3JvdXAuZXZlbnRzLnB1c2goZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgZ3JvdXBzQnlJZC5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwLCBfKSB7XG4gICAgICBjb3Vyc2UuZ3JvdXBzLnB1c2goZ3JvdXApO1xuICAgIH0pO1xuXG4gICAgZmFjdWx0eS5jb3Vyc2VzLnB1c2goY291cnNlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIEFycmF5LmZyb20oZmFjdWx0aWVzQnlOYW1lLnZhbHVlcygpKTtcbn1cbiIsImltcG9ydCB7cGFyc2VDaGVlc2VGb3JrfSBmcm9tICcuL2NoZWVzZWZvcmsnO1xuXG5leHBvcnQgY2xhc3MgRmFjdWx0eSB7XG4gIG5hbWU6IHN0cmluZztcbiAgc2VtZXN0ZXI6IHN0cmluZztcbiAgY291cnNlczogQ291cnNlW107XG59XG5cbmV4cG9ydCB0eXBlIENhdGFsb2cgPSBGYWN1bHR5W107XG5cbmV4cG9ydCBjbGFzcyBHcm91cCB7XG4gIGNvdXJzZTogQ291cnNlO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBldmVudHM6IEFjYWRlbWljRXZlbnRbXTtcbiAgaWQ6IG51bWJlcjtcbiAgdHlwZTogc3RyaW5nO1xuICB0ZWFjaGVyczogQXJyYXk8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIENvdXJzZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgYWNhZGVtaWNQb2ludHM6IG51bWJlcjtcbiAgaWQ6IG51bWJlcjtcbiAgZ3JvdXBzOiBBcnJheTxHcm91cD47XG4gIGxlY3R1cmVySW5DaGFyZ2U6IHN0cmluZztcbiAgdGVzdERhdGVzOiBEYXRlT2JqW107XG4gIGZhY3VsdHk/OiBGYWN1bHR5O1xufVxuXG5leHBvcnQgY2xhc3MgQWNhZGVtaWNFdmVudCB7XG4gIGRheTogbnVtYmVyO1xuICBncm91cDogR3JvdXA7XG4gIHN0YXJ0TWludXRlOiBudW1iZXI7XG4gIGVuZE1pbnV0ZTogbnVtYmVyO1xuICBsb2NhdGlvbjogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU2NoZWR1bGUge1xuICBldmVudHM6IEFjYWRlbWljRXZlbnRbXTtcbiAgcmF0aW5nOiBTY2hlZHVsZVJhdGluZztcbn1cblxuLyoqXG4gKiBlYXJsaWVzdFN0YXJ0IGFuZCBsYXRlc3RGaW5pc2ggYXJlIGluIGhvdXJzIChlLmcuIDE6MzBQTSBpcyAxMy41KS5cbiAqXG4gKiBudW1SdW5zIGlzIHRoZSBhbW91bnQgb2Ygb2NjdXJlbmNlcyB3aGVyZSB0d28gYWRqYWNlbnQgZXZlbnRzIChlbmRNaW51dGVcbiAqIG9mIHRoZSBmaXJzdCBvbmUgZXF1YWxzIHN0YXJ0TWludXRlIG9mIHRoZSBzZWNvbmQsIHNhbWUgZGF5KSBhcmUgaW4gdGhlXG4gKiBzYW1lIHJvb20uXG4gKlxuICogZnJlZURheXMgaXMgdGhlIG51bWJlciBvZiBkYXlzIGluIFN1bi1UaHUgd2l0aCBubyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTY2hlZHVsZVJhdGluZyB7XG4gIGVhcmxpZXN0U3RhcnQ6IG51bWJlcjtcbiAgbGF0ZXN0RmluaXNoOiBudW1iZXI7XG4gIG51bVJ1bnM6IG51bWJlcjtcbiAgZnJlZURheXM6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJTZXR0aW5ncyB7XG4gIG5vQ29sbGlzaW9uczogYm9vbGVhbjtcbiAgZm9yYmlkZGVuR3JvdXBzOiBzdHJpbmdbXTtcbiAgcmF0aW5nTWluOiBTY2hlZHVsZVJhdGluZztcbiAgcmF0aW5nTWF4OiBTY2hlZHVsZVJhdGluZztcbn1cblxuZXhwb3J0IGNsYXNzIERhdGVPYmoge1xuICB5ZWFyOiBudW1iZXI7XG4gIG1vbnRoOiBudW1iZXI7XG4gIGRheTogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNvcnRzIGV2ZW50cyBieSBzdGFydCB0aW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0RXZlbnRzKGV2ZW50czogQWNhZGVtaWNFdmVudFtdKSB7XG4gIGV2ZW50cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAoYS5kYXkgIT0gYi5kYXkpIHtcbiAgICAgIHJldHVybiBhLmRheSAtIGIuZGF5O1xuICAgIH1cbiAgICByZXR1cm4gYS5zdGFydE1pbnV0ZSAtIGIuc3RhcnRNaW51dGU7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgZmFsc2UgaWZmIHR3byBlbnRyaWVzIGluIGV2ZW50cyBvdmVybGFwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBldmVudHNDb2xsaWRlKGV2ZW50czogQWNhZGVtaWNFdmVudFtdKTogYm9vbGVhbiB7XG4gIGxldCBlID0gZXZlbnRzLnNsaWNlKCk7XG4gIHNvcnRFdmVudHMoZSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBlLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGlmIChlW2ldLmRheSA9PSBlW2kgKyAxXS5kYXkpIHtcbiAgICAgIGlmIChlW2kgKyAxXS5zdGFydE1pbnV0ZSA8IGVbaV0uZW5kTWludXRlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBMb2FkIHRoZSBjYXRhbG9nIG9iamVjdCBmcm9tIHVybC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRDYXRhbG9nKHVybDogc3RyaW5nKTogUHJvbWlzZTxDYXRhbG9nPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgIGxldCByZXN1bHQ6IENhdGFsb2cgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXEucmVzcG9uc2VbMF0gPT0gJ1snKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZSBhcyBzdHJpbmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBwYXJzZUNoZWVzZUZvcmsocmVxLnJlc3BvbnNlIGFzIHN0cmluZyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpeFJhd0NhdGFsb2cocmVzdWx0KTtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChFcnJvcignTmV0d29yayBFcnJvcicpKTtcbiAgICB9O1xuXG4gICAgcmVxLnNlbmQoKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIGJhY2stbGlua3MgdG8gY2F0YWxvZyBvYmplY3RzIChjb3Vyc2UgLT4gZmFjdWx0eSwgZ3JvdXAgLT4gY291cnNlLCBldGMuKVxuICovXG5mdW5jdGlvbiBmaXhSYXdDYXRhbG9nKGNhdGFsb2c6IENhdGFsb2cpIHtcbiAgY2F0YWxvZy5mb3JFYWNoKGZ1bmN0aW9uKGZhY3VsdHkpIHtcbiAgICBmYWN1bHR5LmNvdXJzZXMuZm9yRWFjaChmdW5jdGlvbihjb3Vyc2UpIHtcbiAgICAgIGNvdXJzZS5mYWN1bHR5ID0gZmFjdWx0eTtcbiAgICAgIGlmIChjb3Vyc2UuZ3JvdXBzKSB7XG4gICAgICAgIGNvdXJzZS5ncm91cHMuZm9yRWFjaChmdW5jdGlvbihncm91cCkge1xuICAgICAgICAgIGdyb3VwLmNvdXJzZSA9IGNvdXJzZTtcbiAgICAgICAgICBpZiAoZ3JvdXAuZXZlbnRzKSB7XG4gICAgICAgICAgICBncm91cC5ldmVudHMuZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICBldmVudC5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmltcG9ydCAqIGFzIHRlc3REYXRhIGZyb20gJy4uL3Rlc3RkYXRhLmpzb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9hZFRlc3RDYXRhbG9nKCk6IFByb21pc2U8Q2F0YWxvZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgX3JlamVjdCkge1xuICAgIGxldCByZXN1bHQ6IENhdGFsb2cgPSB0ZXN0RGF0YSBhcyBhbnkgYXMgQ2F0YWxvZztcbiAgICBmaXhSYXdDYXRhbG9nKHJlc3VsdCk7XG4gICAgcmVzb2x2ZShyZXN1bHQpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gY291cnNlJ3MgZ3JvdXBzIGFzIGFuIGFycmF5IG9mIGFycmF5cywgc3BsaXQgYnkgdHlwZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBzQnlUeXBlKGNvdXJzZTogQ291cnNlKTogR3JvdXBbXVtdIHtcbiAgbGV0IG0gPSBuZXcgTWFwKCk7XG4gIGlmICghY291cnNlLmdyb3Vwcykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvdXJzZS5ncm91cHMuZm9yRWFjaChmdW5jdGlvbihncm91cCkge1xuICAgIGlmICghbS5oYXMoZ3JvdXAudHlwZSkpIHtcbiAgICAgIG0uc2V0KGdyb3VwLnR5cGUsIFtdKTtcbiAgICB9XG4gICAgbS5nZXQoZ3JvdXAudHlwZSkucHVzaChncm91cCk7XG4gIH0pO1xuXG4gIHJldHVybiBBcnJheS5mcm9tKG0udmFsdWVzKCkpO1xufVxuIiwiaW1wb3J0IHtEYXRlT2JqLCBHcm91cH0gZnJvbSAnLi9jb21tb24nO1xuXG4vKipcbiAqIENvbnZlcnQgbWludXRlcy1mcm9tLW1pZG5pZ2h0IHRvIEhIOk1NXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW51dGVzVG9UaW1lKG1pbnV0ZXM6IG51bWJlcik6IHN0cmluZyB7XG4gIGxldCBob3VyU3RyaW5nID0gTWF0aC5mbG9vcihtaW51dGVzIC8gNjApLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgbGV0IG1pbnV0ZVN0cmluZyA9IChtaW51dGVzICUgNjApLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgcmV0dXJuIGhvdXJTdHJpbmcgKyAnOicgKyBtaW51dGVTdHJpbmc7XG59XG5cbi8qKlxuICogRm9ybWF0IGEgRGF0ZU9iaiBhcyBhIHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlT2JqOiBEYXRlT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5ldyBEYXRlKGRhdGVPYmoueWVhciwgZGF0ZU9iai5tb250aCwgZGF0ZU9iai5kYXkpLnRvRGF0ZVN0cmluZygpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgYXBwcm9wcmlhdGUgZGlzcGxheSBuYW1lIGZvciB0aGUgZ3JvdXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOYW1lKGdyb3VwOiBHcm91cCk6IHN0cmluZyB7XG4gIHJldHVybiBncm91cC5kZXNjcmlwdGlvbiB8fCBncm91cC5jb3Vyc2UubmFtZTtcbn1cbiIsIi8vIFRvIGVuYWJsZSBkZWJ1Z2dpbmcsIHR5cGUgdGhlIGZvbGxvd2luZyBpbnRvIHlvdXIgSmF2YXNjcmlwdCBjb25zb2xlOlxuLy9cbi8vICAgbWFpbkRlYnVnTG9nZ2luZyA9IHRydWVcbmxldCBtYWluRGVidWdMb2dnaW5nID0gZmFsc2U7XG5cbmltcG9ydCB7cmVuZGVyU2NoZWR1bGV9IGZyb20gJy4vcmVuZGVyJztcbmltcG9ydCB7Z3JvdXBzQnlUeXBlLCBzb3J0RXZlbnRzLCBsb2FkQ2F0YWxvZ30gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHtTY2hlZHVsZSwgQ291cnNlLCBHcm91cCwgQ2F0YWxvZywgU2NoZWR1bGVSYXRpbmcsIEZpbHRlclNldHRpbmdzLCBBY2FkZW1pY0V2ZW50fSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge2Rpc3BsYXlOYW1lLCBmb3JtYXREYXRlLCBtaW51dGVzVG9UaW1lfSBmcm9tICcuL2Zvcm1hdHRpbmcnO1xuXG4vKipcbiAqIFNldHRpbmdzIHRvIGJlIHNhdmVkLiBOb3RlIHRoYXQgdGhpcyBtdXN0IGJlIHNlcmlhbGl6YWJsZSBkaXJlY3RseSBhcyBKU09OLFxuICogc28gU2V0dGluZ3MgYW5kIGFsbCBvZiB0aGUgdHlwZXMgb2YgaXRzIG1lbWJlciB2YXJpYWJsZXMgY2FuJ3QgaGF2ZSBtYXBzXG4gKiBub3Igc2V0cy5cbiAqL1xuY2xhc3MgU2V0dGluZ3Mge1xuICBzZWxlY3RlZENvdXJzZXM6IG51bWJlcltdO1xuICBmb3JiaWRkZW5Hcm91cHM6IHN0cmluZ1tdO1xuICBjdXN0b21FdmVudHM6IHN0cmluZztcbiAgY2F0YWxvZ1VybDogc3RyaW5nO1xuICBmaWx0ZXJTZXR0aW5nczogRmlsdGVyU2V0dGluZ3M7XG59XG5cbmNvbnN0IGRlZmF1bHRDYXRhbG9nVXJsID1cbiAgICAnaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3JlcHktMTc2MjE3LmFwcHNwb3QuY29tL2xhdGVzdC5qc29uJztcblxuLyoqXG4gKiBTZXQgdGhlIGdpdmVuIGNhdGFsb2cgVVJMIGFuZCBzYXZlIHNldHRpbmdzLiBGb3IgdXNlIGZyb20gSFRNTC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2F0YWxvZ1VybCh1cmw6IHN0cmluZykge1xuICAkKCcjY2F0YWxvZy11cmwnKS52YWwodXJsKTtcbiAgY2F0YWxvZ1VybENoYW5nZWQoKTtcbn1cbih3aW5kb3cgYXMgYW55KS5zZXRDYXRhbG9nVXJsID0gc2V0Q2F0YWxvZ1VybDtcblxuLyoqXG4gKiBIYW5kbGVyIGZvciBjaGFuZ2VzIHRvIHRoZSBjYXRhbG9nIFVSTCBmaWVsZFxuICovXG5mdW5jdGlvbiBjYXRhbG9nVXJsQ2hhbmdlZCgpIHtcbiAgc2F2ZVNldHRpbmdzKCk7XG59XG5cbmxldCBzZWxlY3RlZENvdXJzZXMgPSBuZXcgU2V0KCk7XG5cbi8qKlxuICogQ2F0YWxvZyBvZiBhbGwgY291cnNlc1xuICovXG5sZXQgY3VycmVudENhdGFsb2c6IENhdGFsb2cgPSBudWxsO1xuXG4vKipcbiAqIE1hcHBpbmcgZnJvbSBjb3Vyc2UgSURzIHRvIGNvdXJzZXNcbiAqL1xubGV0IGN1cnJlbnRDYXRhbG9nQnlDb3Vyc2VJRDogTWFwPG51bWJlciwgQ291cnNlPiA9IG51bGw7XG5cbi8qKlxuICogVXBkYXRlcyBmb3JibGluayBhY2NvcmRpbmcgdG8gaXRzIGRhdGEoJ2ZvcmJpZGRlbicpXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUZvcmJpZExpbmtUZXh0KGZsOiBKUXVlcnkpIHtcbiAgZmwudGV4dChmbC5kYXRhKCdmb3JiaWRkZW4nKSA/ICdbdW5mb3JiaWRdJyA6ICdbZm9yYmlkXScpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBoZWFkZXIgZm9yIHRoZSBnaXZlbiBncm91cCwgZm9yIGRpc3BsYXlpbmcgaW4gdGhlIGNhdGFsb2dcbiAqL1xuZnVuY3Rpb24gZ3JvdXBIZWFkZXJGb3JDYXRhbG9nKGdyb3VwOiBHcm91cCk6IEpRdWVyeSB7XG4gIGxldCByZXN1bHQgPSAkKCc8bGk+Jyk7XG4gIGxldCBncm91cE5hbWVUZXh0ID0gYEdyb3VwICR7Z3JvdXAuaWR9ICgke2dyb3VwLnR5cGV9KSBgO1xuICBpZiAoZ3JvdXAudGVhY2hlcnMubGVuZ3RoID4gMCkge1xuICAgIGdyb3VwTmFtZVRleHQgKz0gYCgke2dyb3VwLnRlYWNoZXJzLmpvaW4oJywgJyl9KSBgO1xuICB9XG5cbiAgbGV0IGdyb3VwTmFtZSA9ICQoJzxiPicsIHtcbiAgICB0ZXh0OiBncm91cE5hbWVUZXh0LFxuICB9KTtcbiAgcmVzdWx0LmFwcGVuZChncm91cE5hbWUpO1xuXG4gIGxldCBmb3JiaWRMaW5rID0gJCgnPGE+Jywge1xuICAgIGNsYXNzOiAnZm9yYmlkLWxpbmsnLFxuICAgIGhyZWY6ICcjLycsXG4gICAgZGF0YToge2ZvcmJpZGRlbjogaXNHcm91cEZvcmJpZGRlbihncm91cCksIGdyb3VwSUQ6IGdyb3VwSURTdHJpbmcoZ3JvdXApfSxcbiAgfSk7XG5cbiAgdXBkYXRlRm9yYmlkTGlua1RleHQoZm9yYmlkTGluayk7XG5cbiAgZm9yYmlkTGluay5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoZm9yYmlkTGluay5kYXRhKCdmb3JiaWRkZW4nKSkge1xuICAgICAgZGVsRm9yYmlkZGVuR3JvdXAoZ3JvdXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRGb3JiaWRkZW5Hcm91cChncm91cCk7XG4gICAgfVxuICB9KTtcbiAgcmVzdWx0LmFwcGVuZChmb3JiaWRMaW5rKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZvcmJpZGRlbiBncm91cHMsIGFzIGZvcm1hdHRlZCB1c2luZyBncm91cElEU3RyaW5nXG4gKi9cbmxldCBmb3JiaWRkZW5Hcm91cHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4vKipcbiAqIEEgc3RyaW5nIGlkZW50aWZpZXIgcmVwcmVzZW50aW5nIGEgZ2l2ZW4gZ3JvdXAuIFVzZWQgaW4gZm9yYmlkZGVuR3JvdXBzLlxuICpcbiAqIEZvcm1hdDogJ2NvdXJzZV9pZC5ncm91cF9pZCdcbiAqL1xuZnVuY3Rpb24gZ3JvdXBJRFN0cmluZyhncm91cDogR3JvdXApOiBzdHJpbmcge1xuICByZXR1cm4gYCR7Z3JvdXAuY291cnNlLmlkfS4ke2dyb3VwLmlkfWA7XG59XG5cbi8qKlxuICogQWRkIHRoZSBnaXZlbiBncm91cCB0byB0aGUgZm9yYmlkZGVuIGdyb3Vwc1xuICovXG5mdW5jdGlvbiBhZGRGb3JiaWRkZW5Hcm91cChncm91cDogR3JvdXApIHtcbiAgZm9yYmlkZGVuR3JvdXBzLmFkZChncm91cElEU3RyaW5nKGdyb3VwKSk7XG4gIHNhdmVTZXR0aW5ncygpO1xuXG4gIHVwZGF0ZUZvcmJpZGRlbkdyb3VwcygpO1xufVxuLy8gVE9ETyhsdXR6a3kpOiBNYWtpbmcgYWRkRm9yYmlkZGVuR3JvdXAgYXZhaWxhYmxlIHRvIHJlbmRlci50cyBpbiB0aGlzIHdheVxuLy8gaXMgYW4gdWdseSBoYWNrLlxuKHdpbmRvdyBhcyBhbnkpLmFkZEZvcmJpZGRlbkdyb3VwID0gYWRkRm9yYmlkZGVuR3JvdXA7XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBncm91cCBmcm9tIHRoZSBmb3JiaWRkZW4gZ3JvdXBzXG4gKi9cbmZ1bmN0aW9uIGRlbEZvcmJpZGRlbkdyb3VwKGdyb3VwOiBHcm91cCkge1xuICBmb3JiaWRkZW5Hcm91cHMuZGVsZXRlKGdyb3VwSURTdHJpbmcoZ3JvdXApKTtcbiAgc2F2ZVNldHRpbmdzKCk7XG5cbiAgdXBkYXRlRm9yYmlkZGVuR3JvdXBzKCk7XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBncm91cCBpcyBmb3JiaWRkZW5cbiAqL1xuZnVuY3Rpb24gaXNHcm91cEZvcmJpZGRlbihncm91cDogR3JvdXApOiBib29sZWFuIHtcbiAgcmV0dXJuIGZvcmJpZGRlbkdyb3Vwcy5oYXMoZ3JvdXBJRFN0cmluZyhncm91cCkpO1xufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgbGlzdCBvZiBjdXJyZW50bHkgZm9yYmlkZGVuIGdyb3Vwc1xuICovXG5mdW5jdGlvbiB1cGRhdGVGb3JiaWRkZW5Hcm91cHMoKSB7XG4gIGxldCB1bCA9ICQoJyNmb3JiaWRkZW4tZ3JvdXBzJyk7XG4gIHVsLmVtcHR5KCk7XG5cbiAgZm9yYmlkZGVuR3JvdXBzLmZvckVhY2goZnVuY3Rpb24oZmcpIHtcbiAgICBsZXQgbGkgPSAkKCc8bGk+Jyk7XG4gICAgbGkudGV4dChmZyArICcgJyk7XG5cbiAgICBsZXQgdW5mb3JiaWRMaW5rID0gJCgnPGE+Jywge1xuICAgICAgaHJlZjogJyMvJyxcbiAgICAgIHRleHQ6ICdbdW5mb3JiaWRdJyxcbiAgICAgIGNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yYmlkZGVuR3JvdXBzLmRlbGV0ZShmZyk7XG4gICAgICAgIHNhdmVTZXR0aW5ncygpO1xuICAgICAgICB1cGRhdGVGb3JiaWRkZW5Hcm91cHMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsaS5hcHBlbmQodW5mb3JiaWRMaW5rKTtcbiAgICB1bC5hcHBlbmQobGkpO1xuICB9KTtcblxuICAkKCdhLmZvcmJpZC1saW5rJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICBsZXQgZ3JvdXBJRDogc3RyaW5nID0gJCh0aGlzKS5kYXRhKCdncm91cElEJyk7XG5cbiAgICBsZXQgaXNGb3JiaWRkZW4gPSBmb3JiaWRkZW5Hcm91cHMuaGFzKGdyb3VwSUQpO1xuICAgICQodGhpcykuZGF0YSgnZm9yYmlkZGVuJywgaXNGb3JiaWRkZW4pO1xuICAgIHVwZGF0ZUZvcmJpZExpbmtUZXh0KCQodGhpcykpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBjb3Vyc2UgSUQgYXMgYSA2LWRpZ2l0IG51bWJlclxuICpcbiAqIEZvciBleGFtcGxlLCAxODQyMCBzaG91bGQgYmUgcHJlc2VudGVkIChhbmQgc2VhcmNoYWJsZSkgYXMgMDE4NDIwLlxuICovXG5mdW5jdGlvbiBmb3JtYXRDb3Vyc2VJZChpZDogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZyhpZCkucGFkU3RhcnQoNiwgJzAnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gSFRNTCBkZXNjcmlwdGlvbiBmb3IgYSBjb3Vyc2VcbiAqL1xuZnVuY3Rpb24gaHRtbERlc2NyaWJlQ291cnNlKGNvdXJzZTogQ291cnNlKTogSFRNTEVsZW1lbnQge1xuICBsZXQgcmVzdWx0ID0gJCgnPHNwYW4+Jyk7XG4gIGxldCB1bCA9ICQoJzx1bD4nKTtcbiAgdWwuYXBwZW5kKCQoJzxsaT4nLCB7XG4gICAgaHRtbDogYDxiPkZ1bGwgbmFtZTwvYj4gJHtmb3JtYXRDb3Vyc2VJZChjb3Vyc2UuaWQpfSAke2NvdXJzZS5uYW1lfWAsXG4gIH0pKTtcbiAgdWwuYXBwZW5kKFxuICAgICAgJCgnPGxpPicsIHtodG1sOiBgPGI+QWNhZGVtaWMgcG9pbnRzOjwvYj4gJHtjb3Vyc2UuYWNhZGVtaWNQb2ludHN9YH0pKTtcbiAgdWwuYXBwZW5kKCQoJzxsaT4nLCB7XG4gICAgaHRtbDogYDxiPkxlY3R1cmVyIGluIGNoYXJnZTo8L2I+ICR7XG4gICAgICAgIHJ0bFNwYW4oY291cnNlLmxlY3R1cmVySW5DaGFyZ2UgfHwgJ1t1bmtub3duXScpfWAsXG4gIH0pKTtcbiAgdWwuYXBwZW5kKCQoJzxsaT4nLCB7aHRtbDogJzxiPlRlc3QgZGF0ZXM6PC9iPid9KSk7XG4gIGxldCB0ZXN0RGF0ZXMgPSAkKCc8dWw+Jyk7XG4gIGlmIChjb3Vyc2UudGVzdERhdGVzKSB7XG4gICAgY291cnNlLnRlc3REYXRlcy5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgIHRlc3REYXRlcy5hcHBlbmQoJCgnPGxpPicsIHt0ZXh0OiBmb3JtYXREYXRlKGQpfSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRlc3REYXRlcy5hcHBlbmQoJCgnPGxpPicsIHt0ZXh0OiAnW3Vua25vd25dJ30pKTtcbiAgfVxuICB1bC5hcHBlbmQodGVzdERhdGVzKTtcblxuICB1bC5hcHBlbmQoJCgnPGxpPicsIHtodG1sOiAnPGI+R3JvdXBzOjwvYj4nfSkpO1xuICBsZXQgZ3JvdXBzID0gJCgnPHVsPicpO1xuICBpZiAoY291cnNlLmdyb3Vwcykge1xuICAgIGNvdXJzZS5ncm91cHMuZm9yRWFjaChmdW5jdGlvbihnKSB7XG4gICAgICBncm91cHMuYXBwZW5kKGdyb3VwSGVhZGVyRm9yQ2F0YWxvZyhnKVswXSk7XG4gICAgICBsZXQgZXZlbnRzID0gJCgnPHVsPicpO1xuICAgICAgaWYgKGcuZXZlbnRzKSB7XG4gICAgICAgIGcuZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGV2ZW50cy5hcHBlbmQoJCgnPGxpPicsIHtcbiAgICAgICAgICAgIHRleHQ6IGAke2RheU5hbWVzW2UuZGF5XX0sIGAgKyBtaW51dGVzVG9UaW1lKGUuc3RhcnRNaW51dGUpICsgJy0nICtcbiAgICAgICAgICAgICAgICBtaW51dGVzVG9UaW1lKGUuZW5kTWludXRlKSArIGAgYXQgJHtlLmxvY2F0aW9uIHx8ICdbdW5rbm93bl0nfWAsXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ZW50cy5hcHBlbmQoJCgnPGxpPicsIHt0ZXh0OiAnW3Vua25vd25dJ30pKTtcbiAgICAgIH1cbiAgICAgIGdyb3Vwcy5hcHBlbmQoZXZlbnRzKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBncm91cHMuYXBwZW5kKCQoJzxsaT4nLCB7dGV4dDogJ1t1bmtub3duXSd9KSk7XG4gIH1cbiAgdWwuYXBwZW5kKGdyb3Vwcyk7XG5cbiAgcmVzdWx0LmFwcGVuZCh1bCk7XG4gIHJldHVybiByZXN1bHRbMF07XG59XG5cbmNvbnN0IGV4cGFuZEluZm9TeW1ib2wgPSAnPGkgY2xhc3M9XCJmYXMgZmEtaW5mby1jaXJjbGVcIj48L2k+JztcbmNvbnN0IGNvbGxhcHNlSW5mb1N5bWJvbCA9ICc8aSBjbGFzcz1cImZhcyBmYS1taW51cy1jaXJjbGVcIj48L2k+JztcblxuLyoqXG4gKiBXcmFwIHMgd2l0aCBhIHJpZ2h0LXRvLWxlZnQgc3BhblxuICovXG5mdW5jdGlvbiBydGxTcGFuKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgPHNwYW4gZGlyPVwicnRsXCI+JHtzfTwvc3Bhbj5gO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHNwYW4gZm9yIGEgY291cnNlIGxhYmVsLCBpbmNsdWRpbmcgaW5mbyBidXR0b25cbiAqL1xuZnVuY3Rpb24gY291cnNlTGFiZWwoY291cnNlOiBDb3Vyc2UpOiBIVE1MRWxlbWVudCB7XG4gIC8vIFRPRE8obHV0emt5KTogVGhpcyBmdW5jdGlvbiBpcyBmdWxsIG9mIERPTSBtaXN1c2UsIGhlbmNlIHRoZSB0cy1pZ25vcmVcbiAgLy8gc3ltYm9scy5cbiAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGxldCBpbmZvTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgaW5mb0xpbmsuaW5uZXJIVE1MID0gZXhwYW5kSW5mb1N5bWJvbDtcbiAgaW5mb0xpbmsuY2xhc3NOYW1lID0gJ2V4cGFuZG8nO1xuICBpbmZvTGluay5ocmVmID0gJyMvJztcbiAgc3Bhbi5pbm5lckhUTUwgPSBgICR7Zm9ybWF0Q291cnNlSWQoY291cnNlLmlkKX0gJHtydGxTcGFuKGNvdXJzZS5uYW1lKX0gYDtcbiAgaW5mb0xpbmsub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIEB0cy1pZ25vcmU6IGRvbS1taXN1c2VcbiAgICBpZiAoIXNwYW4udHRpbWUzX2V4cGFuZGVkKSB7XG4gICAgICBsZXQgaW5mb0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgLy8gQHRzLWlnbm9yZTogZG9tLW1pc3VzZVxuICAgICAgc3Bhbi5pbmZvRGl2ID0gaW5mb0RpdjtcbiAgICAgIGluZm9EaXYuYXBwZW5kQ2hpbGQoaHRtbERlc2NyaWJlQ291cnNlKGNvdXJzZSkpO1xuICAgICAgLy8gc2hvd0NvdXJzZURlYnVnSW5mbyhjb3Vyc2UpO1xuICAgICAgc3Bhbi5hcHBlbmRDaGlsZChpbmZvRGl2KTtcbiAgICAgIGluZm9MaW5rLmlubmVySFRNTCA9IGNvbGxhcHNlSW5mb1N5bWJvbDtcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGRvbS1taXN1c2VcbiAgICAgIHNwYW4udHRpbWUzX2V4cGFuZGVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mb0xpbmsuaW5uZXJIVE1MID0gZXhwYW5kSW5mb1N5bWJvbDtcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGRvbS1taXN1c2VcbiAgICAgIHNwYW4udHRpbWUzX2V4cGFuZGVkID0gZmFsc2U7XG4gICAgICAvLyBAdHMtaWdub3JlOiBkb20tbWlzdXNlXG4gICAgICBzcGFuLnJlbW92ZUNoaWxkKHNwYW4uaW5mb0Rpdik7XG4gICAgfVxuICB9O1xuICBzcGFuLmFwcGVuZENoaWxkKGluZm9MaW5rKTtcbiAgcmV0dXJuIHNwYW47XG59XG5cbmxldCBjb3Vyc2VBZGRCdXR0b25zID0gbmV3IE1hcCgpO1xubGV0IGNvdXJzZUFkZExhYmVscyA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBXcml0ZSBjYXRhbG9nIHNlbGVjdG9yIHRvIHBhZ2UuXG4gKi9cbmZ1bmN0aW9uIHdyaXRlQ2F0YWxvZ1NlbGVjdG9yKCkge1xuICBsZXQgZmFjdWx0aWVzRGl2ID0gJCgnI2NhdGFsb2cnKTtcblxuICBmYWN1bHRpZXNEaXYuZW1wdHkoKTtcbiAgY3VycmVudENhdGFsb2cuZm9yRWFjaChmdW5jdGlvbihmYWN1bHR5KSB7XG4gICAgbGV0IGZhY3VsdHlEZXRhaWxzID0gJCgnPGRldGFpbHM+Jyk7XG5cbiAgICBsZXQgc3VtbWFyeSA9ICQoJzxzdW1tYXJ5PicpO1xuICAgIHN1bW1hcnkuaHRtbChgPHN0cm9uZz4ke2ZhY3VsdHkubmFtZX08L3N0cm9uZz4gYCk7XG4gICAgbGV0IHNlbWVzdGVyVGFnID0gJCgnPHNwYW4+Jywge1xuICAgICAgY2xhc3M6ICdiYWRnZSBiYWRnZS1zZWNvbmRhcnknLFxuICAgICAgdGV4dDogZmFjdWx0eS5zZW1lc3RlcixcbiAgICB9KTtcbiAgICBzdW1tYXJ5LmFwcGVuZChzZW1lc3RlclRhZyk7XG4gICAgZmFjdWx0eURldGFpbHMuYXBwZW5kKHN1bW1hcnkpO1xuICAgIGZhY3VsdGllc0Rpdi5hcHBlbmQoZmFjdWx0eURldGFpbHMpO1xuXG4gICAgbGV0IGNvdXJzZUxpc3QgPSAkKCc8dWw+Jywge2NsYXNzOiAnY291cnNlLWxpc3QnfSk7XG4gICAgZmFjdWx0eURldGFpbHMuYXBwZW5kKGNvdXJzZUxpc3QpO1xuXG4gICAgZmFjdWx0eS5jb3Vyc2VzLmZvckVhY2goZnVuY3Rpb24oY291cnNlKSB7XG4gICAgICBsZXQgYnRuID0gJCgnPGJ1dHRvbj4nLCB7XG4gICAgICAgIHRleHQ6ICcrJyxcbiAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFkZFNlbGVjdGVkQ291cnNlKGNvdXJzZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvdXJzZUFkZEJ1dHRvbnMuc2V0KGNvdXJzZS5pZCwgYnRuKTtcbiAgICAgIGxldCBsYWJlbCA9IGNvdXJzZUxhYmVsKGNvdXJzZSk7XG4gICAgICBjb3Vyc2VBZGRMYWJlbHMuc2V0KGNvdXJzZS5pZCwgbGFiZWwpO1xuICAgICAgbGV0IGNvdXJzZUxpID0gJCgnPGxpPicpO1xuICAgICAgY291cnNlTGkuYXBwZW5kKGJ0bikuYXBwZW5kKGxhYmVsKTtcbiAgICAgIGNvdXJzZUxpc3QuYXBwZW5kKGNvdXJzZUxpKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGNoZWNrYm94IHdpdGggdGhlIGdpdmVuIElEIGlzIGNoZWNrZWRcbiAqL1xuZnVuY3Rpb24gZ2V0Q2hlY2tib3hWYWx1ZUJ5SWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xufVxuXG4vKipcbiAqIFNldHMgd2hldGhlciBvciBub3QgYSBjaGVja2JveCB3aXRoIHRoZSBnaXZlbiBJRCBpcyBjaGVja2VkXG4gKi9cbmZ1bmN0aW9uIHNldENoZWNrYm94VmFsdWVCeUlkKGlkOiBzdHJpbmcsIGNoZWNrZWQ6IGJvb2xlYW4pIHtcbiAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gY2hlY2tlZDtcbn1cblxuLyoqXG4gKiBTYXZlIGFsbCBzZXR0aW5ncyB0byBsb2NhbFN0b3JhZ2VcbiAqL1xuZnVuY3Rpb24gc2F2ZVNldHRpbmdzKCkge1xuICBzZXR0aW5ncy5zZWxlY3RlZENvdXJzZXMgPSBBcnJheS5mcm9tKHNlbGVjdGVkQ291cnNlcykubWFwKGMgPT4gYy5pZCk7XG4gIHNldHRpbmdzLmN1c3RvbUV2ZW50cyA9ICQoJyNjdXN0b20tZXZlbnRzLXRleHRhcmVhJykudmFsKCkgYXMgc3RyaW5nO1xuICBzZXR0aW5ncy5jYXRhbG9nVXJsID0gJCgnI2NhdGFsb2ctdXJsJykudmFsKCkgYXMgc3RyaW5nO1xuICBzZXR0aW5ncy5maWx0ZXJTZXR0aW5ncyA9IHtcbiAgICBmb3JiaWRkZW5Hcm91cHM6IEFycmF5LmZyb20oZm9yYmlkZGVuR3JvdXBzKSxcbiAgICBub0NvbGxpc2lvbnM6IGdldENoZWNrYm94VmFsdWVCeUlkKCdmaWx0ZXIubm9Db2xsaXNpb25zJyksXG4gICAgcmF0aW5nTWF4OiBnZXROdWxsUmF0aW5nKCksXG4gICAgcmF0aW5nTWluOiBnZXROdWxsUmF0aW5nKCksXG4gIH07XG5cbiAgT2JqZWN0LmtleXMoYWxsUmF0aW5ncykuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgIHNldHRpbmdzLmZpbHRlclNldHRpbmdzLnJhdGluZ01pbltyXSA9IGdldE51bUlucHV0VmFsdWVXaXRoRGVmYXVsdChcbiAgICAgICAgKCQoYCNyYXRpbmctJHtyfS1taW5gKVswXSkgYXMgSFRNTElucHV0RWxlbWVudCwgbnVsbCk7XG4gICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgIHNldHRpbmdzLmZpbHRlclNldHRpbmdzLnJhdGluZ01heFtyXSA9IGdldE51bUlucHV0VmFsdWVXaXRoRGVmYXVsdChcbiAgICAgICAgKCQoYCNyYXRpbmctJHtyfS1tYXhgKVswXSkgYXMgSFRNTElucHV0RWxlbWVudCwgbnVsbCk7XG4gIH0pO1xuXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHRpbWUzX3NldHRpbmdzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcblxuICBpZiAobWFpbkRlYnVnTG9nZ2luZykge1xuICAgIGNvbnNvbGUuaW5mbygnU2F2ZWQgc2V0dGluZ3M6Jywgc2V0dGluZ3MpO1xuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBudW1lcmljIHZhbHVlIGluIHRoZSBnaXZlbiBmaWVsZCwgb3IgcmV0dXJuIHRoZSBkZWZhdWx0IGlmXG4gKiBpdCdzIGVtcHR5LlxuICovXG5mdW5jdGlvbiBnZXROdW1JbnB1dFZhbHVlV2l0aERlZmF1bHQoXG4gICAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQsIGRlZmF1bHRWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgaWYgKGlucHV0LnZhbHVlID09ICcnKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfVxuICByZXR1cm4gTnVtYmVyKGlucHV0LnZhbHVlKTtcbn1cblxuLyoqXG4gKiBNYXJrIGNvdXJzZSBhcyBzZWxlY3RlZC5cbiAqL1xuZnVuY3Rpb24gYWRkU2VsZWN0ZWRDb3Vyc2UoY291cnNlOiBDb3Vyc2UpIHtcbiAgaWYgKG1haW5EZWJ1Z0xvZ2dpbmcpIHtcbiAgICBjb25zb2xlLmluZm8oJ1NlbGVjdGVkJywgY291cnNlKTtcbiAgfVxuICBzZWxlY3RlZENvdXJzZXMuYWRkKGNvdXJzZSk7XG4gIGNvdXJzZUFkZEJ1dHRvbnMuZ2V0KGNvdXJzZS5pZCkuZGlzYWJsZWQgPSB0cnVlO1xuICBjb3Vyc2VBZGRMYWJlbHMuZ2V0KGNvdXJzZS5pZCkuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQtY291cnNlLWxhYmVsJyk7XG4gIHNhdmVTZXR0aW5ncygpO1xuICByZWZyZXNoU2VsZWN0ZWRDb3Vyc2VzKCk7XG59XG5cbi8qKlxuICogQWRkIGEgY291cnNlIHdpdGggYSBnaXZlbiBJRFxuICovXG5mdW5jdGlvbiBhZGRTZWxlY3RlZENvdXJzZUJ5SUQoLi4uaWRzOiBudW1iZXJbXSkge1xuICBpZHMuZm9yRWFjaChmdW5jdGlvbihpZCkge1xuICAgIGxldCBjb3Vyc2UgPSBnZXRDb3Vyc2VCeUlEKGlkKTtcblxuICAgIGlmIChjb3Vyc2UpIHtcbiAgICAgIGFkZFNlbGVjdGVkQ291cnNlKGNvdXJzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gY291cnNlIHdpdGggSUQgJyArIGlkKTtcbiAgICB9XG4gIH0pO1xufVxuKHdpbmRvdyBhcyBhbnkpLmFkZFNlbGVjdGVkQ291cnNlQnlJRCA9IGFkZFNlbGVjdGVkQ291cnNlQnlJRDtcblxuLyoqXG4gKiBNYXJrIGNvdXJzZSBhcyB1bnNlbGVjdGVkLlxuICovXG5mdW5jdGlvbiBkZWxTZWxlY3RlZENvdXJzZShjb3Vyc2U6IENvdXJzZSkge1xuICBpZiAobWFpbkRlYnVnTG9nZ2luZykge1xuICAgIGNvbnNvbGUuaW5mbygnVW5zZWxlY3RlZCcsIGNvdXJzZSk7XG4gIH1cbiAgc2VsZWN0ZWRDb3Vyc2VzLmRlbGV0ZShjb3Vyc2UpO1xuICBjb3Vyc2VBZGRCdXR0b25zLmdldChjb3Vyc2UuaWQpLmRpc2FibGVkID0gZmFsc2U7XG4gIGNvdXJzZUFkZExhYmVscy5nZXQoY291cnNlLmlkKS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZC1jb3Vyc2UtbGFiZWwnKTtcbiAgc2F2ZVNldHRpbmdzKCk7XG4gIHJlZnJlc2hTZWxlY3RlZENvdXJzZXMoKTtcbn1cblxuLyoqXG4gKiBSZWRyYXcgdGhlIGxpc3Qgb2Ygc2VsZWN0ZWQgY291cnNlc1xuICovXG5mdW5jdGlvbiByZWZyZXNoU2VsZWN0ZWRDb3Vyc2VzKCkge1xuICBsZXQgbnNjaGVkcyA9IE51bWJlcih0b3RhbFBvc3NpYmxlU2NoZWR1bGVzKHNlbGVjdGVkQ291cnNlcykpO1xuICAkKCcjcG9zc2libGUtc2NoZWR1bGVzJylcbiAgICAgIC50ZXh0KGAke25zY2hlZHMudG9Mb2NhbGVTdHJpbmcoKX0gKCR7bnNjaGVkcy50b0V4cG9uZW50aWFsKDIpfSlgKTtcbiAgJCgnI2dlbmVyYXRlLXNjaGVkdWxlcycpLnByb3AoJ2Rpc2FibGVkJywgc2VsZWN0ZWRDb3Vyc2VzLnNpemUgPT0gMCk7XG4gIGxldCBkaXYgPSAkKCcjc2VsZWN0ZWQtY291cnNlcycpO1xuICBkaXYuZW1wdHkoKTtcbiAgbGV0IHVsID0gJCgnPHVsPicsIHtjbGFzczogJ2xpc3QtZ3JvdXAnfSk7XG4gIGRpdi5hcHBlbmQodWwpO1xuICBzZWxlY3RlZENvdXJzZXMuZm9yRWFjaChmdW5jdGlvbihjb3Vyc2UpIHtcbiAgICBsZXQgbGkgPSAkKCc8bGk+Jywge2NsYXNzOiAnbGlzdC1ncm91cC1pdGVtJ30pO1xuICAgIGxldCBsYWJlbCA9IGNvdXJzZUxhYmVsKGNvdXJzZSk7XG4gICAgbGV0IGJ0biA9ICQoJzxidXR0b24+Jywge1xuICAgICAgY2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1kYW5nZXIgZmxvYXQtcmlnaHQnLFxuICAgICAgaHRtbDogJzxpIGNsYXNzPVwiZmFzIGZhLXRyYXNoLWFsdFwiPjwvaT4nLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWxTZWxlY3RlZENvdXJzZShjb3Vyc2UpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBsaS5hcHBlbmQobGFiZWwpO1xuXG4gICAgaWYgKGNvdXJzZS5ncm91cHMgPT0gbnVsbCB8fCBjb3Vyc2UuZ3JvdXBzLmxlbmd0aCA9PSAwKSB7XG4gICAgICBsaS5hcHBlbmQoJCgnPGk+Jywge1xuICAgICAgICBjbGFzczogJ3RleHQtd2FybmluZyBmYXMgZmEtZXhjbGFtYXRpb24tdHJpYW5nbGUnLFxuICAgICAgICB0aXRsZTogJ0NvdXJzZSBoYXMgbm8gZ3JvdXBzJyxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBsaS5hcHBlbmQoYnRuKTtcbiAgICB1bC5hcHBlbmQobGkpO1xuICB9KTtcbn1cblxuaW1wb3J0IFNjaGVkdWxlcldvcmtlciA9IHJlcXVpcmUoJ3dvcmtlci1sb2FkZXI/bmFtZT1bbmFtZV0uanMhLi9zY2hlZHVsZXJfd29ya2VyJyk7XG5sZXQgc2NoZWR1bGVyV29ya2VyID0gbmV3IFNjaGVkdWxlcldvcmtlcigpO1xuXG4vKipcbiAqIFJlc3BvbmQgdG8gc2NoZWR1bGluZyByZXN1bHQgZnJvbSB3b3JrZXJcbiAqL1xuc2NoZWR1bGVyV29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGU6IE1lc3NhZ2VFdmVudCkge1xuICBpZiAobWFpbkRlYnVnTG9nZ2luZykge1xuICAgIGNvbnNvbGUuaW5mbygnUmVjZWl2ZWQgbWVzc2FnZSBmcm9tIHdvcmtlcjonLCBlKTtcbiAgfVxuICAkKCcjZ2VuZXJhdGUtc2NoZWR1bGVzJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICQoJyNzcGlubmVyJykuaGlkZSgpO1xuICBpZiAoZS5kYXRhID09IG51bGwpIHtcbiAgICAkKCcjZXhjZXB0aW9uLW9jY3VycmVkLXNjaGVkdWxpbmcnKS5zaG93KCk7XG4gIH0gZWxzZSB7XG4gICAgc2V0UG9zc2libGVTY2hlZHVsZXMoZS5kYXRhKTtcbiAgfVxufTtcblxuLyoqXG4gKiBDaGVjayBpZiBjdXN0b20tZXZlbnRzLXRleHRhcmVhIGhhcyB2YWxpZCBldmVudHNcbiAqL1xuZnVuY3Rpb24gY2hlY2tDdXN0b21FdmVudHMoKSB7XG4gIGxldCBlbGVtID0gJCgnI2N1c3RvbS1ldmVudHMtdGV4dGFyZWEnKTtcbiAgZWxlbS5yZW1vdmVDbGFzcygnaXMtaW52YWxpZCcpO1xuICBlbGVtLnJlbW92ZUNsYXNzKCdpcy12YWxpZCcpO1xuXG4gIHRyeSB7XG4gICAgbGV0IGNvdXJzZXMgPSBidWlsZEN1c3RvbUV2ZW50c0NvdXJzZXMoZWxlbS52YWwoKSBhcyBzdHJpbmcpO1xuICAgIGlmIChjb3Vyc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIGVsZW0uYWRkQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgZWxlbS5hZGRDbGFzcygnaXMtaW52YWxpZCcpO1xuICB9XG59XG4od2luZG93IGFzIGFueSkuY2hlY2tDdXN0b21FdmVudHMgPSBjaGVja0N1c3RvbUV2ZW50cztcblxuY29uc3QgY3VzdG9tRXZlbnRSZWdleCA9IG5ldyBSZWdFeHAoW1xuICAvKFN1bnxNb258VHVlfFdlZHxUaHV8RnJpfFNhdCkgLyxcbiAgLyhbMC05XXsyfSk6KFswLTldezJ9KS0oWzAtOV17Mn0pOihbMC05XXsyfSkgLyxcbiAgLyguKikvLFxuXS5tYXAoeCA9PiB4LnNvdXJjZSkuam9pbignJykpO1xuXG4vLyBUT0RPKGx1dHpreSk6IGludmVyc2VEYXlJbmRleCBpcyBjYXVzaW5nIHR5cGUgcHJvYmxlbXMsIG1ha2luZyB1cyB1c2Vcbi8vIHNvbWUgdHMtaWdub3JlLlxuY29uc3QgaW52ZXJzZURheUluZGV4ID0ge1xuICBTdW46IDAsXG4gIE1vbjogMSxcbiAgVHVlOiAyLFxuICBXZWQ6IDMsXG4gIFRodTogNCxcbiAgRnJpOiA1LFxuICBTYXQ6IDYsXG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIGNvdXJzZSB3aXRoIGEgc2luZ2xlIGV2ZW50XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVNpbmdsZUV2ZW50Q291cnNlKFxuICAgIG5hbWU6IHN0cmluZywgZGF5OiBudW1iZXIsIHN0YXJ0TWludXRlOiBudW1iZXIsIGVuZE1pbnV0ZTogbnVtYmVyKTogQ291cnNlIHtcbiAgbGV0IGM6IENvdXJzZSA9IHtcbiAgICBhY2FkZW1pY1BvaW50czogMCxcbiAgICBpZDogMCxcbiAgICBsZWN0dXJlckluQ2hhcmdlOiAnJyxcbiAgICBuYW1lOiBuYW1lLFxuICAgIHRlc3REYXRlczogW10sXG4gICAgZ3JvdXBzOiBbXSxcbiAgfTtcblxuICBsZXQgZzogR3JvdXAgPSB7XG4gICAgY291cnNlOiBjLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBpZDogMCxcbiAgICB0ZWFjaGVyczogW10sXG4gICAgdHlwZTogJ2xlY3R1cmUnLFxuICAgIGV2ZW50czogW10sXG4gIH07XG5cbiAgYy5ncm91cHMucHVzaChnKTtcblxuICBsZXQgZTogQWNhZGVtaWNFdmVudCA9IHtcbiAgICBkYXk6IGRheSxcbiAgICBzdGFydE1pbnV0ZTogc3RhcnRNaW51dGUsXG4gICAgZW5kTWludXRlOiBlbmRNaW51dGUsXG4gICAgbG9jYXRpb246ICcnLFxuICAgIGdyb3VwOiBnLFxuICB9O1xuXG4gIGcuZXZlbnRzLnB1c2goZSk7XG5cbiAgcmV0dXJuIGM7XG59XG5cbi8qKlxuICogQnVpbGQgY291cnNlcyB3aXRoIHRoZSBjb25maWd1cmVkIGN1c3RvbSBldmVudHNcbiAqXG4gKiBAcGFyYW0gcyAtIEN1c3RvbSBldmVudHMsIGxpbmVzIG1hdGNoaW5nIGN1c3RvbUV2ZW50UmVnZXhcbiAqL1xuZnVuY3Rpb24gYnVpbGRDdXN0b21FdmVudHNDb3Vyc2VzKHM6IHN0cmluZyk6IENvdXJzZVtdIHtcbiAgbGV0IHJlc3VsdDogQ291cnNlW10gPSBbXTtcblxuICBpZiAocyA9PSAnJykge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBzLnNwbGl0KCdcXG4nKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICBsZXQgbSA9IGN1c3RvbUV2ZW50UmVnZXguZXhlYyhsaW5lKTtcbiAgICBpZiAobSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBjdXN0b20gZXZlbnQgbGluZTogJyArIGxpbmUpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmU6IGludmVyc2VEYXlJbmRleFxuICAgIGxldCBkYXk6IG51bWJlciA9IGludmVyc2VEYXlJbmRleFttWzFdXTtcbiAgICBsZXQgc3RhcnRNaW51dGUgPSBOdW1iZXIoTnVtYmVyKG1bMl0pICogNjAgKyBOdW1iZXIobVszXSkpO1xuICAgIGxldCBlbmRNaW51dGUgPSBOdW1iZXIoTnVtYmVyKG1bNF0pICogNjAgKyBOdW1iZXIobVs1XSkpO1xuICAgIGxldCBkZXNjID0gbVs2XTtcblxuICAgIHJlc3VsdC5wdXNoKGNyZWF0ZVNpbmdsZUV2ZW50Q291cnNlKGRlc2MsIGRheSwgc3RhcnRNaW51dGUsIGVuZE1pbnV0ZSkpO1xuICB9KTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFN0YXJ0IGEgd29ya2VyIHRvIGdlbmVyYXRlIHNjaGVkdWxlc1xuICovXG5mdW5jdGlvbiBnZXRTY2hlZHVsZXMoKSB7XG4gICQoJyNnZW5lcmF0ZS1zY2hlZHVsZXMnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAkKCcjc3Bpbm5lcicpLnNob3coKTtcbiAgJCgnI2V4Y2VwdGlvbi1vY2N1cnJlZCcpLmhpZGUoKTtcbiAgJCgnI25vLXNjaGVkdWxlcycpLmhpZGUoKTtcbiAgJCgnI2luaXRpYWwtaW5zdHJ1Y3Rpb25zJykuaGlkZSgpO1xuXG4gIGxldCBjb3Vyc2VzVG9TY2hlZHVsZSA9IG5ldyBTZXQoc2VsZWN0ZWRDb3Vyc2VzKTtcbiAgdHJ5IHtcbiAgICBsZXQgY291cnNlcyA9IGJ1aWxkQ3VzdG9tRXZlbnRzQ291cnNlcyhzZXR0aW5ncy5jdXN0b21FdmVudHMpO1xuICAgIGNvdXJzZXMuZm9yRWFjaChjID0+IGNvdXJzZXNUb1NjaGVkdWxlLmFkZChjKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGJ1aWxkIGN1c3RvbSBldmVudHMgY291cnNlOicsIGVycm9yKTtcbiAgfVxuXG4gIHNjaGVkdWxlcldvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgY291cnNlczogY291cnNlc1RvU2NoZWR1bGUsXG4gICAgZmlsdGVyU2V0dGluZ3M6IHNldHRpbmdzLmZpbHRlclNldHRpbmdzLFxuICB9KTtcbn1cbih3aW5kb3cgYXMgYW55KS5nZXRTY2hlZHVsZXMgPSBnZXRTY2hlZHVsZXM7XG5cbmxldCBwb3NzaWJsZVNjaGVkdWxlczogU2NoZWR1bGVbXSA9IFtdO1xuXG5sZXQgY3VycmVudFNjaGVkdWxlID0gMDtcblxuLyoqXG4gKiBTZXQgdGhlIGNvbGxlY3Rpb24gb2YgcG9zc2libGUgc2NoZWR1bGVzXG4gKi9cbmZ1bmN0aW9uIHNldFBvc3NpYmxlU2NoZWR1bGVzKHNjaGVkdWxlczogU2NoZWR1bGVbXSkge1xuICBwb3NzaWJsZVNjaGVkdWxlcyA9IHNjaGVkdWxlcztcbiAgY3VycmVudFNjaGVkdWxlID0gMDtcbiAgbGV0IGRpdnMgPSAkKCcjc2NoZWR1bGUtYnJvd3NlciwgI3JlbmRlcmVkLXNjaGVkdWxlLWNvbnRhaW5lcicpO1xuICAkKCcjbnVtLXNjaGVkdWxlcycpLnRleHQoc2NoZWR1bGVzLmxlbmd0aCk7XG4gIGlmIChzY2hlZHVsZXMubGVuZ3RoID09IDAgfHxcbiAgICAgIChzY2hlZHVsZXMubGVuZ3RoID09IDEgJiYgc2NoZWR1bGVzWzBdLmV2ZW50cy5sZW5ndGggPT0gMCkpIHtcbiAgICBkaXZzLmhpZGUoKTtcbiAgICAkKCcjbm8tc2NoZWR1bGVzJykuc2hvdygpO1xuICB9IGVsc2Uge1xuICAgIGRpdnMuc2hvdygpO1xuICAgIGdvVG9TY2hlZHVsZSgwKTtcbiAgfVxufVxuXG4vKipcbiAqIEluY3JlbWVudCB0aGUgY3VycmVudCBkaXNwbGF5ZWQgc2NoZWR1bGVcbiAqL1xuZnVuY3Rpb24gbmV4dFNjaGVkdWxlKCkge1xuICBnb1RvU2NoZWR1bGUoY3VycmVudFNjaGVkdWxlICsgMSk7XG59XG4od2luZG93IGFzIGFueSkubmV4dFNjaGVkdWxlID0gbmV4dFNjaGVkdWxlO1xuXG4vKipcbiAqIERlY3JlbWVudCB0aGUgY3VycmVudCBkaXNwbGF5ZWQgc2NoZWR1bGVcbiAqL1xuZnVuY3Rpb24gcHJldlNjaGVkdWxlKCkge1xuICBnb1RvU2NoZWR1bGUoY3VycmVudFNjaGVkdWxlIC0gMSk7XG59XG4od2luZG93IGFzIGFueSkucHJldlNjaGVkdWxlID0gcHJldlNjaGVkdWxlO1xuXG5jb25zdCBkYXlOYW1lcyA9IFtcbiAgJ1N1bmRheScsXG4gICdNb25kYXknLFxuICAnVHVlc2RheScsXG4gICdXZWRuZXNkYXknLFxuICAnVGh1cnNkYXknLFxuICAnRnJpZGF5JyxcbiAgJ1NhdHVyZGF5Jyxcbl07XG5cbi8vIENvbG9ycyBhcmUgdGFrZW4gZnJvbSB0aGlzIHBhZ2UsIGJ1dCByZW9yZGVyZWQgdG8gbWF4aW1pemUgY29udHJhc3Q6XG4vLyBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy80LjEvZ2V0dGluZy1zdGFydGVkL3RoZW1pbmcvXG5jb25zdCBjb3Vyc2VDb2xvcnMgPSBbXG4gIFsnIzAwN2JmZicsICcjZmZmJ10sICAvLyBibHVlXG4gIFsnI2U4M2U4YycsICcjZmZmJ10sICAvLyBwaW5rXG4gIFsnI2ZmYzEwNycsICcjMDAwJ10sICAvLyB5ZWxsb3dcbiAgWycjNjYxMGYyJywgJyNmZmYnXSwgIC8vIGluZGlnb1xuICBbJyNkYzM1NDUnLCAnI2ZmZiddLCAgLy8gcmVkXG4gIFsnIzI4YTc0NScsICcjZmZmJ10sICAvLyBncmVlblxuICBbJyM2ZjQyYzEnLCAnI2ZmZiddLCAgLy8gcHVycGxlXG4gIFsnI2ZkN2UxNCcsICcjMDAwJ10sICAvLyBvcmFuZ2VcbiAgWycjMjBjOTk3JywgJyNmZmYnXSwgIC8vIHRlYWxcbiAgWycjMTdhMmI4JywgJyNmZmYnXSwgIC8vIGN5YW5cbiAgWycjNmM3NTdkJywgJyNmZmYnXSwgIC8vIGdyYXlcbiAgWycjMzQzYTQwJywgJyNmZmYnXSwgIC8vIGRhcmstZ3JheVxuXTtcblxuLyoqXG4gKiBHZXQgYXBwcm9wcmlhdGUgY29sb3JzIGZvciBjb3Vyc2VzXG4gKi9cbmZ1bmN0aW9uIGdldENvdXJzZUNvbG9yTWFwKGNvdXJzZXM6IFNldDxDb3Vyc2U+KTogTWFwPG51bWJlciwgc3RyaW5nW10+IHtcbiAgbGV0IG51bWJlcnMgPSBBcnJheS5mcm9tKGNvdXJzZXMudmFsdWVzKCkpLm1hcChjID0+IGMuaWQpLnNvcnQoKTtcblxuICAvLyAwIGNvdXJzZSBJRCBpcyBmb3IgY3VzdG9tIGV2ZW50c1xuICBudW1iZXJzLnB1c2goMCk7XG5cbiAgbGV0IG51bXNBbmRDb2xvcnMgPVxuICAgICAgbnVtYmVycy5tYXAoKG51bSwgaSkgPT4gW251bSwgY291cnNlQ29sb3JzW2ldXSkgYXMgW251bWJlciwgc3RyaW5nW11dW107XG5cbiAgcmV0dXJuIG5ldyBNYXAobnVtc0FuZENvbG9ycyk7XG59XG5cbi8qKlxuICogRGlzcGxheSBzY2hlZHVsZSBpLCBtb2R1bG8gdGhlIHBvc3NpYmxlIHJhbmdlIDAtKG51bVNjaGVkdWxlcyAtIDEpXG4gKi9cbmZ1bmN0aW9uIGdvVG9TY2hlZHVsZShpOiBudW1iZXIpIHtcbiAgbGV0IG1heCA9IHBvc3NpYmxlU2NoZWR1bGVzLmxlbmd0aDtcbiAgaSA9IChpICsgbWF4KSAlIG1heDtcbiAgY3VycmVudFNjaGVkdWxlID0gaTtcbiAgJCgnI2N1cnJlbnQtc2NoZWR1bGUtaWQnKS50ZXh0KGkgKyAxKTtcbiAgbGV0IHNjaGVkdWxlID0gcG9zc2libGVTY2hlZHVsZXNbaV07XG5cbiAgd3JpdGVTY2hlZHVsZUNvbnRlbnRzKCQoJyNzY2hlZHVsZS1jb250ZW50cycpLCBzY2hlZHVsZSk7XG4gIHJlbmRlclNjaGVkdWxlKFxuICAgICAgJCgnI3JlbmRlcmVkLXNjaGVkdWxlJylbMF0sIHNjaGVkdWxlLCBnZXRDb3Vyc2VDb2xvck1hcChzZWxlY3RlZENvdXJzZXMpKTtcbn1cblxubGV0IHNvcnRlZEJ5UmF0aW5nID0gJyc7XG5cbmxldCBzb3J0ZWRCeVJhdGluZ0FzYyA9IHRydWU7XG5cbi8vIFRPRE8obHV0emt5KTogYWxsUmF0aW5ncyBicmVha3MgdHlwZXNjcmlwdCB0eXBlIGNoZWNrcyBhbmQgZm9yY2VzIHVzIHRvXG4vLyB1c2UgYSBsb3Qgb2YgdHMtaWdub3JlIGNvbW1lbnRzLlxuY29uc3QgYWxsUmF0aW5ncyA9IHtcbiAgZWFybGllc3RTdGFydDoge1xuICAgIG5hbWU6ICdFYXJsaWVzdCBzdGFydCcsXG4gICAgZXhwbGFuYXRpb246ICdIb3VyIGF0IHdoaWNoIHRoZSBlYXJsaWVzdCBjbGFzcyBvZiB0aGUgd2VlayBzdGFydCcsXG4gICAgYmFkZ2VUZXh0RnVuYzogKHM6IG51bWJlcikgPT4gYEVhcmxpZXN0IHN0YXJ0OiAke3N9YCxcbiAgfSxcbiAgbGF0ZXN0RmluaXNoOiB7XG4gICAgbmFtZTogJ0xhdGVzdCBmaW5pc2gnLFxuICAgIGV4cGxhbmF0aW9uOiAnSG91ciBhdCB3aGljaCB0aGUgbGF0ZXN0IGNsYXNzIG9mIHRoZSB3ZWVrIGZpbmlzaGVzJyxcbiAgICBiYWRnZVRleHRGdW5jOiAoczogbnVtYmVyKSA9PiBgTGF0ZXN0IGZpbmlzaDogJHtzfWAsXG4gIH0sXG4gIG51bVJ1bnM6IHtcbiAgICBuYW1lOiAnTnVtYmVyIG9mIHJ1bnMnLFxuICAgIGV4cGxhbmF0aW9uOiAnTnVtYmVyIG9mIGFkamFjZW50IGNsYXNzZXMgaW4gZGlmZmVyZW50IGJ1aWxkaW5ncycsXG4gICAgYmFkZ2VUZXh0RnVuYzogKHM6IG51bWJlcikgPT4gYCR7c30gcnVuc2AsXG4gIH0sXG4gIGZyZWVEYXlzOiB7XG4gICAgbmFtZTogJ0ZyZWUgZGF5cycsXG4gICAgZXhwbGFuYXRpb246ICdOdW1iZXIgb2YgZGF5cyB3aXRoIG5vIGNsYXNzZXMnLFxuICAgIGJhZGdlVGV4dEZ1bmM6IChzOiBudW1iZXIpID0+IGAke3N9IGZyZWUgZGF5c2AsXG4gIH0sXG59O1xuXG4vKipcbiAqIFNvcnQgY3VycmVudCBzY2hlZHVsZSBieSByYXRpbmdcbiAqL1xuZnVuY3Rpb24gc29ydEJ5UmF0aW5nKHJhdGluZzogc3RyaW5nKSB7XG4gIGlmIChzb3J0ZWRCeVJhdGluZyA9PSByYXRpbmcpIHtcbiAgICBzb3J0ZWRCeVJhdGluZ0FzYyA9ICFzb3J0ZWRCeVJhdGluZ0FzYztcbiAgfVxuXG4gIHNvcnRlZEJ5UmF0aW5nID0gcmF0aW5nO1xuICBwb3NzaWJsZVNjaGVkdWxlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgcmV0dXJuIChzb3J0ZWRCeVJhdGluZ0FzYyA/IDEgOiAtMSkgKiAoYS5yYXRpbmdbcmF0aW5nXSAtIGIucmF0aW5nW3JhdGluZ10pO1xuICB9KTtcblxuICBnb1RvU2NoZWR1bGUoMCk7XG4gIE9iamVjdC5rZXlzKGFsbFJhdGluZ3MpLmZvckVhY2goZnVuY3Rpb24ocmF0aW5nKSB7XG4gICAgJChgI3JhdGluZy1iYWRnZS0ke3JhdGluZ31gKVxuICAgICAgICAucmVwbGFjZVdpdGgoZ2V0UmF0aW5nQmFkZ2UocmF0aW5nLCBwb3NzaWJsZVNjaGVkdWxlc1swXSkpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgYSBiYWRnZSBmb3IgdGhlIGdpdmVuIHJhdGluZyBhY2NvcmRpbmcgdG8gdGhlIHNjaGVkdWxlIHR5cGVcbiAqL1xuZnVuY3Rpb24gZ2V0UmF0aW5nQmFkZ2UocmF0aW5nOiBzdHJpbmcsIHNjaGVkdWxlOiBTY2hlZHVsZSk6IEpRdWVyeSB7XG4gIGxldCByZXN1bHQgPSAkKCc8YT4nLCB7XG4gICAgY2xhc3M6ICdiYWRnZSBiYWRnZS1pbmZvJyxcbiAgICBpZDogYHJhdGluZy1iYWRnZS0ke3JhdGluZ31gLFxuICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICB0ZXh0OiBhbGxSYXRpbmdzW3JhdGluZ10uYmFkZ2VUZXh0RnVuYyhzY2hlZHVsZS5yYXRpbmdbcmF0aW5nXSksXG4gICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgIHRpdGxlOiBhbGxSYXRpbmdzW3JhdGluZ10uZXhwbGFuYXRpb24sXG4gICAgaHJlZjogJyMvJyxcbiAgICBjbGljazogZnVuY3Rpb24oKSB7XG4gICAgICBzb3J0QnlSYXRpbmcocmF0aW5nKTtcbiAgICB9LFxuICB9KTtcblxuICBpZiAoc29ydGVkQnlSYXRpbmcgPT0gcmF0aW5nKSB7XG4gICAgbGV0IGljb24gPSBzb3J0ZWRCeVJhdGluZ0FzYyA/ICdmYS1zb3J0LXVwJyA6ICdmYS1zb3J0LWRvd24nO1xuICAgIHJlc3VsdC5hcHBlbmQoYCA8aSBjbGFzcz1cImZhcyAke2ljb259XCI+PC9pPmApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBXcml0ZSB0aGUgc2NoZWR1bGUgY29udGVudHMgdG8gdGFyZ2V0XG4gKi9cbmZ1bmN0aW9uIHdyaXRlU2NoZWR1bGVDb250ZW50cyh0YXJnZXQ6IEpRdWVyeSwgc2NoZWR1bGU6IFNjaGVkdWxlKSB7XG4gIHRhcmdldC5lbXB0eSgpO1xuXG4gIE9iamVjdC5rZXlzKGFsbFJhdGluZ3MpXG4gICAgICAubWFwKHJhdGluZyA9PiBnZXRSYXRpbmdCYWRnZShyYXRpbmcsIHNjaGVkdWxlKSlcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGJhZGdlKSB7XG4gICAgICAgIHRhcmdldC5hcHBlbmQoYmFkZ2UpLmFwcGVuZCgnICcpO1xuICAgICAgfSk7XG5cbiAgbGV0IHVsID0gJCgnPHVsPicsIHtjbGFzczogJ2xpc3QtZ3JvdXAnfSk7XG4gIHRhcmdldC5hcHBlbmQodWwpO1xuXG4gIGJ5RGF5KHNjaGVkdWxlKS5mb3JFYWNoKGZ1bmN0aW9uKGRheUV2ZW50cykge1xuICAgIGxldCBkYXlFbnRyeSA9ICQoJzxsaT4nLCB7XG4gICAgICBjbGFzczogJ2xpc3QtZ3JvdXAtaXRlbScsXG4gICAgICBjc3M6IHsncGFkZGluZy10b3AnOiAnMnB4JywgJ3BhZGRpbmctYm90dG9tJzogJzJweCd9LFxuICAgICAgaHRtbDogJCgnPHNtYWxsPicsIHtcbiAgICAgICAgY2xhc3M6ICdmb250LXdlaWdodC1ib2xkJyxcbiAgICAgICAgdGV4dDogZGF5TmFtZXNbZGF5RXZlbnRzWzBdLmRheV0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICB1bC5hcHBlbmQoZGF5RW50cnkpO1xuICAgIC8vIGxldCBldmVudExpc3QgPSAkKCc8dWw+Jyk7XG4gICAgLy8gICAgZGF5RW50cnkuYXBwZW5kKGV2ZW50TGlzdCk7XG4gICAgZGF5RXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgbGV0IGV2ZW50RW50cnkgPSAkKCc8bGk+Jywge1xuICAgICAgICBjbGFzczogJ2xpc3QtZ3JvdXAtaXRlbScsXG4gICAgICB9KTtcbiAgICAgIGxldCBzdGFydFRpbWUgPSBtaW51dGVzVG9UaW1lKGUuc3RhcnRNaW51dGUpO1xuICAgICAgbGV0IGxvY2F0aW9uID0gZS5sb2NhdGlvbiB8fCAnW3Vua25vd25dJztcbiAgICAgIGxldCBlbmRUaW1lID0gbWludXRlc1RvVGltZShlLmVuZE1pbnV0ZSk7XG4gICAgICBsZXQgdGVhY2hlcnMgPSBlLmdyb3VwLnRlYWNoZXJzLmpvaW4oJywnKSB8fCAnW3Vua25vd25dJztcbiAgICAgIGV2ZW50RW50cnkuaHRtbChgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW5cIj5cbiAgICAgICAgICAgPHNtYWxsIGNsYXNzPVwidGV4dC1tdXRlZFwiPlxuICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFyIGZhLWNsb2NrXCI+PC9pPlxuICAgICAgICAgICAgICR7c3RhcnRUaW1lfS0ke2VuZFRpbWV9XG4gICAgICAgICAgIDwvc21hbGw+XG4gICAgICAgICAgIDxzbWFsbD5cbiAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1tYXAtbWFya2VyXCI+PC9pPlxuICAgICAgICAgICAgIDxzcGFuIGRpcj1cInJ0bFwiPiR7bG9jYXRpb259PC9zcGFuPlxuICAgICAgICAgICA8L3NtYWxsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBkaXI9XCJydGxcIj4ke2Rpc3BsYXlOYW1lKGUuZ3JvdXApfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgPHNtYWxsPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hhbGtib2FyZC10ZWFjaGVyXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gZGlyPVwicnRsXCI+JHt0ZWFjaGVyc308L3NwYW4+XG4gICAgICAgICAgPC9zbWFsbD5cbiAgICAgICAgICA8c21hbGwgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+XG4gICAgICAgICAgICAke2Zvcm1hdENvdXJzZUlkKGUuZ3JvdXAuY291cnNlLmlkKX0sIGdyb3VwICR7ZS5ncm91cC5pZH1cbiAgICAgICAgICA8L3NtYWxsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYCk7XG4gICAgICB1bC5hcHBlbmQoZXZlbnRFbnRyeSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEdldCBldmVudHMgZm9yIHNjaGVkdWxlIHNwbGl0IGludG8gcGVyLWRheSBhcnJheXNcbiAqXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBhcnJheXMgb2YgZXZlbnRzLCB3aXRoIGVudHJ5IGlzIGFuIGFycmF5IG9mIGV2ZW50c1xuICogICAgICAgICAgd2l0aCB0aGUgc2FtZSBkYXksIHNvcnRlZCBhc2NlbmRpbmcuXG4gKi9cbmZ1bmN0aW9uIGJ5RGF5KHNjaGVkdWxlOiBTY2hlZHVsZSk6IEFjYWRlbWljRXZlbnRbXVtdIHtcbiAgbGV0IGV2ZW50cyA9IHNjaGVkdWxlLmV2ZW50cy5zbGljZSgpO1xuICBsZXQgcmVzdWx0OiBBY2FkZW1pY0V2ZW50W11bXSA9IFtbXV07XG5cbiAgc29ydEV2ZW50cyhldmVudHMpO1xuXG4gIGxldCBjdXJyZW50RGF5ID0gZXZlbnRzWzBdLmRheTtcblxuICBldmVudHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUuZGF5ICE9IGN1cnJlbnREYXkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKFtdKTtcbiAgICAgIGN1cnJlbnREYXkgPSBlLmRheTtcbiAgICB9XG4gICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXS5wdXNoKGUpO1xuICB9KTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZpbmQgYSBjb3Vyc2UgYnkgaXRzIElEXG4gKi9cbmZ1bmN0aW9uIGdldENvdXJzZUJ5SUQoaWQ6IG51bWJlcik6IENvdXJzZSB7XG4gIHJldHVybiBjdXJyZW50Q2F0YWxvZ0J5Q291cnNlSUQuZ2V0KGlkKTtcbn1cblxuLyoqXG4gKiBHZXRzIG5pY2tuYW1lcyBvciBhYmJyZXZpYXRpb25zIGZvciBhIGNvdXJzZVxuICovXG5mdW5jdGlvbiBnZXROaWNrbmFtZXMoY291cnNlOiBDb3Vyc2UpOiBzdHJpbmcge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgaWYgKGNvdXJzZS5uYW1lLmluY2x1ZGVzKCfXl9ep15HXldefINeT15nXpNeo16DXpteZ15DXnNeZINeV15DXmdeg15jXkteo15zXmScpKSB7XG4gICAgcmVzdWx0LnB1c2goJ9eX15PXldeQJywgJ9eX15PXlVwi15AnKTtcbiAgfVxuICBpZiAoY291cnNlLm5hbWUuaW5jbHVkZXMoJ9ee15PXoteZINeU157Xl9ep15EnKSkge1xuICAgIHJlc3VsdC5wdXNoKCfXnteT157XlycsICfXnteT155cIteXJyk7XG4gIH1cbiAgaWYgKGNvdXJzZS5uYW1lLmluY2x1ZGVzKCfXpNeZ16HXmden15QnKSkge1xuICAgIHJlc3VsdC5wdXNoKCfXpNeZ15bXmden15QnKTtcbiAgfVxuICBpZiAoY291cnNlLm5hbWUuaW5jbHVkZXMoJ9eQ16DXnNeZ15bXlCDXoNeV157XqNeZ16onKSkge1xuICAgIHJlc3VsdC5wdXNoKCfXoNeV157XqNeZ15bXlCcpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogU2V0IHVwIHRoZSBjb3Vyc2Ugc2VsZWN0aW9uIHNlbGVjdGl6ZS5qcyBib3hcbiAqL1xuZnVuY3Rpb24gY291cnNlc1NlbGVjdGl6ZVNldHVwKCkge1xuICBsZXQgc2VsZWN0Qm94ID0gJCgnI2NvdXJzZXMtc2VsZWN0aXplJyk7XG5cbiAgLy8gR2V0dGluZyB0aGUgdHlwZXMgcmlnaHQgZm9yIHNlbGVjdGl6ZSBpcyBkaWZmaWN1bHQgOi9cblxuICBsZXQgb3B0czogYW55ID0gW107XG4gIGxldCBvcHRncm91cHM6IGFueSA9IFtdO1xuXG4gIGN1cnJlbnRDYXRhbG9nLmZvckVhY2goZnVuY3Rpb24oZmFjdWx0eSkge1xuICAgIG9wdGdyb3Vwcy5wdXNoKHtsYWJlbDogZmFjdWx0eS5uYW1lLCB2YWx1ZTogZmFjdWx0eS5uYW1lfSk7XG4gICAgZmFjdWx0eS5jb3Vyc2VzLmZvckVhY2goZnVuY3Rpb24oY291cnNlKSB7XG4gICAgICBvcHRzLnB1c2goe1xuICAgICAgICBvcHRncm91cDogZmFjdWx0eS5uYW1lLFxuICAgICAgICB2YWx1ZTogY291cnNlLmlkLFxuICAgICAgICB0ZXh0OiBgJHtmb3JtYXRDb3Vyc2VJZChjb3Vyc2UuaWQpfSAtICR7Y291cnNlLm5hbWV9YCxcbiAgICAgICAgbmlja25hbWVzOiBnZXROaWNrbmFtZXMoY291cnNlKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBzZWxlY3RCb3guc2VsZWN0aXplKHtcbiAgICBvcHRpb25zOiBvcHRzLFxuICAgIG9wdGdyb3Vwczogb3B0Z3JvdXBzLFxuICAgIHNlYXJjaEZpZWxkOiBbJ3RleHQnLCAnbmlja25hbWVzJ10sXG4gICAgb25JdGVtQWRkOiBmdW5jdGlvbihjb3Vyc2VJRCkge1xuICAgICAgaWYgKGNvdXJzZUlEID09ICcnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBjb3Vyc2UgPSBnZXRDb3Vyc2VCeUlEKE51bWJlcihjb3Vyc2VJRCkpO1xuICAgICAgYWRkU2VsZWN0ZWRDb3Vyc2UoY291cnNlKTtcbiAgICAgIHNlbGVjdEJveFswXS5zZWxlY3RpemUuY2xlYXIoKTtcbiAgICB9LFxuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgYSBudWxsIHJhdGluZ1xuICovXG5mdW5jdGlvbiBnZXROdWxsUmF0aW5nKCk6IFNjaGVkdWxlUmF0aW5nIHtcbiAgcmV0dXJuIHtcbiAgICBlYXJsaWVzdFN0YXJ0OiBudWxsLFxuICAgIGZyZWVEYXlzOiBudWxsLFxuICAgIGxhdGVzdEZpbmlzaDogbnVsbCxcbiAgICBudW1SdW5zOiBudWxsLFxuICB9O1xufVxuXG4vKipcbiAqIExvYWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2VcbiAqXG4gKiBAcGFyYW0gcyAtIEpTT04gZm9ybSBvZiBzZXR0aW5nc1xuICovXG5mdW5jdGlvbiBsb2FkU2V0dGluZ3Moczogc3RyaW5nKTogU2V0dGluZ3Mge1xuICBsZXQgcmVzdWx0OiBTZXR0aW5ncyA9IHtcbiAgICBjYXRhbG9nVXJsOiBkZWZhdWx0Q2F0YWxvZ1VybCxcbiAgICBzZWxlY3RlZENvdXJzZXM6IFtdLFxuICAgIGZvcmJpZGRlbkdyb3VwczogW10sXG4gICAgY3VzdG9tRXZlbnRzOiAnJyxcbiAgICBmaWx0ZXJTZXR0aW5nczoge1xuICAgICAgZm9yYmlkZGVuR3JvdXBzOiBbXSxcbiAgICAgIG5vQ29sbGlzaW9uczogdHJ1ZSxcbiAgICAgIHJhdGluZ01pbjogZ2V0TnVsbFJhdGluZygpLFxuICAgICAgcmF0aW5nTWF4OiBnZXROdWxsUmF0aW5nKCksXG4gICAgfSxcbiAgfTtcblxuICBpZiAocyAhPSAnJykge1xuICAgIHJlc3VsdCA9ICQuZXh0ZW5kKHRydWUgLyogZGVlcCAqLywgcmVzdWx0LCBKU09OLnBhcnNlKHMpIGFzIFNldHRpbmdzKSBhc1xuICAgICAgICBTZXR0aW5ncztcbiAgfVxuXG4gIGlmIChtYWluRGVidWdMb2dnaW5nKSB7XG4gICAgY29uc29sZS5pbmZvKCdMb2FkZWQgc2V0dGluZ3M6JywgcmVzdWx0KTtcbiAgfVxuXG4gICQoJyNjYXRhbG9nLXVybCcpLnZhbChyZXN1bHQuY2F0YWxvZ1VybCk7XG4gICQoJyNjdXN0b20tZXZlbnRzLXRleHRhcmVhJykudmFsKHJlc3VsdC5jdXN0b21FdmVudHMpO1xuXG4gIHtcbiAgICBsZXQgZnMgPSByZXN1bHQuZmlsdGVyU2V0dGluZ3M7XG4gICAgc2V0Q2hlY2tib3hWYWx1ZUJ5SWQoJ2ZpbHRlci5ub0NvbGxpc2lvbnMnLCBmcy5ub0NvbGxpc2lvbnMpO1xuXG4gICAgT2JqZWN0LmtleXMoYWxsUmF0aW5ncykuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgICAkKGAjcmF0aW5nLSR7cn0tbWluYCkudmFsKGZzLnJhdGluZ01pbltyXSk7XG4gICAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgICAkKGAjcmF0aW5nLSR7cn0tbWF4YCkudmFsKGZzLnJhdGluZ01heFtyXSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZpZ3VyZSBvdXQgdGhlIHRvdGFsIG51bWJlciBvZiBzY2hlZHVsZXMgcG9zc2libGUgZm9yIHRoZSBzZXQgb2YgY291cnNlcyxcbiAqIGRpc3JlZ2FyZGluZyBmaWx0ZXJzLlxuICovXG5mdW5jdGlvbiB0b3RhbFBvc3NpYmxlU2NoZWR1bGVzKGNvdXJzZXM6IFNldDxDb3Vyc2U+KTogbnVtYmVyIHtcbiAgbGV0IGsgPSBBcnJheS5mcm9tKGNvdXJzZXMudmFsdWVzKCkpO1xuXG4gIHJldHVybiBrXG4gICAgICAubWFwKFxuICAgICAgICAgIGNvdXJzZSA9PiBncm91cHNCeVR5cGUoY291cnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh0ID0+IHQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSAqIGIsIDEpKVxuICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSAqIGIsIDEpO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBsaW1pdC1ieS1yYXRpbmdzIGZvcm0gZm9yIHRoZSBzZXR0aW5ncyBzdWJwYWdlXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUmF0aW5nc0xpbWl0Rm9ybSgpIHtcbiAgbGV0IGZvcm0gPSAkKCcjcmF0aW5nLWxpbWl0cy1mb3JtJyk7XG4gIE9iamVjdC5rZXlzKGFsbFJhdGluZ3MpLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgIGxldCByb3cgPSAkKCc8ZGl2PicsIHtjbGFzczogJ3Jvdyd9KTtcbiAgICBmb3JtLmFwcGVuZChyb3cpO1xuICAgIHJvdy5hcHBlbmQoJCgnPGRpdj4nLCB7XG4gICAgICBjbGFzczogJ2NvbCBjb2wtZm9ybS1sYWJlbCcsXG4gICAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgICB0ZXh0OiBhbGxSYXRpbmdzW3JdLm5hbWUsXG4gICAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgICB0aXRsZTogYWxsUmF0aW5nc1tyXS5leHBsYW5hdGlvbixcbiAgICB9KSk7XG4gICAgcm93LmFwcGVuZCgkKCc8ZGl2PicsIHtcbiAgICAgIGNsYXNzOiAnY29sJyxcbiAgICAgIGh0bWw6ICQoJzxpbnB1dD4nLCB7XG4gICAgICAgIGlkOiBgcmF0aW5nLSR7cn0tbWluYCxcbiAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgIGNsYXNzOiAnZm9ybS1jb250cm9sJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICct4oieJyxcbiAgICAgICAgY2hhbmdlOiBzYXZlU2V0dGluZ3MsXG4gICAgICB9KSxcbiAgICB9KSk7XG4gICAgcm93LmFwcGVuZCgkKCc8ZGl2PicsIHtcbiAgICAgIGNsYXNzOiAnY29sJyxcbiAgICAgIGh0bWw6ICQoJzxpbnB1dD4nLCB7XG4gICAgICAgIGlkOiBgcmF0aW5nLSR7cn0tbWF4YCxcbiAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgIGNsYXNzOiAnZm9ybS1jb250cm9sJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICfiiJ4nLFxuICAgICAgICBjaGFuZ2U6IHNhdmVTZXR0aW5ncyxcbiAgICAgIH0pLFxuICAgIH0pKTtcbiAgfSk7XG59XG5cbmJ1aWxkUmF0aW5nc0xpbWl0Rm9ybSgpO1xuXG5sZXQgc2V0dGluZ3MgPSBsb2FkU2V0dGluZ3Mod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0dGltZTNfc2V0dGluZ3MnKSk7XG5cbmZvcmJpZGRlbkdyb3VwcyA9IG5ldyBTZXQoc2V0dGluZ3MuZmlsdGVyU2V0dGluZ3MuZm9yYmlkZGVuR3JvdXBzKTtcbnVwZGF0ZUZvcmJpZGRlbkdyb3VwcygpO1xuXG5sb2FkQ2F0YWxvZyhzZXR0aW5ncy5jYXRhbG9nVXJsKVxuICAgIC50aGVuKFxuICAgICAgICBmdW5jdGlvbihjYXRhbG9nKSB7XG4gICAgICAgICAgaWYgKG1haW5EZWJ1Z0xvZ2dpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkZWQgY2F0YWxvZzonLCBjYXRhbG9nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudENhdGFsb2cgPSBjYXRhbG9nO1xuICAgICAgICAgIGN1cnJlbnRDYXRhbG9nQnlDb3Vyc2VJRCA9IG5ldyBNYXAoKTtcblxuICAgICAgICAgIGN1cnJlbnRDYXRhbG9nLmZvckVhY2goZnVuY3Rpb24oZmFjdWx0eSkge1xuICAgICAgICAgICAgZmFjdWx0eS5jb3Vyc2VzLmZvckVhY2goZnVuY3Rpb24oY291cnNlKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRDYXRhbG9nQnlDb3Vyc2VJRC5zZXQoY291cnNlLmlkLCBjb3Vyc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB3cml0ZUNhdGFsb2dTZWxlY3RvcigpO1xuICAgICAgICAgIHNldHRpbmdzLnNlbGVjdGVkQ291cnNlcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhZGRTZWxlY3RlZENvdXJzZUJ5SUQoaWQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGFkZCBjb3Vyc2UgJHtpZH06YCwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvdXJzZXNTZWxlY3RpemVTZXR1cCgpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICQoJyNleGNlcHRpb24tb2NjdXJyZWQtY2F0YWxvZycpLnNob3coKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBjYXRhbG9nOicsIGVycm9yKTtcbiAgICAgICAgfSk7XG4iLCJpbXBvcnQge0FjYWRlbWljRXZlbnQsIFNjaGVkdWxlfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge2V2ZW50c0NvbGxpZGV9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7ZGlzcGxheU5hbWUsIG1pbnV0ZXNUb1RpbWV9IGZyb20gJy4vZm9ybWF0dGluZyc7XG5cbi8qKlxuICogTGF5ZXJlZCBldmVudHMgZm9yIHJlbmRlcmluZyBvbiBzY3JlZW5cbiAqXG4gKiBFeHBsYW5hdGlvbjogU3VwcG9zZSB5b3UgaGF2ZSBldmVudHMgQSwgQiwgQywgdGhhdCBjb2xsaWRlIGxpa2Ugc28gKHRpbWVcbiAqIGJlaW5nIGhvcml6b250YWwpOlxuICpcbiAqICAgIFtBQUFBQUFBXVxuICogW0JCQkJCQl1cbiAqICAgICAgICAgW0NDQ0NDQ11cbiAqXG4gKiBCZWNhdXNlIHRoZSBjb2xsaXNpb25zIGFyZSBBLUIgYW5kIEEtQyAoYnV0IG5ldmVyIEItQyksIHRoZXkgY2FuIGJlIGxhaWRcbiAqIG91dCwgZm9yIGV4YW1wbGUsIGxpa2Ugc286XG4gKlxuICogW0JCQkJCQl1bQ0NDQ0NDXVxuICogICAgW0FBQUFBQUFdXG4gKlxuICogSW4gdGhpcyBjYXNlLCB0aGUgbnVtTGF5ZXJzIGZvciBhbGwgZXZlbnRzIGlzIDIsIEIgYW5kIEMgYXJlIG9uIGxheWVyIDAsIGFuZFxuICogQSBpcyBvbiBsYXllciAxLiBJZiBDIHdlcmUgdG8gc3RhcnQgYSBiaXQgZWFybGllciwgdGhvdWdoLCB0aHJlZSBsYXllcnMgd291bGRcbiAqIGJlIG5lZWRlZDpcbiAqXG4gKiBbQkJCQkJCXVxuICogICAgICBbQ0NDQ0NDXVxuICogICAgW0FBQUFBQUFdXG4gKlxuICogSW4gdGhpcyBjYXNlIHRoZSBudW1MYXllcnMgZm9yIGFsbCBldmVudHMgaXMgMywgYW5kIEIsIEMsIGFuZCBBIGFyZSBvbiBsYXllcnNcbiAqIDAsIDEsIGFuZCAyIHJlc3BlY3RpdmVseS5cbiAqL1xuY2xhc3MgTGF5ZXJlZEV2ZW50IHtcbiAgZXZlbnQ6IEFjYWRlbWljRXZlbnQ7XG4gIGxheWVyOiBudW1iZXI7XG4gIG51bUxheWVyczogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNvcnQgZXZlbnRzIGludG8gYnVja2V0cyBvZiBjb2xsaWRpbmcgZXZlbnRzLlxuICpcbiAqIFNoYW1lbGVzc2x5IGxpZnRlZCBmcm9tIGJvYXpnIGF0XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbHV0emt5L3R0aW1lL2Jsb2IvbWFzdGVyL2xpYi90dGltZS90Y2FsL3RjYWwucmJcbiAqXG4gKiBUT0RPKGx1dHpreSk6IFRoaXMgaXMgZXhwb3J0ZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMgb25seS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dExheWVyZWRFdmVudHMoZXZlbnRzOiBBY2FkZW1pY0V2ZW50W10pOiBMYXllcmVkRXZlbnRbXSB7XG4gIGxldCByZXN1bHQ6IExheWVyZWRFdmVudFtdID0gW107XG5cbiAgbGV0IHJlbWFpbmluZyA9IGV2ZW50cy5zbGljZSgpO1xuXG4gIHdoaWxlIChyZW1haW5pbmcubGVuZ3RoID4gMCkge1xuICAgIGxldCBzZWxlY3RlZCA9IG5ldyBTZXQoW3JlbWFpbmluZ1swXV0pO1xuICAgIGxldCBzZWxlY3RlZE1vcmVFdmVudHMgPSB0cnVlO1xuXG4gICAgd2hpbGUgKHNlbGVjdGVkTW9yZUV2ZW50cykge1xuICAgICAgc2VsZWN0ZWRNb3JlRXZlbnRzID0gZmFsc2U7XG4gICAgICBsZXQgb2xkU2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgIHNlbGVjdGVkID0gbmV3IFNldCgpO1xuICAgICAgb2xkU2VsZWN0ZWQuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgIHNlbGVjdGVkLmFkZChzKTtcbiAgICAgICAgcmVtYWluaW5nLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgICAgIGlmIChldmVudHNDb2xsaWRlKFtyLCBzXSkpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkLmFkZChyKTtcbiAgICAgICAgICAgIHNlbGVjdGVkTW9yZUV2ZW50cyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZW1haW5pbmcgPSByZW1haW5pbmcuZmlsdGVyKHggPT4gIXNlbGVjdGVkLmhhcyh4KSk7XG4gICAgfVxuXG4gICAgbGV0IGxheWVyczogQWNhZGVtaWNFdmVudFtdW10gPSBbXTtcblxuICAgIHNlbGVjdGVkLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgbGV0IGFzc2lnbmVkVG9MYXllciA9IGZhbHNlO1xuICAgICAgbGF5ZXJzLnNvbWUoZnVuY3Rpb24obGF5ZXIsIF8pIHtcbiAgICAgICAgaWYgKCFldmVudHNDb2xsaWRlKGxheWVyLmNvbmNhdChbc10pKSkge1xuICAgICAgICAgIGFzc2lnbmVkVG9MYXllciA9IHRydWU7XG4gICAgICAgICAgbGF5ZXIucHVzaChzKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFhc3NpZ25lZFRvTGF5ZXIpIHtcbiAgICAgICAgLy8gTm8gbGF5ZXIgaGFzIGJlZW4gYXNzaWduZWQgeWV0LCBzbyBhbGwgbGF5ZXJzIG11c3QgY29sbGlkZSB3aXRoXG4gICAgICAgIC8vIHMuIENyZWF0ZSBhIG5ldyBvbmUuXG4gICAgICAgIGxheWVycy5wdXNoKFtzXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsYXllcnMuZm9yRWFjaChmdW5jdGlvbihsLCBpKSB7XG4gICAgICBsLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgZXZlbnQ6IHMsXG4gICAgICAgICAgbGF5ZXI6IGksXG4gICAgICAgICAgbnVtTGF5ZXJzOiBsYXllcnMubGVuZ3RoLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHN0YXJ0IHRpbWUgb2YgdGhlIGVhcmxpZXN0IGV2ZW50IGluIHRoZSBzY2hlZHVsZVxuICovXG5mdW5jdGlvbiBnZXRFYXJsaWVzdChzY2hlZHVsZTogU2NoZWR1bGUpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5taW4oLi4uc2NoZWR1bGUuZXZlbnRzLm1hcCh4ID0+IHguc3RhcnRNaW51dGUpKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGVuZCB0aW1lIG9mIHRoZSBsYXRlc3QgZXZlbnQgaW4gdGhlIHNjaGVkdWxlXG4gKi9cbmZ1bmN0aW9uIGdldExhdGVzdChzY2hlZHVsZTogU2NoZWR1bGUpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5tYXgoLi4uc2NoZWR1bGUuZXZlbnRzLm1hcCh4ID0+IHguZW5kTWludXRlKSk7XG59XG5cbi8qKlxuICogUmVuZGVyIGEgc2NoZWR1bGUgdG8gdGFyZ2V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJTY2hlZHVsZShcbiAgICB0YXJnZXQ6IEhUTUxFbGVtZW50LCBzY2hlZHVsZTogU2NoZWR1bGUsXG4gICAgY291cnNlQ29sb3JzOiBNYXA8bnVtYmVyLCBzdHJpbmdbXT4pIHtcbiAgdGFyZ2V0LmlubmVySFRNTCA9ICcnO1xuXG4gIGxldCBlYXJsaWVzdCA9IGdldEVhcmxpZXN0KHNjaGVkdWxlKTtcbiAgbGV0IGxhdGVzdCA9IGdldExhdGVzdChzY2hlZHVsZSk7XG4gIGxldCBzY2FsZSA9IDEwMC4wIC8gKGxhdGVzdCAtIGVhcmxpZXN0KTtcblxuICBsZXQgbGF5ZXJlZEV2ZW50cyA9IGxheW91dExheWVyZWRFdmVudHMoc2NoZWR1bGUuZXZlbnRzKTtcblxuICBsYXllcmVkRXZlbnRzLmZvckVhY2goZnVuY3Rpb24obGUpIHtcbiAgICBsZXQgZXZlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZXQgZXZlbnQgPSBsZS5ldmVudDtcbiAgICBldmVudERpdi5jbGFzc05hbWUgPSAnZXZlbnQnO1xuICAgIGxldCBjb2xvcnMgPSBjb3Vyc2VDb2xvcnMuZ2V0KGV2ZW50Lmdyb3VwLmNvdXJzZS5pZCk7XG4gICAgZXZlbnREaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JzWzBdO1xuICAgIGV2ZW50RGl2LnN0eWxlLmNvbG9yID0gY29sb3JzWzFdO1xuICAgIHBvc2l0aW9uRWxlbWVudChcbiAgICAgICAgZXZlbnREaXYsICclJyxcbiAgICAgICAgLyogbGVmdCAgICovICgxMDAgLyA2LjApICogKDEgKyBldmVudC5kYXkgKyBsZS5sYXllciAvIGxlLm51bUxheWVycyksXG4gICAgICAgIC8qIHRvcCAgICAqLyBzY2FsZSAqIChldmVudC5zdGFydE1pbnV0ZSAtIGVhcmxpZXN0KSxcbiAgICAgICAgLyogd2lkdGggICovIDEwMCAvIDYuMCAvIGxlLm51bUxheWVycyxcbiAgICAgICAgLyogaGVpZ2h0ICovIHNjYWxlICogKGV2ZW50LmVuZE1pbnV0ZSAtIGV2ZW50LnN0YXJ0TWludXRlKSk7XG4gICAgYW5ub3RhdGVFdmVudChldmVudERpdiwgZXZlbnQpO1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChldmVudERpdik7XG4gIH0pO1xuXG4gIGFkZEdyaWRMaW5lcyh0YXJnZXQsIHNjaGVkdWxlKTtcbn1cblxuLyoqXG4gKiBBbm5vdGF0ZSB0aGUgZGl2IHdpdGggdGhlIGFjdHVhbHkgY29udGVudHMgb2YgdGhlIGV2ZW50XG4gKi9cbmZ1bmN0aW9uIGFubm90YXRlRXZlbnQodGFyZ2V0OiBIVE1MRWxlbWVudCwgZXZlbnQ6IEFjYWRlbWljRXZlbnQpIHtcbiAgdGFyZ2V0LmlubmVySFRNTCA9ICcnO1xuICBsZXQgY291cnNlTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgY291cnNlTmFtZS5jbGFzc05hbWUgPSAnY291cnNlLW5hbWUnO1xuICBjb3Vyc2VOYW1lLmlubmVyVGV4dCA9IGRpc3BsYXlOYW1lKGV2ZW50Lmdyb3VwKTtcbiAgdGFyZ2V0LmFwcGVuZENoaWxkKGNvdXJzZU5hbWUpO1xuXG4gIGxldCBldmVudFR5cGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGV2ZW50VHlwZS5jbGFzc05hbWUgPSAnZXZlbnQtdHlwZSc7XG4gIGV2ZW50VHlwZS5pbm5lclRleHQgPSBldmVudC5ncm91cC50eXBlO1xuICB0YXJnZXQuYXBwZW5kQ2hpbGQoZXZlbnRUeXBlKTtcblxuICBsZXQgbG9jYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbG9jYXRpb24uY2xhc3NOYW1lID0gJ2xvY2F0aW9uJztcbiAgbG9jYXRpb24uaW5uZXJUZXh0ID0gZXZlbnQubG9jYXRpb247XG4gIHRhcmdldC5hcHBlbmRDaGlsZChsb2NhdGlvbik7XG5cbiAgbGV0IGZvcmJpZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBmb3JiaWREaXYuY2xhc3NOYW1lID0gJ2ZvcmJpZCc7XG4gIGxldCBmb3JiaWRMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBmb3JiaWRMaW5rLmlubmVySFRNTCA9ICc8aSBjbGFzcz1cImZhcyBmYS1iYW5cIj48L2k+JztcbiAgZm9yYmlkTGluay5ocmVmID0gJyMvJztcbiAgZm9yYmlkTGluay50aXRsZSA9ICdGb3JiaWQgdGhpcyBncm91cCc7XG4gIGZvcmJpZExpbmsub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICQoZm9yYmlkTGluaykuZmFkZU91dCgxMDApLmZhZGVJbigxMDApO1xuICAgICh3aW5kb3cgYXMgYW55KS5hZGRGb3JiaWRkZW5Hcm91cChldmVudC5ncm91cCk7XG4gIH07XG4gIGZvcmJpZERpdi5hcHBlbmRDaGlsZChmb3JiaWRMaW5rKTtcbiAgdGFyZ2V0LmFwcGVuZENoaWxkKGZvcmJpZERpdik7XG59XG5cbmNvbnN0IGdyaWREZW5zaXR5ID0gMzA7XG5cbi8qKlxuICogUmVuZGVyIGdyaWQgbGluZXMgb24gdGFyZ2V0XG4gKi9cbmZ1bmN0aW9uIGFkZEdyaWRMaW5lcyh0YXJnZXQ6IEhUTUxFbGVtZW50LCBzY2hlZHVsZTogU2NoZWR1bGUpIHtcbiAgbGV0IGVhcmxpZXN0ID0gZ2V0RWFybGllc3Qoc2NoZWR1bGUpO1xuICBsZXQgbGF0ZXN0ID0gZ2V0TGF0ZXN0KHNjaGVkdWxlKTtcbiAgbGV0IHNjYWxlID0gMTAwLjAgLyAobGF0ZXN0IC0gZWFybGllc3QpO1xuXG4gIGxldCBmaXJzdEdyaWRMaW5lID0gTWF0aC5jZWlsKGVhcmxpZXN0IC8gZ3JpZERlbnNpdHkpICogZ3JpZERlbnNpdHk7XG4gIGxldCBsYXN0R3JpZExpbmUgPSBNYXRoLmZsb29yKGxhdGVzdCAvIGdyaWREZW5zaXR5KSAqIGdyaWREZW5zaXR5O1xuXG4gIGZvciAobGV0IHQgPSBmaXJzdEdyaWRMaW5lOyB0IDw9IGxhc3RHcmlkTGluZTsgdCArPSBncmlkRGVuc2l0eSkge1xuICAgIGxldCBncmlkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JpZERpdi5jbGFzc05hbWUgPSAnZ3JpZC1saW5lJztcbiAgICBncmlkRGl2LmlubmVyVGV4dCA9IG1pbnV0ZXNUb1RpbWUodCk7XG4gICAgcG9zaXRpb25FbGVtZW50KFxuICAgICAgICBncmlkRGl2LCAnJScsXG4gICAgICAgIC8qIGxlZnQgICAgKi8gMCxcbiAgICAgICAgLyogdG9wICAgICAqLyBzY2FsZSAqICh0IC0gZWFybGllc3QpLFxuICAgICAgICAvKiB3aWR0aCAgICovIDEwMCxcbiAgICAgICAgLyogaGVpZ2h0ICAqLyBzY2FsZSAqIGdyaWREZW5zaXR5KTtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZ3JpZERpdik7XG4gIH1cbn1cblxuLyoqXG4gKiBQb3NpdGlvbiBlbGVtZW50IHVzaW5nIHRoZSBnaXZlbiB1bml0c1xuICovXG5mdW5jdGlvbiBwb3NpdGlvbkVsZW1lbnQoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsIHVuaXRzOiBzdHJpbmcsIGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH0ke3VuaXRzfWA7XG4gIGVsZW1lbnQuc3R5bGUudG9wID0gYCR7dG9wfSR7dW5pdHN9YDtcbiAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3dpZHRofSR7dW5pdHN9YDtcbiAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9JHt1bml0c31gO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==