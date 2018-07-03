/**
 * Sorts events by start time
 *
 * @param {Event[]} events - Events to sort
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
 * Load the catalog object from url.
 *
 * @param {string} url - URL to download catalog from.
 * @param {bool} isLocal - Load from local FS using Node rather than XHR
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
          fixRawCatalog(result);
          resolve(result);
        }
      });
      return;
    }

    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        let result /** Catalog */ = JSON.parse(req.response);
        fixRawCatalog(result);
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

if (typeof module != 'undefined') {
  module.exports = {
    sortEvents: sortEvents,
    loadCatalog: loadCatalog,
  };
}
