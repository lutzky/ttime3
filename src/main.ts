let mainDebugLogging = false;

if (new URL(window.location.href).searchParams.get("ttime_debug")) {
  mainDebugLogging = true;
}

import { groupsByType, loadCatalog, sortEvents } from "./common";
import {
  AcademicEvent,
  Catalog,
  Course,
  FilterSettings,
  Group,
  Schedule,
} from "./common";
import { displayName, minutesToTime } from "./formatting";
import { ScheduleRating } from "./rating";

import * as cheesefork from "./cheesefork";
import DateSet from "./dateset";
import getNicknames from "./nicknames";
import * as render from "./render";

/**
 * Settings to be saved. Note that this must be serializable directly as JSON,
 * so Settings and all of the types of its member variables can't have maps
 * nor sets.
 */
class Settings {
  public selectedCourses: number[];
  public forbiddenGroups: string[];
  public customEvents: string;
  public catalogUrl: string;
  public filterSettings: FilterSettings;
  public minTestDateDistance: number;
  public hideCoursesWithCloseTests: boolean;
}

/**
 * Set the given catalog URL and save settings. For use from HTML.
 */
function setCatalogUrl(url: string) {
  $("#catalog-url").val(url);
  catalogUrlChanged();
}
(window as any).setCatalogUrl = setCatalogUrl;

/**
 * Handler for changes to the catalog URL field
 */
function catalogUrlChanged() {
  saveSettings();
}
(window as any).catalogUrlChanged = catalogUrlChanged;

const cheeseForkCatalogs = cheesefork.getCatalogs("");
cheeseForkCatalogs.then((catalogs) => {
  for (const [catalogName, catalogUrl] of catalogs.slice().reverse()) {
    $("#cheesefork-catalog-selectors").append(
      $("<a>", {
        class: "dropdown-item",
        click: () => setCatalogUrl(catalogUrl),
        href: "#/",
        text: catalogName,
      })
    );
  }
});

const selectedCourses = new Set<Course>();

let selectedCoursesTestDates = new DateSet([]);

function getTestDates(): DateSet {
  return selectedCoursesTestDates;
}

/**
 * Catalog of all courses
 */
let currentCatalog: Catalog = null;

/**
 * Mapping from course IDs to courses
 */
let currentCatalogByCourseID: Map<number, Course> = null;

/**
 * Updates forblink according to its data('forbidden')
 */
function updateForbidLinkText(fl: JQuery) {
  if (!fl.data("groupID")) {
    console.info("Error: No groupID for", fl);
  }
  fl.text(fl.data("forbidden") ? "[unforbid]" : "[forbid]");
}

/**
 * Creates a header for the given group, for displaying in the catalog
 */
function groupHeaderForCatalog(group: Group): JQuery {
  const result = $("<li>");
  let groupNameText = `Group ${group.id} (${group.type}) `;
  if (group.teachers.length > 0) {
    groupNameText += `(${group.teachers.join(", ")}) `;
  }

  const groupName = $("<b>", {
    text: groupNameText,
  });
  result.append(groupName);

  const forbidLink = $("<a>", {
    class: "forbid-link",
    data: { forbidden: isGroupForbidden(group), groupID: groupIDString(group) },
    href: "#/",
  });

  updateForbidLinkText(forbidLink);

  forbidLink.on("click", () => {
    if (forbidLink.data("forbidden")) {
      delForbiddenGroup(group);
    } else {
      addForbiddenGroup(group);
    }
  });
  result.append(forbidLink);

  return result;
}

/**
 * Forbidden groups, as formatted using groupIDString
 */
let forbiddenGroups = new Set<string>();

/**
 * A string identifier representing a given group. Used in forbiddenGroups.
 *
 * Format: 'course_id.group_id'
 */
function groupIDString(group: Group): string {
  return `${group.course.id}.${group.id}`;
}

/**
 * Add the given group to the forbidden groups
 */
function addForbiddenGroup(group: Group) {
  forbiddenGroups.add(groupIDString(group));
  saveSettings();

  updateForbiddenGroups();
}
render.setAddForbiddenGroupCallback(addForbiddenGroup);

/**
 * Remove the given group from the forbidden groups
 */
function delForbiddenGroup(group: Group) {
  forbiddenGroups.delete(groupIDString(group));
  saveSettings();

  updateForbiddenGroups();
}

/**
 * Check whether group is forbidden
 */
