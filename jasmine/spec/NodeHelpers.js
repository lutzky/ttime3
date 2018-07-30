if (typeof require != 'undefined') {
  let common = require('../../common');
  let scheduler = require('../../scheduler');
  let formatting = require('../../formatting');

  sortEvents = common.sortEvents;
  cartesian = scheduler.cartesian;
  eventsCollide = common.eventsCollide;
  minutesToTime = formatting.minutesToTime;
  generateSchedules = scheduler.generateSchedules;
  filterNoRunning = scheduler.filterNoRunning;

  loadTestCatalog = () => common.loadCatalog('testdata.json', true);
} else {
  // Not running in Node, do nothing.
}
