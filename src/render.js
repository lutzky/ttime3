'use strict';

/**
 * @typedef {{
 *   event: AcademicEvent,
 *   layer: number,
 *   numLayers: number,
 * }}
 *
 * Explanation: Suppose you have events A, B, C, that collide like so (time
 * being horizontal):
 *
 *    [AAAAAAA]
 * [BBBBBB]
 *         [CCCCCC]
 *
 * Because the collisions are A-B and A-C (but never B-C), they can be laid
 * out, for example, like so:
 *
 * [BBBBBB][CCCCCC]
 *    [AAAAAAA]
 *
 * In this case, the numLayers for all events is 2, B and C are on layer 0, and
 * A is on layer 1. If C were to start a bit earlier, though, three layers would
 * be needed:
 *
 * [BBBBBB]
 *      [CCCCCC]
 *    [AAAAAAA]
 *
 * In this case the numLayers for all events is 3, and B, C, and A are on layers
 * 0, 1, and 2 respectively.
 *
 */
let LayeredEvent;
/* exported LayeredEvent */

/**
 * Sort events into buckets of colliding events.
 *
 * Shamelessly lifted from boazg at
 * https://github.com/lutzky/ttime/blob/master/lib/ttime/tcal/tcal.rb
 *
 * @param {Array<AcademicEvent>} events - Events to layer
 *
 * @returns {Array<LayeredEvent>}
 */
function layoutLayeredEvents(events) {
  /** @type {Array<LayeredEvent>} */
  let result = [];

  let remaining = events.slice();

  while (remaining.length > 0) {
    let selected = new Set([remaining[0]]);
    let selectedMoreEvents = true;

    while (selectedMoreEvents) {
      selectedMoreEvents = false;
      let oldSelected = selected;
      selected = new Set();
      oldSelected.forEach(function(s) {
        selected.add(s);
        remaining.forEach(function(r) {
          if (eventsCollide([r, s])) {
            selected.add(r);
            selectedMoreEvents = true;
          }
        });
      });

      remaining = remaining.filter(x => !selected.has(x));
    }

    /** @type {Array<Array<AcademicEvent>>} */
    let layers = [];

    selected.forEach(function(s) {
      let assignedToLayer = false;
      layers.some(function(layer, i) {
        if (!eventsCollide(layer.concat([s]))) {
          assignedToLayer = true;
          layer.push(s);
          return true;
        }
      });

      if (!assignedToLayer) {
        // No layer has been assigned yet, so all layers must collide with
        // s. Create a new one.
        layers.push([s]);
      }
    });

    layers.forEach(function(l, i) {
      l.forEach(function(s) {
        result.push({
          event: s,
          layer: i,
          numLayers: layers.length,
        });
      });
    });
  }

  return result;
}

/**
 * Get the start time of the earliest event in the schedule
 *
 * @param {Schedule} schedule - Schedule
 *
 * @returns {number}
 */
function getEarliest(schedule) {
  return Math.min(...schedule.events.map(x => x.startMinute));
}

/**
 * Get the end time of the latest event in the schedule
 *
 * @param {Schedule} schedule - Schedule
 *
 * @returns {number}
 */
function getLatest(schedule) {
  return Math.max(...schedule.events.map(x => x.endMinute));
}

/**
 * Render a schedule to target
 *
 * @param {Element} target - Target to write schedule to
 * @param {Schedule} schedule - Schedule to render
 * @param {Map<number, Array<string>>} courseColors - Map from course ID to
 *                                                    colors
 */
function renderSchedule(target, schedule, courseColors) {
  target.innerHTML = '';

  let earliest = getEarliest(schedule);
  let latest = getLatest(schedule);
  let scale = 100.0 / (latest - earliest);

  let layeredEvents = layoutLayeredEvents(schedule.events);

  layeredEvents.forEach(function(le) {
    let eventDiv = document.createElement('div');
    let event = le.event;
    eventDiv.className = 'event';
    let colors = courseColors.get(event.group.course.id);
    eventDiv.style['background-color'] = colors[0];
    eventDiv.style['color'] = colors[1];
    positionElement(
      eventDiv,
      '%',
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

/**
 * Annotate the div with the actualy contents of the event
 *
 * @param {Element} target - Div to annotate
 * @param {AcademicEvent} event - Event details to show
 */
function annotateEvent(target, event) {
  target.innerHTML = '';
  let courseName = document.createElement('span');
  courseName.className = 'course-name';
  courseName.innerText = displayName(event.group);
  target.appendChild(courseName);

  let eventType = document.createElement('span');
  eventType.className = 'event-type';
  eventType.innerText = event.group.type;
  target.appendChild(eventType);

  let location = document.createElement('div');
  location.className = 'location';
  location.innerText = event.location;
  target.appendChild(location);

  let forbidDiv = document.createElement('div');
  forbidDiv.className = 'forbid';
  let forbidLink = document.createElement('a');
  forbidLink.innerHTML = '<i class="fas fa-ban"></i>';
  forbidLink.href = '#/';
  forbidLink.title = 'Forbid this group';
  forbidLink.onclick = function() {
    $(forbidLink)
      .fadeOut(100)
      .fadeIn(100);
    addForbiddenGroup(event.group);
  };
  forbidDiv.appendChild(forbidLink);
  target.appendChild(forbidDiv);
}

const gridDensity = 30;

/**
 * Render grid lines on target
 *
 * @param {Element} target - Target to draw grid lines on
 * @param {Schedule} schedule - Schedule being rendered
 */
function addGridLines(target, schedule) {
  let earliest = getEarliest(schedule);
  let latest = getLatest(schedule);
  let scale = 100.0 / (latest - earliest);

  let firstGridLine = Math.ceil(earliest / gridDensity) * gridDensity;
  let lastGridLine = Math.floor(latest / gridDensity) * gridDensity;

  for (let t = firstGridLine; t <= lastGridLine; t += gridDensity) {
    let gridDiv = document.createElement('div');
    gridDiv.className = 'grid-line';
    gridDiv.innerText = minutesToTime(t);
    positionElement(
      gridDiv,
      '%',
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
 *
 * @param {Element} element - Element to position
 * @param {string} units - Units, appended to all coordinates
 * @param {number} left - Left coordinate
 * @param {number} top - Top coordinate
 * @param {number} width - Width
 * @param {number} height - Height
 */
function positionElement(element, units, left, top, width, height) {
  element.style.left = `${left}${units}`;
  element.style.top = `${top}${units}`;
  element.style.width = `${width}${units}`;
  element.style.height = `${height}${units}`;
}

if (typeof module != 'undefined') {
  module.exports = {
    layoutLayeredEvents: layoutLayeredEvents,
    renderSchedule: renderSchedule,
  };
}
