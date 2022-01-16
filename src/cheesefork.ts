/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicEvent, Catalog, Course, Faculty, Group } from "./common";
import * as json5 from "json5";

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
function parseCheeseForkHour(s: string): number[] {
  return s.split(" - ").map((hhm) => {
    const splitHour = hhm.split(":");
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
export function parseCheeseForkTestDate(s: string): Date {
  if (!s) {
    return null;
  }

  const r = dateRegex.exec(s);
  if (r == null) {
    console.warn("Failed to match date regex with: ", s);
    return null;
  }

  const year = Number(r[3]);
  const month = Number(r[2]);
  const day = Number(r[1]);
  // Months are 0-indexed (Jan=0)
  return new Date(year, month - 1, day);
}

const _exported_for_testing_only = {
  deserialize: deserialize,
};
export { _exported_for_testing_only as _private };

function deserialize(jsData: string): any[] {
  const rawJSPrefix = "var courses_from_rishum = [";
  const jsonParsePrefix = "var courses_from_rishum = JSON.parse(";

  let rawJSON = "";

  if (jsData.startsWith(rawJSPrefix)) {
    rawJSON = jsData.substring(rawJSPrefix.length - 1 /* include initial [ */);
  } else if (jsData.startsWith(jsonParsePrefix)) {
    const rawEscapedJSON = jsData.substring(
      jsonParsePrefix.length,
      jsData.length - 1 /* drop trailing ) */
    );

    // The external string is single-quoted, but occasionally contains escape
    // sequences, e.g. JSON.parse('{"\\\"":0}'). Unescaping it directly is error-prone,
    // so we use JSON.parse ourselves; however, the JSON standard forbids single-quoted
    // strings, so we use JSON5 in this case.

    rawJSON = json5.parse(rawEscapedJSON);
  }

  if (rawJSON == "") {
    throw new Error("Not valid cheesefork jsData - lacks expected prefix");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(rawJSON);
}

/**
 * Parse cheesefork data
 *
 * @param jsData - Cheesefork courses_*.js data
 */
export function parse(jsData: string): Catalog {
  const hebrew = {
    academicPoints: "נקודות",
    building: "בניין",
    courseId: "מספר מקצוע",
    courseName: "שם מקצוע",
    day: "יום",
    dayLetters: "אבגדהוש",
    faculty: "פקולטה",
    group: "קבוצה",
    hour: "שעה",
    lecturer_tutor: "מרצה/מתרגל",
    moed_a: "מועד א",
    moed_b: "מועד ב",
    notes: "הערות",
    num: "מס.",
    room: "חדר",
    sport: "ספורט",
    thoseInCharge: "אחראים",
    type: "סוג",
  };

  const typeMap = new Map([
    ["הרצאה", "lecture"],
    ["תרגול", "tutorial"],
  ]);

  const facultiesByName: Map<string, Faculty> = new Map();
  const data = deserialize(jsData);

  data.forEach((dataCourse: any) => {
    const facultyName = dataCourse.general[hebrew.faculty] as string;

    if (!facultiesByName.has(facultyName)) {
      facultiesByName.set(facultyName, {
        courses: [],
        name: facultyName,
        semester: "cheesefork-unknown-semester",
      });
    }

    const faculty = facultiesByName.get(facultyName);

    const course: Course = {
      academicPoints: Number(dataCourse.general[hebrew.academicPoints]),
      faculty,
      groups: [],
      id: Number(dataCourse.general[hebrew.courseId]),
      lecturerInCharge: dataCourse.general[hebrew.thoseInCharge] as string,
      name: dataCourse.general[hebrew.courseName] as string,
      notes: dataCourse.general[hebrew.notes] as string,
      testDates: [
        dataCourse.general[hebrew.moed_a],
        dataCourse.general[hebrew.moed_b],
      ]
        .map(parseCheeseForkTestDate)
        .filter((x) => x != null),
    };

    const groupFirstAppearedInMetagroup: Map<number, number> = new Map();

    const groupsById: Map<number, Group> = new Map();

    (dataCourse.schedule as any[]).forEach((dataSchedule: any) => {
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
      const metaGroupId = dataSchedule[hebrew.group] as number;
      const groupId = dataSchedule[hebrew.num] as number;

      if (!groupFirstAppearedInMetagroup.has(groupId)) {
        groupFirstAppearedInMetagroup.set(groupId, metaGroupId);
      }
      if (groupFirstAppearedInMetagroup.get(groupId) !== metaGroupId) {
        return;
      }

      if (!groupsById.has(groupId)) {
        let type = "";
        let desc = "";
        if (facultyName === hebrew.sport) {
          type = "sport";
          desc = dataSchedule[hebrew.type] as string;
        } else {
          type = (typeMap.get(dataSchedule[hebrew.type]) ||
            dataSchedule[hebrew.type]) as string;
        }

        groupsById.set(groupId, {
          course,
          description: desc,
          events: [],
          id: groupId,
          teachers: [],
          type,
        });
      }

      const group = groupsById.get(groupId);

      const times = parseCheeseForkHour(dataSchedule[hebrew.hour]);

      const event: AcademicEvent = {
        day: hebrew.dayLetters.indexOf(dataSchedule[hebrew.day]),
        endMinute: times[1],
        group,
        location:
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          dataSchedule[hebrew.building] + " " + dataSchedule[hebrew.room],
        startMinute: times[0],
      };

      {
        const t = dataSchedule[hebrew.lecturer_tutor] as string;
        if (t && !group.teachers.includes(t)) {
          group.teachers.push(t);
        }
      }

      group.events.push(event);
    });

    groupsById.forEach((group, _) => {
      course.groups.push(group);
    });

    faculty.courses.push(course);
  });

  return Array.from(facultiesByName.values());
}

export function catalogNameFromUrl(url: string): string {
  const raw = url.substr(url.lastIndexOf("_") + 1, 6);
  const semesterNames: { [semester: number]: string } = {
    1: "Winter",
    2: "Spring",
    3: "Summer",
  };
  const year = Number(raw.slice(0, 4));
  const semester = Number(raw.slice(4));
  let yearStr: string;
  if (semester === 1) {
    yearStr = `${year}/${String(year + 1).slice(2)}`;
  } else {
    yearStr = `${year + 1}`;
  }
  return `${semesterNames[semester]} ${yearStr} (CheeseFork)`;
}

interface GHContentsJSONEntry {
  download_url: string;
}

/**
 * Get all Cheesefork catalogs
 *
 * @param token - Github API token; if unsure, set to ''.
 *
 * @returns [Name, URL] for all catalogs, sorted oldest-to-newest
 */
export function getCatalogs(token: string): Promise<[string, string][]> {
  return new Promise((resolve, reject) => {
    const apiURL =
      "https://api.github.com/repos/michael-maltsev/cheese-fork/contents/courses?ref=gh-pages";
    const req = new XMLHttpRequest();
    req.open("GET", apiURL, true);
    if (token) {
      console.info("Using API token");
      // We use setRequestHeader rather than withCredentials due to CORS
      // limitations; see https://stackoverflow.com/a/21851378/993214
      req.setRequestHeader("Authorization", "Basic " + btoa("lutzky:" + token));
    }
    req.onload = () => {
      if (req.status !== 200) {
        reject(Error(`HTTP ${req.status}: ${req.statusText}`));
        return;
      }
      if (token) {
        for (const header of ["X-RateLimit-Limit", "X-RateLimit-Remaining"]) {
          console.info(`${header}: ${req.getResponseHeader(header)}`);
        }
      }
      try {
        const result = JSON.parse(req.responseText) as GHContentsJSONEntry[];
        const minified: string[] = result
          .map((r: GHContentsJSONEntry): string => r.download_url)
          .filter((url: string) => url.endsWith(".min.js"));
        const tuples: [string, string][] = minified.map(
          (url: string): [string, string] => [catalogNameFromUrl(url), url]
        );
        const sortedByURL = tuples.sort((a, b) => (a[1] < b[1] ? -1 : 1));
        resolve(sortedByURL);
      } catch (err) {
        reject(err);
      }
    };

    req.onerror = () => {
      reject(Error("Network Error"));
      return;
    };

    req.send();
  });
}
