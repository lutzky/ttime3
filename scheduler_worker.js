importScripts('common.js', 'scheduler.js');

/**
 * @param {Event} e - Message event
 */
onmessage = function(e) {
  console.log(
    'Message received from main script:',
    JSON.stringify(e.data, null, '  ')
  );

  let schedules = generateSchedules(e.data.courses, e.data.filterSettings);
  postMessage(schedules);
};
