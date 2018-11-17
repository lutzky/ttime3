'use strict';

/**
 * This module implements support for importing data from cheeseFork
 *
 * See https://github.com/michael-maltsev/cheese-fork
 */

/**
 * Parse a cheesefork-format hour
 *
 * @param {string} s - "HH:M - HH:M", where M is tens of minutes
 *
 * @returns {Array<number>} - Minutes since midnight
 */
function parseCheeseForkHour(s) {
  return s.split(' - ').map(function(hhm) {
    let splitHour = hhm.split(':');
    let minute = Number(splitHour[0]) * 60;
    if (splitHour.length > 1) {
      minute += splitHour[1] * 10;
    }
    return minute;
  });
}

const dateRegex = /([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/;

/**
 * Parse a cheesefork-format test date
 *
 * @param {string} s - "Bla bla bla DD.MM.YYYY Bla bla bla"
 *
 * @returns {DateObj?}
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
 * @param {string} jsData - Cheesefork courses_*.js data
 *
 * @returns {Catalog}
 */
function parseCheeseFork(jsData) {
  /* exported parseCheeseFork */
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

  /** @type {Map<string, Faculty>} */
  let facultiesByName = new Map();

  if (!jsData.startsWith(cheeseForkPrefix)) {
    throw new Error('Not valid cheesefork jsData - lacks expected prefix');
  }

  let data = JSON.parse(jsData.substring(cheeseForkPrefix.length));

  console.info('Experimental CheeseFork parser. First course: ', data[0]);

  data.forEach(function(dataCourse) {
    let facultyName = dataCourse['general'][hebrew.faculty];

    if (!facultiesByName.has(facultyName)) {
      facultiesByName.set(facultyName, {
        name: facultyName,
        semester: 'cheesefork-unknown-semester',
        courses: [],
      });
    }

    let faculty = facultiesByName.get(facultyName);

    /** @type {Course} */
    let course = {
      academicPoints: Number(dataCourse['general'][hebrew.academicPoints]),
      name: dataCourse['general'][hebrew.courseName],
      id: Number(dataCourse['general'][hebrew.courseId]),
      lecturerInCharge: dataCourse['general'][hebrew.thoseInCharge],
      testDates: [
        dataCourse['general'][hebrew.moed_a],
        dataCourse['general'][hebrew.moed_b],
      ]
        .map(parseCheeseForkTestDate)
        .filter(x => x != null),
      groups: [],
    };

    /** @type {Map<number, number>} */
    let groupFirstAppearedInMetagroup = new Map();

    /** @type {Map<number, Group>} */
    let groupsById = new Map();

    dataCourse['schedule'].forEach(function(dataSchedule) {
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
        } else {
          type =
            typeMap.get(dataSchedule[hebrew.type]) || dataSchedule[hebrew.type];
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

      /** @type {AcademicEvent} */
      let event = {
        group: group,
        day: hebrew.dayLetters.indexOf(dataSchedule[hebrew.day]),
        startMinute: times[0],
        endMinute: times[1],
        location:
          dataSchedule[hebrew.building] + ' ' + dataSchedule[hebrew.room],
      };

      {
        let t = dataSchedule[hebrew.lecturer_tutor];
        if (t && !group.teachers.includes(t)) {
          group.teachers.push(t);
        }
      }

      group.events.push(event);
    });

    groupsById.forEach(function(group, id) {
      course.groups.push(group);
    });

    faculty.courses.push(course);
  });

  return Array.from(facultiesByName.values());
}