function isGroupForbidden(group: Group): boolean {
  return forbiddenGroups.has(groupIDString(group));
}

/**
 * Update the list of currently forbidden groups
 */
function updateForbiddenGroups() {
  const ul = $("#forbidden-groups");
  showToast();
  ul.empty();

  if (forbiddenGroups.size === 0) {
    ul.html('<small class="text-muted">[empty]</small>');
  }

  forbiddenGroups.forEach((fg) => {
    const li = $("<li>");
    li.text(fg + " ");
    li.addClass("list-group-item");

    const unforbidLink = $("<a>", {
      href: "#/",
      text: "[unforbid]",
      click() {
        forbiddenGroups.delete(fg);
        saveSettings();
        updateForbiddenGroups();
      },
    });

    li.append(unforbidLink);
    ul.append(li);
  });

  $("a.forbid-all-lecture").each((_, element) => {
    updateAllOrNothingSelector(element as HTMLAnchorElement, "lecture");
  });
  $("a.forbid-all-tutorial").each((_, element) => {
    updateAllOrNothingSelector(element as HTMLAnchorElement, "tutorial");
  });

  $("a.forbid-link").each((_, element) => {
    const ejq = $(element);
    const groupID: string = ejq.data("groupID");

    const isForbidden = forbiddenGroups.has(groupID);
    ejq.data("forbidden", isForbidden);
    updateForbidLinkText(ejq);
  });
}

/**
 * Format a course ID as a 6-digit number
 *
 * For example, 18420 should be presented (and searchable) as 018420.
 */
function formatCourseId(id: number): string {
  return String(id).padStart(6, "0");
}

/**
 * Return an HTML description for a course
 */
