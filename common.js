'use strict';

/**
 * Sorts events by start time
 *
 * @param {Array<AcademicEvent>} events - Events to sort
 */
function sortEvents(events) {
  events.sort(function(a, b) {
    if (a.day != b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });
}

/**
 * Returns false iff two entries in events overlap
 *
 * @param {Array<AcademicEvent>} events - Events to check for collisions
 *
 * @returns {boolean}
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

/**
 * Load the catalog object from url.
 *
 * @param {string} url - URL to download catalog from.
 * @param {boolean} isLocal - Load from local FS using Node rather than XHR
 *
 * @returns {Promise<Catalog>}
 */
function loadCatalog(url, isLocal) {
  return new Promise(function(resolve, reject) {
    if (isLocal) {
      require('fs').readFile(url, function(err, data) {
        if (err) {
          reject(err);
        } else {
          let result = JSON.parse(data);
          fixRawCatalog(/** @type {Catalog} */ (result));
          resolve(result);
        }
      });
      return;
    }

    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        let result = null;
        if (req.response[0] == '[') {
          result = JSON.parse(/** @type {string } */ (req.response));
        } else {
          result = parseCheeseFork(/** @type {string} */ (req.response));
        }
        fixRawCatalog(/** @type {Catalog} */ (result));
        resolve(result);
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error('Network Error'));
    };

    console.info('Sending XHR');
    req.send();
  });
}

/**
 * Add back-links to catalog objects (course -> faculty, group -> course, etc.)
 *
 * @param {Catalog} catalog - Catalog to add back-links to
 */
function fixRawCatalog(catalog) {
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

/**
 * Load the test catalog from local data
 *
 * @returns {Promise<Catalog>}
 */
function loadTestCatalog() {
  if (typeof require != 'undefined') {
    return loadCatalog('testdata.json', true);
  } else {
    return loadCatalog('../testdata.json', false);
  }
}

/**
 * Return course's groups as an array of arrays, split by type
 *
 * @param {Course} course - Course to get groups from
 *
 * @returns {Array<Array<Group>>}
 */
function groupsByType(course) {
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

if (typeof module != 'undefined') {
  module.exports = {
    eventsCollide: eventsCollide,
    groupsByType: groupsByType,
    sortEvents: sortEvents,
    loadCatalog: loadCatalog,
    loadTestCatalog: loadTestCatalog,
  };
}
