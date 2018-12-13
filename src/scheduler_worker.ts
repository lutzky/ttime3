const ctx: Worker = self as any;

import {generateSchedules} from './scheduler';

ctx.onmessage = (e: MessageEvent) => {
  try {
    const schedules = generateSchedules(e.data.courses, e.data.filterSettings);
    ctx.postMessage(schedules);
  } catch (err) {
    console.error('Caught exception in worker:', err);
    ctx.postMessage(null);
  }
};
