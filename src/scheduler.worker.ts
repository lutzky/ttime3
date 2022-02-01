/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const ctx: Worker = self as unknown as Worker;

import { generateSchedules, setDebug } from "./scheduler";
import { Course, FilterSettings } from "./common";

ctx.onmessage = (e: MessageEvent) => {
  if (e.data.debug !== undefined) {
    setDebug(e.data.debug as boolean);
    return;
  }
  try {
    const schedules = generateSchedules(
      e.data.courses as Set<Course>,
      e.data.filterSettings as FilterSettings
    );
    ctx.postMessage(schedules);
  } catch (err) {
    console.error("Caught exception in worker:", err);
    ctx.postMessage(null);
  }
};
