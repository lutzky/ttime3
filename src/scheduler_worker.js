// importScripts('common.js', 'scheduler.js');
importScripts('scheduler.js');

/**
 * @param {Event} e - Message event
 */
onmessage = function(e) {
  try {
    let schedules = generateSchedules(e.data.courses, e.data.filterSettings);
    postMessage(schedules);
  } catch (err) {
    console.error('Caught exception in worker:', err);
    postMessage(null);
  }
};
