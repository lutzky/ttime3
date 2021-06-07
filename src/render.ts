import { AcademicEvent, Group, Schedule } from "./common";
import { eventsCollide } from "./common";
import { displayName, minutesToTime } from "./formatting";
import layerize from "./layerize";

/**
 * Get the start time of the earliest event in the schedule
 */
function getEarliest(schedule: Schedule): number {
  return Math.min(...schedule.events.map((x) => x.startMinute));
}

/**
 * Get the end time of the latest event in the schedule
 */
function getLatest(schedule: Schedule): number {
  return Math.max(...schedule.events.map((x) => x.endMinute));
}

/**
 * Render a schedule to target
 */
export function renderSchedule(
  target: HTMLElement,
  schedule: Schedule,
  courseColors: Map<number, string[]>
): void {
  target.innerHTML = "";

  const earliest = getEarliest(schedule);
  const latest = getLatest(schedule);
  const scale = 100.0 / (latest - earliest);

  const layeredEvents = layerize(schedule.events, eventsCollide);

  layeredEvents.forEach((le) => {
    const eventDiv = document.createElement("div");
    const event = le.obj;
    eventDiv.className = "event";
    const colors = courseColors.get(event.group.course.id);
    eventDiv.style.backgroundColor = colors[0];
    eventDiv.style.color = colors[1];
    positionElement(
      eventDiv,
      "%",
      /* left   */ (100 / 6.0) * (1 + event.day + le.layer / le.numLayers),
      /* top    */ scale * (event.startMinute - earliest),
      /* width  */ 100 / 6.0 / le.numLayers,
      /* height */ scale * (event.endMinute - event.startMinute)
    );
    annotateEvent(eventDiv, event);
    target.appendChild(eventDiv);
  });

  addGridLines(target, schedule);
}

let addForbiddenGroup: (g: Group) => void = null;

export function setAddForbiddenGroupCallback(f: (g: Group) => void): void {
  addForbiddenGroup = f;
}

/**
 * Annotate the div with the actualy contents of the event
 */
function annotateEvent(target: HTMLElement, event: AcademicEvent) {
  target.innerHTML = "";
  const courseName = document.createElement("span");
  courseName.className = "course-name";
  courseName.innerText = displayName(event.group);
  target.appendChild(courseName);

  const eventType = document.createElement("span");
  eventType.className = "event-type";
  eventType.innerText = event.group.type;
  target.appendChild(eventType);

  const location = document.createElement("div");
  location.className = "location";
  location.innerText = event.location;
  target.appendChild(location);

  if (addForbiddenGroup) {
    const forbidDiv = document.createElement("div");
    forbidDiv.className = "forbid";
    const forbidLink = document.createElement("a");
    forbidLink.innerHTML = '<i class="fas fa-ban"></i>';
    forbidLink.href = "#/";
    forbidLink.title = "Forbid this group";
    forbidLink.onclick = () => {
      $(forbidLink).fadeOut(100).fadeIn(100);
      addForbiddenGroup(event.group);
    };
    forbidDiv.appendChild(forbidLink);
    target.appendChild(forbidDiv);
  }
}

const gridDensity = 30;

/**
 * Render grid lines on target
 */
function addGridLines(target: HTMLElement, schedule: Schedule) {
  const earliest = getEarliest(schedule);
  const latest = getLatest(schedule);
  const scale = 100.0 / (latest - earliest);

  const firstGridLine = Math.ceil(earliest / gridDensity) * gridDensity;
  const lastGridLine = Math.floor(latest / gridDensity) * gridDensity;

  for (let t = firstGridLine; t <= lastGridLine; t += gridDensity) {
    const gridDiv = document.createElement("div");
    gridDiv.className = "grid-line";
    gridDiv.innerText = minutesToTime(t);
    positionElement(
      gridDiv,
      "%",
      /* left    */ 0,
      /* top     */ scale * (t - earliest),
      /* width   */ 100,
      /* height  */ scale * gridDensity
    );
    target.appendChild(gridDiv);
  }
}

/**
 * Position element using the given units
 */
function positionElement(
  element: HTMLElement,
  units: string,
  left: number,
  top: number,
  width: number,
  height: number
) {
  element.style.left = `${left}${units}`;
  element.style.top = `${top}${units}`;
  element.style.width = `${width}${units}`;
  element.style.height = `${height}${units}`;
}
