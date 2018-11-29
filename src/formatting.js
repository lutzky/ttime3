'use strict';

/**
 * Convert minutes-from-midnight to HH:MM
 *
 * @param {number} minutes - Minutes from midnight
 * @returns {string} - HH:MM
 */
function minutesToTime(minutes) {
  let hourString = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  let minuteString = (minutes % 60).toString().padStart(2, '0');
  return hourString + ':' + minuteString;
}

/**
 * @typedef {{year: number, month: number, day: number}}
 */
let DateObj;
/* exported DateObj */

/**
 * Format a DateObj as a string
 *
 * @param {DateObj} dateObj - Date to format
 * @returns {string}
 */
function formatDate(dateObj) {
  return new Date(dateObj.year, dateObj.month, dateObj.day).toDateString();
}

if (typeof module != 'undefined') {
  module.exports = {
    minutesToTime: minutesToTime,
    formatDate: formatDate,
  };
}
