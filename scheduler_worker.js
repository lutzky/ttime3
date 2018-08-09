importScripts('common.js', 'scheduler.js');

/**
 * @param {Event} e - Message event
 */
onmessage = function(e) {
  console.log(
    'Message received from main script:',
    JSON.stringify(e.data, null, '  ')
  );

  let courses = Array.from(e.data.courses);
  let filters = Array.from(e.data.filters);

  let filterSettings = {
    forbiddenGroups: new Set(e.data.forbiddenGroups),
  };

  let schedules = generateSchedules(courses, filters, filterSettings);
  postMessage(schedules);
};