function htmlDescribeCourse(course: Course): HTMLElement {
  const result = $("<span>");
  const ul = $("<ul>");
  ul.append(
    $("<li>", {
      html: `<b>Full name</b> ${formatCourseId(course.id)} ${course.name}`,
    })
  );
  ul.append(
    $("<li>", { html: `<b>Academic points:</b> ${course.academicPoints}` })
  );
  ul.append(
    $("<li>", {
      html: `<b>Lecturer in charge:</b> ${rtlSpan(
        course.lecturerInCharge || "[unknown]"
      )}`,
    })
  );
  ul.append($("<li>", { html: "<b>Test dates:</b>" }));
  const testDates = $("<ul>");
  if (course.testDates) {
    course.testDates.forEach((d) => {
      testDates.append($("<li>", { text: d.toDateString() }));
    });
  } else {
    testDates.append($("<li>", { text: "[unknown]" }));
  }
  ul.append(testDates);

  if (course.notes) {
    const li = $("<li>");
    li.append("<b>Notes:</b> ");
    li.append(
      $("<div>", {
        class: "rtlnotes",
        html: course.notes.replace(/\n/g, "<br>"),
      })
    );
    ul.append(li);
  }

  ul.append($("<li>", { html: "<b>Groups:</b>" }));
  const groups = $("<ul>");
  if (course.groups) {
    course.groups.forEach((g) => {
      groups.append(groupHeaderForCatalog(g)[0]);
      const events = $("<ul>");
      if (g.events) {
        g.events.forEach((e) => {
          events.append(
            $("<li>", {
              text:
                `${dayNames[e.day]}, ` +
                minutesToTime(e.startMinute) +
                "-" +
                minutesToTime(e.endMinute) +
                ` at ${e.location || "[unknown]"}`,
            })
          );
        });
      } else {
        events.append($("<li>", { text: "[unknown]" }));
      }
      groups.append(events);
    });
  } else {
    groups.append($("<li>", { text: "[unknown]" }));
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
function rtlSpan(s: string): string {
  return `<span dir="rtl">${s}</span>`;
}

/**
 * Create a span for a course label, including info button
 */
function courseLabel(course: Course): HTMLElement {
  const span = document.createElement("span");
  const infoLink = document.createElement("a");
  infoLink.innerHTML = expandInfoSymbol;
  infoLink.className = "expando";
  infoLink.href = "#/";
  span.innerHTML = ` ${formatCourseId(course.id)} ${rtlSpan(course.name)} `;
  infoLink.onclick = () => {
    if (!$(span).data("ttime3_expanded")) {
      const infoDiv = document.createElement("div");
      $(span).data("infoDiv", infoDiv);
      infoDiv.appendChild(htmlDescribeCourse(course));
      if (mainDebugLogging) {
        console.info(course);
      }
      span.appendChild(infoDiv);
      infoLink.innerHTML = collapseInfoSymbol;
      $(span).data("ttime3_expanded", true);
    } else {
      infoLink.innerHTML = expandInfoSymbol;
      $(span).data("ttime3_expanded", false);
      span.removeChild($(span).data("infoDiv"));
    }
  };
  span.appendChild(infoLink);
  return span;
}

function toggleAllGroups(course: Course, type: string) {
  const relevantGroups = course.groups.filter((g) => g.type === type);
  if (relevantGroups.length === 0) {
    console.info(`No ${type} groups for course ${course.id}`);
    return;
  }
  const relevantForbiddenGroups = relevantGroups.filter(isGroupForbidden);
  if (relevantGroups.length === relevantForbiddenGroups.length) {
    // All groups are forbidden - unforbid all
    for (const g of relevantForbiddenGroups) {
      delForbiddenGroup(g);
    }
  } else {
    // Some or none of the groups are forbidden - forbid all
    const remainingGroups = relevantGroups.filter((g) => !isGroupForbidden(g));
    for (const g of remainingGroups) {
      addForbiddenGroup(g);
    }
  }
}

function updateAllOrNothingSelector(s: HTMLAnchorElement, type: string) {
  const course = getCourseByID(parseInt(s.dataset.courseId, 10));
  const relevantGroups = course.groups.filter((g) => g.type === type);
  const relevantForbiddenGroups = relevantGroups.filter(isGroupForbidden);
  const baseClassName = `forbid-all-${type}`;
  switch (relevantForbiddenGroups.length) {
    case relevantGroups.length:
      s.className = `${baseClassName} badge badge-danger`;
      s.title = `All ${type} groups forbidden`;
      break;
    case 0:
      s.className = `${baseClassName} badge badge-success`;
      s.title = `All ${type} groups allowed`;
      break;
    default:
      s.className = `${baseClassName} badge badge-warning`;
      s.title = `Some ${type} groups forbidden`;
      break;
  }
}

const courseAddButtons = new Map();
const courseAddLabels = new Map();

/**
 * Write catalog selector to page.
 */
function writeCatalogSelector() {
  const facultiesDiv = $("#catalog");

  facultiesDiv.empty();
  currentCatalog.forEach((faculty) => {
    const facultyDetails = $("<details>");

    const summary = $("<summary>");
    summary.html(`<strong>${faculty.name}</strong> `);
    const semesterTag = $("<span>", {
      class: "badge badge-secondary",
      text: faculty.semester,
    });
    summary.append(semesterTag);
    facultyDetails.append(summary);
    facultiesDiv.append(facultyDetails);

    const courseList = $("<ul>", { class: "course-list" });
    facultyDetails.append(courseList);

    faculty.courses.forEach((course) => {
      const btn = $("<button>", {
        text: "+",
        click() {
          addSelectedCourse(course);
        },
      });
      courseAddButtons.set(course.id, btn);
      const label = courseLabel(course);
      courseAddLabels.set(course.id, label);
      const courseLi = $("<li>");
      courseLi.append(btn).append(label);
      courseList.append(courseLi);
    });
  });
}

/**
 * Returns whether or not a checkbox with the given ID is checked
 */
function getCheckboxValueById(id: string): boolean {
  return (document.getElementById(id) as HTMLInputElement).checked;
}

/**
 * Sets whether or not a checkbox with the given ID is checked
 */
function setCheckboxValueById(id: string, checked: boolean) {
  (document.getElementById(id) as HTMLInputElement).checked = checked;
}

function toastAndSaveSettings() {
  showToast();
  saveSettings();
}

/**
 * Save all settings to localStorage
 */
function saveSettings() {
  settings.selectedCourses = Array.from(selectedCourses).map((c) => c.id);
  settings.customEvents = $("#custom-events-textarea").val() as string;
  settings.catalogUrl = $("#catalog-url").val() as string;
  settings.hideCoursesWithCloseTests = $("#hide-courses-with-close-tests").prop(
    "checked"
  ) as boolean;

  settings.minTestDateDistance = getNumInputValueWithDefault(
    $("#close-test-distance")[0] as HTMLInputElement,
    5
  );
  // Reflecting this back to the UI here is a bit of a hack :/
  $("#min-test-date-distance-display").text(settings.minTestDateDistance);
  updateTestDates();

  settings.filterSettings = {
    forbiddenGroups: Array.from(forbiddenGroups),
    noCollisions: getCheckboxValueById("filter.noCollisions"),
    ratingMax: getNullRating(),
    ratingMin: getNullRating(),
  };

  allRatingTypes.forEach((r) => {
    settings.filterSettings.ratingMin[r] = getNumInputValueWithDefault(
      $(`#rating-${r}-min`)[0] as HTMLInputElement,
      null
    );
    settings.filterSettings.ratingMax[r] = getNumInputValueWithDefault(
      $(`#rating-${r}-max`)[0] as HTMLInputElement,
      null
    );
  });

  window.localStorage.setItem("ttime3_settings", JSON.stringify(settings));

  (window as any).gtag("event", settings.catalogUrl, {
    event_category: "saveSettings",
    event_label: "catalog-url",
  });
  (window as any).gtag("event", settings.filterSettings.noCollisions, {
    event_category: "saveSettings",
    event_label: "no-collisions",
  });

  if (mainDebugLogging) {
    console.info("Saved settings:", settings);
  }
}
(window as any).saveSettings = saveSettings;

/**
 * Get the numeric value in the given field, or return the default if
 * it's empty.
 */
function getNumInputValueWithDefault(
  input: HTMLInputElement,
  defaultValue: number
): number {
  if (input.value === "") {
    return defaultValue;
  }
  return Number(input.value);
}

/**
 * Mark course as selected.
 */
function addSelectedCourse(course: Course) {
  if (mainDebugLogging) {
    console.info("Selected", course);
  }
  (window as any).gtag("event", `${course.id}`, {
    event_category: "SelectCourses",
    event_label: "addCourse",
  });
  selectedCourses.add(course);
  courseAddButtons.get(course.id).disabled = true;
  courseAddLabels.get(course.id).classList.add("disabled-course-label");
  saveSettings();
  refreshSelectedCourses();
  updateTestDates();
}

/**
 * Add a course with a given ID
 */
function addSelectedCourseByID(...ids: number[]) {
  ids.forEach((id) => {
    const course = getCourseByID(id);

    if (course) {
      addSelectedCourse(course);
    } else {
      throw new Error("No course with ID " + id);
    }
  });
}
(window as any).addSelectedCourseByID = addSelectedCourseByID;

/**
 * Mark course as unselected.
 */
function delSelectedCourse(course: Course) {
  if (mainDebugLogging) {
    console.info("Unselected", course);
  }
  (window as any).gtag("event", `${course.id}`, {
    event_category: "SelectCourses",
    event_label: "delCourse",
  });
  selectedCourses.delete(course);
  courseAddButtons.get(course.id).disabled = false;
  courseAddLabels.get(course.id).classList.remove("disabled-course-label");
  saveSettings();
  refreshSelectedCourses();
  updateTestDates();
}

function updateTestDates() {
  selectedCoursesTestDates = new DateSet(Array.from(selectedCourses));
  const selectize = $("#courses-selectize")[0].selectize;
  if (selectize) {
    selectize.clearCache();
  }
  $("#how-to-show-close-test-courses").html(
    settings.hideCoursesWithCloseTests
      ? "hidden"
      : 'shown in <span style="color: red">red</span>'
  );
  const ul = $("<ul>", { class: "list-group" });
  $("#test-schedule").empty();
  $("#test-schedule").append(ul);
  const datesAndDistances = selectedCoursesTestDates.getDatesAndDistances();
  for (let i = 0; i < datesAndDistances.length; i++) {
    const [distance, date, course] = datesAndDistances[i];
    let formattedDistance = "";
    if (i > 0) {
      formattedDistance = `${distance}d`;
      if (distance < settings.minTestDateDistance) {
        formattedDistance = `<span style="color: red; font-weight: bold">${distance}d</span>`;
      }
      formattedDistance += " &rarr;";
    }
    ul.append(
      $("<li>", {
        class: "list-group-item",
        html: `${formattedDistance} ${date.toDateString()} - ${course.name}`,
      })
    );
  }
}

/**
 * Redraw the list of selected courses, and update the list of test dates
 */
function refreshSelectedCourses() {
  const nscheds = Number(totalPossibleSchedules(selectedCourses));
  $("#possible-schedules").text(
    `${nscheds.toLocaleString()} (${nscheds.toExponential(2)})`
  );
  $("#generate-schedules").prop("disabled", selectedCourses.size === 0);
  const div = $("#selected-courses");
  div.empty();
  const ul = $("<ul>", { class: "list-group" });
  div.append(ul);
  selectedCourses.forEach((course) => {
    const li = $("<li>", { class: "list-group-item" });
    const label = courseLabel(course);
    const btn = $("<button>", {
      class: "btn btn-sm btn-danger float-right",
      html: '<i class="fas fa-trash-alt"></i>',
      click() {
        delSelectedCourse(course);
      },
    });
    li.append(label);

    if (course.groups === null || course.groups.length === 0) {
      li.append(
        $("<i>", {
          class: "text-warning fas fa-exclamation-triangle",
          title: "Course has no groups",
        })
      );
    }

    const noLectures = document.createElement("a");
    noLectures.innerHTML = "L";
    noLectures.href = "#/";
    noLectures.dataset.courseId = `${course.id}`;
    noLectures.onclick = () => toggleAllGroups(course, "lecture");
    updateAllOrNothingSelector(noLectures, "lecture");
    li.append(noLectures);

    const noTutorials = document.createElement("a");
    noTutorials.innerHTML = "T";
    noTutorials.href = "#/";
    noTutorials.dataset.courseId = `${course.id}`;
    noTutorials.onclick = () => toggleAllGroups(course, "tutorial");
    updateAllOrNothingSelector(noTutorials, "tutorial");
    li.append(noTutorials);

    li.append(btn);
    ul.append(li);
  });
}

import SchedulerWorker from "worker-loader!./scheduler.worker";
const schedulerWorker = new SchedulerWorker();
schedulerWorker.postMessage({ debug: mainDebugLogging });

/**
 * Respond to scheduling result from worker
 */
schedulerWorker.onmessage = (e: MessageEvent) => {
  if (mainDebugLogging) {
    console.info("Received message from worker:", e);
  }
  $("#generate-schedules").prop("disabled", false);
  $("#spinner").hide();
  if (e.data == null) {
    $("#exception-occurred-scheduling").show();
  } else {
    setPossibleSchedules(e.data);
  }
};

/**
 * Check if custom-events-textarea has valid events
 */
function checkCustomEvents() {
  const elem = $("#custom-events-textarea");
  elem.removeClass("is-invalid");
  elem.removeClass("is-valid");

  try {
    const courses = buildCustomEventsCourses(elem.val() as string);
    if (courses.length > 0) {
      elem.addClass("is-valid");
    }
  } catch (e) {
    elem.addClass("is-invalid");
  }
}
(window as any).checkCustomEvents = checkCustomEvents;

const customEventRegex = new RegExp(
  [
    /(Sun|Mon|Tue|Wed|Thu|Fri|Sat) /,
    /([0-9]{2}):([0-9]{2})-([0-9]{2}):([0-9]{2}) /,
    /(.*)/,
  ]
    .map((x) => x.source)
    .join("")
);

/* tslint:disable:object-literal-sort-keys */
const inverseDayIndex = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};
/* tslint:enable:object-literal-sort-keys */

/**
 * Create a course with a single event
 */
function createSingleEventCourse(
  name: string,
  day: number,
  startMinute: number,
  endMinute: number
): Course {
  const c: Course = {
    academicPoints: 0,
    groups: [],
    id: 0,
    lecturerInCharge: "",
    name,
    notes: "",
    testDates: [],
  };

  const g: Group = {
    course: c,
    description: "",
    events: [],
    id: 0,
    teachers: [],
    type: "lecture",
  };

  c.groups.push(g);

  const e: AcademicEvent = {
    day,
    endMinute,
    group: g,
    location: "",
    startMinute,
  };

  g.events.push(e);

  return c;
}

/**
 * Build courses with the configured custom events
 *
 * @param s - Custom events, lines matching customEventRegex
 */
function buildCustomEventsCourses(s: string): Course[] {
  const result: Course[] = [];

  if (s === "") {
    return result;
  }

  s.split("\n").forEach((line) => {
    const m = customEventRegex.exec(line);
    if (m == null) {
      throw Error("Invalid custom event line: " + line);
    }

    const day: number = inverseDayIndex[m[1] as keyof typeof inverseDayIndex];
    const startMinute = Number(Number(m[2]) * 60 + Number(m[3]));
    const endMinute = Number(Number(m[4]) * 60 + Number(m[5]));
    const desc = m[6];

    result.push(createSingleEventCourse(desc, day, startMinute, endMinute));
  });

  return result;
}

let showToastAgain = false;

function showToast() {
  if (showToastAgain) {
    $(".toast").toast("show");
    $("#generate-schedules").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    showToastAgain = false;
  }
}

function hideToast() {
  $(".toast").toast("hide");
  showToastAgain = false;
}

/**
 * Start a worker to generate schedules
 */
function getSchedules() {
  hideToast();
  $("#generate-schedules").prop("disabled", true);
  showToastAgain = true;
  $("#spinner").show();
  $("#exception-occurred").hide();
  $("#no-schedules").hide();
  $("#initial-instructions").hide();

  (window as any).gtag("event", "generateSchedules");
  (window as any).gtag("event", "generateSchedules-num-courses", {
    value: selectedCourses.size,
  });

  const coursesToSchedule = new Set(selectedCourses);
  try {
    const courses = buildCustomEventsCourses(settings.customEvents);
    courses.forEach((c) => coursesToSchedule.add(c));
  } catch (error) {
    console.error("Failed to build custom events course:", error);
  }

  schedulerWorker.postMessage({
    courses: coursesToSchedule,
    filterSettings: settings.filterSettings,
  });
}
(window as any).getSchedules = getSchedules;

let possibleSchedules: Schedule[] = [];

let currentSchedule = 0;

/**
 * Set the collection of possible schedules
 */
function setPossibleSchedules(schedules: Schedule[]) {
  possibleSchedules = schedules;
  currentSchedule = 0;
  const divs = $("#schedule-browser, #rendered-schedule-container");
  $("#num-schedules").text(schedules.length);
  if (
    schedules.length === 0 ||
    (schedules.length === 1 && schedules[0].events.length === 0)
  ) {
    divs.hide();
    $("#no-schedules").show();
  } else {
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
(window as any).nextSchedule = nextSchedule;

/**
 * Decrement the current displayed schedule
 */
function prevSchedule() {
  goToSchedule(currentSchedule - 1);
}
(window as any).prevSchedule = prevSchedule;

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Colors are taken from this page, but reordered to maximize contrast:
// https://getbootstrap.com/docs/4.1/getting-started/theming/
const courseColors = [
  ["#007bff", "#fff"], // blue
  ["#e83e8c", "#fff"], // pink
  ["#ffc107", "#000"], // yellow
  ["#6610f2", "#fff"], // indigo
  ["#dc3545", "#fff"], // red
  ["#28a745", "#fff"], // green
  ["#6f42c1", "#fff"], // purple
  ["#fd7e14", "#000"], // orange
  ["#20c997", "#fff"], // teal
  ["#17a2b8", "#fff"], // cyan
  ["#6c757d", "#fff"], // gray
  ["#343a40", "#fff"], // dark-gray
];

/**
 * Get appropriate colors for courses
 */
function getCourseColorMap(courses: Set<Course>): Map<number, string[]> {
  const numbers = Array.from(courses.values())
    .map((c) => c.id)
    .sort();

  // 0 course ID is for custom events
  numbers.push(0);

  const numsAndColors = numbers.map((num, i) => [num, courseColors[i]]) as [
    number,
    string[]
  ][];

  return new Map(numsAndColors);
}

/**
 * Display schedule i, modulo the possible range 0-(numSchedules - 1)
 */
function goToSchedule(i: number) {
  const max = possibleSchedules.length;
  i = (i + max) % max;
  currentSchedule = i;
  $("#current-schedule-id").text(i + 1);
  const schedule = possibleSchedules[i];

  writeScheduleContents($("#schedule-contents"), schedule);
  render.renderSchedule(
    $("#rendered-schedule")[0],
    schedule,
    getCourseColorMap(selectedCourses)
  );
}

let sortedByRating = "";

let sortedByRatingAsc = true;

const allRatings = {
  earliestStart: {
    badgeTextFunc: (s: number) => `Earliest start: ${s}`,
    explanation: "Hour at which the earliest class of the week start",
    name: "Earliest start",
  },
  freeDays: {
    badgeTextFunc: (s: number) => `${s} free days`,
    explanation: "Number of days with no classes",
    name: "Free days",
  },
  latestFinish: {
    badgeTextFunc: (s: number) => `Latest finish: ${s}`,
    explanation: "Hour at which the latest class of the week finishes",
    name: "Latest finish",
  },
  numRuns: {
    badgeTextFunc: (s: number) => `${s} runs`,
    explanation: "Number of adjacent classes in different buildings",
    name: "Number of runs",
  },
};

type ratingType = keyof ScheduleRating;

const allRatingTypes = Object.keys(allRatings) as ratingType[];

/**
 * Sort current schedule by rating
 */
function sortByRating(rating: ratingType) {
  if (sortedByRating === rating) {
    sortedByRatingAsc = !sortedByRatingAsc;
  }

  sortedByRating = rating;
  possibleSchedules.sort((a, b) => {
    return (sortedByRatingAsc ? 1 : -1) * (a.rating[rating] - b.rating[rating]);
  });

  goToSchedule(0);
  allRatingTypes.forEach((r) => {
    $(`#rating-badge-${r}`).replaceWith(
      getRatingBadge(r, possibleSchedules[0])
    );
  });
}

/**
 * Get a badge for the given rating according to the schedule type
 */
function getRatingBadge(rating: ratingType, schedule: Schedule): JQuery {
  const result = $("<a>", {
    class: "badge badge-info",
    href: "#/",
    id: `rating-badge-${rating}`,
    text: allRatings[rating].badgeTextFunc(schedule.rating[rating]),
    title: allRatings[rating].explanation,
    click() {
      sortByRating(rating);
    },
  });

  if (sortedByRating === rating) {
    const icon = sortedByRatingAsc ? "fa-sort-up" : "fa-sort-down";
    result.append(` <i class="fas ${icon}"></i>`);
  }

  return result;
}

/**
 * Write the schedule contents to target
 */
function writeScheduleContents(target: JQuery, schedule: Schedule) {
  target.empty();

  allRatingTypes
    .map((rating) => getRatingBadge(rating, schedule))
    .forEach((badge) => {
      target.append(badge).append(" ");
    });

  const ul = $("<ul>", { class: "list-group" });
  target.append(ul);

  byDay(schedule).forEach((dayEvents) => {
    const dayEntry = $("<li>", {
      class: "list-group-item",
      css: { "padding-top": "2px", "padding-bottom": "2px" },
      html: $("<small>", {
        class: "font-weight-bold",
        text: dayNames[dayEvents[0].day],
      }),
    });
    ul.append(dayEntry);
    // let eventList = $('<ul>');
    //    dayEntry.append(eventList);
    dayEvents.forEach((e) => {
      const eventEntry = $("<li>", {
        class: "list-group-item",
      });
      const startTime = minutesToTime(e.startMinute);
      const location = e.location || "[unknown]";
      const endTime = minutesToTime(e.endMinute);
      const teachers = e.group.teachers.join(",") || "[unknown]";
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
        <div dir="rtl">${displayName(e.group)}</div>
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
function byDay(schedule: Schedule): AcademicEvent[][] {
  const events = schedule.events.slice();
  const result: AcademicEvent[][] = [[]];

  sortEvents(events);

  let currentDay = events[0].day;

  events.forEach((e) => {
    if (e.day !== currentDay) {
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
function getCourseByID(id: number): Course {
  return currentCatalogByCourseID.get(id);
}

/**
 * Set up the course selection selectize.js box
 */
function coursesSelectizeSetup() {
  const selectBox = $("#courses-selectize");

  // Getting the types right for selectize is difficult :/

  const opts: any = [];
  const optgroups: any = [];

  currentCatalog.forEach((faculty) => {
    optgroups.push({ label: faculty.name, value: faculty.name });
    faculty.courses.forEach((course) => {
      opts.push({
        nicknames: getNicknames(course),
        optgroup: faculty.name,
        text: `${formatCourseId(course.id)} - ${course.name}`,
        value: course.id,
      });
    });
  });

  selectBox.selectize({
    optgroups,
    options: opts,
    render: {
      option(data, escape) {
        let hasCloseTest = false;
        const closeTestStyle = settings.hideCoursesWithCloseTests
          ? "display: none"
          : "color: red";
        const course = getCourseByID(data.value);
        if (course.testDates) {
          course.testDates.forEach((testDate: Date) => {
            if (
              !getTestDates().fitsWithDistance(
                testDate,
                settings.minTestDateDistance
              )
            ) {
              hasCloseTest = true;
            }
          });
        }
        return $("<div>", {
          class: "option",
          style: hasCloseTest ? closeTestStyle : null,
          text: escape(data.text),
        })[0].outerHTML;
      },
    },
    searchField: ["text", "nicknames"],
    onItemAdd(courseID) {
      if (courseID === "") {
        return;
      }
      const course = getCourseByID(Number(courseID));
      addSelectedCourse(course);
      selectBox[0].selectize.clear();
    },
  });
}

/**
 * Get a null rating
 */
function getNullRating(): ScheduleRating {
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
function loadSettings(s: string): Settings {
  let result: Settings = {
    catalogUrl: "",
    customEvents: "",
    filterSettings: {
      forbiddenGroups: [],
      noCollisions: true,
      ratingMax: getNullRating(),
      ratingMin: getNullRating(),
    },
    forbiddenGroups: [],
    hideCoursesWithCloseTests: false,
    minTestDateDistance: 5,
    selectedCourses: [],
  };

  if (s !== "") {
    result = $.extend(
      true /* deep */,
      result,
      JSON.parse(s) as Settings
    ) as Settings;
  }

  if (mainDebugLogging) {
    console.info("Loaded settings:", result);
  }

  $("#catalog-url").val(result.catalogUrl);
  $("#custom-events-textarea").val(result.customEvents);
  $("#hide-courses-with-close-tests").prop(
    "checked",
    result.hideCoursesWithCloseTests
  );
  $("#min-test-date-distance-display").text(result.minTestDateDistance);
  $("#close-test-distance").val(result.minTestDateDistance);

  {
    const fs = result.filterSettings;
    setCheckboxValueById("filter.noCollisions", fs.noCollisions);

    allRatingTypes.forEach((r) => {
      $(`#rating-${r}-min`).val(fs.ratingMin[r]);
      $(`#rating-${r}-max`).val(fs.ratingMax[r]);
    });
  }

  return result;
}

/**
 * Figure out the total number of schedules possible for the set of courses,
 * disregarding filters.
 */
function totalPossibleSchedules(courses: Set<Course>): number {
  const k = Array.from(courses.values());

  return k
    .map((course) =>
      groupsByType(course)
        .map((t) => t.length)
        .reduce((a, b) => a * b, 1)
    )
    .reduce((a, b) => a * b, 1);
}

/**
 * Build the limit-by-ratings form for the settings subpage
 */
function buildRatingsLimitForm() {
  const form = $("#rating-limits-form");
  allRatingTypes.forEach((r) => {
    const row = $("<div>", { class: "row" });
    form.append(row);
    row.append(
      $("<div>", {
        class: "col col-form-label",
        text: allRatings[r].name,
        title: allRatings[r].explanation,
      })
    );
    row.append(
      $("<div>", {
        class: "col",
        html: $("<input>", {
          change: toastAndSaveSettings,
          class: "form-control",
          id: `rating-${r}-min`,
          placeholder: "-∞",
          type: "number",
        }),
      })
    );
    row.append(
      $("<div>", {
        class: "col",
        html: $("<input>", {
          change: toastAndSaveSettings,
          class: "form-control",
          id: `rating-${r}-max`,
          placeholder: "∞",
          type: "number",
        }),
      })
    );
  });
}

buildRatingsLimitForm();

const settings = loadSettings(window.localStorage.getItem("ttime3_settings"));

if (settings.catalogUrl) {
  $("#old-catalog-alert-url").text(settings.catalogUrl);
  $("#old-catalog-alert").collapse("show");
}

forbiddenGroups = new Set(settings.filterSettings.forbiddenGroups);
updateForbiddenGroups();

async function renderCatalog() {
  try {
    const cheeseForkLatest = cheeseForkCatalogs.then(
      (catalogs) => catalogs[catalogs.length - 1][1]
    );
    const catalog = await loadCatalog(
      settings.catalogUrl || (await cheeseForkLatest)
    );
    if (mainDebugLogging) {
      console.log("Loaded catalog:", catalog);
    }
    currentCatalog = catalog;
    currentCatalogByCourseID = new Map();

    currentCatalog.forEach((faculty) => {
      faculty.courses.forEach((course) => {
        currentCatalogByCourseID.set(course.id, course);
      });
    });

    writeCatalogSelector();
    settings.selectedCourses.forEach((id) => {
      try {
        addSelectedCourseByID(id);
      } catch (error) {
        console.error(`Failed to add course ${id}:`, error);
      }
    });
    $("#selected-courses-semester-indicator").text(currentCatalog[0].semester);
    coursesSelectizeSetup();
  } catch (error) {
    $("#exception-occurred-catalog").show();
    console.error("Failed to load catalog:", error);
  }
}

renderCatalog();
showToastAgain = true;
