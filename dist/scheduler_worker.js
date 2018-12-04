/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/ts-loader/index.js!./src/scheduler_worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ts-loader/index.js!./src/scheduler_worker.ts":
/*!**********************************************************!*\
  !*** ./node_modules/ts-loader!./src/scheduler_worker.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ctx = self;
const scheduler_1 = __webpack_require__(/*! ./scheduler */ "./src/scheduler.ts");
ctx.onmessage = function (e) {
    try {
        let schedules = scheduler_1.generateSchedules(e.data.courses, e.data.filterSettings);
        ctx.postMessage(schedules);
    }
    catch (err) {
        console.error('Caught exception in worker:', err);
        ctx.postMessage(null);
    }
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

/***/ "./src/scheduler.ts":
/*!**************************!*\
  !*** ./src/scheduler.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// To enable debugging, go to your JavaScript console, switch the "JavaScript
// context" to scheduler_worker.js, and type the following into the console:
//
//   schedulerDebugLogging = true;
let schedulerDebugLogging = false;
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
/**
 * Return the building in which ev happens
 */
function eventBuilding(ev) {
    if (ev.location) {
        return ev.location.split(' ')[0];
    }
    else {
        return ev.location;
    }
}
/**
 * Count instances in which events involve running between different buildings
 * in adjacent classes.
 */
function countRuns(events) {
    let e = events.slice();
    let result = 0;
    common_1.sortEvents(e);
    for (let i = 0; i < e.length - 1; i++) {
        if (e[i].day == e[i + 1].day) {
            if (e[i + 1].startMinute == e[i].endMinute) {
                let b1 = eventBuilding(e[i]);
                let b2 = eventBuilding(e[i + 1]);
                if (b1 && b2 && b1 != b2) {
                    result++;
                }
            }
        }
    }
    return result;
}
/**
 * Returns true iff schedule has no collisions
 */
function filterNoCollisions(schedule) {
    return !common_1.eventsCollide(schedule.events);
}
/**
 * Return a cartesian product of arrays
 *
 * Note: If changing this method, test with "make karma_thorough".
 *
 * TODO(lutzky): cartesian is exported for testing purposes
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
exports.cartesian = cartesian;
/**
 * Return all possible schedules
 */
function generateSchedules(courses, settings) {
    if (schedulerDebugLogging) {
        console.time('generateSchedules');
    }
    let groupBins = Array.from(courses)
        .map(c => removeForbiddenGroups(c, settings))
        .map(common_1.groupsByType)
        .reduce((a, b) => a.concat(b), []);
    let groupProduct = cartesian(...groupBins);
    let schedules = groupProduct.map(groupsToSchedule);
    if (schedulerDebugLogging) {
        console.info(`${schedules.length} total schedules`);
    }
    schedules = runAllFilters(schedules, settings);
    if (schedulerDebugLogging) {
        console.timeEnd('generateSchedules');
    }
    return schedules;
}
exports.generateSchedules = generateSchedules;
/**
 * Remove forbidden groups from course. Modifies course and returns modified
 * course as well.
 */
function removeForbiddenGroups(course, settings) {
    if (course.groups == null) {
        console.warn('Scheduling with groupless course', course);
        return course;
    }
    course.groups = course.groups.filter(g => !settings.forbiddenGroups.includes(`${course.id}.${g.id}`));
    return course;
}
/**
 * Filter src using filter (named filterName), logging how many schedules
 * it removed.
 */
function filterWithDelta(src, filter, filterName) {
    let result = src.filter(filter);
    if (schedulerDebugLogging) {
        console.info(`Filter ${filterName} removed ${src.length - result.length} schedules`);
    }
    return result;
}
/**
 * Filter using all filters, according to settings
 */
function runAllFilters(schedules, settings) {
    let result = schedules.slice();
    if (settings.noCollisions) {
        result = filterWithDelta(result, filterNoCollisions, 'noCollisions');
    }
    result = filterByRatings(result, settings);
    return result;
}
/**
 * Filter schedules by ratingMin and ratingMax
 */
function filterByRatings(schedules, settings) {
    Object.keys(settings.ratingMin).forEach(function (r) {
        // @ts-ignore: allRatings
        if (settings.ratingMin[r] == null && settings.ratingMax[r] == null) {
            return;
        }
        schedules = filterWithDelta(schedules, function (schedule) {
            if (
            // @ts-ignore: allRatings
            settings.ratingMin[r] != null &&
                // @ts-ignore: allRatings
                schedule.rating[r] < settings.ratingMin[r]) {
                return false;
            }
            if (
            // @ts-ignore: allRatings
            settings.ratingMax[r] != null &&
                // @ts-ignore: allRatings
                schedule.rating[r] > settings.ratingMax[r]) {
                return false;
            }
            return true;
        }, `Rating '${r}'`);
    });
    return schedules;
}
/**
 * Returns the number of free days given an event set
 */
function countFreeDays(events) {
    let hasClasses = [false, false, false, false, false];
    events.forEach(function (event) {
        hasClasses[event.day] = true;
    });
    return hasClasses.filter(x => x == false).length;
}
/**
 * Rate the given events as a schedule
 *
 * TODO(lutzky): rate is exported for testing purposes
 */
function rate(events) {
    return {
        earliestStart: Math.min(...events.map(e => e.startMinute / 60.0)),
        latestFinish: Math.max(...events.map(e => e.endMinute / 60.0)),
        numRuns: countRuns(events),
        freeDays: countFreeDays(events),
    };
}
exports.rate = rate;
/**
 * Convert groups to a schedule
 */
function groupsToSchedule(groups) {
    let e = groups.reduce((a, b) => a.concat(b.events), []);
    return {
        events: e,
        rating: rate(e),
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90dGltZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90dGltZS8uL3NyYy9zY2hlZHVsZXJfd29ya2VyLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL2NoZWVzZWZvcmsudHMiLCJ3ZWJwYWNrOi8vdHRpbWUvLi9zcmMvY29tbW9uLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL3NjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsTUFBTSxHQUFHLEdBQVcsSUFBVyxDQUFDO0FBRWhDLGlGQUE4QztBQUU5QyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQVMsQ0FBZTtJQUN0QyxJQUFJO1FBQ0YsSUFBSSxTQUFTLEdBQUcsNkJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FB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Q0FBQztBQUNKLENBQUM7QUFQRCxvQkFPQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFlO0lBQ3ZDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RCxPQUFPO1FBQ0wsTUFBTSxFQUFFLENBQUM7UUFDVCxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNoQixDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJzY2hlZHVsZXJfd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9ub2RlX21vZHVsZXMvdHMtbG9hZGVyL2luZGV4LmpzIS4vc3JjL3NjaGVkdWxlcl93b3JrZXIudHNcIik7XG4iLCJjb25zdCBjdHg6IFdvcmtlciA9IHNlbGYgYXMgYW55O1xuXG5pbXBvcnQge2dlbmVyYXRlU2NoZWR1bGVzfSBmcm9tICcuL3NjaGVkdWxlcic7XG5cbmN0eC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlOiBNZXNzYWdlRXZlbnQpIHtcbiAgdHJ5IHtcbiAgICBsZXQgc2NoZWR1bGVzID0gZ2VuZXJhdGVTY2hlZHVsZXMoZS5kYXRhLmNvdXJzZXMsIGUuZGF0YS5maWx0ZXJTZXR0aW5ncyk7XG4gICAgY3R4LnBvc3RNZXNzYWdlKHNjaGVkdWxlcyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NhdWdodCBleGNlcHRpb24gaW4gd29ya2VyOicsIGVycik7XG4gICAgY3R4LnBvc3RNZXNzYWdlKG51bGwpO1xuICB9XG59O1xuIiwiaW1wb3J0IHtBY2FkZW1pY0V2ZW50LCBDYXRhbG9nLCBDb3Vyc2UsIERhdGVPYmosIEZhY3VsdHksIEdyb3VwfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgaW1wbGVtZW50cyBzdXBwb3J0IGZvciBpbXBvcnRpbmcgZGF0YSBmcm9tIGNoZWVzZUZvcmtcbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21pY2hhZWwtbWFsdHNldi9jaGVlc2UtZm9ya1xuICovXG5cbi8qKlxuICogUGFyc2UgYSBjaGVlc2Vmb3JrLWZvcm1hdCBob3VyXG4gKlxuICogQHBhcmFtIHMgLSBcIkhIOk0gLSBISDpNXCIsIHdoZXJlIE0gaXMgdGVucyBvZiBtaW51dGVzXG4gKlxuICogQHJldHVybnMgTWludXRlcyBzaW5jZSBtaWRuaWdodFxuICovXG5mdW5jdGlvbiBwYXJzZUNoZWVzZUZvcmtIb3VyKHM6IHN0cmluZyk6IG51bWJlcltdIHtcbiAgcmV0dXJuIHMuc3BsaXQoJyAtICcpLm1hcChmdW5jdGlvbihoaG0pIHtcbiAgICBsZXQgc3BsaXRIb3VyID0gaGhtLnNwbGl0KCc6Jyk7XG4gICAgbGV0IG1pbnV0ZSA9IE51bWJlcihzcGxpdEhvdXJbMF0pICogNjA7XG4gICAgaWYgKHNwbGl0SG91ci5sZW5ndGggPiAxKSB7XG4gICAgICBtaW51dGUgKz0gTnVtYmVyKHNwbGl0SG91clsxXSkgKiAxMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbnV0ZTtcbiAgfSk7XG59XG5cbmNvbnN0IGRhdGVSZWdleCA9IC8oWzAtOV17MSwyfSlcXC4oWzAtOV17MSwyfSlcXC4oWzAtOV17NH0pLztcblxuLyoqXG4gKiBQYXJzZSBhIGNoZWVzZWZvcmstZm9ybWF0IHRlc3QgZGF0ZVxuICpcbiAqIEBwYXJhbSBzIC0gXCJCbGEgYmxhIGJsYSBERC5NTS5ZWVlZIEJsYSBibGEgYmxhXCJcbiAqL1xuZnVuY3Rpb24gcGFyc2VDaGVlc2VGb3JrVGVzdERhdGUoczogc3RyaW5nKTogRGF0ZU9iaiB7XG4gIGlmICghcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IHIgPSBkYXRlUmVnZXguZXhlYyhzKTtcbiAgaWYgKHIgPT0gbnVsbCkge1xuICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIG1hdGNoIGRhdGUgcmVnZXggd2l0aDogJywgcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtkYXk6IE51bWJlcihyWzFdKSwgbW9udGg6IE51bWJlcihyWzJdKSwgeWVhcjogTnVtYmVyKHJbM10pfTtcbn1cblxuLyoqXG4gKiBQYXJzZSBjaGVlc2Vmb3JrIGRhdGFcbiAqXG4gKiBAcGFyYW0ganNEYXRhIC0gQ2hlZXNlZm9yayBjb3Vyc2VzXyouanMgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDaGVlc2VGb3JrKGpzRGF0YTogc3RyaW5nKTogQ2F0YWxvZyB7XG4gIGNvbnN0IGNoZWVzZUZvcmtQcmVmaXggPSAndmFyIGNvdXJzZXNfZnJvbV9yaXNodW0gPSAnO1xuXG4gIGNvbnN0IGhlYnJldyA9IHtcbiAgICBhY2FkZW1pY1BvaW50czogJ9eg16fXldeT15XXqicsXG4gICAgYnVpbGRpbmc6ICfXkdeg15nXmdefJyxcbiAgICBjb3Vyc2VJZDogJ9ee16HXpNeoINee16fXpteV16InLFxuICAgIGNvdXJzZU5hbWU6ICfXqdedINee16fXpteV16InLFxuICAgIGRheTogJ9eZ15XXnScsXG4gICAgZGF5TGV0dGVyczogJ9eQ15HXkteT15TXldepJyxcbiAgICBmYWN1bHR5OiAn16TXp9eV15zXmNeUJyxcbiAgICBncm91cDogJ9en15HXldem15QnLFxuICAgIGhvdXI6ICfXqdei15QnLFxuICAgIGxlY3R1cmVyX3R1dG9yOiAn157XqNem15Qv157Xqteo15LXnCcsXG4gICAgbW9lZF9hOiAn157Xldei15Mg15AnLFxuICAgIG1vZWRfYjogJ9ee15XXoteTINeRJyxcbiAgICBudW06ICfXntehLicsXG4gICAgcm9vbTogJ9eX15PXqCcsXG4gICAgc3BvcnQ6ICfXodek15XXqNeYJyxcbiAgICB0aG9zZUluQ2hhcmdlOiAn15DXl9eo15DXmdedJyxcbiAgICB0eXBlOiAn16HXldeSJyxcbiAgfTtcblxuICBjb25zdCB0eXBlTWFwID0gbmV3IE1hcChbWyfXlNeo16bXkNeUJywgJ2xlY3R1cmUnXSwgWyfXqteo15LXldecJywgJ3R1dG9yaWFsJ11dKTtcblxuICBsZXQgZmFjdWx0aWVzQnlOYW1lOiBNYXA8c3RyaW5nLCBGYWN1bHR5PiA9IG5ldyBNYXAoKTtcblxuICBpZiAoIWpzRGF0YS5zdGFydHNXaXRoKGNoZWVzZUZvcmtQcmVmaXgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgdmFsaWQgY2hlZXNlZm9yayBqc0RhdGEgLSBsYWNrcyBleHBlY3RlZCBwcmVmaXgnKTtcbiAgfVxuXG4gIGxldCBkYXRhID0gSlNPTi5wYXJzZShqc0RhdGEuc3Vic3RyaW5nKGNoZWVzZUZvcmtQcmVmaXgubGVuZ3RoKSk7XG5cbiAgY29uc29sZS5pbmZvKCdFeHBlcmltZW50YWwgQ2hlZXNlRm9yayBwYXJzZXIuIEZpcnN0IGNvdXJzZTogJywgZGF0YVswXSk7XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGFDb3Vyc2U6IGFueSkge1xuICAgIGxldCBmYWN1bHR5TmFtZSA9IGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcuZmFjdWx0eV07XG5cbiAgICBpZiAoIWZhY3VsdGllc0J5TmFtZS5oYXMoZmFjdWx0eU5hbWUpKSB7XG4gICAgICBmYWN1bHRpZXNCeU5hbWUuc2V0KGZhY3VsdHlOYW1lLCB7XG4gICAgICAgIG5hbWU6IGZhY3VsdHlOYW1lLFxuICAgICAgICBzZW1lc3RlcjogJ2NoZWVzZWZvcmstdW5rbm93bi1zZW1lc3RlcicsXG4gICAgICAgIGNvdXJzZXM6IFtdLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IGZhY3VsdHkgPSBmYWN1bHRpZXNCeU5hbWUuZ2V0KGZhY3VsdHlOYW1lKTtcblxuICAgIGxldCBjb3Vyc2U6IENvdXJzZSA9IHtcbiAgICAgIGFjYWRlbWljUG9pbnRzOiBOdW1iZXIoZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5hY2FkZW1pY1BvaW50c10pLFxuICAgICAgZmFjdWx0eTogZmFjdWx0eSxcbiAgICAgIG5hbWU6IGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcuY291cnNlTmFtZV0sXG4gICAgICBpZDogTnVtYmVyKGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcuY291cnNlSWRdKSxcbiAgICAgIGxlY3R1cmVySW5DaGFyZ2U6IGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcudGhvc2VJbkNoYXJnZV0sXG4gICAgICB0ZXN0RGF0ZXM6IFtcbiAgICAgICAgZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5tb2VkX2FdLFxuICAgICAgICBkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3Lm1vZWRfYl0sXG4gICAgICBdLm1hcChwYXJzZUNoZWVzZUZvcmtUZXN0RGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4ICE9IG51bGwpLFxuICAgICAgZ3JvdXBzOiBbXSxcbiAgICB9O1xuXG4gICAgbGV0IGdyb3VwRmlyc3RBcHBlYXJlZEluTWV0YWdyb3VwOiBNYXA8bnVtYmVyLCBudW1iZXI+ID0gbmV3IE1hcCgpO1xuXG4gICAgbGV0IGdyb3Vwc0J5SWQ6IE1hcDxudW1iZXIsIEdyb3VwPiA9IG5ldyBNYXAoKTtcblxuICAgIGRhdGFDb3Vyc2VbJ3NjaGVkdWxlJ10uZm9yRWFjaChmdW5jdGlvbihkYXRhU2NoZWR1bGU6IGFueSkge1xuICAgICAgLypcbiAgICAgICAqIEluIENoZWVzZUZvcmsgZGF0YSwgZ3JvdXBzIGFyZSByZXBlYXRlZCBhY2NvcmRpbmcgdG9cbiAgICAgICAqIFwiZ3JvdXBzLXlvdS1zaG91bGQtc2lnbi11cC10b1wiLiBUaGlzIGlzIGRlbm90ZWQgYXMgXCJncm91cFwiIGluIHRoZSBkYXRhLFxuICAgICAgICogd2hlcmVhcyB3aGF0IHdlIHdvdWxkIGNvbnNpZGVyIHRoZSBhY3R1YWwgZ3JvdXAgbnVtYmVyIGlzIGRlbm90ZWQgYXNcbiAgICAgICAqIFwibnVtYmVyXCIuIFNvLCBmb3IgZXhhbXBsZSwgXCJncm91cFwiIDExIG1pZ2h0IHNheSB5b3Ugc2hvdWxkIHJlZ2lzdGVyIGZvclxuICAgICAgICogbGVjdHVyZSAxMCBhbmQgdHV0b3JpYWwgMTEsIGFuZCBcImdyb3VwXCIgMTIgd291bGQgc2F5IHlvdSBzaG91bGRcbiAgICAgICAqIHJlZ2lzdGVyIGZvciBsZWN0dXJlIDEwIGFuZCB0dXRvcmlhbCAxMi4gTGVjdHVyZSAxMCB3b3VsZCBiZSByZXBlYXRlZFxuICAgICAgICogaW4gdGhlIGRhdGEgLSBvbmNlIGZvciBlYWNoIFwiZ3JvdXBcIi4gU28gd2UgY2FsbCB0aGVzZSBcImdyb3Vwc1wiXG4gICAgICAgKiBtZXRhR3JvdXBzIGhlcmUsIGFuZCBpZ25vcmUgc3Vic2VxdWVudCBpbnN0YW5jZXMgb2YgYW55IFwicmVhbCBncm91cFwiIC1cbiAgICAgICAqIHRoYXQgaXMsIGFueSBncm91cCB3aXRoIGEgbnVtYmVyIHdlJ3ZlIHNlZW4gYmVmb3JlLCBidXQgYSBtZXRhZ3JvdXAgd2VcbiAgICAgICAqIGhhdmVuJ3Qgc2Vlbi5cbiAgICAgICAqL1xuICAgICAgbGV0IG1ldGFHcm91cElkID0gZGF0YVNjaGVkdWxlW2hlYnJldy5ncm91cF07XG4gICAgICBsZXQgZ3JvdXBJZCA9IGRhdGFTY2hlZHVsZVtoZWJyZXcubnVtXTtcblxuICAgICAgaWYgKCFncm91cEZpcnN0QXBwZWFyZWRJbk1ldGFncm91cC5oYXMoZ3JvdXBJZCkpIHtcbiAgICAgICAgZ3JvdXBGaXJzdEFwcGVhcmVkSW5NZXRhZ3JvdXAuc2V0KGdyb3VwSWQsIG1ldGFHcm91cElkKTtcbiAgICAgIH1cbiAgICAgIGlmIChncm91cEZpcnN0QXBwZWFyZWRJbk1ldGFncm91cC5nZXQoZ3JvdXBJZCkgIT0gbWV0YUdyb3VwSWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWdyb3Vwc0J5SWQuaGFzKGdyb3VwSWQpKSB7XG4gICAgICAgIGxldCB0eXBlID0gJyc7XG4gICAgICAgIGxldCBkZXNjID0gJyc7XG4gICAgICAgIGlmIChmYWN1bHR5TmFtZSA9PSBoZWJyZXcuc3BvcnQpIHtcbiAgICAgICAgICB0eXBlID0gJ3Nwb3J0JztcbiAgICAgICAgICBkZXNjID0gZGF0YVNjaGVkdWxlW2hlYnJldy50eXBlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0eXBlID0gdHlwZU1hcC5nZXQoZGF0YVNjaGVkdWxlW2hlYnJldy50eXBlXSkgfHxcbiAgICAgICAgICAgICAgZGF0YVNjaGVkdWxlW2hlYnJldy50eXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyb3Vwc0J5SWQuc2V0KGdyb3VwSWQsIHtcbiAgICAgICAgICBpZDogZ3JvdXBJZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzYyxcbiAgICAgICAgICBjb3Vyc2U6IGNvdXJzZSxcbiAgICAgICAgICB0ZWFjaGVyczogW10sXG4gICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdyb3VwID0gZ3JvdXBzQnlJZC5nZXQoZ3JvdXBJZCk7XG5cbiAgICAgIGxldCB0aW1lcyA9IHBhcnNlQ2hlZXNlRm9ya0hvdXIoZGF0YVNjaGVkdWxlW2hlYnJldy5ob3VyXSk7XG5cbiAgICAgIGxldCBldmVudDogQWNhZGVtaWNFdmVudCA9IHtcbiAgICAgICAgZ3JvdXA6IGdyb3VwLFxuICAgICAgICBkYXk6IGhlYnJldy5kYXlMZXR0ZXJzLmluZGV4T2YoZGF0YVNjaGVkdWxlW2hlYnJldy5kYXldKSxcbiAgICAgICAgc3RhcnRNaW51dGU6IHRpbWVzWzBdLFxuICAgICAgICBlbmRNaW51dGU6IHRpbWVzWzFdLFxuICAgICAgICBsb2NhdGlvbjpcbiAgICAgICAgICAgIGRhdGFTY2hlZHVsZVtoZWJyZXcuYnVpbGRpbmddICsgJyAnICsgZGF0YVNjaGVkdWxlW2hlYnJldy5yb29tXSxcbiAgICAgIH07XG5cbiAgICAgIHtcbiAgICAgICAgbGV0IHQgPSBkYXRhU2NoZWR1bGVbaGVicmV3LmxlY3R1cmVyX3R1dG9yXTtcbiAgICAgICAgaWYgKHQgJiYgIWdyb3VwLnRlYWNoZXJzLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgZ3JvdXAudGVhY2hlcnMucHVzaCh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBncm91cC5ldmVudHMucHVzaChldmVudCk7XG4gICAgfSk7XG5cbiAgICBncm91cHNCeUlkLmZvckVhY2goZnVuY3Rpb24oZ3JvdXAsIF8pIHtcbiAgICAgIGNvdXJzZS5ncm91cHMucHVzaChncm91cCk7XG4gICAgfSk7XG5cbiAgICBmYWN1bHR5LmNvdXJzZXMucHVzaChjb3Vyc2UpO1xuICB9KTtcblxuICByZXR1cm4gQXJyYXkuZnJvbShmYWN1bHRpZXNCeU5hbWUudmFsdWVzKCkpO1xufVxuIiwiaW1wb3J0IHtwYXJzZUNoZWVzZUZvcmt9IGZyb20gJy4vY2hlZXNlZm9yayc7XG5cbmV4cG9ydCBjbGFzcyBGYWN1bHR5IHtcbiAgbmFtZTogc3RyaW5nO1xuICBzZW1lc3Rlcjogc3RyaW5nO1xuICBjb3Vyc2VzOiBDb3Vyc2VbXTtcbn1cblxuZXhwb3J0IHR5cGUgQ2F0YWxvZyA9IEZhY3VsdHlbXTtcblxuZXhwb3J0IGNsYXNzIEdyb3VwIHtcbiAgY291cnNlOiBDb3Vyc2U7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGV2ZW50czogQWNhZGVtaWNFdmVudFtdO1xuICBpZDogbnVtYmVyO1xuICB0eXBlOiBzdHJpbmc7XG4gIHRlYWNoZXJzOiBBcnJheTxzdHJpbmc+O1xufVxuXG5leHBvcnQgY2xhc3MgQ291cnNlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBhY2FkZW1pY1BvaW50czogbnVtYmVyO1xuICBpZDogbnVtYmVyO1xuICBncm91cHM6IEFycmF5PEdyb3VwPjtcbiAgbGVjdHVyZXJJbkNoYXJnZTogc3RyaW5nO1xuICB0ZXN0RGF0ZXM6IERhdGVPYmpbXTtcbiAgZmFjdWx0eT86IEZhY3VsdHk7XG59XG5cbmV4cG9ydCBjbGFzcyBBY2FkZW1pY0V2ZW50IHtcbiAgZGF5OiBudW1iZXI7XG4gIGdyb3VwOiBHcm91cDtcbiAgc3RhcnRNaW51dGU6IG51bWJlcjtcbiAgZW5kTWludXRlOiBudW1iZXI7XG4gIGxvY2F0aW9uOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBTY2hlZHVsZSB7XG4gIGV2ZW50czogQWNhZGVtaWNFdmVudFtdO1xuICByYXRpbmc6IFNjaGVkdWxlUmF0aW5nO1xufVxuXG4vKipcbiAqIGVhcmxpZXN0U3RhcnQgYW5kIGxhdGVzdEZpbmlzaCBhcmUgaW4gaG91cnMgKGUuZy4gMTozMFBNIGlzIDEzLjUpLlxuICpcbiAqIG51bVJ1bnMgaXMgdGhlIGFtb3VudCBvZiBvY2N1cmVuY2VzIHdoZXJlIHR3byBhZGphY2VudCBldmVudHMgKGVuZE1pbnV0ZVxuICogb2YgdGhlIGZpcnN0IG9uZSBlcXVhbHMgc3RhcnRNaW51dGUgb2YgdGhlIHNlY29uZCwgc2FtZSBkYXkpIGFyZSBpbiB0aGVcbiAqIHNhbWUgcm9vbS5cbiAqXG4gKiBmcmVlRGF5cyBpcyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gU3VuLVRodSB3aXRoIG5vIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVkdWxlUmF0aW5nIHtcbiAgZWFybGllc3RTdGFydDogbnVtYmVyO1xuICBsYXRlc3RGaW5pc2g6IG51bWJlcjtcbiAgbnVtUnVuczogbnVtYmVyO1xuICBmcmVlRGF5czogbnVtYmVyO1xufTtcblxuZXhwb3J0IGNsYXNzIEZpbHRlclNldHRpbmdzIHtcbiAgbm9Db2xsaXNpb25zOiBib29sZWFuO1xuICBmb3JiaWRkZW5Hcm91cHM6IHN0cmluZ1tdO1xuICByYXRpbmdNaW46IFNjaGVkdWxlUmF0aW5nO1xuICByYXRpbmdNYXg6IFNjaGVkdWxlUmF0aW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRGF0ZU9iaiB7XG4gIHllYXI6IG51bWJlcjtcbiAgbW9udGg6IG51bWJlcjtcbiAgZGF5OiBudW1iZXI7XG59XG5cbi8qKlxuICogU29ydHMgZXZlbnRzIGJ5IHN0YXJ0IHRpbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRFdmVudHMoZXZlbnRzOiBBY2FkZW1pY0V2ZW50W10pIHtcbiAgZXZlbnRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIGlmIChhLmRheSAhPSBiLmRheSkge1xuICAgICAgcmV0dXJuIGEuZGF5IC0gYi5kYXk7XG4gICAgfVxuICAgIHJldHVybiBhLnN0YXJ0TWludXRlIC0gYi5zdGFydE1pbnV0ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBmYWxzZSBpZmYgdHdvIGVudHJpZXMgaW4gZXZlbnRzIG92ZXJsYXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50c0NvbGxpZGUoZXZlbnRzOiBBY2FkZW1pY0V2ZW50W10pOiBib29sZWFuIHtcbiAgbGV0IGUgPSBldmVudHMuc2xpY2UoKTtcbiAgc29ydEV2ZW50cyhlKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGUubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgaWYgKGVbaV0uZGF5ID09IGVbaSArIDFdLmRheSkge1xuICAgICAgaWYgKGVbaSArIDFdLnN0YXJ0TWludXRlIDwgZVtpXS5lbmRNaW51dGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIExvYWQgdGhlIGNhdGFsb2cgb2JqZWN0IGZyb20gdXJsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZENhdGFsb2codXJsOiBzdHJpbmcpOiBQcm9taXNlPENhdGFsb2c+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbignR0VUJywgdXJsKTtcbiAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmVxLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgbGV0IHJlc3VsdDogQ2F0YWxvZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlcS5yZXNwb25zZVswXSA9PSAnWycpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlIGFzIHN0cmluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHBhcnNlQ2hlZXNlRm9yayhyZXEucmVzcG9uc2UgYXMgc3RyaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZml4UmF3Q2F0YWxvZyhyZXN1bHQpO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KEVycm9yKCdOZXR3b3JrIEVycm9yJykpO1xuICAgIH07XG5cbiAgICByZXEuc2VuZCgpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgYmFjay1saW5rcyB0byBjYXRhbG9nIG9iamVjdHMgKGNvdXJzZSAtPiBmYWN1bHR5LCBncm91cCAtPiBjb3Vyc2UsIGV0Yy4pXG4gKi9cbmZ1bmN0aW9uIGZpeFJhd0NhdGFsb2coY2F0YWxvZzogQ2F0YWxvZykge1xuICBjYXRhbG9nLmZvckVhY2goZnVuY3Rpb24oZmFjdWx0eSkge1xuICAgIGZhY3VsdHkuY291cnNlcy5mb3JFYWNoKGZ1bmN0aW9uKGNvdXJzZSkge1xuICAgICAgY291cnNlLmZhY3VsdHkgPSBmYWN1bHR5O1xuICAgICAgaWYgKGNvdXJzZS5ncm91cHMpIHtcbiAgICAgICAgY291cnNlLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgZ3JvdXAuY291cnNlID0gY291cnNlO1xuICAgICAgICAgIGlmIChncm91cC5ldmVudHMpIHtcbiAgICAgICAgICAgIGdyb3VwLmV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgIGV2ZW50Lmdyb3VwID0gZ3JvdXA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuaW1wb3J0ICogYXMgdGVzdERhdGEgZnJvbSAnLi4vdGVzdGRhdGEuanNvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkVGVzdENhdGFsb2coKTogUHJvbWlzZTxDYXRhbG9nPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCBfcmVqZWN0KSB7XG4gICAgbGV0IHJlc3VsdDogQ2F0YWxvZyA9IHRlc3REYXRhIGFzIGFueSBhcyBDYXRhbG9nO1xuICAgIGZpeFJhd0NhdGFsb2cocmVzdWx0KTtcbiAgICByZXNvbHZlKHJlc3VsdCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiBjb3Vyc2UncyBncm91cHMgYXMgYW4gYXJyYXkgb2YgYXJyYXlzLCBzcGxpdCBieSB0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cHNCeVR5cGUoY291cnNlOiBDb3Vyc2UpOiBHcm91cFtdW10ge1xuICBsZXQgbSA9IG5ldyBNYXAoKTtcbiAgaWYgKCFjb3Vyc2UuZ3JvdXBzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY291cnNlLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgaWYgKCFtLmhhcyhncm91cC50eXBlKSkge1xuICAgICAgbS5zZXQoZ3JvdXAudHlwZSwgW10pO1xuICAgIH1cbiAgICBtLmdldChncm91cC50eXBlKS5wdXNoKGdyb3VwKTtcbiAgfSk7XG5cbiAgcmV0dXJuIEFycmF5LmZyb20obS52YWx1ZXMoKSk7XG59XG4iLCIvLyBUbyBlbmFibGUgZGVidWdnaW5nLCBnbyB0byB5b3VyIEphdmFTY3JpcHQgY29uc29sZSwgc3dpdGNoIHRoZSBcIkphdmFTY3JpcHRcbi8vIGNvbnRleHRcIiB0byBzY2hlZHVsZXJfd29ya2VyLmpzLCBhbmQgdHlwZSB0aGUgZm9sbG93aW5nIGludG8gdGhlIGNvbnNvbGU6XG4vL1xuLy8gICBzY2hlZHVsZXJEZWJ1Z0xvZ2dpbmcgPSB0cnVlO1xubGV0IHNjaGVkdWxlckRlYnVnTG9nZ2luZyA9IGZhbHNlO1xuXG5pbXBvcnQge1NjaGVkdWxlLCBHcm91cCwgQWNhZGVtaWNFdmVudCwgQ291cnNlLCBTY2hlZHVsZVJhdGluZywgRmlsdGVyU2V0dGluZ3N9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7Z3JvdXBzQnlUeXBlLCBzb3J0RXZlbnRzLCBldmVudHNDb2xsaWRlfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogUmV0dXJuIHRoZSBidWlsZGluZyBpbiB3aGljaCBldiBoYXBwZW5zXG4gKi9cbmZ1bmN0aW9uIGV2ZW50QnVpbGRpbmcoZXY6IEFjYWRlbWljRXZlbnQpOiBzdHJpbmcge1xuICBpZiAoZXYubG9jYXRpb24pIHtcbiAgICByZXR1cm4gZXYubG9jYXRpb24uc3BsaXQoJyAnKVswXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZXYubG9jYXRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBDb3VudCBpbnN0YW5jZXMgaW4gd2hpY2ggZXZlbnRzIGludm9sdmUgcnVubmluZyBiZXR3ZWVuIGRpZmZlcmVudCBidWlsZGluZ3NcbiAqIGluIGFkamFjZW50IGNsYXNzZXMuXG4gKi9cbmZ1bmN0aW9uIGNvdW50UnVucyhldmVudHM6IEFjYWRlbWljRXZlbnRbXSk6IG51bWJlciB7XG4gIGxldCBlID0gZXZlbnRzLnNsaWNlKCk7XG4gIGxldCByZXN1bHQgPSAwO1xuICBzb3J0RXZlbnRzKGUpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGUubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgaWYgKGVbaV0uZGF5ID09IGVbaSArIDFdLmRheSkge1xuICAgICAgaWYgKGVbaSArIDFdLnN0YXJ0TWludXRlID09IGVbaV0uZW5kTWludXRlKSB7XG4gICAgICAgIGxldCBiMSA9IGV2ZW50QnVpbGRpbmcoZVtpXSk7XG4gICAgICAgIGxldCBiMiA9IGV2ZW50QnVpbGRpbmcoZVtpICsgMV0pO1xuICAgICAgICBpZiAoYjEgJiYgYjIgJiYgYjEgIT0gYjIpIHtcbiAgICAgICAgICByZXN1bHQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZmYgc2NoZWR1bGUgaGFzIG5vIGNvbGxpc2lvbnNcbiAqL1xuZnVuY3Rpb24gZmlsdGVyTm9Db2xsaXNpb25zKHNjaGVkdWxlOiBTY2hlZHVsZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWV2ZW50c0NvbGxpZGUoc2NoZWR1bGUuZXZlbnRzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBjYXJ0ZXNpYW4gcHJvZHVjdCBvZiBhcnJheXNcbiAqXG4gKiBOb3RlOiBJZiBjaGFuZ2luZyB0aGlzIG1ldGhvZCwgdGVzdCB3aXRoIFwibWFrZSBrYXJtYV90aG9yb3VnaFwiLlxuICpcbiAqIFRPRE8obHV0emt5KTogY2FydGVzaWFuIGlzIGV4cG9ydGVkIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW48VD4oLi4uYTogVFtdW10pOiBUW11bXSB7XG4gIGlmIChhLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtbXV07XG4gIH1cblxuICBsZXQgc3ViQ2FydCA9IGNhcnRlc2lhbiguLi5hLnNsaWNlKDEpKTtcbiAgcmV0dXJuIGFbMF1cbiAgICAgIC5tYXAoeCA9PiBzdWJDYXJ0Lm1hcCh5ID0+IFt4XS5jb25jYXQoeSkpKVxuICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYikpO1xufVxuXG4vKipcbiAqIFJldHVybiBhbGwgcG9zc2libGUgc2NoZWR1bGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVNjaGVkdWxlcyhcbiAgICBjb3Vyc2VzOiBTZXQ8Q291cnNlPiwgc2V0dGluZ3M6IEZpbHRlclNldHRpbmdzKTogU2NoZWR1bGVbXSB7XG4gIGlmIChzY2hlZHVsZXJEZWJ1Z0xvZ2dpbmcpIHtcbiAgICBjb25zb2xlLnRpbWUoJ2dlbmVyYXRlU2NoZWR1bGVzJyk7XG4gIH1cblxuICBsZXQgZ3JvdXBCaW5zID0gQXJyYXkuZnJvbShjb3Vyc2VzKVxuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiByZW1vdmVGb3JiaWRkZW5Hcm91cHMoYywgc2V0dGluZ3MpKVxuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZ3JvdXBzQnlUeXBlKVxuICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSk7XG5cbiAgbGV0IGdyb3VwUHJvZHVjdCA9IGNhcnRlc2lhbiguLi5ncm91cEJpbnMpO1xuICBsZXQgc2NoZWR1bGVzID0gZ3JvdXBQcm9kdWN0Lm1hcChncm91cHNUb1NjaGVkdWxlKTtcblxuICBpZiAoc2NoZWR1bGVyRGVidWdMb2dnaW5nKSB7XG4gICAgY29uc29sZS5pbmZvKGAke3NjaGVkdWxlcy5sZW5ndGh9IHRvdGFsIHNjaGVkdWxlc2ApO1xuICB9XG5cbiAgc2NoZWR1bGVzID0gcnVuQWxsRmlsdGVycyhzY2hlZHVsZXMsIHNldHRpbmdzKTtcblxuICBpZiAoc2NoZWR1bGVyRGVidWdMb2dnaW5nKSB7XG4gICAgY29uc29sZS50aW1lRW5kKCdnZW5lcmF0ZVNjaGVkdWxlcycpO1xuICB9XG4gIHJldHVybiBzY2hlZHVsZXM7XG59XG5cbi8qKlxuICogUmVtb3ZlIGZvcmJpZGRlbiBncm91cHMgZnJvbSBjb3Vyc2UuIE1vZGlmaWVzIGNvdXJzZSBhbmQgcmV0dXJucyBtb2RpZmllZFxuICogY291cnNlIGFzIHdlbGwuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZvcmJpZGRlbkdyb3VwcyhcbiAgICBjb3Vyc2U6IENvdXJzZSwgc2V0dGluZ3M6IEZpbHRlclNldHRpbmdzKTogQ291cnNlIHtcbiAgaWYgKGNvdXJzZS5ncm91cHMgPT0gbnVsbCkge1xuICAgIGNvbnNvbGUud2FybignU2NoZWR1bGluZyB3aXRoIGdyb3VwbGVzcyBjb3Vyc2UnLCBjb3Vyc2UpO1xuICAgIHJldHVybiBjb3Vyc2U7XG4gIH1cbiAgY291cnNlLmdyb3VwcyA9IGNvdXJzZS5ncm91cHMuZmlsdGVyKFxuICAgICAgZyA9PiAhc2V0dGluZ3MuZm9yYmlkZGVuR3JvdXBzLmluY2x1ZGVzKGAke2NvdXJzZS5pZH0uJHtnLmlkfWApKTtcbiAgcmV0dXJuIGNvdXJzZTtcbn1cblxuLyoqXG4gKiBGaWx0ZXIgc3JjIHVzaW5nIGZpbHRlciAobmFtZWQgZmlsdGVyTmFtZSksIGxvZ2dpbmcgaG93IG1hbnkgc2NoZWR1bGVzXG4gKiBpdCByZW1vdmVkLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJXaXRoRGVsdGEoXG4gICAgc3JjOiBTY2hlZHVsZVtdLCBmaWx0ZXI6IChzOiBTY2hlZHVsZSkgPT4gYm9vbGVhbixcbiAgICBmaWx0ZXJOYW1lOiBzdHJpbmcpOiBTY2hlZHVsZVtdIHtcbiAgbGV0IHJlc3VsdCA9IHNyYy5maWx0ZXIoZmlsdGVyKTtcbiAgaWYgKHNjaGVkdWxlckRlYnVnTG9nZ2luZykge1xuICAgIGNvbnNvbGUuaW5mbyhcbiAgICAgICAgYEZpbHRlciAke2ZpbHRlck5hbWV9IHJlbW92ZWQgJHtzcmMubGVuZ3RoIC0gcmVzdWx0Lmxlbmd0aH0gc2NoZWR1bGVzYCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGaWx0ZXIgdXNpbmcgYWxsIGZpbHRlcnMsIGFjY29yZGluZyB0byBzZXR0aW5nc1xuICovXG5mdW5jdGlvbiBydW5BbGxGaWx0ZXJzKFxuICAgIHNjaGVkdWxlczogU2NoZWR1bGVbXSwgc2V0dGluZ3M6IEZpbHRlclNldHRpbmdzKTogU2NoZWR1bGVbXSB7XG4gIGxldCByZXN1bHQgPSBzY2hlZHVsZXMuc2xpY2UoKTtcblxuICBpZiAoc2V0dGluZ3Mubm9Db2xsaXNpb25zKSB7XG4gICAgcmVzdWx0ID0gZmlsdGVyV2l0aERlbHRhKHJlc3VsdCwgZmlsdGVyTm9Db2xsaXNpb25zLCAnbm9Db2xsaXNpb25zJyk7XG4gIH1cblxuICByZXN1bHQgPSBmaWx0ZXJCeVJhdGluZ3MocmVzdWx0LCBzZXR0aW5ncyk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGaWx0ZXIgc2NoZWR1bGVzIGJ5IHJhdGluZ01pbiBhbmQgcmF0aW5nTWF4XG4gKi9cbmZ1bmN0aW9uIGZpbHRlckJ5UmF0aW5ncyhcbiAgICBzY2hlZHVsZXM6IFNjaGVkdWxlW10sIHNldHRpbmdzOiBGaWx0ZXJTZXR0aW5ncyk6IFNjaGVkdWxlW10ge1xuICBPYmplY3Qua2V5cyhzZXR0aW5ncy5yYXRpbmdNaW4pLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICBpZiAoc2V0dGluZ3MucmF0aW5nTWluW3JdID09IG51bGwgJiYgc2V0dGluZ3MucmF0aW5nTWF4W3JdID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzY2hlZHVsZXMgPSBmaWx0ZXJXaXRoRGVsdGEoc2NoZWR1bGVzLCBmdW5jdGlvbihzY2hlZHVsZSkge1xuICAgICAgaWYgKFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgICAgICBzZXR0aW5ncy5yYXRpbmdNaW5bcl0gIT0gbnVsbCAmJlxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgICAgICBzY2hlZHVsZS5yYXRpbmdbcl0gPCBzZXR0aW5ncy5yYXRpbmdNaW5bcl0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgICAgICBzZXR0aW5ncy5yYXRpbmdNYXhbcl0gIT0gbnVsbCAmJlxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGFsbFJhdGluZ3NcbiAgICAgICAgICBzY2hlZHVsZS5yYXRpbmdbcl0gPiBzZXR0aW5ncy5yYXRpbmdNYXhbcl0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LCBgUmF0aW5nICcke3J9J2ApO1xuICB9KTtcblxuICByZXR1cm4gc2NoZWR1bGVzO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIG51bWJlciBvZiBmcmVlIGRheXMgZ2l2ZW4gYW4gZXZlbnQgc2V0XG4gKi9cbmZ1bmN0aW9uIGNvdW50RnJlZURheXMoZXZlbnRzOiBBY2FkZW1pY0V2ZW50W10pOiBudW1iZXIge1xuICBsZXQgaGFzQ2xhc3NlcyA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdO1xuXG4gIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaGFzQ2xhc3Nlc1tldmVudC5kYXldID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc0NsYXNzZXMuZmlsdGVyKHggPT4geCA9PSBmYWxzZSkubGVuZ3RoO1xufVxuXG4vKipcbiAqIFJhdGUgdGhlIGdpdmVuIGV2ZW50cyBhcyBhIHNjaGVkdWxlXG4gKlxuICogVE9ETyhsdXR6a3kpOiByYXRlIGlzIGV4cG9ydGVkIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYXRlKGV2ZW50czogQWNhZGVtaWNFdmVudFtdKTogU2NoZWR1bGVSYXRpbmcge1xuICByZXR1cm4ge1xuICAgIGVhcmxpZXN0U3RhcnQ6IE1hdGgubWluKC4uLmV2ZW50cy5tYXAoZSA9PiBlLnN0YXJ0TWludXRlIC8gNjAuMCkpLFxuICAgIGxhdGVzdEZpbmlzaDogTWF0aC5tYXgoLi4uZXZlbnRzLm1hcChlID0+IGUuZW5kTWludXRlIC8gNjAuMCkpLFxuICAgIG51bVJ1bnM6IGNvdW50UnVucyhldmVudHMpLFxuICAgIGZyZWVEYXlzOiBjb3VudEZyZWVEYXlzKGV2ZW50cyksXG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydCBncm91cHMgdG8gYSBzY2hlZHVsZVxuICovXG5mdW5jdGlvbiBncm91cHNUb1NjaGVkdWxlKGdyb3VwczogR3JvdXBbXSk6IFNjaGVkdWxlIHtcbiAgbGV0IGUgPSBncm91cHMucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiLmV2ZW50cyksIFtdKTtcbiAgcmV0dXJuIHtcbiAgICBldmVudHM6IGUsXG4gICAgcmF0aW5nOiByYXRlKGUpLFxuICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==