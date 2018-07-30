if (typeof require != 'undefined') {
  let common = require('../../common');
  let formatting = require('../../formatting');
  let render = require('../../render');
  let scheduler = require('../../scheduler');

  cartesian = scheduler.cartesian;
  eventsCollide = common.eventsCollide;
  filterNoRunning = scheduler.filterNoRunning;
  generateSchedules = scheduler.generateSchedules;
  layoutLayeredEvents = render.layoutLayeredEvents;
  minutesToTime = formatting.minutesToTime;
  sortEvents = common.sortEvents;

  loadTestCatalog = () => common.loadCatalog('testdata.json', true);
} else {
  // Not running in Node, do nothing.
}
