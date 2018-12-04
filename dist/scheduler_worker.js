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
/******/ 	__webpack_require__.p = "dist/";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90dGltZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90dGltZS8uL3NyYy9zY2hlZHVsZXJfd29ya2VyLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL2NoZWVzZWZvcmsudHMiLCJ3ZWJwYWNrOi8vdHRpbWUvLi9zcmMvY29tbW9uLnRzIiwid2VicGFjazovL3R0aW1lLy4vc3JjL3NjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsTUFBTSxHQUFHLEdBQVcsSUFBVyxDQUFDO0FBRWhDLGlGQUE4QztBQUU5QyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQVMsQ0FBZTtJQUN0QyxJQUFJO1FBQ0YsSUFBSSxTQUFTLEdBQUcsNkJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FB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Q0FBQztBQUNKLENBQUM7QUFQRCxvQkFPQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFlO0lBQ3ZDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RCxPQUFPO1FBQ0wsTUFBTSxFQUFFLENBQUM7UUFDVCxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNoQixDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJzY2hlZHVsZXJfd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJkaXN0L1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanMhLi9zcmMvc2NoZWR1bGVyX3dvcmtlci50c1wiKTtcbiIsImNvbnN0IGN0eDogV29ya2VyID0gc2VsZiBhcyBhbnk7XG5cbmltcG9ydCB7Z2VuZXJhdGVTY2hlZHVsZXN9IGZyb20gJy4vc2NoZWR1bGVyJztcblxuY3R4Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGU6IE1lc3NhZ2VFdmVudCkge1xuICB0cnkge1xuICAgIGxldCBzY2hlZHVsZXMgPSBnZW5lcmF0ZVNjaGVkdWxlcyhlLmRhdGEuY291cnNlcywgZS5kYXRhLmZpbHRlclNldHRpbmdzKTtcbiAgICBjdHgucG9zdE1lc3NhZ2Uoc2NoZWR1bGVzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcignQ2F1Z2h0IGV4Y2VwdGlvbiBpbiB3b3JrZXI6JywgZXJyKTtcbiAgICBjdHgucG9zdE1lc3NhZ2UobnVsbCk7XG4gIH1cbn07XG4iLCJpbXBvcnQge0FjYWRlbWljRXZlbnQsIENhdGFsb2csIENvdXJzZSwgRGF0ZU9iaiwgRmFjdWx0eSwgR3JvdXB9IGZyb20gJy4vY29tbW9uJztcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBpbXBsZW1lbnRzIHN1cHBvcnQgZm9yIGltcG9ydGluZyBkYXRhIGZyb20gY2hlZXNlRm9ya1xuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWljaGFlbC1tYWx0c2V2L2NoZWVzZS1mb3JrXG4gKi9cblxuLyoqXG4gKiBQYXJzZSBhIGNoZWVzZWZvcmstZm9ybWF0IGhvdXJcbiAqXG4gKiBAcGFyYW0gcyAtIFwiSEg6TSAtIEhIOk1cIiwgd2hlcmUgTSBpcyB0ZW5zIG9mIG1pbnV0ZXNcbiAqXG4gKiBAcmV0dXJucyBNaW51dGVzIHNpbmNlIG1pZG5pZ2h0XG4gKi9cbmZ1bmN0aW9uIHBhcnNlQ2hlZXNlRm9ya0hvdXIoczogc3RyaW5nKTogbnVtYmVyW10ge1xuICByZXR1cm4gcy5zcGxpdCgnIC0gJykubWFwKGZ1bmN0aW9uKGhobSkge1xuICAgIGxldCBzcGxpdEhvdXIgPSBoaG0uc3BsaXQoJzonKTtcbiAgICBsZXQgbWludXRlID0gTnVtYmVyKHNwbGl0SG91clswXSkgKiA2MDtcbiAgICBpZiAoc3BsaXRIb3VyLmxlbmd0aCA+IDEpIHtcbiAgICAgIG1pbnV0ZSArPSBOdW1iZXIoc3BsaXRIb3VyWzFdKSAqIDEwO1xuICAgIH1cbiAgICByZXR1cm4gbWludXRlO1xuICB9KTtcbn1cblxuY29uc3QgZGF0ZVJlZ2V4ID0gLyhbMC05XXsxLDJ9KVxcLihbMC05XXsxLDJ9KVxcLihbMC05XXs0fSkvO1xuXG4vKipcbiAqIFBhcnNlIGEgY2hlZXNlZm9yay1mb3JtYXQgdGVzdCBkYXRlXG4gKlxuICogQHBhcmFtIHMgLSBcIkJsYSBibGEgYmxhIERELk1NLllZWVkgQmxhIGJsYSBibGFcIlxuICovXG5mdW5jdGlvbiBwYXJzZUNoZWVzZUZvcmtUZXN0RGF0ZShzOiBzdHJpbmcpOiBEYXRlT2JqIHtcbiAgaWYgKCFzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgciA9IGRhdGVSZWdleC5leGVjKHMpO1xuICBpZiAociA9PSBudWxsKSB7XG4gICAgY29uc29sZS53YXJuKCdGYWlsZWQgdG8gbWF0Y2ggZGF0ZSByZWdleCB3aXRoOiAnLCBzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge2RheTogTnVtYmVyKHJbMV0pLCBtb250aDogTnVtYmVyKHJbMl0pLCB5ZWFyOiBOdW1iZXIoclszXSl9O1xufVxuXG4vKipcbiAqIFBhcnNlIGNoZWVzZWZvcmsgZGF0YVxuICpcbiAqIEBwYXJhbSBqc0RhdGEgLSBDaGVlc2Vmb3JrIGNvdXJzZXNfKi5qcyBkYXRhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNoZWVzZUZvcmsoanNEYXRhOiBzdHJpbmcpOiBDYXRhbG9nIHtcbiAgY29uc3QgY2hlZXNlRm9ya1ByZWZpeCA9ICd2YXIgY291cnNlc19mcm9tX3Jpc2h1bSA9ICc7XG5cbiAgY29uc3QgaGVicmV3ID0ge1xuICAgIGFjYWRlbWljUG9pbnRzOiAn16DXp9eV15PXldeqJyxcbiAgICBidWlsZGluZzogJ9eR16DXmdeZ158nLFxuICAgIGNvdXJzZUlkOiAn157Xodek16gg157Xp9em15XXoicsXG4gICAgY291cnNlTmFtZTogJ9ep150g157Xp9em15XXoicsXG4gICAgZGF5OiAn15nXldedJyxcbiAgICBkYXlMZXR0ZXJzOiAn15DXkdeS15PXlNeV16knLFxuICAgIGZhY3VsdHk6ICfXpNen15XXnNeY15QnLFxuICAgIGdyb3VwOiAn16fXkdeV16bXlCcsXG4gICAgaG91cjogJ9ep16LXlCcsXG4gICAgbGVjdHVyZXJfdHV0b3I6ICfXnteo16bXlC/Xnteq16jXktecJyxcbiAgICBtb2VkX2E6ICfXnteV16LXkyDXkCcsXG4gICAgbW9lZF9iOiAn157Xldei15Mg15EnLFxuICAgIG51bTogJ9ee16EuJyxcbiAgICByb29tOiAn15fXk9eoJyxcbiAgICBzcG9ydDogJ9eh16TXldeo15gnLFxuICAgIHRob3NlSW5DaGFyZ2U6ICfXkNeX16jXkNeZ150nLFxuICAgIHR5cGU6ICfXodeV15InLFxuICB9O1xuXG4gIGNvbnN0IHR5cGVNYXAgPSBuZXcgTWFwKFtbJ9eU16jXpteQ15QnLCAnbGVjdHVyZSddLCBbJ9eq16jXkteV15wnLCAndHV0b3JpYWwnXV0pO1xuXG4gIGxldCBmYWN1bHRpZXNCeU5hbWU6IE1hcDxzdHJpbmcsIEZhY3VsdHk+ID0gbmV3IE1hcCgpO1xuXG4gIGlmICghanNEYXRhLnN0YXJ0c1dpdGgoY2hlZXNlRm9ya1ByZWZpeCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCB2YWxpZCBjaGVlc2Vmb3JrIGpzRGF0YSAtIGxhY2tzIGV4cGVjdGVkIHByZWZpeCcpO1xuICB9XG5cbiAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGpzRGF0YS5zdWJzdHJpbmcoY2hlZXNlRm9ya1ByZWZpeC5sZW5ndGgpKTtcblxuICBjb25zb2xlLmluZm8oJ0V4cGVyaW1lbnRhbCBDaGVlc2VGb3JrIHBhcnNlci4gRmlyc3QgY291cnNlOiAnLCBkYXRhWzBdKTtcblxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0YUNvdXJzZTogYW55KSB7XG4gICAgbGV0IGZhY3VsdHlOYW1lID0gZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5mYWN1bHR5XTtcblxuICAgIGlmICghZmFjdWx0aWVzQnlOYW1lLmhhcyhmYWN1bHR5TmFtZSkpIHtcbiAgICAgIGZhY3VsdGllc0J5TmFtZS5zZXQoZmFjdWx0eU5hbWUsIHtcbiAgICAgICAgbmFtZTogZmFjdWx0eU5hbWUsXG4gICAgICAgIHNlbWVzdGVyOiAnY2hlZXNlZm9yay11bmtub3duLXNlbWVzdGVyJyxcbiAgICAgICAgY291cnNlczogW10sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgZmFjdWx0eSA9IGZhY3VsdGllc0J5TmFtZS5nZXQoZmFjdWx0eU5hbWUpO1xuXG4gICAgbGV0IGNvdXJzZTogQ291cnNlID0ge1xuICAgICAgYWNhZGVtaWNQb2ludHM6IE51bWJlcihkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3LmFjYWRlbWljUG9pbnRzXSksXG4gICAgICBmYWN1bHR5OiBmYWN1bHR5LFxuICAgICAgbmFtZTogZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5jb3Vyc2VOYW1lXSxcbiAgICAgIGlkOiBOdW1iZXIoZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy5jb3Vyc2VJZF0pLFxuICAgICAgbGVjdHVyZXJJbkNoYXJnZTogZGF0YUNvdXJzZVsnZ2VuZXJhbCddW2hlYnJldy50aG9zZUluQ2hhcmdlXSxcbiAgICAgIHRlc3REYXRlczogW1xuICAgICAgICBkYXRhQ291cnNlWydnZW5lcmFsJ11baGVicmV3Lm1vZWRfYV0sXG4gICAgICAgIGRhdGFDb3Vyc2VbJ2dlbmVyYWwnXVtoZWJyZXcubW9lZF9iXSxcbiAgICAgIF0ubWFwKHBhcnNlQ2hlZXNlRm9ya1Rlc3REYXRlKVxuICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHggIT0gbnVsbCksXG4gICAgICBncm91cHM6IFtdLFxuICAgIH07XG5cbiAgICBsZXQgZ3JvdXBGaXJzdEFwcGVhcmVkSW5NZXRhZ3JvdXA6IE1hcDxudW1iZXIsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG5cbiAgICBsZXQgZ3JvdXBzQnlJZDogTWFwPG51bWJlciwgR3JvdXA+ID0gbmV3IE1hcCgpO1xuXG4gICAgZGF0YUNvdXJzZVsnc2NoZWR1bGUnXS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGFTY2hlZHVsZTogYW55KSB7XG4gICAgICAvKlxuICAgICAgICogSW4gQ2hlZXNlRm9yayBkYXRhLCBncm91cHMgYXJlIHJlcGVhdGVkIGFjY29yZGluZyB0b1xuICAgICAgICogXCJncm91cHMteW91LXNob3VsZC1zaWduLXVwLXRvXCIuIFRoaXMgaXMgZGVub3RlZCBhcyBcImdyb3VwXCIgaW4gdGhlIGRhdGEsXG4gICAgICAgKiB3aGVyZWFzIHdoYXQgd2Ugd291bGQgY29uc2lkZXIgdGhlIGFjdHVhbCBncm91cCBudW1iZXIgaXMgZGVub3RlZCBhc1xuICAgICAgICogXCJudW1iZXJcIi4gU28sIGZvciBleGFtcGxlLCBcImdyb3VwXCIgMTEgbWlnaHQgc2F5IHlvdSBzaG91bGQgcmVnaXN0ZXIgZm9yXG4gICAgICAgKiBsZWN0dXJlIDEwIGFuZCB0dXRvcmlhbCAxMSwgYW5kIFwiZ3JvdXBcIiAxMiB3b3VsZCBzYXkgeW91IHNob3VsZFxuICAgICAgICogcmVnaXN0ZXIgZm9yIGxlY3R1cmUgMTAgYW5kIHR1dG9yaWFsIDEyLiBMZWN0dXJlIDEwIHdvdWxkIGJlIHJlcGVhdGVkXG4gICAgICAgKiBpbiB0aGUgZGF0YSAtIG9uY2UgZm9yIGVhY2ggXCJncm91cFwiLiBTbyB3ZSBjYWxsIHRoZXNlIFwiZ3JvdXBzXCJcbiAgICAgICAqIG1ldGFHcm91cHMgaGVyZSwgYW5kIGlnbm9yZSBzdWJzZXF1ZW50IGluc3RhbmNlcyBvZiBhbnkgXCJyZWFsIGdyb3VwXCIgLVxuICAgICAgICogdGhhdCBpcywgYW55IGdyb3VwIHdpdGggYSBudW1iZXIgd2UndmUgc2VlbiBiZWZvcmUsIGJ1dCBhIG1ldGFncm91cCB3ZVxuICAgICAgICogaGF2ZW4ndCBzZWVuLlxuICAgICAgICovXG4gICAgICBsZXQgbWV0YUdyb3VwSWQgPSBkYXRhU2NoZWR1bGVbaGVicmV3Lmdyb3VwXTtcbiAgICAgIGxldCBncm91cElkID0gZGF0YVNjaGVkdWxlW2hlYnJldy5udW1dO1xuXG4gICAgICBpZiAoIWdyb3VwRmlyc3RBcHBlYXJlZEluTWV0YWdyb3VwLmhhcyhncm91cElkKSkge1xuICAgICAgICBncm91cEZpcnN0QXBwZWFyZWRJbk1ldGFncm91cC5zZXQoZ3JvdXBJZCwgbWV0YUdyb3VwSWQpO1xuICAgICAgfVxuICAgICAgaWYgKGdyb3VwRmlyc3RBcHBlYXJlZEluTWV0YWdyb3VwLmdldChncm91cElkKSAhPSBtZXRhR3JvdXBJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghZ3JvdXBzQnlJZC5oYXMoZ3JvdXBJZCkpIHtcbiAgICAgICAgbGV0IHR5cGUgPSAnJztcbiAgICAgICAgbGV0IGRlc2MgPSAnJztcbiAgICAgICAgaWYgKGZhY3VsdHlOYW1lID09IGhlYnJldy5zcG9ydCkge1xuICAgICAgICAgIHR5cGUgPSAnc3BvcnQnO1xuICAgICAgICAgIGRlc2MgPSBkYXRhU2NoZWR1bGVbaGVicmV3LnR5cGVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHR5cGUgPSB0eXBlTWFwLmdldChkYXRhU2NoZWR1bGVbaGVicmV3LnR5cGVdKSB8fFxuICAgICAgICAgICAgICBkYXRhU2NoZWR1bGVbaGVicmV3LnR5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JvdXBzQnlJZC5zZXQoZ3JvdXBJZCwge1xuICAgICAgICAgIGlkOiBncm91cElkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjLFxuICAgICAgICAgIGNvdXJzZTogY291cnNlLFxuICAgICAgICAgIHRlYWNoZXJzOiBbXSxcbiAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ3JvdXAgPSBncm91cHNCeUlkLmdldChncm91cElkKTtcblxuICAgICAgbGV0IHRpbWVzID0gcGFyc2VDaGVlc2VGb3JrSG91cihkYXRhU2NoZWR1bGVbaGVicmV3LmhvdXJdKTtcblxuICAgICAgbGV0IGV2ZW50OiBBY2FkZW1pY0V2ZW50ID0ge1xuICAgICAgICBncm91cDogZ3JvdXAsXG4gICAgICAgIGRheTogaGVicmV3LmRheUxldHRlcnMuaW5kZXhPZihkYXRhU2NoZWR1bGVbaGVicmV3LmRheV0pLFxuICAgICAgICBzdGFydE1pbnV0ZTogdGltZXNbMF0sXG4gICAgICAgIGVuZE1pbnV0ZTogdGltZXNbMV0sXG4gICAgICAgIGxvY2F0aW9uOlxuICAgICAgICAgICAgZGF0YVNjaGVkdWxlW2hlYnJldy5idWlsZGluZ10gKyAnICcgKyBkYXRhU2NoZWR1bGVbaGVicmV3LnJvb21dLFxuICAgICAgfTtcblxuICAgICAge1xuICAgICAgICBsZXQgdCA9IGRhdGFTY2hlZHVsZVtoZWJyZXcubGVjdHVyZXJfdHV0b3JdO1xuICAgICAgICBpZiAodCAmJiAhZ3JvdXAudGVhY2hlcnMuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICBncm91cC50ZWFjaGVycy5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdyb3VwLmV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICB9KTtcblxuICAgIGdyb3Vwc0J5SWQuZm9yRWFjaChmdW5jdGlvbihncm91cCwgXykge1xuICAgICAgY291cnNlLmdyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgICB9KTtcblxuICAgIGZhY3VsdHkuY291cnNlcy5wdXNoKGNvdXJzZSk7XG4gIH0pO1xuXG4gIHJldHVybiBBcnJheS5mcm9tKGZhY3VsdGllc0J5TmFtZS52YWx1ZXMoKSk7XG59XG4iLCJpbXBvcnQge3BhcnNlQ2hlZXNlRm9ya30gZnJvbSAnLi9jaGVlc2Vmb3JrJztcblxuZXhwb3J0IGNsYXNzIEZhY3VsdHkge1xuICBuYW1lOiBzdHJpbmc7XG4gIHNlbWVzdGVyOiBzdHJpbmc7XG4gIGNvdXJzZXM6IENvdXJzZVtdO1xufVxuXG5leHBvcnQgdHlwZSBDYXRhbG9nID0gRmFjdWx0eVtdO1xuXG5leHBvcnQgY2xhc3MgR3JvdXAge1xuICBjb3Vyc2U6IENvdXJzZTtcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgZXZlbnRzOiBBY2FkZW1pY0V2ZW50W107XG4gIGlkOiBudW1iZXI7XG4gIHR5cGU6IHN0cmluZztcbiAgdGVhY2hlcnM6IEFycmF5PHN0cmluZz47XG59XG5cbmV4cG9ydCBjbGFzcyBDb3Vyc2Uge1xuICBuYW1lOiBzdHJpbmc7XG4gIGFjYWRlbWljUG9pbnRzOiBudW1iZXI7XG4gIGlkOiBudW1iZXI7XG4gIGdyb3VwczogQXJyYXk8R3JvdXA+O1xuICBsZWN0dXJlckluQ2hhcmdlOiBzdHJpbmc7XG4gIHRlc3REYXRlczogRGF0ZU9ialtdO1xuICBmYWN1bHR5PzogRmFjdWx0eTtcbn1cblxuZXhwb3J0IGNsYXNzIEFjYWRlbWljRXZlbnQge1xuICBkYXk6IG51bWJlcjtcbiAgZ3JvdXA6IEdyb3VwO1xuICBzdGFydE1pbnV0ZTogbnVtYmVyO1xuICBlbmRNaW51dGU6IG51bWJlcjtcbiAgbG9jYXRpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlIHtcbiAgZXZlbnRzOiBBY2FkZW1pY0V2ZW50W107XG4gIHJhdGluZzogU2NoZWR1bGVSYXRpbmc7XG59XG5cbi8qKlxuICogZWFybGllc3RTdGFydCBhbmQgbGF0ZXN0RmluaXNoIGFyZSBpbiBob3VycyAoZS5nLiAxOjMwUE0gaXMgMTMuNSkuXG4gKlxuICogbnVtUnVucyBpcyB0aGUgYW1vdW50IG9mIG9jY3VyZW5jZXMgd2hlcmUgdHdvIGFkamFjZW50IGV2ZW50cyAoZW5kTWludXRlXG4gKiBvZiB0aGUgZmlyc3Qgb25lIGVxdWFscyBzdGFydE1pbnV0ZSBvZiB0aGUgc2Vjb25kLCBzYW1lIGRheSkgYXJlIGluIHRoZVxuICogc2FtZSByb29tLlxuICpcbiAqIGZyZWVEYXlzIGlzIHRoZSBudW1iZXIgb2YgZGF5cyBpbiBTdW4tVGh1IHdpdGggbm8gZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgU2NoZWR1bGVSYXRpbmcge1xuICBlYXJsaWVzdFN0YXJ0OiBudW1iZXI7XG4gIGxhdGVzdEZpbmlzaDogbnVtYmVyO1xuICBudW1SdW5zOiBudW1iZXI7XG4gIGZyZWVEYXlzOiBudW1iZXI7XG59O1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyU2V0dGluZ3Mge1xuICBub0NvbGxpc2lvbnM6IGJvb2xlYW47XG4gIGZvcmJpZGRlbkdyb3Vwczogc3RyaW5nW107XG4gIHJhdGluZ01pbjogU2NoZWR1bGVSYXRpbmc7XG4gIHJhdGluZ01heDogU2NoZWR1bGVSYXRpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBEYXRlT2JqIHtcbiAgeWVhcjogbnVtYmVyO1xuICBtb250aDogbnVtYmVyO1xuICBkYXk6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBTb3J0cyBldmVudHMgYnkgc3RhcnQgdGltZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydEV2ZW50cyhldmVudHM6IEFjYWRlbWljRXZlbnRbXSkge1xuICBldmVudHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgaWYgKGEuZGF5ICE9IGIuZGF5KSB7XG4gICAgICByZXR1cm4gYS5kYXkgLSBiLmRheTtcbiAgICB9XG4gICAgcmV0dXJuIGEuc3RhcnRNaW51dGUgLSBiLnN0YXJ0TWludXRlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGZhbHNlIGlmZiB0d28gZW50cmllcyBpbiBldmVudHMgb3ZlcmxhcFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRzQ29sbGlkZShldmVudHM6IEFjYWRlbWljRXZlbnRbXSk6IGJvb2xlYW4ge1xuICBsZXQgZSA9IGV2ZW50cy5zbGljZSgpO1xuICBzb3J0RXZlbnRzKGUpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZS5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBpZiAoZVtpXS5kYXkgPT0gZVtpICsgMV0uZGF5KSB7XG4gICAgICBpZiAoZVtpICsgMV0uc3RhcnRNaW51dGUgPCBlW2ldLmVuZE1pbnV0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogTG9hZCB0aGUgY2F0YWxvZyBvYmplY3QgZnJvbSB1cmwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkQ2F0YWxvZyh1cmw6IHN0cmluZyk6IFByb21pc2U8Q2F0YWxvZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKCdHRVQnLCB1cmwpO1xuICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyZXEuc3RhdHVzID09IDIwMCkge1xuICAgICAgICBsZXQgcmVzdWx0OiBDYXRhbG9nID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVxLnJlc3BvbnNlWzBdID09ICdbJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2UgYXMgc3RyaW5nKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gcGFyc2VDaGVlc2VGb3JrKHJlcS5yZXNwb25zZSBhcyBzdHJpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaXhSYXdDYXRhbG9nKHJlc3VsdCk7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlcS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QoRXJyb3IoJ05ldHdvcmsgRXJyb3InKSk7XG4gICAgfTtcblxuICAgIHJlcS5zZW5kKCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCBiYWNrLWxpbmtzIHRvIGNhdGFsb2cgb2JqZWN0cyAoY291cnNlIC0+IGZhY3VsdHksIGdyb3VwIC0+IGNvdXJzZSwgZXRjLilcbiAqL1xuZnVuY3Rpb24gZml4UmF3Q2F0YWxvZyhjYXRhbG9nOiBDYXRhbG9nKSB7XG4gIGNhdGFsb2cuZm9yRWFjaChmdW5jdGlvbihmYWN1bHR5KSB7XG4gICAgZmFjdWx0eS5jb3Vyc2VzLmZvckVhY2goZnVuY3Rpb24oY291cnNlKSB7XG4gICAgICBjb3Vyc2UuZmFjdWx0eSA9IGZhY3VsdHk7XG4gICAgICBpZiAoY291cnNlLmdyb3Vwcykge1xuICAgICAgICBjb3Vyc2UuZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgICBncm91cC5jb3Vyc2UgPSBjb3Vyc2U7XG4gICAgICAgICAgaWYgKGdyb3VwLmV2ZW50cykge1xuICAgICAgICAgICAgZ3JvdXAuZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgZXZlbnQuZ3JvdXAgPSBncm91cDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5pbXBvcnQgKiBhcyB0ZXN0RGF0YSBmcm9tICcuLi90ZXN0ZGF0YS5qc29uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRUZXN0Q2F0YWxvZygpOiBQcm9taXNlPENhdGFsb2c+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIF9yZWplY3QpIHtcbiAgICBsZXQgcmVzdWx0OiBDYXRhbG9nID0gdGVzdERhdGEgYXMgYW55IGFzIENhdGFsb2c7XG4gICAgZml4UmF3Q2F0YWxvZyhyZXN1bHQpO1xuICAgIHJlc29sdmUocmVzdWx0KTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGNvdXJzZSdzIGdyb3VwcyBhcyBhbiBhcnJheSBvZiBhcnJheXMsIHNwbGl0IGJ5IHR5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3Vwc0J5VHlwZShjb3Vyc2U6IENvdXJzZSk6IEdyb3VwW11bXSB7XG4gIGxldCBtID0gbmV3IE1hcCgpO1xuICBpZiAoIWNvdXJzZS5ncm91cHMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb3Vyc2UuZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24oZ3JvdXApIHtcbiAgICBpZiAoIW0uaGFzKGdyb3VwLnR5cGUpKSB7XG4gICAgICBtLnNldChncm91cC50eXBlLCBbXSk7XG4gICAgfVxuICAgIG0uZ2V0KGdyb3VwLnR5cGUpLnB1c2goZ3JvdXApO1xuICB9KTtcblxuICByZXR1cm4gQXJyYXkuZnJvbShtLnZhbHVlcygpKTtcbn1cbiIsIi8vIFRvIGVuYWJsZSBkZWJ1Z2dpbmcsIGdvIHRvIHlvdXIgSmF2YVNjcmlwdCBjb25zb2xlLCBzd2l0Y2ggdGhlIFwiSmF2YVNjcmlwdFxuLy8gY29udGV4dFwiIHRvIHNjaGVkdWxlcl93b3JrZXIuanMsIGFuZCB0eXBlIHRoZSBmb2xsb3dpbmcgaW50byB0aGUgY29uc29sZTpcbi8vXG4vLyAgIHNjaGVkdWxlckRlYnVnTG9nZ2luZyA9IHRydWU7XG5sZXQgc2NoZWR1bGVyRGVidWdMb2dnaW5nID0gZmFsc2U7XG5cbmltcG9ydCB7U2NoZWR1bGUsIEdyb3VwLCBBY2FkZW1pY0V2ZW50LCBDb3Vyc2UsIFNjaGVkdWxlUmF0aW5nLCBGaWx0ZXJTZXR0aW5nc30gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHtncm91cHNCeVR5cGUsIHNvcnRFdmVudHMsIGV2ZW50c0NvbGxpZGV9IGZyb20gJy4vY29tbW9uJztcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGJ1aWxkaW5nIGluIHdoaWNoIGV2IGhhcHBlbnNcbiAqL1xuZnVuY3Rpb24gZXZlbnRCdWlsZGluZyhldjogQWNhZGVtaWNFdmVudCk6IHN0cmluZyB7XG4gIGlmIChldi5sb2NhdGlvbikge1xuICAgIHJldHVybiBldi5sb2NhdGlvbi5zcGxpdCgnICcpWzBdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBldi5sb2NhdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIENvdW50IGluc3RhbmNlcyBpbiB3aGljaCBldmVudHMgaW52b2x2ZSBydW5uaW5nIGJldHdlZW4gZGlmZmVyZW50IGJ1aWxkaW5nc1xuICogaW4gYWRqYWNlbnQgY2xhc3Nlcy5cbiAqL1xuZnVuY3Rpb24gY291bnRSdW5zKGV2ZW50czogQWNhZGVtaWNFdmVudFtdKTogbnVtYmVyIHtcbiAgbGV0IGUgPSBldmVudHMuc2xpY2UoKTtcbiAgbGV0IHJlc3VsdCA9IDA7XG4gIHNvcnRFdmVudHMoZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZS5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBpZiAoZVtpXS5kYXkgPT0gZVtpICsgMV0uZGF5KSB7XG4gICAgICBpZiAoZVtpICsgMV0uc3RhcnRNaW51dGUgPT0gZVtpXS5lbmRNaW51dGUpIHtcbiAgICAgICAgbGV0IGIxID0gZXZlbnRCdWlsZGluZyhlW2ldKTtcbiAgICAgICAgbGV0IGIyID0gZXZlbnRCdWlsZGluZyhlW2kgKyAxXSk7XG4gICAgICAgIGlmIChiMSAmJiBiMiAmJiBiMSAhPSBiMikge1xuICAgICAgICAgIHJlc3VsdCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmZiBzY2hlZHVsZSBoYXMgbm8gY29sbGlzaW9uc1xuICovXG5mdW5jdGlvbiBmaWx0ZXJOb0NvbGxpc2lvbnMoc2NoZWR1bGU6IFNjaGVkdWxlKTogYm9vbGVhbiB7XG4gIHJldHVybiAhZXZlbnRzQ29sbGlkZShzY2hlZHVsZS5ldmVudHMpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGNhcnRlc2lhbiBwcm9kdWN0IG9mIGFycmF5c1xuICpcbiAqIE5vdGU6IElmIGNoYW5naW5nIHRoaXMgbWV0aG9kLCB0ZXN0IHdpdGggXCJtYWtlIGthcm1hX3Rob3JvdWdoXCIuXG4gKlxuICogVE9ETyhsdXR6a3kpOiBjYXJ0ZXNpYW4gaXMgZXhwb3J0ZWQgZm9yIHRlc3RpbmcgcHVycG9zZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhbjxUPiguLi5hOiBUW11bXSk6IFRbXVtdIHtcbiAgaWYgKGEubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW1tdXTtcbiAgfVxuXG4gIGxldCBzdWJDYXJ0ID0gY2FydGVzaWFuKC4uLmEuc2xpY2UoMSkpO1xuICByZXR1cm4gYVswXVxuICAgICAgLm1hcCh4ID0+IHN1YkNhcnQubWFwKHkgPT4gW3hdLmNvbmNhdCh5KSkpXG4gICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGFsbCBwb3NzaWJsZSBzY2hlZHVsZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlU2NoZWR1bGVzKFxuICAgIGNvdXJzZXM6IFNldDxDb3Vyc2U+LCBzZXR0aW5nczogRmlsdGVyU2V0dGluZ3MpOiBTY2hlZHVsZVtdIHtcbiAgaWYgKHNjaGVkdWxlckRlYnVnTG9nZ2luZykge1xuICAgIGNvbnNvbGUudGltZSgnZ2VuZXJhdGVTY2hlZHVsZXMnKTtcbiAgfVxuXG4gIGxldCBncm91cEJpbnMgPSBBcnJheS5mcm9tKGNvdXJzZXMpXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChjID0+IHJlbW92ZUZvcmJpZGRlbkdyb3VwcyhjLCBzZXR0aW5ncykpXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChncm91cHNCeVR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYiksIFtdKTtcblxuICBsZXQgZ3JvdXBQcm9kdWN0ID0gY2FydGVzaWFuKC4uLmdyb3VwQmlucyk7XG4gIGxldCBzY2hlZHVsZXMgPSBncm91cFByb2R1Y3QubWFwKGdyb3Vwc1RvU2NoZWR1bGUpO1xuXG4gIGlmIChzY2hlZHVsZXJEZWJ1Z0xvZ2dpbmcpIHtcbiAgICBjb25zb2xlLmluZm8oYCR7c2NoZWR1bGVzLmxlbmd0aH0gdG90YWwgc2NoZWR1bGVzYCk7XG4gIH1cblxuICBzY2hlZHVsZXMgPSBydW5BbGxGaWx0ZXJzKHNjaGVkdWxlcywgc2V0dGluZ3MpO1xuXG4gIGlmIChzY2hlZHVsZXJEZWJ1Z0xvZ2dpbmcpIHtcbiAgICBjb25zb2xlLnRpbWVFbmQoJ2dlbmVyYXRlU2NoZWR1bGVzJyk7XG4gIH1cbiAgcmV0dXJuIHNjaGVkdWxlcztcbn1cblxuLyoqXG4gKiBSZW1vdmUgZm9yYmlkZGVuIGdyb3VwcyBmcm9tIGNvdXJzZS4gTW9kaWZpZXMgY291cnNlIGFuZCByZXR1cm5zIG1vZGlmaWVkXG4gKiBjb3Vyc2UgYXMgd2VsbC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRm9yYmlkZGVuR3JvdXBzKFxuICAgIGNvdXJzZTogQ291cnNlLCBzZXR0aW5nczogRmlsdGVyU2V0dGluZ3MpOiBDb3Vyc2Uge1xuICBpZiAoY291cnNlLmdyb3VwcyA9PSBudWxsKSB7XG4gICAgY29uc29sZS53YXJuKCdTY2hlZHVsaW5nIHdpdGggZ3JvdXBsZXNzIGNvdXJzZScsIGNvdXJzZSk7XG4gICAgcmV0dXJuIGNvdXJzZTtcbiAgfVxuICBjb3Vyc2UuZ3JvdXBzID0gY291cnNlLmdyb3Vwcy5maWx0ZXIoXG4gICAgICBnID0+ICFzZXR0aW5ncy5mb3JiaWRkZW5Hcm91cHMuaW5jbHVkZXMoYCR7Y291cnNlLmlkfS4ke2cuaWR9YCkpO1xuICByZXR1cm4gY291cnNlO1xufVxuXG4vKipcbiAqIEZpbHRlciBzcmMgdXNpbmcgZmlsdGVyIChuYW1lZCBmaWx0ZXJOYW1lKSwgbG9nZ2luZyBob3cgbWFueSBzY2hlZHVsZXNcbiAqIGl0IHJlbW92ZWQuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlcldpdGhEZWx0YShcbiAgICBzcmM6IFNjaGVkdWxlW10sIGZpbHRlcjogKHM6IFNjaGVkdWxlKSA9PiBib29sZWFuLFxuICAgIGZpbHRlck5hbWU6IHN0cmluZyk6IFNjaGVkdWxlW10ge1xuICBsZXQgcmVzdWx0ID0gc3JjLmZpbHRlcihmaWx0ZXIpO1xuICBpZiAoc2NoZWR1bGVyRGVidWdMb2dnaW5nKSB7XG4gICAgY29uc29sZS5pbmZvKFxuICAgICAgICBgRmlsdGVyICR7ZmlsdGVyTmFtZX0gcmVtb3ZlZCAke3NyYy5sZW5ndGggLSByZXN1bHQubGVuZ3RofSBzY2hlZHVsZXNgKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZpbHRlciB1c2luZyBhbGwgZmlsdGVycywgYWNjb3JkaW5nIHRvIHNldHRpbmdzXG4gKi9cbmZ1bmN0aW9uIHJ1bkFsbEZpbHRlcnMoXG4gICAgc2NoZWR1bGVzOiBTY2hlZHVsZVtdLCBzZXR0aW5nczogRmlsdGVyU2V0dGluZ3MpOiBTY2hlZHVsZVtdIHtcbiAgbGV0IHJlc3VsdCA9IHNjaGVkdWxlcy5zbGljZSgpO1xuXG4gIGlmIChzZXR0aW5ncy5ub0NvbGxpc2lvbnMpIHtcbiAgICByZXN1bHQgPSBmaWx0ZXJXaXRoRGVsdGEocmVzdWx0LCBmaWx0ZXJOb0NvbGxpc2lvbnMsICdub0NvbGxpc2lvbnMnKTtcbiAgfVxuXG4gIHJlc3VsdCA9IGZpbHRlckJ5UmF0aW5ncyhyZXN1bHQsIHNldHRpbmdzKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZpbHRlciBzY2hlZHVsZXMgYnkgcmF0aW5nTWluIGFuZCByYXRpbmdNYXhcbiAqL1xuZnVuY3Rpb24gZmlsdGVyQnlSYXRpbmdzKFxuICAgIHNjaGVkdWxlczogU2NoZWR1bGVbXSwgc2V0dGluZ3M6IEZpbHRlclNldHRpbmdzKTogU2NoZWR1bGVbXSB7XG4gIE9iamVjdC5rZXlzKHNldHRpbmdzLnJhdGluZ01pbikuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgIGlmIChzZXR0aW5ncy5yYXRpbmdNaW5bcl0gPT0gbnVsbCAmJiBzZXR0aW5ncy5yYXRpbmdNYXhbcl0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNjaGVkdWxlcyA9IGZpbHRlcldpdGhEZWx0YShzY2hlZHVsZXMsIGZ1bmN0aW9uKHNjaGVkdWxlKSB7XG4gICAgICBpZiAoXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgICAgICAgIHNldHRpbmdzLnJhdGluZ01pbltyXSAhPSBudWxsICYmXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgICAgICAgIHNjaGVkdWxlLnJhdGluZ1tyXSA8IHNldHRpbmdzLnJhdGluZ01pbltyXSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgICAgICAgIHNldHRpbmdzLnJhdGluZ01heFtyXSAhPSBudWxsICYmXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZTogYWxsUmF0aW5nc1xuICAgICAgICAgIHNjaGVkdWxlLnJhdGluZ1tyXSA+IHNldHRpbmdzLnJhdGluZ01heFtyXSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sIGBSYXRpbmcgJyR7cn0nYCk7XG4gIH0pO1xuXG4gIHJldHVybiBzY2hlZHVsZXM7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGZyZWUgZGF5cyBnaXZlbiBhbiBldmVudCBzZXRcbiAqL1xuZnVuY3Rpb24gY291bnRGcmVlRGF5cyhldmVudHM6IEFjYWRlbWljRXZlbnRbXSk6IG51bWJlciB7XG4gIGxldCBoYXNDbGFzc2VzID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV07XG5cbiAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBoYXNDbGFzc2VzW2V2ZW50LmRheV0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzQ2xhc3Nlcy5maWx0ZXIoeCA9PiB4ID09IGZhbHNlKS5sZW5ndGg7XG59XG5cbi8qKlxuICogUmF0ZSB0aGUgZ2l2ZW4gZXZlbnRzIGFzIGEgc2NoZWR1bGVcbiAqXG4gKiBUT0RPKGx1dHpreSk6IHJhdGUgaXMgZXhwb3J0ZWQgZm9yIHRlc3RpbmcgcHVycG9zZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhdGUoZXZlbnRzOiBBY2FkZW1pY0V2ZW50W10pOiBTY2hlZHVsZVJhdGluZyB7XG4gIHJldHVybiB7XG4gICAgZWFybGllc3RTdGFydDogTWF0aC5taW4oLi4uZXZlbnRzLm1hcChlID0+IGUuc3RhcnRNaW51dGUgLyA2MC4wKSksXG4gICAgbGF0ZXN0RmluaXNoOiBNYXRoLm1heCguLi5ldmVudHMubWFwKGUgPT4gZS5lbmRNaW51dGUgLyA2MC4wKSksXG4gICAgbnVtUnVuczogY291bnRSdW5zKGV2ZW50cyksXG4gICAgZnJlZURheXM6IGNvdW50RnJlZURheXMoZXZlbnRzKSxcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGdyb3VwcyB0byBhIHNjaGVkdWxlXG4gKi9cbmZ1bmN0aW9uIGdyb3Vwc1RvU2NoZWR1bGUoZ3JvdXBzOiBHcm91cFtdKTogU2NoZWR1bGUge1xuICBsZXQgZSA9IGdyb3Vwcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIuZXZlbnRzKSwgW10pO1xuICByZXR1cm4ge1xuICAgIGV2ZW50czogZSxcbiAgICByYXRpbmc6IHJhdGUoZSksXG4gIH07XG59XG4iXSwic291cmNlUm9vdCI6IiJ9