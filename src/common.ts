import {parseCheeseFork} from './cheesefork';

export class Faculty {
  name: string;
  semester: string;
  courses: Course[];
}

export type Catalog = Faculty[];

export class Group {
  course: Course;
  description: string;
  events: AcademicEvent[];
  id: number;
  type: string;
  teachers: Array<string>;
}

export class Course {
  name: string;
  academicPoints: number;
  id: number;
  groups: Array<Group>;
  lecturerInCharge: string;
  testDates: DateObj[];
  faculty?: Faculty;
}

export class AcademicEvent {
  day: number;
  group: Group;
  startMinute: number;
  endMinute: number;
  location: string;
}

export class Schedule {
  events: AcademicEvent[];
  rating: ScheduleRating;
}

/**
 * earliestStart and latestFinish are in hours (e.g. 1:30PM is 13.5).
 *
 * numRuns is the amount of occurences where two adjacent events (endMinute
 * of the first one equals startMinute of the second, same day) are in the
 * same room.
 *
 * freeDays is the number of days in Sun-Thu with no events.
 */
export class ScheduleRating {
  earliestStart: number;
  latestFinish: number;
  numRuns: number;
  freeDays: number;
};

export class FilterSettings {
  noCollisions: boolean;
  forbiddenGroups: string[];
  ratingMin: ScheduleRating;
  ratingMax: ScheduleRating;
}

export class DateObj {
  year: number;
  month: number;
  day: number;
}

/**
 * Sorts events by start time
 */
export function sortEvents(events: AcademicEvent[]) {
  events.sort(function(a, b) {
    if (a.day != b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });
}

/**
 * Returns false iff two entries in events overlap
 */
export function eventsCollide(events: AcademicEvent[]): boolean {
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
 * Load the catalog object from url.
 */
export function loadCatalog(url: string): Promise<Catalog> {
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        let result: Catalog = null;
        try {
          if (req.response[0] == '[') {
            result = JSON.parse(req.response as string);
          } else {
            result = parseCheeseFork(req.response as string);
          }
          fixRawCatalog(result);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error('Network Error'));
    };

    req.send();
  });
}

/**
 * Add back-links to catalog objects (course -> faculty, group -> course, etc.)
 */
function fixRawCatalog(catalog: Catalog) {
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

import * as testData from '../testdata.json';

export function loadTestCatalog(): Promise<Catalog> {
  return new Promise(function(resolve, _reject) {
    let result: Catalog = testData as any as Catalog;
    fixRawCatalog(result);
    resolve(result);
  });
}

/**
 * Return course's groups as an array of arrays, split by type
 */
export function groupsByType(course: Course): Group[][] {
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
