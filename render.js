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
 * Render a schedule to target
 *
 * @param {Element} target - Target to write schedule to
 * @param {Schedule} schedule - Schedule to render
 */
function renderSchedule(target, schedule) {
  target.innerHTML = '';

  let earliest = Math.min(...schedule.events.map(x => x.startMinute));
  let latest = Math.max(...schedule.events.map(x => x.endMinute));

  let scale = 100.0 / (latest - earliest);

  let layeredEvents = layoutLayeredEvents(schedule.events);

  layeredEvents.forEach(function(le) {
    let eventDiv = document.createElement('div');
    let event = le.event;
    eventDiv.className = 'event';
    positionElement(
      eventDiv,
      '%',
      /* left   */ 20 * (event.day + le.layer / le.numLayers),
      /* top    */ scale * (event.startMinute - earliest),
      /* width  */ 20 / le.numLayers,
      /* height */ scale * (event.endMinute - event.startMinute)
    );
    eventDiv.innerHTML = event.group.course.name;
    target.appendChild(eventDiv);
  });
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
