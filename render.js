'use strict';

/**
 * @typedef {Object} LayeredEvent
 * @property {Event} event - Actual event
 * @property {number} layer - Collision layer for event
 * @property {number} ratio - How much to scale this event by
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
 * In this case, the ratio for all events is 1/2, B and C are on layer 0, and A
 * is on layer 1. If C were to start a bit earlier, though, three layers
 * would be needed:
 *
 * [BBBBBB]
 *      [CCCCCC]
 *    [AAAAAAA]
 *
 * In this case the ratio for all events is 1/3, and B, C, and A are on layers
 * 0, 1, and 2 respectively.
 *
 */

/**
 * Sort events into buckets of colliding events.
 *
 * Shamelessly lifted from boazg at
 * https://github.com/lutzky/ttime/blob/master/lib/ttime/tcal/tcal.rb
 *
 * @param {Event[]} events - Events to layer
 *
 * @returns {LayeredEvent[]}
 */
function layoutLayeredEvents(events) {
  // TODO(lutzky): This does not yet actually return anything useful, and
  // modifies its input, when it shouldn't.
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

    let layers = [];

    selected.forEach(function(s) {
      // TODO(lutzky): Assigning s.layer here breaks the Event type :/
      s.layer = null;

      layers.some(function(layer, i) {
        if (!eventsCollide(layer.concat([s]))) {
          layer.push(s);
          s.layer = i;
          return true;
        }
      });

      if (s.layer == null) {
        // No layer has been assigned yet, so all layers must collide with
        // s. Create a new one.
        layers.push([s]);
        s.layer = layers.length - 1;
      }
    });

    let ratio = 1.0 / layers.length;
    selected.forEach(function(s) {
      s.ratio = ratio;
    });
  }

  return result;
}

if (typeof module != 'undefined') {
  module.exports = {
    layoutLayeredEvents: layoutLayeredEvents,
  };
}
