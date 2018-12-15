const ctx: Worker = self as any;

import {generateSchedules, setDebug} from './scheduler';

ctx.onmessage = (e: MessageEvent) => {
  if (e.data.debug !== undefined) {
    setDebug(e.data.debug);
    return;
  }
  try {
    const schedules = generateSchedules(e.data.courses, e.data.filterSettings);
    ctx.postMessage(schedules);
  } catch (err) {
    console.error('Caught exception in worker:', err);
    ctx.postMessage(null);
  }
};
