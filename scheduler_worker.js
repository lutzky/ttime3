importScripts('common.js', 'scheduler.js');

onmessage = function(e) {
  console.log('Message received from main script:', e.data);

  let courses = Array.from(e.data);

  let schedules = generateSchedules(courses, ['noCollisions']);
  postMessage(schedules);
};
