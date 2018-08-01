'use strict';

/**
 * @typedef {Object} LayeredEvent
 * @property {Event} event - Actual event
 * @property {number} layer - Collision layer for event
 * @property {number} numLayers - The total number of layers
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

/**
 * Sort events into buckets of colliding events.
 *
 * Shamelessly lifted from boazg at
 * https://github.com/lutzky/ttime/blob/master/lib/ttime/tcal/tcal.rb
 *
 * @param {Array<Event>} events - Events to layer
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

    /** @type {Array<Array<<Event>>} */
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

if (typeof module != 'undefined') {
  module.exports = {
    layoutLayeredEvents: layoutLayeredEvents,
  };
}
