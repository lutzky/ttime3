/**
 * @typedef {Object} Course
 * @property {string} name
 * @property {number} academicPoints - Number of academic points
 * @property {number} id - Course ID
 * @
 */

/**
 * @typedef {Object} Faculty
 * @property {string} name
 * @property {Course[]} courses
 */

/**
 * @typedef {Faculty[]} Catalog
 */

const catalogUrl =
  'https://storage.googleapis.com/repy-176217.appspot.com/latest.json';

let selectedCourses = new Set();

/**
 * Load the catalog object from url.
 *
 * @param {string} url - URL to download catalog from.
 *
 * @returns {Promise<Catalog>}
 */
function loadCatalog(url) {
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('GET', catalogUrl);
    req.onload = function() {
      if (req.status == 200) {
        resolve(JSON.parse(req.response));
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
 * Write catalog selector to page.
 *
 * @param {Catalog} catalog - Catalog of faculties.
 */
function writeCatalogSelector(catalog) {
  let facultiesDiv = document.getElementById('catalog');
  let facultyList = document.createElement('ul');

  facultiesDiv.innerHTML = '';
  facultiesDiv.appendChild(facultyList);
  catalog.forEach(function(faculty) {
    let li = document.createElement('li');
    li.textContent = faculty.name;
    let courseList = document.createElement('ul');
    li.appendChild(courseList);
    facultyList.appendChild(li);

    faculty.courses.forEach(function(course) {
      let btn = document.createElement('button');
      let nameSpan = document.createElement('span');
      btn.textContent = '+';
      nameSpan.textContent = ' ' + course.name;
      let courseLi = document.createElement('li');
      courseLi.appendChild(btn);
      courseLi.appendChild(nameSpan);
      courseList.appendChild(courseLi);

      btn.onclick = function() {
        addSelectedCourse(course);
      };
    });
  });
}

/**
 * Mark course as selected.
 *
 * @param {Course} course - Course to select
 */
function addSelectedCourse(course) {
  console.info('Selected', course);
  selectedCourses.add(course);
  refreshSelectedCourses();
}

/**
 * Mark course as unselected.
 *
 * @param {Course} course - Course to unselect
 */
function delSelectedCourse(course) {
  console.info('Unselected', course);
  selectedCourses.delete(course);
  refreshSelectedCourses();
}

/**
 * Redraw the list of selected courses
 *
 * TODO(lutzky): This is actually a bad idea and would cause flicker, better do
 * something neater.
 */
function refreshSelectedCourses() {
  let div = document.getElementById('selected-courses');
  div.innerHTML = '';
  let ul = document.createElement('ul');
  div.appendChild(ul);
  selectedCourses.forEach(function(course) {
    let li = document.createElement('li');
    let nameSpan = document.createElement('span');
    let btn = document.createElement('button');
    btn.innerText = '-';
    btn.onclick = function() {
      delSelectedCourse(course);
    };
    nameSpan.innerText = ' ' + course.name;
    li.appendChild(btn);
    li.appendChild(nameSpan);
    ul.appendChild(li);
  });
}

loadCatalog(catalogUrl).then(
  function(catalog) {
    console.log('Loaded catalog:', catalog);
    writeCatalogSelector(catalog);
  },
  function(error) {
    console.error('Failed!', error);
  }
);
