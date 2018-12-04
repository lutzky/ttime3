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
/******/ 	__webpack_require__.p = "dist/";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90dGltZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vdHRpbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHRpbWUvLi9zcmMvc2NoZWR1bGVyX3dvcmtlci50cyIsIndlYnBhY2s6Ly90dGltZS8uL3NyYy9jaGVlc2Vmb3JrLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL2NvbW1vbi50cyIsIndlYnBhY2s6Ly90dGltZS8uL3NyYy9mb3JtYXR0aW5nLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vdHRpbWUvLi9zcmMvcmVuZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7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SCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FDcEIsT0FBb0IsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEdBQVcsRUFDOUQsS0FBYSxFQUFFLE1BQWM7SUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDdkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDN0MsQ0FBQyIsImZpbGUiOiJ0dGltZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInR0aW1lXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInR0aW1lXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImRpc3QvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4udHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFdvcmtlcihfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwic2NoZWR1bGVyX3dvcmtlci5qc1wiKTtcbn07IiwiaW1wb3J0IHtBY2FkZW1pY0V2ZW50LCBDYXRhbG9nLCBDb3Vyc2UsIERhdGVPYmosIEZhY3VsdHksIEdyb3VwfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgaW1wbGVtZW50cyBzdXBwb3J0IGZvciBpbXBvcnRpbmcgZGF0YSBmcm9tIGNoZWVzZUZvcmtcbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21pY2hhZWwtbWFsdHNldi9jaGVlc2UtZm9ya1xuICovXG5cbi8qKlxuICogUGFyc2UgYSBjaGVlc2Vmb3JrLWZvcm1hdCBob3VyXG4gKlxuICogQHBhcmFtIHMgLSBcIkhIOk0gLSBISDpNXCIsIHdoZXJlIE0gaXMgdGVucyBvZiBtaW51dGVzXG4gKlxuICogQHJldHVybnMgTWludXRlcyBzaW5jZSBtaWRuaWdodFxuICovXG5mdW5jdGlvbiBwYXJzZUNoZWVzZUZvcmtIb3VyKHM6IHN0cmluZyk6IG51bWJlcltdIHtcbiAgcmV0dXJuIHMuc3BsaXQoJyAtICcpLm1hcChmdW5jdGlvbihoaG0pIHtcbiAgICBsZXQgc3BsaXRIb3VyID0gaGhtLnNwbGl0KCc6Jyk7XG4gICAgbGV0IG1pbnV0ZSA9IE51bWJlcihzcGxpdEhvdXJbMF0pICogNjA7XG4gICAgaWYgKHNwbGl0SG91ci5sZW5ndGggPiAxKSB7XG4gICAgICBtaW51dGUgKz0gTnVtYmVyKHNwbGl0SG91clsxXSkgKiAxMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbnV0ZTtcbiAgfSk7XG59XG5cbmNvbnN0IGRhdGVSZWdleCA9IC8oWzAtOV17MSwyfSlcXC4oWzAtOV17MSwyfSlcXC4oWzAtOV17NH0pLztcblxuLyoqXG4gKiBQYXJzZSBhIGNoZWVzZWZvcmstZm9ybWF0IHRlc3QgZGF0ZVxuICpcbiAqIEBwYXJhbSBzIC0gXCJCbGEgYmxhIGJsYSBERC5NTS5ZWVlZIEJsYSBibGEgYmxhXCJcbiAqL1xuZnVuY3Rpb24gcGFyc2VDaGVlc2VGb3JrVGVzdERhdGUoczogc3RyaW5nKTogRGF0ZU9iaiB7XG4gIGlmICghcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IHIgPSBkYXRlUmVnZXguZXhlYyhzKTtcbiAgaWYgKHIgPT0gbnVsbCkge1xuICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIG1hdGNoIGRhdGUgcmVnZXggd2l0aDogJywgcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtkYXk6IE51bWJlcihyWzFdKSwgbW9udGg6IE51bWJlcihyWzJdKSwgeWVhcjogTnVtYmVyKHJbM10pfTtcbn1cblxuLyoqXG4gKiBQYXJzZSBjaGVlc2Vmb3JrIGRhdGFcbiAqXG4gKiBAcGFyYW0ganNEYXRhIC0gQ2hlZXNlZm9yayBjb3Vyc2VzXyouanMgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDaGVlc2VGb3JrKGpzRGF0YTogc3RyaW5nKTogQ2F0YWxvZyB7XG4gIGNvbnN0IGNoZWVzZUZvcmtQcmVmaXggPSAndmFyIGNvdXJzZXNfZnJvbV9yaXNodW0gPSAnO1xuXG4gIGNvbnN0IGhlYnJldyA9IHtcbiAgICBhY2FkZW1pY1BvaW50czogJ9eg16fXldeT15XXqicsXG4gICAgYnVpbGRpbmc6ICfXkdeg15nXmdefJyxcbiAgICBjb3Vyc2VJZDogJ9ee16HXpNeoINee16fXpteV16InLFxuICAgIGNvdXJzZU5hbWU6ICfXqdedINee16fXpteV16InLFxuICAgIGRheTogJ9eZ15XXnScsXG4gICAgZGF5TGV0dGVyczogJ9eQ15HXkteT15TXldepJyxcbiAgICBmYWN1bHR5OiAn16TXp9eV15zXmNeUJyxcbiAgICBncm91cDogJ9en15HXldem15QnLFxuICAgIGhvdXI6ICfXqdei15QnLFxuICAgIGxlY3R1cmVyX3R1dG9yOiAn157XqNem15Qv157Xqteo15LXnCcsXG4gICAgbW9lZF9hOiAn157Xldei15Mg15AnLFxuICAgIG1vZWRfYjogJ9ee15XXoteTINeRJyxcbiAgICBudW06ICfXntehLicsXG4gICAgcm9vbTogJ9eX15PXqCcsXG4gICAgc3BvcnQ6ICfXodek15XXqNeYJyxcbiAgICB0aG9zZUluQ2hhcmdlOiAn15DXl9eo15DXmdedJyxcbiAgICB0eXBlOiAn16HXldeSJyxcbiAgfTtcblxuICBjb25zdCB0eXBlTWFwID0gbmV3IE1hcChbWyfXlNeo16bXkNeUJywgJ2xlY3R1cmUnXSwgWyfXqteo15LXldecJywgJ3R1dG9yaWFsJ11dKTtcblxuICBsZXQgZmFjdWx0aWVzQnlOYW1lOiBNYXA8c3RyaW5nLCBGYWN1bHR5PiA9IG5ldyBNYXAoKTtcblxuICBpZiAoIWpzRGF0YS5zdGFydHNXaXRoKGNoZWVzZUZvcmtQcmVmaXgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgdmFsaWQgY2hlZXNlZm9yayBqc0RhdGEgLSBsYWNrcyBleHBlY3RlZCBwcmVmaXgnKTtcbiAgfVxuXG4gIGxldCBkYXRhID0gSlNPTi5wYXJzZShqc0RhdGEuc3Vic3RyaW5nKGNoZWVzZUZvcmtQcmVmaXgubGVuZ3RoKSk7XG5cbiAgY29uc29sZS5pbmZvKCdFeHBlcmltZW50YWwgQ2hlZXNlRm9yayBwYXJzZXIuIEZpcnN0IGNvdXJzZTogJywgZGF0YVswXSk7XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGFDb3Vyc2U6IGFueSkge1xuICAgIGxldCBmYWN1bHR5TmFtZSA9IGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcuZmFjdWx0eV07XG5cbiAgICBpZiAoIWZhY3VsdGllc0J5TmFtZS5oYXMoZmFjdWx0eU5hbWUpKSB7XG4gICAgICBmYWN1bHRpZXNCeU5hbWUuc2V0KGZhY3VsdHlOYW1lLCB7XG4gICAgICAgIG5hbWU6IGZhY3VsdHlOYW1lLFxuICAgICAgICBzZW1lc3RlcjogJ2NoZWVzZWZvcmstdW5rbm93bi1zZW1lc3RlcicsXG4gICAgICAgIGNvdXJzZXM6IFtdLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IGZhY3VsdHkgPSBmYWN1bHRpZXNCeU5hbWUuZ2V0KGZhY3VsdHlOYW1lKTtcblxuICAgIGxldCBjb3Vyc2U6IENvdXJzZSA9IHtcbiAgICAgIGFjYWRlbWljUG9pbnRzOiBOdW1iZXIoZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5hY2FkZW1pY1BvaW50c10pLFxuICAgICAgZmFjdWx0eTogZmFjdWx0eSxcbiAgICAgIG5hbWU6IGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcuY291cnNlTmFtZV0sXG4gICAgICBpZDogTnVtYmVyKGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcuY291cnNlSWRdKSxcbiAgICAgIGxlY3R1cmVySW5DaGFyZ2U6IGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcudGhvc2VJbkNoYXJnZV0sXG4gICAgICB0ZXN0RGF0ZXM6IFtcbiAgICAgICAgZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5tb2VkX2FdLFxuICAgICAgICBkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3Lm1vZWRfYl0sXG4gICAgICBdLm1hcChwYXJzZUNoZWVzZUZvcmtUZXN0RGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4ICE9IG51bGwpLFxuICAgICAgZ3JvdXBzOiBbXSxcbiAgICB9O1xuXG4gICAgbGV0IGdyb3VwRmlyc3RBcHBlYXJlZEluTWV0YWdyb3VwOiBNYXA8bnVtYmVyLCBudW1iZXI+ID0gbmV3IE1hcCgpO1xuXG4gICAgbGV0IGdyb3Vwc0J5SWQ6IE1hcDxudW1iZXIsIEdyb3VwPiA9IG5ldyBNYXAoKTtcblxuICAgIGRhdGFDb3Vyc2VbJ3NjaGVkdWxlJ10uZm9yRWFjaChmdW5jdGlvbihkYXRhU2NoZWR1bGU6IGFueSkge1xuICAgICAgLypcbiAgICAgICAqIEluIENoZWVzZUZvcmsgZGF0YSwgZ3JvdXBzIGFyZSByZXBlYXRlZCBhY2NvcmRpbmcgdG9cbiAgICAgICAqIFwiZ3JvdXBzLXlvdS1zaG91bGQtc2lnbi11cC10b1wiLiBUaGlzIGlzIGRlbm90ZWQgYXMgXCJncm91cFwiIGluIHRoZSBkYXRhLFxuICAgICAgICogd2hlcmVhcyB3aGF0IHdlIHdvdWxkIGNvbnNpZGVyIHRoZSBhY3R1YWwgZ3JvdXAgbnVtYmVyIGlzIGRlbm90ZWQgYXNcbiAgICAgICAqIFwibnVtYmVyXCIuIFNvLCBmb3IgZXhhbXBsZSwgXCJncm91cFwiIDExIG1pZ2h0IHNheSB5b3Ugc2hvdWxkIHJlZ2lzdGVyIGZvclxuICAgICAgICogbGVjdHVyZSAxMCBhbmQgdHV0b3JpYWwgMTEsIGFuZCBcImdyb3VwXCIgMTIgd291bGQgc2F5IHlvdSBzaG91bGRcbiAgICAgICAqIHJlZ2lzdGVyIGZvciBsZWN0dXJlIDEwIGFuZCB0dXRvcmlhbCAxMi4gTGVjdHVyZSAxMCB3b3VsZCBiZSByZXBlYXRlZFxuICAgICAgICogaW4gdGhlIGRhdGEgLSBvbmNlIGZvciBlYWNoIFwiZ3JvdXBcIi4gU28gd2UgY2FsbCB0aGVzZSBcImdyb3Vwc1wiXG4gICAgICAgKiBtZXRhR3JvdXBzIGhlcmUsIGFuZCBpZ25vcmUgc3Vic2VxdWVudCBpbnN0YW5jZXMgb2YgYW55IFwicmVhbCBncm91cFwiIC1cbiAgICAgICAqIHRoYXQgaXMsIGFueSBncm91cCB3aXRoIGEgbnVtYmVyIHdlJ3ZlIHNlZW4gYmVmb3JlLCBidXQgYSBtZXRhZ3JvdXAgd2VcbiAgICAgICAqIGhhdmVuJ3Qgc2Vlbi5cbiAgICAgICAqL1xuICAgICAgbGV0IG1ldGFHcm91cElkID0gZGF0YVNjaGVkdWxlW2hlYnJldy5ncm91cF07XG4gICAgICBsZXQgZ3JvdXBJZCA9IGRhdGFTY2hlZHVsZVtoZWJyZXcubnVtXTtcblxuICAgICAgaWYgKCFncm91cEZpcnN0QXBwZWFyZWRJbk1ldGFncm91cC5oYXMoZ3JvdXBJZCkpIHtcbiAgICAgICAgZ3JvdXBGaXJzdEFwcGVhcmVkSW5NZXRhZ3JvdXAuc2V0KGdyb3VwSWQsIG1ldGFHcm91cElkKTtcbiAgICAgIH1cbiAgICAgIGlmIChncm91cEZpcnN0QXBwZWFyZWRJbk1ldGFncm91cC5nZXQoZ3JvdXBJZCkgIT0gbWV0YUdyb3VwSWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWdyb3Vwc0J5SWQuaGFzKGdyb3VwSWQpKSB7XG4gICAgICAgIGxldCB0eXBlID0gJyc7XG4gICAgICAgIGxldCBkZXNjID0gJyc7XG4gICAgICAgIGlmIChmYWN1bHR5TmFtZSA9PSBoZWJyZXcuc3BvcnQpIHtcbiAgICAgICAgICB0eXBlID0gJ3Nwb3J0JztcbiAgICAgICAgICBkZXNjID0gZGF0YVNjaGVkdWxlW2hlYnJldy50eXBlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0eXBlID0gdHlwZU1hcC5nZXQoZGF0YVNjaGVkdWxlW2hlYnJldy50eXBlXSkgfHxcbiAgICAgICAgICAgICAgZGF0YVNjaGVkdWxlW2hlYnJldy50eXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyb3Vwc0J5SWQuc2V0KGdyb3VwSWQsIHtcbiAgICAgICAgICBpZDogZ3JvdXBJZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzYyxcbiAgICAgICAgICBjb3Vyc2U6IGNvdXJzZSxcbiAgICAgICAgICB0ZWFjaGVyczogW10sXG4gICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdyb3VwID0gZ3JvdXBzQnlJZC5nZXQoZ3JvdXBJZCk7XG5cbiAgICAgIGxldCB0aW1lcyA9IHBhcnNlQ2hlZXNlRm9ya0hvdXIoZGF0YVNjaGVkdWxlW2hlYnJldy5ob3VyXSk7XG5cbiAgICAgIGxldCBldmVudDogQWNhZGVtaWNFdmVudCA9IHtcbiAgICAgICAgZ3JvdXA6IGdyb3VwLFxuICAgICAgICBkYXk6IGhlYnJldy5kYXlMZXR0ZXJzLmluZGV4T2YoZGF0YVNjaGVkdWxlW2hlYnJldy5kYXldKSxcbiAgICAgICAgc3RhcnRNaW51dGU6IHRpbWVzWzBdLFxuICAgICAgICBlbmRNaW51dGU6IHRpbWVzWzFdLFxuICAgICAgICBsb2NhdGlvbjpcbiAgICAgICAgICAgIGRhdGFTY2hlZHVsZVtoZWJyZXcuYnVpbGRpbmddICsgJyAnICsgZGF0YVNjaGVkdWxlW2hlYnJldy5yb29tXSxcbiAgICAgIH07XG5cbiAgICAgIHtcbiAgICAgICAgbGV0IHQgPSBkYXRhU2NoZWR1bGVbaGVicmV3LmxlY3R1cmVyX3R1dG9yXTtcbiAgICAgICAgaWYgKHQgJiYgIWdyb3VwLnRlYWNoZXJzLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgZ3JvdXAudGVhY2hlcnMucHVzaCh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBncm91cC5ldmVudHMucHVzaChldmVudCk7XG4gICAgfSk7XG5cbiAgICBncm91cHNCeUlkLmZvckVhY2goZnVuY3Rpb24oZ3JvdXAsIF8pIHtcbiAgICAgIGNvdXJzZS5ncm91cHMucHVzaChncm91cCk7XG4gICAgfSk7XG5cbiAgICBmYWN1bHR5LmNvdXJzZXMucHVzaChjb3Vyc2UpO1xuICB9KTtcblxuICByZXR1cm4gQXJyYXkuZnJvbShmYWN1bHRpZXNCeU5hbWUudmFsdWVzKCkpO1xufVxuIiwiaW1wb3J0IHtwYXJzZUNoZWVzZUZvcmt9IGZyb20gJy4vY2hlZXNlZm9yayc7XG5cbmV4cG9ydCBjbGFzcyBGYWN1bHR5IHtcbiAgbmFtZTogc3RyaW5nO1xuICBzZW1lc3Rlcjogc3RyaW5nO1xuICBjb3Vyc2VzOiBDb3Vyc2VbXTtcbn1cblxuZXhwb3J0IHR5cGUgQ2F0YWxvZyA9IEZhY3VsdHlbXTtcblxuZXhwb3J0IGNsYXNzIEdyb3VwIHtcbiAgY291cnNlOiBDb3Vyc2U7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGV2ZW50czogQWNhZGVtaWNFdmVudFtdO1xuICBpZDogbnVtYmVyO1xuICB0eXBlOiBzdHJpbmc7XG4gIHRlYWNoZXJzOiBBcnJheTxzdHJpbmc+O1xufVxuXG5leHBvcnQgY2xhc3MgQ291cnNlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBhY2FkZW1pY1BvaW50czogbnVtYmVyO1xuICBpZDogbnVtYmVyO1xuICBncm91cHM6IEFycmF5PEdyb3VwPjtcbiAgbGVjdHVyZXJJbkNoYXJnZTogc3RyaW5nO1xuICB0ZXN0RGF0ZXM6IERhdGVPYmpbXTtcbiAgZmFjdWx0eT86IEZhY3VsdHk7XG59XG5cbmV4cG9ydCBjbGFzcyBBY2FkZW1pY0V2ZW50IHtcbiAgZGF5OiBudW1iZXI7XG4gIGdyb3VwOiBHcm91cDtcbiAgc3RhcnRNaW51dGU6IG51bWJlcjtcbiAgZW5kTWludXRlOiBudW1iZXI7XG4gIGxvY2F0aW9uOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBTY2hlZHVsZSB7XG4gIGV2ZW50czogQWNhZGVtaWNFdmVudFtdO1xuICByYXRpbmc6IFNjaGVkdWxlUmF0aW5nO1xufVxuXG4vKipcbiAqIGVhcmxpZXN0U3RhcnQgYW5kIGxhdGVzdEZpbmlzaCBhcmUgaW4gaG91cnMgKGUuZy4gMTozMFBNIGlzIDEzLjUpLlxuICpcbiAqIG51bVJ1bnMgaXMgdGhlIGFtb3VudCBvZiBvY2N1cmVuY2VzIHdoZXJlIHR3byBhZGphY2VudCBldmVudHMgKGVuZE1pbnV0ZVxuICogb2YgdGhlIGZpcnN0IG9uZSBlcXVhbHMgc3RhcnRNaW51dGUgb2YgdGhlIHNlY29uZCwgc2FtZSBkYXkpIGFyZSBpbiB0aGVcbiAqIHNhbWUgcm9vbS5cbiAqXG4gKiBmcmVlRGF5cyBpcyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gU3VuLVRodSB3aXRoIG5vIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVkdWxlUmF0aW5nIHtcbiAgZWFybGllc3RTdGFydDogbnVtYmVyO1xuICBsYXRlc3RGaW5pc2g6IG51bWJlcjtcbiAgbnVtUnVuczogbnVtYmVyO1xuICBmcmVlRGF5czogbnVtYmVyO1xufTtcblxuZXhwb3J0IGNsYXNzIEZpbHRlclNldHRpbmdzIHtcbiAgbm9Db2xsaXNpb25zOiBib29sZWFuO1xuICBmb3JiaWRkZW5Hcm91cHM6IHN0cmluZ1tdO1xuICByYXRpbmdNaW46IFNjaGVkdWxlUmF0aW5nO1xuICByYXRpbmdNYXg6IFNjaGVkdWxlUmF0aW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRGF0ZU9iaiB7XG4gIHllYXI6IG51bWJlcjtcbiAgbW9udGg6IG51bWJlcjtcbiAgZGF5OiBudW1iZXI7XG59XG5cbi8qKlxuICogU29ydHMgZXZlbnRzIGJ5IHN0YXJ0IHRpbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRFdmVudHMoZXZlbnRzOiBBY2FkZW1pY0V2ZW50W10pIHtcbiAgZXZlbnRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIGlmIChhLmRheSAhPSBiLmRheSkge1xuICAgICAgcmV0dXJuIGEuZGF5IC0gYi5kYXk7XG4gICAgfVxuICAgIHJldHVybiBhLnN0YXJ0TWludXRlIC0gYi5zdGFydE1pbnV0ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBmYWxzZSBpZmYgdHdvIGVudHJpZXMgaW4gZXZlbnRzIG92ZXJsYXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50c0NvbGxpZGUoZXZlbnRzOiBBY2FkZW1pY0V2ZW50W10pOiBib29sZWFuIHtcbiAgbGV0IGUgPSBldmVudHMuc2xpY2UoKTtcbiAgc29ydEV2ZW50cyhlKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGUubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgaWYgKGVbaV0uZGF5ID09IGVbaSArIDFdLmRheSkge1xuICAgICAgaWYgKGVbaSArIDFdLnN0YXJ0TWludXRlIDwgZVtpXS5lbmRNaW51dGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIExvYWQgdGhlIGNhdGFsb2cgb2JqZWN0IGZyb20gdXJsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZENhdGFsb2codXJsOiBzdHJpbmcpOiBQcm9taXNlPENhdGFsb2c+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbignR0VUJywgdXJsKTtcbiAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmVxLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgbGV0IHJlc3VsdDogQ2F0YWxvZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlcS5yZXNwb25zZVswXSA9PSAnWycpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlIGFzIHN0cmluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHBhcnNlQ2hlZXNlRm9yayhyZXEucmVzcG9uc2UgYXMgc3RyaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZml4UmF3Q2F0YWxvZyhyZXN1bHQpO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KEVycm9yKCdOZXR3b3JrIEVycm9yJykpO1xuICAgIH07XG5cbiAgICByZXEuc2VuZCgpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgYmFjay1saW5rcyB0byBjYXRhbG9nIG9iamVjdHMgKGNvdXJzZSAtPiBmYWN1bHR5LCBncm91cCAtPiBjb3Vyc2UsIGV0Yy4pXG4gKi9cbmZ1bmN0aW9uIGZpeFJhd0NhdGFsb2coY2F0YWxvZzogQ2F0YWxvZykge1xuICBjYXRhbG9nLmZvckVhY2goZnVuY3Rpb24oZmFjdWx0eSkge1xuICAgIGZhY3VsdHkuY291cnNlcy5mb3JFYWNoKGZ1bmN0aW9uKGNvdXJzZSkge1xuICAgICAgY291cnNlLmZhY3VsdHkgPSBmYWN1bHR5O1xuICAgICAgaWYgKGNvdXJzZS5ncm91cHMpIHtcbiAgICAgICAgY291cnNlLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgZ3JvdXAuY291cnNlID0gY291cnNlO1xuICAgICAgICAgIGlmIChncm91cC5ldmVudHMpIHtcbiAgICAgICAgICAgIGdyb3VwLmV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgIGV2ZW50Lmdyb3VwID0gZ3JvdXA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuaW1wb3J0ICogYXMgdGVzdERhdGEgZnJvbSAnLi4vdGVzdGRhdGEuanNvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkVGVzdENhdGFsb2coKTogUHJvbWlzZTxDYXRhbG9nPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCBfcmVqZWN0KSB7XG4gICAgbGV0IHJlc3VsdDogQ2F0YWxvZyA9IHRlc3REYXRhIGFzIGFueSBhcyBDYXRhbG9nO1xuICAgIGZpeFJhd0NhdGFsb2cocmVzdWx0KTtcbiAgICByZXNvbHZlKHJlc3VsdCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiBjb3Vyc2UncyBncm91cHMgYXMgYW4gYXJyYXkgb2YgYXJyYXlzLCBzcGxpdCBieSB0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cHNCeVR5cGUoY291cnNlOiBDb3Vyc2UpOiBHcm91cFtdW10ge1xuICBsZXQgbSA9IG5ldyBNYXAoKTtcbiAgaWYgKCFjb3Vyc2UuZ3JvdXBzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY291cnNlLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgaWYgKCFtLmhhcyhncm91cC50eXBlKSkge1xuICAgICAgbS5zZXQoZ3JvdXAudHlwZSwgW10pO1xuICAgIH1cbiAgICBtLmdldChncm91cC50eXBlKS5wdXNoKGdyb3VwKTtcbiAgfSk7XG5cbiAgcmV0dXJuIEFycmF5LmZyb20obS52YWx1ZXMoKSk7XG59XG4iLCJpbXBvcnQge0RhdGVPYmosIEdyb3VwfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogQ29udmVydCBtaW51dGVzLWZyb20tbWlkbmlnaHQgdG8gSEg6TU1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pbnV0ZXNUb1RpbWUobWludXRlczogbnVtYmVyKTogc3RyaW5nIHtcbiAgbGV0IGhvdXJTdHJpbmcgPSBNYXRoLmZsb29yKG1pbnV0ZXMgLyA2MCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICBsZXQgbWludXRlU3RyaW5nID0gKG1pbnV0ZXMgJSA2MCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICByZXR1cm4gaG91clN0cmluZyArICc6JyArIG1pbnV0ZVN0cmluZztcbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBEYXRlT2JqIGFzIGEgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGVPYmo6IERhdGVPYmopOiBzdHJpbmcge1xuICByZXR1cm4gbmV3IERhdGUoZGF0ZU9iai55ZWFyLCBkYXRlT2JqLm1vbnRoLCBkYXRlT2JqLmRheSkudG9EYXRlU3RyaW5nKCk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBkaXNwbGF5IG5hbWUgZm9yIHRoZSBncm91cFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheU5hbWUoZ3JvdXA6IEdyb3VwKTogc3RyaW5nIHtcbiAgcmV0dXJuIGdyb3VwLmRlc2NyaXB0aW9uIHx8IGdyb3VwLmNvdXJzZS5uYW1lO1xufVxuIiwiLy8gVG8gZW5hYmxlIGRlYnVnZ2luZywgdHlwZSB0aGUgZm9sbG93aW5nIGludG8geW91ciBKYXZhc2NyaXB0IGNvbnNvbGU6XG4vL1xuLy8gICBtYWluRGVidWdMb2dnaW5nID0gdHJ1ZVxubGV0IG1haW5EZWJ1Z0xvZ2dpbmcgPSBmYWxzZTtcblxuaW1wb3J0IHtyZW5kZXJTY2hlZHVsZX0gZnJvbSAnLi9yZW5kZXInO1xuaW1wb3J0IHtncm91cHNCeVR5cGUsIHNvcnRFdmVudHMsIGxvYWRDYXRhbG9nfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge1NjaGVkdWxlLCBDb3Vyc2UsIEdyb3VwLCBDYXRhbG9nLCBTY2hlZHVsZVJhdGluZywgRmlsdGVyU2V0dGluZ3MsIEFjYWRlbWljRXZlbnR9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7ZGlzcGxheU5hbWUsIGZvcm1hdERhdGUsIG1pbnV0ZXNUb1RpbWV9IGZyb20gJy4vZm9ybWF0dGluZyc7XG5cbi8qKlxuICogU2V0dGluZ3MgdG8gYmUgc2F2ZWQuIE5vdGUgdGhhdCB0aGlzIG11c3QgYmUgc2VyaWFsaXphYmxlIGRpcmVjdGx5IGFzIEpTT04sXG4gKiBzbyBTZXR0aW5ncyBhbmQgYWxsIG9mIHRoZSB0eXBlcyBvZiBpdHMgbWVtYmVyIHZhcmlhYmxlcyBjYW4ndCBoYXZlIG1hcHNcbiAqIG5vciBzZXRzLlxuICovXG5jbGFzcyBTZXR0aW5ncyB7XG4gIHNlbGVjdGVkQ291cnNlczogbnVtYmVyW107XG4gIGZvcmJpZGRlbkdyb3Vwczogc3RyaW5nW107XG4gIGN1c3RvbUV2ZW50czogc3RyaW5nO1xuICBjYXRhbG9nVXJsOiBzdHJpbmc7XG4gIGZpbHRlclNldHRpbmdzOiBGaWx0ZXJTZXR0aW5ncztcbn1cblxuY29uc3QgZGVmYXVsdENhdGFsb2dVcmwgPVxuICAgICdodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vcmVweS0xNzYyMTcuYXBwc3BvdC5jb20vbGF0ZXN0Lmpzb24nO1xuXG4vKipcbiAqIFNldCB0aGUgZ2l2ZW4gY2F0YWxvZyBVUkwgYW5kIHNhdmUgc2V0dGluZ3MuIEZvciB1c2UgZnJvbSBIVE1MLlxuICovXG5mdW5jdGlvbiBzZXRDYXRhbG9nVXJsKHVybDogc3RyaW5nKSB7XG4gICQoJyNjYXRhbG9nLXVybCcpLnZhbCh1cmwpO1xuICBjYXRhbG9nVXJsQ2hhbmdlZCgpO1xufVxuKHdpbmRvdyBhcyBhbnkpLnNldENhdGFsb2dVcmwgPSBzZXRDYXRhbG9nVXJsO1xuXG4vKipcbiAqIEhhbmRsZXIgZm9yIGNoYW5nZXMgdG8gdGhlIGNhdGFsb2cgVVJMIGZpZWxkXG4gKi9cbmZ1bmN0aW9uIGNhdGFsb2dVcmxDaGFuZ2VkKCkge1xuICBzYXZlU2V0dGluZ3MoKTtcbn1cblxubGV0IHNlbGVjdGVkQ291cnNlcyA9IG5ldyBTZXQoKTtcblxuLyoqXG4gKiBDYXRhbG9nIG9mIGFsbCBjb3Vyc2VzXG4gKi9cbmxldCBjdXJyZW50Q2F0YWxvZzogQ2F0YWxvZyA9IG51bGw7XG5cbi8qKlxuICogTWFwcGluZyBmcm9tIGNvdXJzZSBJRHMgdG8gY291cnNlc1xuICovXG5sZXQgY3VycmVudENhdGFsb2dCeUNvdXJzZUlEOiBNYXA8bnVtYmVyLCBDb3Vyc2U+ID0gbnVsbDtcblxuLyoqXG4gKiBVcGRhdGVzIGZvcmJsaW5rIGFjY29yZGluZyB0byBpdHMgZGF0YSgnZm9yYmlkZGVuJylcbiAqL1xuZnVuY3Rpb24gdXBkYXRlRm9yYmlkTGlua1RleHQoZmw6IEpRdWVyeSkge1xuICBmbC50ZXh0KGZsLmRhdGEoJ2ZvcmJpZGRlbicpID8gJ1t1bmZvcmJpZF0nIDogJ1tmb3JiaWRdJyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhlYWRlciBmb3IgdGhlIGdpdmVuIGdyb3VwLCBmb3IgZGlzcGxheWluZyBpbiB0aGUgY2F0YWxvZ1xuICovXG5mdW5jdGlvbiBncm91cEhlYWRlckZvckNhdGFsb2coZ3JvdXA6IEdyb3VwKTogSlF1ZXJ5IHtcbiAgbGV0IHJlc3VsdCA9ICQoJzxsaT4nKTtcbiAgbGV0IGdyb3VwTmFtZVRleHQgPSBgR3JvdXAgJHtncm91cC5pZH0gKCR7Z3JvdXAudHlwZX0pIGA7XG4gIGlmIChncm91cC50ZWFjaGVycy5sZW5ndGggPiAwKSB7XG4gICAgZ3JvdXBOYW1lVGV4dCArPSBgKCR7Z3JvdXAudGVhY2hlcnMuam9pbignLCAnKX0pIGA7XG4gIH1cblxuICBsZXQgZ3JvdXBOYW1lID0gJCgnPGI+Jywge1xuICAgIHRleHQ6IGdyb3VwTmFtZVRleHQsXG4gIH0pO1xuICByZXN1bHQuYXBwZW5kKGdyb3VwTmFtZSk7XG5cbiAgbGV0IGZvcmJpZExpbmsgPSAkKCc8YT4nLCB7XG4gICAgY2xhc3M6ICdmb3JiaWQtbGluaycsXG4gICAgaHJlZjogJyMvJyxcbiAgICBkYXRhOiB7Zm9yYmlkZGVuOiBpc0dyb3VwRm9yYmlkZGVuKGdyb3VwKSwgZ3JvdXBJRDogZ3JvdXBJRFN0cmluZyhncm91cCl9LFxuICB9KTtcblxuICB1cGRhdGVGb3JiaWRMaW5rVGV4dChmb3JiaWRMaW5rKTtcblxuICBmb3JiaWRMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGlmIChmb3JiaWRMaW5rLmRhdGEoJ2ZvcmJpZGRlbicpKSB7XG4gICAgICBkZWxGb3JiaWRkZW5Hcm91cChncm91cCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEZvcmJpZGRlbkdyb3VwKGdyb3VwKTtcbiAgICB9XG4gIH0pO1xuICByZXN1bHQuYXBwZW5kKGZvcmJpZExpbmspO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRm9yYmlkZGVuIGdyb3VwcywgYXMgZm9ybWF0dGVkIHVzaW5nIGdyb3VwSURTdHJpbmdcbiAqL1xubGV0IGZvcmJpZGRlbkdyb3VwczogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG5cbi8qKlxuICogQSBzdHJpbmcgaWRlbnRpZmllciByZXByZXNlbnRpbmcgYSBnaXZlbiBncm91cC4gVXNlZCBpbiBmb3JiaWRkZW5Hcm91cHMuXG4gKlxuICogRm9ybWF0OiAnY291cnNlX2lkLmdyb3VwX2lkJ1xuICovXG5mdW5jdGlvbiBncm91cElEU3RyaW5nKGdyb3VwOiBHcm91cCk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtncm91cC5jb3Vyc2UuaWR9LiR7Z3JvdXAuaWR9YDtcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIGdyb3VwIHRvIHRoZSBmb3JiaWRkZW4gZ3JvdXBzXG4gKi9cbmZ1bmN0aW9uIGFkZEZvcmJpZGRlbkdyb3VwKGdyb3VwOiBHcm91cCkge1xuICBmb3JiaWRkZW5Hcm91cHMuYWRkKGdyb3VwSURTdHJpbmcoZ3JvdXApKTtcbiAgc2F2ZVNldHRpbmdzKCk7XG5cbiAgdXBkYXRlRm9yYmlkZGVuR3JvdXBzKCk7XG59XG4vLyBUT0RPKGx1dHpreSk6IE1ha2luZyBhZGRGb3JiaWRkZW5Hcm91cCBhdmFpbGFibGUgdG8gcmVuZGVyLnRzIGluIHRoaXMgd2F5XG4vLyBpcyBhbiB1Z2x5IGhhY2suXG4od2luZG93IGFzIGFueSkuYWRkRm9yYmlkZGVuR3JvdXAgPSBhZGRGb3JiaWRkZW5Hcm91cDtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGdyb3VwIGZyb20gdGhlIGZvcmJpZGRlbiBncm91cHNcbiAqL1xuZnVuY3Rpb24gZGVsRm9yYmlkZGVuR3JvdXAoZ3JvdXA6IEdyb3VwKSB7XG4gIGZvcmJpZGRlbkdyb3Vwcy5kZWxldGUoZ3JvdXBJRFN0cmluZyhncm91cCkpO1xuICBzYXZlU2V0dGluZ3MoKTtcblxuICB1cGRhdGVGb3JiaWRkZW5Hcm91cHMoKTtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGdyb3VwIGlzIGZvcmJpZGRlblxuICovXG5mdW5jdGlvbiBpc0dyb3VwRm9yYmlkZGVuKGdyb3VwOiBHcm91cCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZm9yYmlkZGVuR3JvdXBzLmhhcyhncm91cElEU3RyaW5nKGdyb3VwKSk7XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBsaXN0IG9mIGN1cnJlbnRseSBmb3JiaWRkZW4gZ3JvdXBzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUZvcmJpZGRlbkdyb3VwcygpIHtcbiAgbGV0IHVsID0gJCgnI2ZvcmJpZGRlbi1ncm91cHMnKTtcbiAgdWwuZW1wdHkoKTtcblxuICBmb3JiaWRkZW5Hcm91cHMuZm9yRWFjaChmdW5jdGlvbihmZykge1xuICAgIGxldCBsaSA9ICQoJzxsaT4nKTtcbiAgICBsaS50ZXh0KGZnICsgJyAnKTtcblxuICAgIGxldCB1bmZvcmJpZExpbmsgPSAkKCc8YT4nLCB7XG4gICAgICBocmVmOiAnIy8nLFxuICAgICAgdGV4dDogJ1t1bmZvcmJpZF0nLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3JiaWRkZW5Hcm91cHMuZGVsZXRlKGZnKTtcbiAgICAgICAgc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIHVwZGF0ZUZvcmJpZGRlbkdyb3VwcygpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxpLmFwcGVuZCh1bmZvcmJpZExpbmspO1xuICAgIHVsLmFwcGVuZChsaSk7XG4gIH0pO1xuXG4gICQoJ2EuZm9yYmlkLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIGxldCBncm91cElEOiBzdHJpbmcgPSAkKHRoaXMpLmRhdGEoJ2dyb3VwSUQnKTtcblxuICAgIGxldCBpc0ZvcmJpZGRlbiA9IGZvcmJpZGRlbkdyb3Vwcy5oYXMoZ3JvdXBJRCk7XG4gICAgJCh0aGlzKS5kYXRhKCdmb3JiaWRkZW4nLCBpc0ZvcmJpZGRlbik7XG4gICAgdXBkYXRlRm9yYmlkTGlua1RleHQoJCh0aGlzKSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEZvcm1hdCBhIGNvdXJzZSBJRCBhcyBhIDYtZGlnaXQgbnVtYmVyXG4gKlxuICogRm9yIGV4YW1wbGUsIDE4NDIwIHNob3VsZCBiZSBwcmVzZW50ZWQgKGFuZCBzZWFyY2hhYmxlKSBhcyAwMTg0MjAuXG4gKi9cbmZ1bmN0aW9uIGZvcm1hdENvdXJzZUlkKGlkOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nKGlkKS5wYWRTdGFydCg2LCAnMCcpO1xufVxuXG4vKipcbiAqIFJldHVybiBhbiBIVE1MIGRlc2NyaXB0aW9uIGZvciBhIGNvdXJzZVxuICovXG5mdW5jdGlvbiBodG1sRGVzY3JpYmVDb3Vyc2UoY291cnNlOiBDb3Vyc2UpOiBIVE1MRWxlbWVudCB7XG4gIGxldCByZXN1bHQgPSAkKCc8c3Bhbj4nKTtcbiAgbGV0IHVsID0gJCgnPHVsPicpO1xuICB1bC5hcHBlbmQoJCgnPGxpPicsIHtcbiAgICBodG1sOiBgPGI+RnVsbCBuYW1lPC9iPiAke2Zvcm1hdENvdXJzZUlkKGNvdXJzZS5pZCl9ICR7Y291cnNlLm5hbWV9YCxcbiAgfSkpO1xuICB1bC5hcHBlbmQoXG4gICAgICAkKCc8bGk+Jywge2h0bWw6IGA8Yj5BY2FkZW1pYyBwb2ludHM6PC9iPiAke2NvdXJzZS5hY2FkZW1pY1BvaW50c31gfSkpO1xuICB1bC5hcHBlbmQoJCgnPGxpPicsIHtcbiAgICBodG1sOiBgPGI+TGVjdHVyZXIgaW4gY2hhcmdlOjwvYj4gJHtcbiAgICAgICAgcnRsU3Bhbihjb3Vyc2UubGVjdHVyZXJJbkNoYXJnZSB8fCAnW3Vua25vd25dJyl9YCxcbiAgfSkpO1xuICB1bC5hcHBlbmQoJCgnPGxpPicsIHtodG1sOiAnPGI+VGVzdCBkYXRlczo8L2I+J30pKTtcbiAgbGV0IHRlc3REYXRlcyA9ICQoJzx1bD4nKTtcbiAgaWYgKGNvdXJzZS50ZXN0RGF0ZXMpIHtcbiAgICBjb3Vyc2UudGVzdERhdGVzLmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgdGVzdERhdGVzLmFwcGVuZCgkKCc8bGk+Jywge3RleHQ6IGZvcm1hdERhdGUoZCl9KSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGVzdERhdGVzLmFwcGVuZCgkKCc8bGk+Jywge3RleHQ6ICdbdW5rbm93bl0nfSkpO1xuICB9XG4gIHVsLmFwcGVuZCh0ZXN0RGF0ZXMpO1xuXG4gIHVsLmFwcGVuZCgkKCc8bGk+Jywge2h0bWw6ICc8Yj5Hcm91cHM6PC9iPid9KSk7XG4gIGxldCBncm91cHMgPSAkKCc8dWw+Jyk7XG4gIGlmIChjb3Vyc2UuZ3JvdXBzKSB7XG4gICAgY291cnNlLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKGcpIHtcbiAgICAgIGdyb3Vwcy5hcHBlbmQoZ3JvdXBIZWFkZXJGb3JDYXRhbG9nKGcpWzBdKTtcbiAgICAgIGxldCBldmVudHMgPSAkKCc8dWw+Jyk7XG4gICAgICBpZiAoZy5ldmVudHMpIHtcbiAgICAgICAgZy5ldmVudHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgZXZlbnRzLmFwcGVuZCgkKCc8bGk+Jywge1xuICAgICAgICAgICAgdGV4dDogYCR7ZGF5TmFtZXNbZS5kYXldfSwgYCArIG1pbnV0ZXNUb1RpbWUoZS5zdGFydE1pbnV0ZSkgKyAnLScgK1xuICAgICAgICAgICAgICAgIG1pbnV0ZXNUb1RpbWUoZS5lbmRNaW51dGUpICsgYCBhdCAke2UubG9jYXRpb24gfHwgJ1t1bmtub3duXSd9YCxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZlbnRzLmFwcGVuZCgkKCc8bGk+Jywge3RleHQ6ICdbdW5rbm93bl0nfSkpO1xuICAgICAgfVxuICAgICAgZ3JvdXBzLmFwcGVuZChldmVudHMpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGdyb3Vwcy5hcHBlbmQoJCgnPGxpPicsIHt0ZXh0OiAnW3Vua25vd25dJ30pKTtcbiAgfVxuICB1bC5hcHBlbmQoZ3JvdXBzKTtcblxuICByZXN1bHQuYXBwZW5kKHVsKTtcbiAgcmV0dXJuIHJlc3VsdFswXTtcbn1cblxuY29uc3QgZXhwYW5kSW5mb1N5bWJvbCA9ICc8aSBjbGFzcz1cImZhcyBmYS1pbmZvLWNpcmNsZVwiPjwvaT4nO1xuY29uc3QgY29sbGFwc2VJbmZvU3ltYm9sID0gJzxpIGNsYXNzPVwiZmFzIGZhLW1pbnVzLWNpcmNsZVwiPjwvaT4nO1xuXG4vKipcbiAqIFdyYXAgcyB3aXRoIGEgcmlnaHQtdG8tbGVmdCBzcGFuXG4gKi9cbmZ1bmN0aW9uIHJ0bFNwYW4oczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGA8c3BhbiBkaXI9XCJydGxcIj4ke3N9PC9zcGFuPmA7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgc3BhbiBmb3IgYSBjb3Vyc2UgbGFiZWwsIGluY2x1ZGluZyBpbmZvIGJ1dHRvblxuICovXG5mdW5jdGlvbiBjb3Vyc2VMYWJlbChjb3Vyc2U6IENvdXJzZSk6IEhUTUxFbGVtZW50IHtcbiAgLy8gVE9ETyhsdXR6a3kpOiBUaGlzIGZ1bmN0aW9uIGlzIGZ1bGwgb2YgRE9NIG1pc3VzZSwgaGVuY2UgdGhlIHRzLWlnbm9yZVxuICAvLyBzeW1ib2xzLlxuICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgbGV0IGluZm9MaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBpbmZvTGluay5pbm5lckhUTUwgPSBleHBhbmRJbmZvU3ltYm9sO1xuICBpbmZvTGluay5jbGFzc05hbWUgPSAnZXhwYW5kbyc7XG4gIGluZm9MaW5rLmhyZWYgPSAnIy8nO1xuICBzcGFuLmlubmVySFRNTCA9IGAgJHtmb3JtYXRDb3Vyc2VJZChjb3Vyc2UuaWQpfSAke3J0bFNwYW4oY291cnNlLm5hbWUpfSBgO1xuICBpbmZvTGluay5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gQHRzLWlnbm9yZTogZG9tLW1pc3VzZVxuICAgIGlmICghc3Bhbi50dGltZTNfZXhwYW5kZWQpIHtcbiAgICAgIGxldCBpbmZvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAvLyBAdHMtaWdub3JlOiBkb20tbWlzdXNlXG4gICAgICBzcGFuLmluZm9EaXYgPSBpbmZvRGl2O1xuICAgICAgaW5mb0Rpdi5hcHBlbmRDaGlsZChodG1sRGVzY3JpYmVDb3Vyc2UoY291cnNlKSk7XG4gICAgICAvLyBzaG93Q291cnNlRGVidWdJbmZvKGNvdXJzZSk7XG4gICAgICBzcGFuLmFwcGVuZENoaWxkKGluZm9EaXYpO1xuICAgICAgaW5mb0xpbmsuaW5uZXJIVE1MID0gY29sbGFwc2VJbmZvU3ltYm9sO1xuICAgICAgLy8gQHRzLWlnbm9yZTogZG9tLW1pc3VzZVxuICAgICAgc3Bhbi50dGltZTNfZXhwYW5kZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmZvTGluay5pbm5lckhUTUwgPSBleHBhbmRJbmZvU3ltYm9sO1xuICAgICAgLy8gQHRzLWlnbm9yZTogZG9tLW1pc3VzZVxuICAgICAgc3Bhbi50dGltZTNfZXhwYW5kZWQgPSBmYWxzZTtcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGRvbS1taXN1c2VcbiAgICAgIHNwYW4ucmVtb3ZlQ2hpbGQoc3Bhbi5pbmZvRGl2KTtcbiAgICB9XG4gIH07XG4gIHNwYW4uYXBwZW5kQ2hpbGQoaW5mb0xpbmspO1xuICByZXR1cm4gc3Bhbjtcbn1cblxubGV0IGNvdXJzZUFkZEJ1dHRvbnMgPSBuZXcgTWFwKCk7XG5sZXQgY291cnNlQWRkTGFiZWxzID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIFdyaXRlIGNhdGFsb2cgc2VsZWN0b3IgdG8gcGFnZS5cbiAqL1xuZnVuY3Rpb24gd3JpdGVDYXRhbG9nU2VsZWN0b3IoKSB7XG4gIGxldCBmYWN1bHRpZXNEaXYgPSAkKCcjY2F0YWxvZycpO1xuXG4gIGZhY3VsdGllc0Rpdi5lbXB0eSgpO1xuICBjdXJyZW50Q2F0YWxvZy5mb3JFYWNoKGZ1bmN0aW9uKGZhY3VsdHkpIHtcbiAgICBsZXQgZmFjdWx0eURldGFpbHMgPSAkKCc8ZGV0YWlscz4nKTtcblxuICAgIGxldCBzdW1tYXJ5ID0gJCgnPHN1bW1hcnk+Jyk7XG4gICAgc3VtbWFyeS5odG1sKGA8c3Ryb25nPiR7ZmFjdWx0eS5uYW1lfTwvc3Ryb25nPiBgKTtcbiAgICBsZXQgc2VtZXN0ZXJUYWcgPSAkKCc8c3Bhbj4nLCB7XG4gICAgICBjbGFzczogJ2JhZGdlIGJhZGdlLXNlY29uZGFyeScsXG4gICAgICB0ZXh0OiBmYWN1bHR5LnNlbWVzdGVyLFxuICAgIH0pO1xuICAgIHN1bW1hcnkuYXBwZW5kKHNlbWVzdGVyVGFnKTtcbiAgICBmYWN1bHR5RGV0YWlscy5hcHBlbmQoc3VtbWFyeSk7XG4gICAgZmFjdWx0aWVzRGl2LmFwcGVuZChmYWN1bHR5RGV0YWlscyk7XG5cbiAgICBsZXQgY291cnNlTGlzdCA9ICQoJzx1bD4nLCB7Y2xhc3M6ICdjb3Vyc2UtbGlzdCd9KTtcbiAgICBmYWN1bHR5RGV0YWlscy5hcHBlbmQoY291cnNlTGlzdCk7XG5cbiAgICBmYWN1bHR5LmNvdXJzZXMuZm9yRWFjaChmdW5jdGlvbihjb3Vyc2UpIHtcbiAgICAgIGxldCBidG4gPSAkKCc8YnV0dG9uPicsIHtcbiAgICAgICAgdGV4dDogJysnLFxuICAgICAgICBjbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYWRkU2VsZWN0ZWRDb3Vyc2UoY291cnNlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY291cnNlQWRkQnV0dG9ucy5zZXQoY291cnNlLmlkLCBidG4pO1xuICAgICAgbGV0IGxhYmVsID0gY291cnNlTGFiZWwoY291cnNlKTtcbiAgICAgIGNvdXJzZUFkZExhYmVscy5zZXQoY291cnNlLmlkLCBsYWJlbCk7XG4gICAgICBsZXQgY291cnNlTGkgPSAkKCc8bGk+Jyk7XG4gICAgICBjb3Vyc2VMaS5hcHBlbmQoYnRuKS5hcHBlbmQobGFiZWwpO1xuICAgICAgY291cnNlTGlzdC5hcHBlbmQoY291cnNlTGkpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgY2hlY2tib3ggd2l0aCB0aGUgZ2l2ZW4gSUQgaXMgY2hlY2tlZFxuICovXG5mdW5jdGlvbiBnZXRDaGVja2JveFZhbHVlQnlJZChpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XG59XG5cbi8qKlxuICogU2V0cyB3aGV0aGVyIG9yIG5vdCBhIGNoZWNrYm94IHdpdGggdGhlIGdpdmVuIElEIGlzIGNoZWNrZWRcbiAqL1xuZnVuY3Rpb24gc2V0Q2hlY2tib3hWYWx1ZUJ5SWQoaWQ6IHN0cmluZywgY2hlY2tlZDogYm9vbGVhbikge1xuICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSBjaGVja2VkO1xufVxuXG4vKipcbiAqIFNhdmUgYWxsIHNldHRpbmdzIHRvIGxvY2FsU3RvcmFnZVxuICovXG5mdW5jdGlvbiBzYXZlU2V0dGluZ3MoKSB7XG4gIHNldHRpbmdzLnNlbGVjdGVkQ291cnNlcyA9IEFycmF5LmZyb20oc2VsZWN0ZWRDb3Vyc2VzKS5tYXAoYyA9PiBjLmlkKTtcbiAgc2V0dGluZ3MuY3VzdG9tRXZlbnRzID0gJCgnI2N1c3RvbS1ldmVudHMtdGV4dGFyZWEnKS52YWwoKSBhcyBzdHJpbmc7XG4gIHNldHRpbmdzLmNhdGFsb2dVcmwgPSAkKCcjY2F0YWxvZy11cmwnKS52YWwoKSBhcyBzdHJpbmc7XG4gIHNldHRpbmdzLmZpbHRlclNldHRpbmdzID0ge1xuICAgIGZvcmJpZGRlbkdyb3VwczogQXJyYXkuZnJvbShmb3JiaWRkZW5Hcm91cHMpLFxuICAgIG5vQ29sbGlzaW9uczogZ2V0Q2hlY2tib3hWYWx1ZUJ5SWQoJ2ZpbHRlci5ub0NvbGxpc2lvbnMnKSxcbiAgICByYXRpbmdNYXg6IGdldE51bGxSYXRpbmcoKSxcbiAgICByYXRpbmdNaW46IGdldE51bGxSYXRpbmcoKSxcbiAgfTtcblxuICBPYmplY3Qua2V5cyhhbGxSYXRpbmdzKS5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgc2V0dGluZ3MuZmlsdGVyU2V0dGluZ3MucmF0aW5nTWluW3JdID0gZ2V0TnVtSW5wdXRWYWx1ZVdpdGhEZWZhdWx0KFxuICAgICAgICAoJChgI3JhdGluZy0ke3J9LW1pbmApWzBdKSBhcyBIVE1MSW5wdXRFbGVtZW50LCBudWxsKTtcbiAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgc2V0dGluZ3MuZmlsdGVyU2V0dGluZ3MucmF0aW5nTWF4W3JdID0gZ2V0TnVtSW5wdXRWYWx1ZVdpdGhEZWZhdWx0KFxuICAgICAgICAoJChgI3JhdGluZy0ke3J9LW1heGApWzBdKSBhcyBIVE1MSW5wdXRFbGVtZW50LCBudWxsKTtcbiAgfSk7XG5cbiAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0dGltZTNfc2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuXG4gIGlmIChtYWluRGVidWdMb2dnaW5nKSB7XG4gICAgY29uc29sZS5pbmZvKCdTYXZlZCBzZXR0aW5nczonLCBzZXR0aW5ncyk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIG51bWVyaWMgdmFsdWUgaW4gdGhlIGdpdmVuIGZpZWxkLCBvciByZXR1cm4gdGhlIGRlZmF1bHQgaWZcbiAqIGl0J3MgZW1wdHkuXG4gKi9cbmZ1bmN0aW9uIGdldE51bUlucHV0VmFsdWVXaXRoRGVmYXVsdChcbiAgICBpbnB1dDogSFRNTElucHV0RWxlbWVudCwgZGVmYXVsdFZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAoaW5wdXQudmFsdWUgPT0gJycpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9XG4gIHJldHVybiBOdW1iZXIoaW5wdXQudmFsdWUpO1xufVxuXG4vKipcbiAqIE1hcmsgY291cnNlIGFzIHNlbGVjdGVkLlxuICovXG5mdW5jdGlvbiBhZGRTZWxlY3RlZENvdXJzZShjb3Vyc2U6IENvdXJzZSkge1xuICBpZiAobWFpbkRlYnVnTG9nZ2luZykge1xuICAgIGNvbnNvbGUuaW5mbygnU2VsZWN0ZWQnLCBjb3Vyc2UpO1xuICB9XG4gIHNlbGVjdGVkQ291cnNlcy5hZGQoY291cnNlKTtcbiAgY291cnNlQWRkQnV0dG9ucy5nZXQoY291cnNlLmlkKS5kaXNhYmxlZCA9IHRydWU7XG4gIGNvdXJzZUFkZExhYmVscy5nZXQoY291cnNlLmlkKS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZC1jb3Vyc2UtbGFiZWwnKTtcbiAgc2F2ZVNldHRpbmdzKCk7XG4gIHJlZnJlc2hTZWxlY3RlZENvdXJzZXMoKTtcbn1cblxuLyoqXG4gKiBBZGQgYSBjb3Vyc2Ugd2l0aCBhIGdpdmVuIElEXG4gKi9cbmZ1bmN0aW9uIGFkZFNlbGVjdGVkQ291cnNlQnlJRCguLi5pZHM6IG51bWJlcltdKSB7XG4gIGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG4gICAgbGV0IGNvdXJzZSA9IGdldENvdXJzZUJ5SUQoaWQpO1xuXG4gICAgaWYgKGNvdXJzZSkge1xuICAgICAgYWRkU2VsZWN0ZWRDb3Vyc2UoY291cnNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjb3Vyc2Ugd2l0aCBJRCAnICsgaWQpO1xuICAgIH1cbiAgfSk7XG59XG4od2luZG93IGFzIGFueSkuYWRkU2VsZWN0ZWRDb3Vyc2VCeUlEID0gYWRkU2VsZWN0ZWRDb3Vyc2VCeUlEO1xuXG4vKipcbiAqIE1hcmsgY291cnNlIGFzIHVuc2VsZWN0ZWQuXG4gKi9cbmZ1bmN0aW9uIGRlbFNlbGVjdGVkQ291cnNlKGNvdXJzZTogQ291cnNlKSB7XG4gIGlmIChtYWluRGVidWdMb2dnaW5nKSB7XG4gICAgY29uc29sZS5pbmZvKCdVbnNlbGVjdGVkJywgY291cnNlKTtcbiAgfVxuICBzZWxlY3RlZENvdXJzZXMuZGVsZXRlKGNvdXJzZSk7XG4gIGNvdXJzZUFkZEJ1dHRvbnMuZ2V0KGNvdXJzZS5pZCkuZGlzYWJsZWQgPSBmYWxzZTtcbiAgY291cnNlQWRkTGFiZWxzLmdldChjb3Vyc2UuaWQpLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkLWNvdXJzZS1sYWJlbCcpO1xuICBzYXZlU2V0dGluZ3MoKTtcbiAgcmVmcmVzaFNlbGVjdGVkQ291cnNlcygpO1xufVxuXG4vKipcbiAqIFJlZHJhdyB0aGUgbGlzdCBvZiBzZWxlY3RlZCBjb3Vyc2VzXG4gKi9cbmZ1bmN0aW9uIHJlZnJlc2hTZWxlY3RlZENvdXJzZXMoKSB7XG4gIGxldCBuc2NoZWRzID0gTnVtYmVyKHRvdGFsUG9zc2libGVTY2hlZHVsZXMoc2VsZWN0ZWRDb3Vyc2VzKSk7XG4gICQoJyNwb3NzaWJsZS1zY2hlZHVsZXMnKVxuICAgICAgLnRleHQoYCR7bnNjaGVkcy50b0xvY2FsZVN0cmluZygpfSAoJHtuc2NoZWRzLnRvRXhwb25lbnRpYWwoMil9KWApO1xuICAkKCcjZ2VuZXJhdGUtc2NoZWR1bGVzJykucHJvcCgnZGlzYWJsZWQnLCBzZWxlY3RlZENvdXJzZXMuc2l6ZSA9PSAwKTtcbiAgbGV0IGRpdiA9ICQoJyNzZWxlY3RlZC1jb3Vyc2VzJyk7XG4gIGRpdi5lbXB0eSgpO1xuICBsZXQgdWwgPSAkKCc8dWw+Jywge2NsYXNzOiAnbGlzdC1ncm91cCd9KTtcbiAgZGl2LmFwcGVuZCh1bCk7XG4gIHNlbGVjdGVkQ291cnNlcy5mb3JFYWNoKGZ1bmN0aW9uKGNvdXJzZSkge1xuICAgIGxldCBsaSA9ICQoJzxsaT4nLCB7Y2xhc3M6ICdsaXN0LWdyb3VwLWl0ZW0nfSk7XG4gICAgbGV0IGxhYmVsID0gY291cnNlTGFiZWwoY291cnNlKTtcbiAgICBsZXQgYnRuID0gJCgnPGJ1dHRvbj4nLCB7XG4gICAgICBjbGFzczogJ2J0biBidG4tc20gYnRuLWRhbmdlciBmbG9hdC1yaWdodCcsXG4gICAgICBodG1sOiAnPGkgY2xhc3M9XCJmYXMgZmEtdHJhc2gtYWx0XCI+PC9pPicsXG4gICAgICBjbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlbFNlbGVjdGVkQ291cnNlKGNvdXJzZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIGxpLmFwcGVuZChsYWJlbCk7XG5cbiAgICBpZiAoY291cnNlLmdyb3VwcyA9PSBudWxsIHx8IGNvdXJzZS5ncm91cHMubGVuZ3RoID09IDApIHtcbiAgICAgIGxpLmFwcGVuZCgkKCc8aT4nLCB7XG4gICAgICAgIGNsYXNzOiAndGV4dC13YXJuaW5nIGZhcyBmYS1leGNsYW1hdGlvbi10cmlhbmdsZScsXG4gICAgICAgIHRpdGxlOiAnQ291cnNlIGhhcyBubyBncm91cHMnLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGxpLmFwcGVuZChidG4pO1xuICAgIHVsLmFwcGVuZChsaSk7XG4gIH0pO1xufVxuXG5pbXBvcnQgU2NoZWR1bGVyV29ya2VyID0gcmVxdWlyZSgnd29ya2VyLWxvYWRlcj9uYW1lPVtuYW1lXS5qcyEuL3NjaGVkdWxlcl93b3JrZXInKTtcbmxldCBzY2hlZHVsZXJXb3JrZXIgPSBuZXcgU2NoZWR1bGVyV29ya2VyKCk7XG5cbi8qKlxuICogUmVzcG9uZCB0byBzY2hlZHVsaW5nIHJlc3VsdCBmcm9tIHdvcmtlclxuICovXG5zY2hlZHVsZXJXb3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oZTogTWVzc2FnZUV2ZW50KSB7XG4gIGlmIChtYWluRGVidWdMb2dnaW5nKSB7XG4gICAgY29uc29sZS5pbmZvKCdSZWNlaXZlZCBtZXNzYWdlIGZyb20gd29ya2VyOicsIGUpO1xuICB9XG4gICQoJyNnZW5lcmF0ZS1zY2hlZHVsZXMnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgJCgnI3NwaW5uZXInKS5oaWRlKCk7XG4gIGlmIChlLmRhdGEgPT0gbnVsbCkge1xuICAgICQoJyNleGNlcHRpb24tb2NjdXJyZWQtc2NoZWR1bGluZycpLnNob3coKTtcbiAgfSBlbHNlIHtcbiAgICBzZXRQb3NzaWJsZVNjaGVkdWxlcyhlLmRhdGEpO1xuICB9XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGN1c3RvbS1ldmVudHMtdGV4dGFyZWEgaGFzIHZhbGlkIGV2ZW50c1xuICovXG5mdW5jdGlvbiBjaGVja0N1c3RvbUV2ZW50cygpIHtcbiAgbGV0IGVsZW0gPSAkKCcjY3VzdG9tLWV2ZW50cy10ZXh0YXJlYScpO1xuICBlbGVtLnJlbW92ZUNsYXNzKCdpcy1pbnZhbGlkJyk7XG4gIGVsZW0ucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XG5cbiAgdHJ5IHtcbiAgICBsZXQgY291cnNlcyA9IGJ1aWxkQ3VzdG9tRXZlbnRzQ291cnNlcyhlbGVtLnZhbCgpIGFzIHN0cmluZyk7XG4gICAgaWYgKGNvdXJzZXMubGVuZ3RoID4gMCkge1xuICAgICAgZWxlbS5hZGRDbGFzcygnaXMtdmFsaWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlbGVtLmFkZENsYXNzKCdpcy1pbnZhbGlkJyk7XG4gIH1cbn1cbih3aW5kb3cgYXMgYW55KS5jaGVja0N1c3RvbUV2ZW50cyA9IGNoZWNrQ3VzdG9tRXZlbnRzO1xuXG5jb25zdCBjdXN0b21FdmVudFJlZ2V4ID0gbmV3IFJlZ0V4cChbXG4gIC8oU3VufE1vbnxUdWV8V2VkfFRodXxGcml8U2F0KSAvLFxuICAvKFswLTldezJ9KTooWzAtOV17Mn0pLShbMC05XXsyfSk6KFswLTldezJ9KSAvLFxuICAvKC4qKS8sXG5dLm1hcCh4ID0+IHguc291cmNlKS5qb2luKCcnKSk7XG5cbi8vIFRPRE8obHV0emt5KTogaW52ZXJzZURheUluZGV4IGlzIGNhdXNpbmcgdHlwZSBwcm9ibGVtcywgbWFraW5nIHVzIHVzZVxuLy8gc29tZSB0cy1pZ25vcmUuXG5jb25zdCBpbnZlcnNlRGF5SW5kZXggPSB7XG4gIFN1bjogMCxcbiAgTW9uOiAxLFxuICBUdWU6IDIsXG4gIFdlZDogMyxcbiAgVGh1OiA0LFxuICBGcmk6IDUsXG4gIFNhdDogNixcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgY291cnNlIHdpdGggYSBzaW5nbGUgZXZlbnRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlU2luZ2xlRXZlbnRDb3Vyc2UoXG4gICAgbmFtZTogc3RyaW5nLCBkYXk6IG51bWJlciwgc3RhcnRNaW51dGU6IG51bWJlciwgZW5kTWludXRlOiBudW1iZXIpOiBDb3Vyc2Uge1xuICBsZXQgYzogQ291cnNlID0ge1xuICAgIGFjYWRlbWljUG9pbnRzOiAwLFxuICAgIGlkOiAwLFxuICAgIGxlY3R1cmVySW5DaGFyZ2U6ICcnLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgdGVzdERhdGVzOiBbXSxcbiAgICBncm91cHM6IFtdLFxuICB9O1xuXG4gIGxldCBnOiBHcm91cCA9IHtcbiAgICBjb3Vyc2U6IGMsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGlkOiAwLFxuICAgIHRlYWNoZXJzOiBbXSxcbiAgICB0eXBlOiAnbGVjdHVyZScsXG4gICAgZXZlbnRzOiBbXSxcbiAgfTtcblxuICBjLmdyb3Vwcy5wdXNoKGcpO1xuXG4gIGxldCBlOiBBY2FkZW1pY0V2ZW50ID0ge1xuICAgIGRheTogZGF5LFxuICAgIHN0YXJ0TWludXRlOiBzdGFydE1pbnV0ZSxcbiAgICBlbmRNaW51dGU6IGVuZE1pbnV0ZSxcbiAgICBsb2NhdGlvbjogJycsXG4gICAgZ3JvdXA6IGcsXG4gIH07XG5cbiAgZy5ldmVudHMucHVzaChlKTtcblxuICByZXR1cm4gYztcbn1cblxuLyoqXG4gKiBCdWlsZCBjb3Vyc2VzIHdpdGggdGhlIGNvbmZpZ3VyZWQgY3VzdG9tIGV2ZW50c1xuICpcbiAqIEBwYXJhbSBzIC0gQ3VzdG9tIGV2ZW50cywgbGluZXMgbWF0Y2hpbmcgY3VzdG9tRXZlbnRSZWdleFxuICovXG5mdW5jdGlvbiBidWlsZEN1c3RvbUV2ZW50c0NvdXJzZXMoczogc3RyaW5nKTogQ291cnNlW10ge1xuICBsZXQgcmVzdWx0OiBDb3Vyc2VbXSA9IFtdO1xuXG4gIGlmIChzID09ICcnKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHMuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIGxldCBtID0gY3VzdG9tRXZlbnRSZWdleC5leGVjKGxpbmUpO1xuICAgIGlmIChtID09IG51bGwpIHtcbiAgICAgIHRocm93IEVycm9yKCdJbnZhbGlkIGN1c3RvbSBldmVudCBsaW5lOiAnICsgbGluZSk7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZTogaW52ZXJzZURheUluZGV4XG4gICAgbGV0IGRheTogbnVtYmVyID0gaW52ZXJzZURheUluZGV4W21bMV1dO1xuICAgIGxldCBzdGFydE1pbnV0ZSA9IE51bWJlcihOdW1iZXIobVsyXSkgKiA2MCArIE51bWJlcihtWzNdKSk7XG4gICAgbGV0IGVuZE1pbnV0ZSA9IE51bWJlcihOdW1iZXIobVs0XSkgKiA2MCArIE51bWJlcihtWzVdKSk7XG4gICAgbGV0IGRlc2MgPSBtWzZdO1xuXG4gICAgcmVzdWx0LnB1c2goY3JlYXRlU2luZ2xlRXZlbnRDb3Vyc2UoZGVzYywgZGF5LCBzdGFydE1pbnV0ZSwgZW5kTWludXRlKSk7XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogU3RhcnQgYSB3b3JrZXIgdG8gZ2VuZXJhdGUgc2NoZWR1bGVzXG4gKi9cbmZ1bmN0aW9uIGdldFNjaGVkdWxlcygpIHtcbiAgJCgnI2dlbmVyYXRlLXNjaGVkdWxlcycpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICQoJyNzcGlubmVyJykuc2hvdygpO1xuICAkKCcjZXhjZXB0aW9uLW9jY3VycmVkJykuaGlkZSgpO1xuICAkKCcjbm8tc2NoZWR1bGVzJykuaGlkZSgpO1xuICAkKCcjaW5pdGlhbC1pbnN0cnVjdGlvbnMnKS5oaWRlKCk7XG5cbiAgbGV0IGNvdXJzZXNUb1NjaGVkdWxlID0gbmV3IFNldChzZWxlY3RlZENvdXJzZXMpO1xuICB0cnkge1xuICAgIGxldCBjb3Vyc2VzID0gYnVpbGRDdXN0b21FdmVudHNDb3Vyc2VzKHNldHRpbmdzLmN1c3RvbUV2ZW50cyk7XG4gICAgY291cnNlcy5mb3JFYWNoKGMgPT4gY291cnNlc1RvU2NoZWR1bGUuYWRkKGMpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gYnVpbGQgY3VzdG9tIGV2ZW50cyBjb3Vyc2U6JywgZXJyb3IpO1xuICB9XG5cbiAgc2NoZWR1bGVyV29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICBjb3Vyc2VzOiBjb3Vyc2VzVG9TY2hlZHVsZSxcbiAgICBmaWx0ZXJTZXR0aW5nczogc2V0dGluZ3MuZmlsdGVyU2V0dGluZ3MsXG4gIH0pO1xufVxuKHdpbmRvdyBhcyBhbnkpLmdldFNjaGVkdWxlcyA9IGdldFNjaGVkdWxlcztcblxubGV0IHBvc3NpYmxlU2NoZWR1bGVzOiBTY2hlZHVsZVtdID0gW107XG5cbmxldCBjdXJyZW50U2NoZWR1bGUgPSAwO1xuXG4vKipcbiAqIFNldCB0aGUgY29sbGVjdGlvbiBvZiBwb3NzaWJsZSBzY2hlZHVsZXNcbiAqL1xuZnVuY3Rpb24gc2V0UG9zc2libGVTY2hlZHVsZXMoc2NoZWR1bGVzOiBTY2hlZHVsZVtdKSB7XG4gIHBvc3NpYmxlU2NoZWR1bGVzID0gc2NoZWR1bGVzO1xuICBjdXJyZW50U2NoZWR1bGUgPSAwO1xuICBsZXQgZGl2cyA9ICQoJyNzY2hlZHVsZS1icm93c2VyLCAjcmVuZGVyZWQtc2NoZWR1bGUtY29udGFpbmVyJyk7XG4gICQoJyNudW0tc2NoZWR1bGVzJykudGV4dChzY2hlZHVsZXMubGVuZ3RoKTtcbiAgaWYgKHNjaGVkdWxlcy5sZW5ndGggPT0gMCB8fFxuICAgICAgKHNjaGVkdWxlcy5sZW5ndGggPT0gMSAmJiBzY2hlZHVsZXNbMF0uZXZlbnRzLmxlbmd0aCA9PSAwKSkge1xuICAgIGRpdnMuaGlkZSgpO1xuICAgICQoJyNuby1zY2hlZHVsZXMnKS5zaG93KCk7XG4gIH0gZWxzZSB7XG4gICAgZGl2cy5zaG93KCk7XG4gICAgZ29Ub1NjaGVkdWxlKDApO1xuICB9XG59XG5cbi8qKlxuICogSW5jcmVtZW50IHRoZSBjdXJyZW50IGRpc3BsYXllZCBzY2hlZHVsZVxuICovXG5mdW5jdGlvbiBuZXh0U2NoZWR1bGUoKSB7XG4gIGdvVG9TY2hlZHVsZShjdXJyZW50U2NoZWR1bGUgKyAxKTtcbn1cbih3aW5kb3cgYXMgYW55KS5uZXh0U2NoZWR1bGUgPSBuZXh0U2NoZWR1bGU7XG5cbi8qKlxuICogRGVjcmVtZW50IHRoZSBjdXJyZW50IGRpc3BsYXllZCBzY2hlZHVsZVxuICovXG5mdW5jdGlvbiBwcmV2U2NoZWR1bGUoKSB7XG4gIGdvVG9TY2hlZHVsZShjdXJyZW50U2NoZWR1bGUgLSAxKTtcbn1cbih3aW5kb3cgYXMgYW55KS5wcmV2U2NoZWR1bGUgPSBwcmV2U2NoZWR1bGU7XG5cbmNvbnN0IGRheU5hbWVzID0gW1xuICAnU3VuZGF5JyxcbiAgJ01vbmRheScsXG4gICdUdWVzZGF5JyxcbiAgJ1dlZG5lc2RheScsXG4gICdUaHVyc2RheScsXG4gICdGcmlkYXknLFxuICAnU2F0dXJkYXknLFxuXTtcblxuLy8gQ29sb3JzIGFyZSB0YWtlbiBmcm9tIHRoaXMgcGFnZSwgYnV0IHJlb3JkZXJlZCB0byBtYXhpbWl6ZSBjb250cmFzdDpcbi8vIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzQuMS9nZXR0aW5nLXN0YXJ0ZWQvdGhlbWluZy9cbmNvbnN0IGNvdXJzZUNvbG9ycyA9IFtcbiAgWycjMDA3YmZmJywgJyNmZmYnXSwgIC8vIGJsdWVcbiAgWycjZTgzZThjJywgJyNmZmYnXSwgIC8vIHBpbmtcbiAgWycjZmZjMTA3JywgJyMwMDAnXSwgIC8vIHllbGxvd1xuICBbJyM2NjEwZjInLCAnI2ZmZiddLCAgLy8gaW5kaWdvXG4gIFsnI2RjMzU0NScsICcjZmZmJ10sICAvLyByZWRcbiAgWycjMjhhNzQ1JywgJyNmZmYnXSwgIC8vIGdyZWVuXG4gIFsnIzZmNDJjMScsICcjZmZmJ10sICAvLyBwdXJwbGVcbiAgWycjZmQ3ZTE0JywgJyMwMDAnXSwgIC8vIG9yYW5nZVxuICBbJyMyMGM5OTcnLCAnI2ZmZiddLCAgLy8gdGVhbFxuICBbJyMxN2EyYjgnLCAnI2ZmZiddLCAgLy8gY3lhblxuICBbJyM2Yzc1N2QnLCAnI2ZmZiddLCAgLy8gZ3JheVxuICBbJyMzNDNhNDAnLCAnI2ZmZiddLCAgLy8gZGFyay1ncmF5XG5dO1xuXG4vKipcbiAqIEdldCBhcHByb3ByaWF0ZSBjb2xvcnMgZm9yIGNvdXJzZXNcbiAqL1xuZnVuY3Rpb24gZ2V0Q291cnNlQ29sb3JNYXAoY291cnNlczogU2V0PENvdXJzZT4pOiBNYXA8bnVtYmVyLCBzdHJpbmdbXT4ge1xuICBsZXQgbnVtYmVycyA9IEFycmF5LmZyb20oY291cnNlcy52YWx1ZXMoKSkubWFwKGMgPT4gYy5pZCkuc29ydCgpO1xuXG4gIC8vIDAgY291cnNlIElEIGlzIGZvciBjdXN0b20gZXZlbnRzXG4gIG51bWJlcnMucHVzaCgwKTtcblxuICBsZXQgbnVtc0FuZENvbG9ycyA9XG4gICAgICBudW1iZXJzLm1hcCgobnVtLCBpKSA9PiBbbnVtLCBjb3Vyc2VDb2xvcnNbaV1dKSBhcyBbbnVtYmVyLCBzdHJpbmdbXV1bXTtcblxuICByZXR1cm4gbmV3IE1hcChudW1zQW5kQ29sb3JzKTtcbn1cblxuLyoqXG4gKiBEaXNwbGF5IHNjaGVkdWxlIGksIG1vZHVsbyB0aGUgcG9zc2libGUgcmFuZ2UgMC0obnVtU2NoZWR1bGVzIC0gMSlcbiAqL1xuZnVuY3Rpb24gZ29Ub1NjaGVkdWxlKGk6IG51bWJlcikge1xuICBsZXQgbWF4ID0gcG9zc2libGVTY2hlZHVsZXMubGVuZ3RoO1xuICBpID0gKGkgKyBtYXgpICUgbWF4O1xuICBjdXJyZW50U2NoZWR1bGUgPSBpO1xuICAkKCcjY3VycmVudC1zY2hlZHVsZS1pZCcpLnRleHQoaSArIDEpO1xuICBsZXQgc2NoZWR1bGUgPSBwb3NzaWJsZVNjaGVkdWxlc1tpXTtcblxuICB3cml0ZVNjaGVkdWxlQ29udGVudHMoJCgnI3NjaGVkdWxlLWNvbnRlbnRzJyksIHNjaGVkdWxlKTtcbiAgcmVuZGVyU2NoZWR1bGUoXG4gICAgICAkKCcjcmVuZGVyZWQtc2NoZWR1bGUnKVswXSwgc2NoZWR1bGUsIGdldENvdXJzZUNvbG9yTWFwKHNlbGVjdGVkQ291cnNlcykpO1xufVxuXG5sZXQgc29ydGVkQnlSYXRpbmcgPSAnJztcblxubGV0IHNvcnRlZEJ5UmF0aW5nQXNjID0gdHJ1ZTtcblxuLy8gVE9ETyhsdXR6a3kpOiBhbGxSYXRpbmdzIGJyZWFrcyB0eXBlc2NyaXB0IHR5cGUgY2hlY2tzIGFuZCBmb3JjZXMgdXMgdG9cbi8vIHVzZSBhIGxvdCBvZiB0cy1pZ25vcmUgY29tbWVudHMuXG5jb25zdCBhbGxSYXRpbmdzID0ge1xuICBlYXJsaWVzdFN0YXJ0OiB7XG4gICAgbmFtZTogJ0VhcmxpZXN0IHN0YXJ0JyxcbiAgICBleHBsYW5hdGlvbjogJ0hvdXIgYXQgd2hpY2ggdGhlIGVhcmxpZXN0IGNsYXNzIG9mIHRoZSB3ZWVrIHN0YXJ0JyxcbiAgICBiYWRnZVRleHRGdW5jOiAoczogbnVtYmVyKSA9PiBgRWFybGllc3Qgc3RhcnQ6ICR7c31gLFxuICB9LFxuICBsYXRlc3RGaW5pc2g6IHtcbiAgICBuYW1lOiAnTGF0ZXN0IGZpbmlzaCcsXG4gICAgZXhwbGFuYXRpb246ICdIb3VyIGF0IHdoaWNoIHRoZSBsYXRlc3QgY2xhc3Mgb2YgdGhlIHdlZWsgZmluaXNoZXMnLFxuICAgIGJhZGdlVGV4dEZ1bmM6IChzOiBudW1iZXIpID0+IGBMYXRlc3QgZmluaXNoOiAke3N9YCxcbiAgfSxcbiAgbnVtUnVuczoge1xuICAgIG5hbWU6ICdOdW1iZXIgb2YgcnVucycsXG4gICAgZXhwbGFuYXRpb246ICdOdW1iZXIgb2YgYWRqYWNlbnQgY2xhc3NlcyBpbiBkaWZmZXJlbnQgYnVpbGRpbmdzJyxcbiAgICBiYWRnZVRleHRGdW5jOiAoczogbnVtYmVyKSA9PiBgJHtzfSBydW5zYCxcbiAgfSxcbiAgZnJlZURheXM6IHtcbiAgICBuYW1lOiAnRnJlZSBkYXlzJyxcbiAgICBleHBsYW5hdGlvbjogJ051bWJlciBvZiBkYXlzIHdpdGggbm8gY2xhc3NlcycsXG4gICAgYmFkZ2VUZXh0RnVuYzogKHM6IG51bWJlcikgPT4gYCR7c30gZnJlZSBkYXlzYCxcbiAgfSxcbn07XG5cbi8qKlxuICogU29ydCBjdXJyZW50IHNjaGVkdWxlIGJ5IHJhdGluZ1xuICovXG5mdW5jdGlvbiBzb3J0QnlSYXRpbmcocmF0aW5nOiBzdHJpbmcpIHtcbiAgaWYgKHNvcnRlZEJ5UmF0aW5nID09IHJhdGluZykge1xuICAgIHNvcnRlZEJ5UmF0aW5nQXNjID0gIXNvcnRlZEJ5UmF0aW5nQXNjO1xuICB9XG5cbiAgc29ydGVkQnlSYXRpbmcgPSByYXRpbmc7XG4gIHBvc3NpYmxlU2NoZWR1bGVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICByZXR1cm4gKHNvcnRlZEJ5UmF0aW5nQXNjID8gMSA6IC0xKSAqIChhLnJhdGluZ1tyYXRpbmddIC0gYi5yYXRpbmdbcmF0aW5nXSk7XG4gIH0pO1xuXG4gIGdvVG9TY2hlZHVsZSgwKTtcbiAgT2JqZWN0LmtleXMoYWxsUmF0aW5ncykuZm9yRWFjaChmdW5jdGlvbihyYXRpbmcpIHtcbiAgICAkKGAjcmF0aW5nLWJhZGdlLSR7cmF0aW5nfWApXG4gICAgICAgIC5yZXBsYWNlV2l0aChnZXRSYXRpbmdCYWRnZShyYXRpbmcsIHBvc3NpYmxlU2NoZWR1bGVzWzBdKSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEdldCBhIGJhZGdlIGZvciB0aGUgZ2l2ZW4gcmF0aW5nIGFjY29yZGluZyB0byB0aGUgc2NoZWR1bGUgdHlwZVxuICovXG5mdW5jdGlvbiBnZXRSYXRpbmdCYWRnZShyYXRpbmc6IHN0cmluZywgc2NoZWR1bGU6IFNjaGVkdWxlKTogSlF1ZXJ5IHtcbiAgbGV0IHJlc3VsdCA9ICQoJzxhPicsIHtcbiAgICBjbGFzczogJ2JhZGdlIGJhZGdlLWluZm8nLFxuICAgIGlkOiBgcmF0aW5nLWJhZGdlLSR7cmF0aW5nfWAsXG4gICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgIHRleHQ6IGFsbFJhdGluZ3NbcmF0aW5nXS5iYWRnZVRleHRGdW5jKHNjaGVkdWxlLnJhdGluZ1tyYXRpbmddKSxcbiAgICAvLyBAdHMtaWdub3JlOiBhbGxSYXRpbmdzXG4gICAgdGl0bGU6IGFsbFJhdGluZ3NbcmF0aW5nXS5leHBsYW5hdGlvbixcbiAgICBocmVmOiAnIy8nLFxuICAgIGNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHNvcnRCeVJhdGluZyhyYXRpbmcpO1xuICAgIH0sXG4gIH0pO1xuXG4gIGlmIChzb3J0ZWRCeVJhdGluZyA9PSByYXRpbmcpIHtcbiAgICBsZXQgaWNvbiA9IHNvcnRlZEJ5UmF0aW5nQXNjID8gJ2ZhLXNvcnQtdXAnIDogJ2ZhLXNvcnQtZG93bic7XG4gICAgcmVzdWx0LmFwcGVuZChgIDxpIGNsYXNzPVwiZmFzICR7aWNvbn1cIj48L2k+YCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFdyaXRlIHRoZSBzY2hlZHVsZSBjb250ZW50cyB0byB0YXJnZXRcbiAqL1xuZnVuY3Rpb24gd3JpdGVTY2hlZHVsZUNvbnRlbnRzKHRhcmdldDogSlF1ZXJ5LCBzY2hlZHVsZTogU2NoZWR1bGUpIHtcbiAgdGFyZ2V0LmVtcHR5KCk7XG5cbiAgT2JqZWN0LmtleXMoYWxsUmF0aW5ncylcbiAgICAgIC5tYXAocmF0aW5nID0+IGdldFJhdGluZ0JhZGdlKHJhdGluZywgc2NoZWR1bGUpKVxuICAgICAgLmZvckVhY2goZnVuY3Rpb24oYmFkZ2UpIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZChiYWRnZSkuYXBwZW5kKCcgJyk7XG4gICAgICB9KTtcblxuICBsZXQgdWwgPSAkKCc8dWw+Jywge2NsYXNzOiAnbGlzdC1ncm91cCd9KTtcbiAgdGFyZ2V0LmFwcGVuZCh1bCk7XG5cbiAgYnlEYXkoc2NoZWR1bGUpLmZvckVhY2goZnVuY3Rpb24oZGF5RXZlbnRzKSB7XG4gICAgbGV0IGRheUVudHJ5ID0gJCgnPGxpPicsIHtcbiAgICAgIGNsYXNzOiAnbGlzdC1ncm91cC1pdGVtJyxcbiAgICAgIGNzczogeydwYWRkaW5nLXRvcCc6ICcycHgnLCAncGFkZGluZy1ib3R0b20nOiAnMnB4J30sXG4gICAgICBodG1sOiAkKCc8c21hbGw+Jywge1xuICAgICAgICBjbGFzczogJ2ZvbnQtd2VpZ2h0LWJvbGQnLFxuICAgICAgICB0ZXh0OiBkYXlOYW1lc1tkYXlFdmVudHNbMF0uZGF5XSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHVsLmFwcGVuZChkYXlFbnRyeSk7XG4gICAgLy8gbGV0IGV2ZW50TGlzdCA9ICQoJzx1bD4nKTtcbiAgICAvLyAgICBkYXlFbnRyeS5hcHBlbmQoZXZlbnRMaXN0KTtcbiAgICBkYXlFdmVudHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICBsZXQgZXZlbnRFbnRyeSA9ICQoJzxsaT4nLCB7XG4gICAgICAgIGNsYXNzOiAnbGlzdC1ncm91cC1pdGVtJyxcbiAgICAgIH0pO1xuICAgICAgbGV0IHN0YXJ0VGltZSA9IG1pbnV0ZXNUb1RpbWUoZS5zdGFydE1pbnV0ZSk7XG4gICAgICBsZXQgbG9jYXRpb24gPSBlLmxvY2F0aW9uIHx8ICdbdW5rbm93bl0nO1xuICAgICAgbGV0IGVuZFRpbWUgPSBtaW51dGVzVG9UaW1lKGUuZW5kTWludXRlKTtcbiAgICAgIGxldCB0ZWFjaGVycyA9IGUuZ3JvdXAudGVhY2hlcnMuam9pbignLCcpIHx8ICdbdW5rbm93bl0nO1xuICAgICAgZXZlbnRFbnRyeS5odG1sKGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICA8c21hbGwgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+XG4gICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtY2xvY2tcIj48L2k+XG4gICAgICAgICAgICAgJHtzdGFydFRpbWV9LSR7ZW5kVGltZX1cbiAgICAgICAgICAgPC9zbWFsbD5cbiAgICAgICAgICAgPHNtYWxsPlxuICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLW1hcC1tYXJrZXJcIj48L2k+XG4gICAgICAgICAgICAgPHNwYW4gZGlyPVwicnRsXCI+JHtsb2NhdGlvbn08L3NwYW4+XG4gICAgICAgICAgIDwvc21hbGw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGRpcj1cInJ0bFwiPiR7ZGlzcGxheU5hbWUoZS5ncm91cCl9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW5cIj5cbiAgICAgICAgICA8c21hbGw+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFsa2JvYXJkLXRlYWNoZXJcIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBkaXI9XCJydGxcIj4ke3RlYWNoZXJzfTwvc3Bhbj5cbiAgICAgICAgICA8L3NtYWxsPlxuICAgICAgICAgIDxzbWFsbCBjbGFzcz1cInRleHQtbXV0ZWRcIj5cbiAgICAgICAgICAgICR7Zm9ybWF0Q291cnNlSWQoZS5ncm91cC5jb3Vyc2UuaWQpfSwgZ3JvdXAgJHtlLmdyb3VwLmlkfVxuICAgICAgICAgIDwvc21hbGw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgKTtcbiAgICAgIHVsLmFwcGVuZChldmVudEVudHJ5KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogR2V0IGV2ZW50cyBmb3Igc2NoZWR1bGUgc3BsaXQgaW50byBwZXItZGF5IGFycmF5c1xuICpcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGFycmF5cyBvZiBldmVudHMsIHdpdGggZW50cnkgaXMgYW4gYXJyYXkgb2YgZXZlbnRzXG4gKiAgICAgICAgICB3aXRoIHRoZSBzYW1lIGRheSwgc29ydGVkIGFzY2VuZGluZy5cbiAqL1xuZnVuY3Rpb24gYnlEYXkoc2NoZWR1bGU6IFNjaGVkdWxlKTogQWNhZGVtaWNFdmVudFtdW10ge1xuICBsZXQgZXZlbnRzID0gc2NoZWR1bGUuZXZlbnRzLnNsaWNlKCk7XG4gIGxldCByZXN1bHQ6IEFjYWRlbWljRXZlbnRbXVtdID0gW1tdXTtcblxuICBzb3J0RXZlbnRzKGV2ZW50cyk7XG5cbiAgbGV0IGN1cnJlbnREYXkgPSBldmVudHNbMF0uZGF5O1xuXG4gIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS5kYXkgIT0gY3VycmVudERheSkge1xuICAgICAgcmVzdWx0LnB1c2goW10pO1xuICAgICAgY3VycmVudERheSA9IGUuZGF5O1xuICAgIH1cbiAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdLnB1c2goZSk7XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRmluZCBhIGNvdXJzZSBieSBpdHMgSURcbiAqL1xuZnVuY3Rpb24gZ2V0Q291cnNlQnlJRChpZDogbnVtYmVyKTogQ291cnNlIHtcbiAgcmV0dXJuIGN1cnJlbnRDYXRhbG9nQnlDb3Vyc2VJRC5nZXQoaWQpO1xufVxuXG4vKipcbiAqIEdldHMgbmlja25hbWVzIG9yIGFiYnJldmlhdGlvbnMgZm9yIGEgY291cnNlXG4gKi9cbmZ1bmN0aW9uIGdldE5pY2tuYW1lcyhjb3Vyc2U6IENvdXJzZSk6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSBbXTtcblxuICBpZiAoY291cnNlLm5hbWUuaW5jbHVkZXMoJ9eX16nXkdeV158g15PXmdek16jXoNem15nXkNec15kg15XXkNeZ16DXmNeS16jXnNeZJykpIHtcbiAgICByZXN1bHQucHVzaCgn15fXk9eV15AnLCAn15fXk9eVXCLXkCcpO1xuICB9XG4gIGlmIChjb3Vyc2UubmFtZS5pbmNsdWRlcygn157Xk9ei15kg15TXnteX16nXkScpKSB7XG4gICAgcmVzdWx0LnB1c2goJ9ee15PXnteXJywgJ9ee15PXnlwi15cnKTtcbiAgfVxuICBpZiAoY291cnNlLm5hbWUuaW5jbHVkZXMoJ9ek15nXodeZ16fXlCcpKSB7XG4gICAgcmVzdWx0LnB1c2goJ9ek15nXlteZ16fXlCcpO1xuICB9XG4gIGlmIChjb3Vyc2UubmFtZS5pbmNsdWRlcygn15DXoNec15nXlteUINeg15XXnteo15nXqicpKSB7XG4gICAgcmVzdWx0LnB1c2goJ9eg15XXnteo15nXlteUJyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBTZXQgdXAgdGhlIGNvdXJzZSBzZWxlY3Rpb24gc2VsZWN0aXplLmpzIGJveFxuICovXG5mdW5jdGlvbiBjb3Vyc2VzU2VsZWN0aXplU2V0dXAoKSB7XG4gIGxldCBzZWxlY3RCb3ggPSAkKCcjY291cnNlcy1zZWxlY3RpemUnKTtcblxuICAvLyBHZXR0aW5nIHRoZSB0eXBlcyByaWdodCBmb3Igc2VsZWN0aXplIGlzIGRpZmZpY3VsdCA6L1xuXG4gIGxldCBvcHRzOiBhbnkgPSBbXTtcbiAgbGV0IG9wdGdyb3VwczogYW55ID0gW107XG5cbiAgY3VycmVudENhdGFsb2cuZm9yRWFjaChmdW5jdGlvbihmYWN1bHR5KSB7XG4gICAgb3B0Z3JvdXBzLnB1c2goe2xhYmVsOiBmYWN1bHR5Lm5hbWUsIHZhbHVlOiBmYWN1bHR5Lm5hbWV9KTtcbiAgICBmYWN1bHR5LmNvdXJzZXMuZm9yRWFjaChmdW5jdGlvbihjb3Vyc2UpIHtcbiAgICAgIG9wdHMucHVzaCh7XG4gICAgICAgIG9wdGdyb3VwOiBmYWN1bHR5Lm5hbWUsXG4gICAgICAgIHZhbHVlOiBjb3Vyc2UuaWQsXG4gICAgICAgIHRleHQ6IGAke2Zvcm1hdENvdXJzZUlkKGNvdXJzZS5pZCl9IC0gJHtjb3Vyc2UubmFtZX1gLFxuICAgICAgICBuaWNrbmFtZXM6IGdldE5pY2tuYW1lcyhjb3Vyc2UpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdEJveC5zZWxlY3RpemUoe1xuICAgIG9wdGlvbnM6IG9wdHMsXG4gICAgb3B0Z3JvdXBzOiBvcHRncm91cHMsXG4gICAgc2VhcmNoRmllbGQ6IFsndGV4dCcsICduaWNrbmFtZXMnXSxcbiAgICBvbkl0ZW1BZGQ6IGZ1bmN0aW9uKGNvdXJzZUlEKSB7XG4gICAgICBpZiAoY291cnNlSUQgPT0gJycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGNvdXJzZSA9IGdldENvdXJzZUJ5SUQoTnVtYmVyKGNvdXJzZUlEKSk7XG4gICAgICBhZGRTZWxlY3RlZENvdXJzZShjb3Vyc2UpO1xuICAgICAgc2VsZWN0Qm94WzBdLnNlbGVjdGl6ZS5jbGVhcigpO1xuICAgIH0sXG4gIH0pO1xufVxuXG4vKipcbiAqIEdldCBhIG51bGwgcmF0aW5nXG4gKi9cbmZ1bmN0aW9uIGdldE51bGxSYXRpbmcoKTogU2NoZWR1bGVSYXRpbmcge1xuICByZXR1cm4ge1xuICAgIGVhcmxpZXN0U3RhcnQ6IG51bGwsXG4gICAgZnJlZURheXM6IG51bGwsXG4gICAgbGF0ZXN0RmluaXNoOiBudWxsLFxuICAgIG51bVJ1bnM6IG51bGwsXG4gIH07XG59XG5cbi8qKlxuICogTG9hZCBzZXR0aW5ncyBmcm9tIGxvY2FsU3RvcmFnZVxuICpcbiAqIEBwYXJhbSBzIC0gSlNPTiBmb3JtIG9mIHNldHRpbmdzXG4gKi9cbmZ1bmN0aW9uIGxvYWRTZXR0aW5ncyhzOiBzdHJpbmcpOiBTZXR0aW5ncyB7XG4gIGxldCByZXN1bHQ6IFNldHRpbmdzID0ge1xuICAgIGNhdGFsb2dVcmw6IGRlZmF1bHRDYXRhbG9nVXJsLFxuICAgIHNlbGVjdGVkQ291cnNlczogW10sXG4gICAgZm9yYmlkZGVuR3JvdXBzOiBbXSxcbiAgICBjdXN0b21FdmVudHM6ICcnLFxuICAgIGZpbHRlclNldHRpbmdzOiB7XG4gICAgICBmb3JiaWRkZW5Hcm91cHM6IFtdLFxuICAgICAgbm9Db2xsaXNpb25zOiB0cnVlLFxuICAgICAgcmF0aW5nTWluOiBnZXROdWxsUmF0aW5nKCksXG4gICAgICByYXRpbmdNYXg6IGdldE51bGxSYXRpbmcoKSxcbiAgICB9LFxuICB9O1xuXG4gIGlmIChzICE9ICcnKSB7XG4gICAgcmVzdWx0ID0gJC5leHRlbmQodHJ1ZSAvKiBkZWVwICovLCByZXN1bHQsIEpTT04ucGFyc2UocykgYXMgU2V0dGluZ3MpIGFzXG4gICAgICAgIFNldHRpbmdzO1xuICB9XG5cbiAgaWYgKG1haW5EZWJ1Z0xvZ2dpbmcpIHtcbiAgICBjb25zb2xlLmluZm8oJ0xvYWRlZCBzZXR0aW5nczonLCByZXN1bHQpO1xuICB9XG5cbiAgJCgnI2NhdGFsb2ctdXJsJykudmFsKHJlc3VsdC5jYXRhbG9nVXJsKTtcbiAgJCgnI2N1c3RvbS1ldmVudHMtdGV4dGFyZWEnKS52YWwocmVzdWx0LmN1c3RvbUV2ZW50cyk7XG5cbiAge1xuICAgIGxldCBmcyA9IHJlc3VsdC5maWx0ZXJTZXR0aW5ncztcbiAgICBzZXRDaGVja2JveFZhbHVlQnlJZCgnZmlsdGVyLm5vQ29sbGlzaW9ucycsIGZzLm5vQ29sbGlzaW9ucyk7XG5cbiAgICBPYmplY3Qua2V5cyhhbGxSYXRpbmdzKS5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgICQoYCNyYXRpbmctJHtyfS1taW5gKS52YWwoZnMucmF0aW5nTWluW3JdKTtcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgICQoYCNyYXRpbmctJHtyfS1tYXhgKS52YWwoZnMucmF0aW5nTWF4W3JdKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRmlndXJlIG91dCB0aGUgdG90YWwgbnVtYmVyIG9mIHNjaGVkdWxlcyBwb3NzaWJsZSBmb3IgdGhlIHNldCBvZiBjb3Vyc2VzLFxuICogZGlzcmVnYXJkaW5nIGZpbHRlcnMuXG4gKi9cbmZ1bmN0aW9uIHRvdGFsUG9zc2libGVTY2hlZHVsZXMoY291cnNlczogU2V0PENvdXJzZT4pOiBudW1iZXIge1xuICBsZXQgayA9IEFycmF5LmZyb20oY291cnNlcy52YWx1ZXMoKSk7XG5cbiAgcmV0dXJuIGtcbiAgICAgIC5tYXAoXG4gICAgICAgICAgY291cnNlID0+IGdyb3Vwc0J5VHlwZShjb3Vyc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHQgPT4gdC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICogYiwgMSkpXG4gICAgICAucmVkdWNlKChhLCBiKSA9PiBhICogYiwgMSk7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpbWl0LWJ5LXJhdGluZ3MgZm9ybSBmb3IgdGhlIHNldHRpbmdzIHN1YnBhZ2VcbiAqL1xuZnVuY3Rpb24gYnVpbGRSYXRpbmdzTGltaXRGb3JtKCkge1xuICBsZXQgZm9ybSA9ICQoJyNyYXRpbmctbGltaXRzLWZvcm0nKTtcbiAgT2JqZWN0LmtleXMoYWxsUmF0aW5ncykuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgbGV0IHJvdyA9ICQoJzxkaXY+Jywge2NsYXNzOiAncm93J30pO1xuICAgIGZvcm0uYXBwZW5kKHJvdyk7XG4gICAgcm93LmFwcGVuZCgkKCc8ZGl2PicsIHtcbiAgICAgIGNsYXNzOiAnY29sIGNvbC1mb3JtLWxhYmVsJyxcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgIHRleHQ6IGFsbFJhdGluZ3Nbcl0ubmFtZSxcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgIHRpdGxlOiBhbGxSYXRpbmdzW3JdLmV4cGxhbmF0aW9uLFxuICAgIH0pKTtcbiAgICByb3cuYXBwZW5kKCQoJzxkaXY+Jywge1xuICAgICAgY2xhc3M6ICdjb2wnLFxuICAgICAgaHRtbDogJCgnPGlucHV0PicsIHtcbiAgICAgICAgaWQ6IGByYXRpbmctJHtyfS1taW5gLFxuICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgY2xhc3M6ICdmb3JtLWNvbnRyb2wnLFxuICAgICAgICBwbGFjZWhvbGRlcjogJy3iiJ4nLFxuICAgICAgICBjaGFuZ2U6IHNhdmVTZXR0aW5ncyxcbiAgICAgIH0pLFxuICAgIH0pKTtcbiAgICByb3cuYXBwZW5kKCQoJzxkaXY+Jywge1xuICAgICAgY2xhc3M6ICdjb2wnLFxuICAgICAgaHRtbDogJCgnPGlucHV0PicsIHtcbiAgICAgICAgaWQ6IGByYXRpbmctJHtyfS1tYXhgLFxuICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgY2xhc3M6ICdmb3JtLWNvbnRyb2wnLFxuICAgICAgICBwbGFjZWhvbGRlcjogJ+KInicsXG4gICAgICAgIGNoYW5nZTogc2F2ZVNldHRpbmdzLFxuICAgICAgfSksXG4gICAgfSkpO1xuICB9KTtcbn1cblxuYnVpbGRSYXRpbmdzTGltaXRGb3JtKCk7XG5cbmxldCBzZXR0aW5ncyA9IGxvYWRTZXR0aW5ncyh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3R0aW1lM19zZXR0aW5ncycpKTtcblxuZm9yYmlkZGVuR3JvdXBzID0gbmV3IFNldChzZXR0aW5ncy5maWx0ZXJTZXR0aW5ncy5mb3JiaWRkZW5Hcm91cHMpO1xudXBkYXRlRm9yYmlkZGVuR3JvdXBzKCk7XG5cbmxvYWRDYXRhbG9nKHNldHRpbmdzLmNhdGFsb2dVcmwpXG4gICAgLnRoZW4oXG4gICAgICAgIGZ1bmN0aW9uKGNhdGFsb2cpIHtcbiAgICAgICAgICBpZiAobWFpbkRlYnVnTG9nZ2luZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRlZCBjYXRhbG9nOicsIGNhdGFsb2cpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50Q2F0YWxvZyA9IGNhdGFsb2c7XG4gICAgICAgICAgY3VycmVudENhdGFsb2dCeUNvdXJzZUlEID0gbmV3IE1hcCgpO1xuXG4gICAgICAgICAgY3VycmVudENhdGFsb2cuZm9yRWFjaChmdW5jdGlvbihmYWN1bHR5KSB7XG4gICAgICAgICAgICBmYWN1bHR5LmNvdXJzZXMuZm9yRWFjaChmdW5jdGlvbihjb3Vyc2UpIHtcbiAgICAgICAgICAgICAgY3VycmVudENhdGFsb2dCeUNvdXJzZUlELnNldChjb3Vyc2UuaWQsIGNvdXJzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHdyaXRlQ2F0YWxvZ1NlbGVjdG9yKCk7XG4gICAgICAgICAgc2V0dGluZ3Muc2VsZWN0ZWRDb3Vyc2VzLmZvckVhY2goZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGFkZFNlbGVjdGVkQ291cnNlQnlJRChpZCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gYWRkIGNvdXJzZSAke2lkfTpgLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY291cnNlc1NlbGVjdGl6ZVNldHVwKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgJCgnI2V4Y2VwdGlvbi1vY2N1cnJlZC1jYXRhbG9nJykuc2hvdygpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIGNhdGFsb2c6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbiIsImltcG9ydCB7QWNhZGVtaWNFdmVudCwgU2NoZWR1bGV9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7ZXZlbnRzQ29sbGlkZX0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHtkaXNwbGF5TmFtZSwgbWludXRlc1RvVGltZX0gZnJvbSAnLi9mb3JtYXR0aW5nJztcblxuLyoqXG4gKiBMYXllcmVkIGV2ZW50cyBmb3IgcmVuZGVyaW5nIG9uIHNjcmVlblxuICpcbiAqIEV4cGxhbmF0aW9uOiBTdXBwb3NlIHlvdSBoYXZlIGV2ZW50cyBBLCBCLCBDLCB0aGF0IGNvbGxpZGUgbGlrZSBzbyAodGltZVxuICogYmVpbmcgaG9yaXpvbnRhbCk6XG4gKlxuICogICAgW0FBQUFBQUFdXG4gKiBbQkJCQkJCXVxuICogICAgICAgICBbQ0NDQ0NDXVxuICpcbiAqIEJlY2F1c2UgdGhlIGNvbGxpc2lvbnMgYXJlIEEtQiBhbmQgQS1DIChidXQgbmV2ZXIgQi1DKSwgdGhleSBjYW4gYmUgbGFpZFxuICogb3V0LCBmb3IgZXhhbXBsZSwgbGlrZSBzbzpcbiAqXG4gKiBbQkJCQkJCXVtDQ0NDQ0NdXG4gKiAgICBbQUFBQUFBQV1cbiAqXG4gKiBJbiB0aGlzIGNhc2UsIHRoZSBudW1MYXllcnMgZm9yIGFsbCBldmVudHMgaXMgMiwgQiBhbmQgQyBhcmUgb24gbGF5ZXIgMCwgYW5kXG4gKiBBIGlzIG9uIGxheWVyIDEuIElmIEMgd2VyZSB0byBzdGFydCBhIGJpdCBlYXJsaWVyLCB0aG91Z2gsIHRocmVlIGxheWVycyB3b3VsZFxuICogYmUgbmVlZGVkOlxuICpcbiAqIFtCQkJCQkJdXG4gKiAgICAgIFtDQ0NDQ0NdXG4gKiAgICBbQUFBQUFBQV1cbiAqXG4gKiBJbiB0aGlzIGNhc2UgdGhlIG51bUxheWVycyBmb3IgYWxsIGV2ZW50cyBpcyAzLCBhbmQgQiwgQywgYW5kIEEgYXJlIG9uIGxheWVyc1xuICogMCwgMSwgYW5kIDIgcmVzcGVjdGl2ZWx5LlxuICovXG5jbGFzcyBMYXllcmVkRXZlbnQge1xuICBldmVudDogQWNhZGVtaWNFdmVudDtcbiAgbGF5ZXI6IG51bWJlcjtcbiAgbnVtTGF5ZXJzOiBudW1iZXI7XG59XG5cbi8qKlxuICogU29ydCBldmVudHMgaW50byBidWNrZXRzIG9mIGNvbGxpZGluZyBldmVudHMuXG4gKlxuICogU2hhbWVsZXNzbHkgbGlmdGVkIGZyb20gYm9hemcgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9sdXR6a3kvdHRpbWUvYmxvYi9tYXN0ZXIvbGliL3R0aW1lL3RjYWwvdGNhbC5yYlxuICpcbiAqIFRPRE8obHV0emt5KTogVGhpcyBpcyBleHBvcnRlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5b3V0TGF5ZXJlZEV2ZW50cyhldmVudHM6IEFjYWRlbWljRXZlbnRbXSk6IExheWVyZWRFdmVudFtdIHtcbiAgbGV0IHJlc3VsdDogTGF5ZXJlZEV2ZW50W10gPSBbXTtcblxuICBsZXQgcmVtYWluaW5nID0gZXZlbnRzLnNsaWNlKCk7XG5cbiAgd2hpbGUgKHJlbWFpbmluZy5sZW5ndGggPiAwKSB7XG4gICAgbGV0IHNlbGVjdGVkID0gbmV3IFNldChbcmVtYWluaW5nWzBdXSk7XG4gICAgbGV0IHNlbGVjdGVkTW9yZUV2ZW50cyA9IHRydWU7XG5cbiAgICB3aGlsZSAoc2VsZWN0ZWRNb3JlRXZlbnRzKSB7XG4gICAgICBzZWxlY3RlZE1vcmVFdmVudHMgPSBmYWxzZTtcbiAgICAgIGxldCBvbGRTZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgc2VsZWN0ZWQgPSBuZXcgU2V0KCk7XG4gICAgICBvbGRTZWxlY3RlZC5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgc2VsZWN0ZWQuYWRkKHMpO1xuICAgICAgICByZW1haW5pbmcuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgaWYgKGV2ZW50c0NvbGxpZGUoW3IsIHNdKSkge1xuICAgICAgICAgICAgc2VsZWN0ZWQuYWRkKHIpO1xuICAgICAgICAgICAgc2VsZWN0ZWRNb3JlRXZlbnRzID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJlbWFpbmluZyA9IHJlbWFpbmluZy5maWx0ZXIoeCA9PiAhc2VsZWN0ZWQuaGFzKHgpKTtcbiAgICB9XG5cbiAgICBsZXQgbGF5ZXJzOiBBY2FkZW1pY0V2ZW50W11bXSA9IFtdO1xuXG4gICAgc2VsZWN0ZWQuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICBsZXQgYXNzaWduZWRUb0xheWVyID0gZmFsc2U7XG4gICAgICBsYXllcnMuc29tZShmdW5jdGlvbihsYXllciwgXykge1xuICAgICAgICBpZiAoIWV2ZW50c0NvbGxpZGUobGF5ZXIuY29uY2F0KFtzXSkpKSB7XG4gICAgICAgICAgYXNzaWduZWRUb0xheWVyID0gdHJ1ZTtcbiAgICAgICAgICBsYXllci5wdXNoKHMpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWFzc2lnbmVkVG9MYXllcikge1xuICAgICAgICAvLyBObyBsYXllciBoYXMgYmVlbiBhc3NpZ25lZCB5ZXQsIHNvIGFsbCBsYXllcnMgbXVzdCBjb2xsaWRlIHdpdGhcbiAgICAgICAgLy8gcy4gQ3JlYXRlIGEgbmV3IG9uZS5cbiAgICAgICAgbGF5ZXJzLnB1c2goW3NdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uKGwsIGkpIHtcbiAgICAgIGwuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBldmVudDogcyxcbiAgICAgICAgICBsYXllcjogaSxcbiAgICAgICAgICBudW1MYXllcnM6IGxheWVycy5sZW5ndGgsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldCB0aGUgc3RhcnQgdGltZSBvZiB0aGUgZWFybGllc3QgZXZlbnQgaW4gdGhlIHNjaGVkdWxlXG4gKi9cbmZ1bmN0aW9uIGdldEVhcmxpZXN0KHNjaGVkdWxlOiBTY2hlZHVsZSk6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLm1pbiguLi5zY2hlZHVsZS5ldmVudHMubWFwKHggPT4geC5zdGFydE1pbnV0ZSkpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZW5kIHRpbWUgb2YgdGhlIGxhdGVzdCBldmVudCBpbiB0aGUgc2NoZWR1bGVcbiAqL1xuZnVuY3Rpb24gZ2V0TGF0ZXN0KHNjaGVkdWxlOiBTY2hlZHVsZSk6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLm1heCguLi5zY2hlZHVsZS5ldmVudHMubWFwKHggPT4geC5lbmRNaW51dGUpKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBzY2hlZHVsZSB0byB0YXJnZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclNjaGVkdWxlKFxuICAgIHRhcmdldDogSFRNTEVsZW1lbnQsIHNjaGVkdWxlOiBTY2hlZHVsZSxcbiAgICBjb3Vyc2VDb2xvcnM6IE1hcDxudW1iZXIsIHN0cmluZ1tdPikge1xuICB0YXJnZXQuaW5uZXJIVE1MID0gJyc7XG5cbiAgbGV0IGVhcmxpZXN0ID0gZ2V0RWFybGllc3Qoc2NoZWR1bGUpO1xuICBsZXQgbGF0ZXN0ID0gZ2V0TGF0ZXN0KHNjaGVkdWxlKTtcbiAgbGV0IHNjYWxlID0gMTAwLjAgLyAobGF0ZXN0IC0gZWFybGllc3QpO1xuXG4gIGxldCBsYXllcmVkRXZlbnRzID0gbGF5b3V0TGF5ZXJlZEV2ZW50cyhzY2hlZHVsZS5ldmVudHMpO1xuXG4gIGxheWVyZWRFdmVudHMuZm9yRWFjaChmdW5jdGlvbihsZSkge1xuICAgIGxldCBldmVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxldCBldmVudCA9IGxlLmV2ZW50O1xuICAgIGV2ZW50RGl2LmNsYXNzTmFtZSA9ICdldmVudCc7XG4gICAgbGV0IGNvbG9ycyA9IGNvdXJzZUNvbG9ycy5nZXQoZXZlbnQuZ3JvdXAuY291cnNlLmlkKTtcbiAgICBldmVudERpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcnNbMF07XG4gICAgZXZlbnREaXYuc3R5bGUuY29sb3IgPSBjb2xvcnNbMV07XG4gICAgcG9zaXRpb25FbGVtZW50KFxuICAgICAgICBldmVudERpdiwgJyUnLFxuICAgICAgICAvKiBsZWZ0ICAgKi8gKDEwMCAvIDYuMCkgKiAoMSArIGV2ZW50LmRheSArIGxlLmxheWVyIC8gbGUubnVtTGF5ZXJzKSxcbiAgICAgICAgLyogdG9wICAgICovIHNjYWxlICogKGV2ZW50LnN0YXJ0TWludXRlIC0gZWFybGllc3QpLFxuICAgICAgICAvKiB3aWR0aCAgKi8gMTAwIC8gNi4wIC8gbGUubnVtTGF5ZXJzLFxuICAgICAgICAvKiBoZWlnaHQgKi8gc2NhbGUgKiAoZXZlbnQuZW5kTWludXRlIC0gZXZlbnQuc3RhcnRNaW51dGUpKTtcbiAgICBhbm5vdGF0ZUV2ZW50KGV2ZW50RGl2LCBldmVudCk7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGV2ZW50RGl2KTtcbiAgfSk7XG5cbiAgYWRkR3JpZExpbmVzKHRhcmdldCwgc2NoZWR1bGUpO1xufVxuXG4vKipcbiAqIEFubm90YXRlIHRoZSBkaXYgd2l0aCB0aGUgYWN0dWFseSBjb250ZW50cyBvZiB0aGUgZXZlbnRcbiAqL1xuZnVuY3Rpb24gYW5ub3RhdGVFdmVudCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBldmVudDogQWNhZGVtaWNFdmVudCkge1xuICB0YXJnZXQuaW5uZXJIVE1MID0gJyc7XG4gIGxldCBjb3Vyc2VOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBjb3Vyc2VOYW1lLmNsYXNzTmFtZSA9ICdjb3Vyc2UtbmFtZSc7XG4gIGNvdXJzZU5hbWUuaW5uZXJUZXh0ID0gZGlzcGxheU5hbWUoZXZlbnQuZ3JvdXApO1xuICB0YXJnZXQuYXBwZW5kQ2hpbGQoY291cnNlTmFtZSk7XG5cbiAgbGV0IGV2ZW50VHlwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZXZlbnRUeXBlLmNsYXNzTmFtZSA9ICdldmVudC10eXBlJztcbiAgZXZlbnRUeXBlLmlubmVyVGV4dCA9IGV2ZW50Lmdyb3VwLnR5cGU7XG4gIHRhcmdldC5hcHBlbmRDaGlsZChldmVudFR5cGUpO1xuXG4gIGxldCBsb2NhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsb2NhdGlvbi5jbGFzc05hbWUgPSAnbG9jYXRpb24nO1xuICBsb2NhdGlvbi5pbm5lclRleHQgPSBldmVudC5sb2NhdGlvbjtcbiAgdGFyZ2V0LmFwcGVuZENoaWxkKGxvY2F0aW9uKTtcblxuICBsZXQgZm9yYmlkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGZvcmJpZERpdi5jbGFzc05hbWUgPSAnZm9yYmlkJztcbiAgbGV0IGZvcmJpZExpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGZvcmJpZExpbmsuaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwiZmFzIGZhLWJhblwiPjwvaT4nO1xuICBmb3JiaWRMaW5rLmhyZWYgPSAnIy8nO1xuICBmb3JiaWRMaW5rLnRpdGxlID0gJ0ZvcmJpZCB0aGlzIGdyb3VwJztcbiAgZm9yYmlkTGluay5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJChmb3JiaWRMaW5rKS5mYWRlT3V0KDEwMCkuZmFkZUluKDEwMCk7XG4gICAgKHdpbmRvdyBhcyBhbnkpLmFkZEZvcmJpZGRlbkdyb3VwKGV2ZW50Lmdyb3VwKTtcbiAgfTtcbiAgZm9yYmlkRGl2LmFwcGVuZENoaWxkKGZvcmJpZExpbmspO1xuICB0YXJnZXQuYXBwZW5kQ2hpbGQoZm9yYmlkRGl2KTtcbn1cblxuY29uc3QgZ3JpZERlbnNpdHkgPSAzMDtcblxuLyoqXG4gKiBSZW5kZXIgZ3JpZCBsaW5lcyBvbiB0YXJnZXRcbiAqL1xuZnVuY3Rpb24gYWRkR3JpZExpbmVzKHRhcmdldDogSFRNTEVsZW1lbnQsIHNjaGVkdWxlOiBTY2hlZHVsZSkge1xuICBsZXQgZWFybGllc3QgPSBnZXRFYXJsaWVzdChzY2hlZHVsZSk7XG4gIGxldCBsYXRlc3QgPSBnZXRMYXRlc3Qoc2NoZWR1bGUpO1xuICBsZXQgc2NhbGUgPSAxMDAuMCAvIChsYXRlc3QgLSBlYXJsaWVzdCk7XG5cbiAgbGV0IGZpcnN0R3JpZExpbmUgPSBNYXRoLmNlaWwoZWFybGllc3QgLyBncmlkRGVuc2l0eSkgKiBncmlkRGVuc2l0eTtcbiAgbGV0IGxhc3RHcmlkTGluZSA9IE1hdGguZmxvb3IobGF0ZXN0IC8gZ3JpZERlbnNpdHkpICogZ3JpZERlbnNpdHk7XG5cbiAgZm9yIChsZXQgdCA9IGZpcnN0R3JpZExpbmU7IHQgPD0gbGFzdEdyaWRMaW5lOyB0ICs9IGdyaWREZW5zaXR5KSB7XG4gICAgbGV0IGdyaWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncmlkRGl2LmNsYXNzTmFtZSA9ICdncmlkLWxpbmUnO1xuICAgIGdyaWREaXYuaW5uZXJUZXh0ID0gbWludXRlc1RvVGltZSh0KTtcbiAgICBwb3NpdGlvbkVsZW1lbnQoXG4gICAgICAgIGdyaWREaXYsICclJyxcbiAgICAgICAgLyogbGVmdCAgICAqLyAwLFxuICAgICAgICAvKiB0b3AgICAgICovIHNjYWxlICogKHQgLSBlYXJsaWVzdCksXG4gICAgICAgIC8qIHdpZHRoICAgKi8gMTAwLFxuICAgICAgICAvKiBoZWlnaHQgICovIHNjYWxlICogZ3JpZERlbnNpdHkpO1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChncmlkRGl2KTtcbiAgfVxufVxuXG4vKipcbiAqIFBvc2l0aW9uIGVsZW1lbnQgdXNpbmcgdGhlIGdpdmVuIHVuaXRzXG4gKi9cbmZ1bmN0aW9uIHBvc2l0aW9uRWxlbWVudChcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCwgdW5pdHM6IHN0cmluZywgbGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcixcbiAgICB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICBlbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtsZWZ0fSR7dW5pdHN9YDtcbiAgZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0b3B9JHt1bml0c31gO1xuICBlbGVtZW50LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9JHt1bml0c31gO1xuICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH0ke3VuaXRzfWA7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9