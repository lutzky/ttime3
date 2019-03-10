import * as cheesefork from './cheesefork';

import {ScheduleRating} from './rating';

/* tslint:disable:max-classes-per-file */

export class Faculty {
  public name: string;
  public semester: string;
  public courses: Course[];
}

export type Catalog = Faculty[];

export class Group {
  public course: Course;
  public description: string;
  public events: AcademicEvent[];
  public id: number;
  public type: string;
  public teachers: string[];
}

export class Course {
  public name: string;
  public academicPoints: number;
  public id: number;
  public groups: Group[];
  public lecturerInCharge: string;
  public testDates: DateObj[];
  public faculty?: Faculty;
}

export class AcademicEvent {
  public day: number;
  public group: Group;
  public startMinute: number;
  public endMinute: number;
  public location: string;
}

export class Schedule {
  public events: AcademicEvent[];
  public rating: ScheduleRating;
}

export class FilterSettings {
  public noCollisions: boolean;
  public forbiddenGroups: string[];
  public ratingMin: ScheduleRating;
  public ratingMax: ScheduleRating;
}

export class DateObj {
  public year: number;
  public month: number;
  public day: number;
}

/* tslint:enable:max-classes-per-file */

/**
 * Sorts events by start time
 */
export function sortEvents(events: AcademicEvent[]) {
  events.sort((a, b) => {
    if (a.day !== b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });
}

/**
 * Returns false iff two entries in events overlap
 */
export function eventsCollide(events: AcademicEvent[]): boolean {
  const e = events.slice();
  sortEvents(e);

  for (let i = 0; i < e.length - 1; i++) {
    if (e[i].day === e[i + 1].day) {
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
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = () => {
      if (req.status === 200) {
        let result: Catalog = null;
        try {
          if (req.response[0] === '[') {
            result = JSON.parse(req.response as string);
          } else {
            result = cheesefork.parse(req.response as string);
            for (const faculty of result) {
              faculty.semester = cheesefork.catalogNameFromUrl(url);
            }
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

    req.onerror = () => {
      reject(Error('Network Error'));
    };

    req.send();
  });
}

/**
 * Add back-links to catalog objects (course -> faculty, group -> course, etc.)
 */
export function fixRawCatalog(catalog: Catalog) {
  catalog.forEach((faculty) => {
    faculty.courses.forEach((course) => {
      course.faculty = faculty;
      if (course.groups) {
        course.groups.forEach((group) => {
          group.course = course;
          if (group.events) {
            group.events.forEach((event) => {
              event.group = group;
            });
          }
        });
      }
    });
  });
}

/**
 * Return course's groups as an array of arrays, split by type
 */
export function groupsByType(course: Course): Group[][] {
  const m = new Map();
  if (!course.groups) {
    return [];
  }

  course.groups.forEach((group) => {
    if (!m.has(group.type)) {
      m.set(group.type, []);
    }
    m.get(group.type).push(group);
  });

  return Array.from(m.values());
}
