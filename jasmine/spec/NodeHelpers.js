if (typeof require != 'undefined') {
  let common = require('../../common');
  let scheduler = require('../../scheduler');
  let formatting = require('../../formatting');

  sortEvents = common.sortEvents;
  cartesian = scheduler.cartesian;
  eventsCollide = scheduler.eventsCollide;
  minutesToTime = formatting.minutesToTime;
  generateSchedules = scheduler.generateSchedules;

  loadTestCatalog = () => common.loadCatalog('testdata.json', true);
} else {
  // Not running in Node, do nothing.
}
