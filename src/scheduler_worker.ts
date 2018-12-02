importScripts('common.js', 'scheduler.js');

import {generateSchedules} from './scheduler';

onmessage = function(e: MessageEvent) {
  try {
    let schedules = generateSchedules(e.data.courses, e.data.filterSettings);
    // TODO(lutzky): For some reason, both TypeScript and the documentation at
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    // expect postMessage to have two parameters. However, this isn't the same
    // function - it's not Window.postMessage, it's Worker.postMessage:
    // https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
    //
    // Maybe this SO question will help:
    // https://stackoverflow.com/questions/38715001/how-to-make-web-workers-with-typescript-and-webpack
    // @ts-ignore
    postMessage(schedules);
  } catch (err) {
    console.error('Caught exception in worker:', err);
    // @ts-ignore
    postMessage(null);
  }
};
