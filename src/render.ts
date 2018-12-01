/**
 * Layered events for rendering on screen
 *
 * Explanation: Suppose you have events A, B, C, that collide like so (time
 * being horizontal):
 *
 *    [AAAAAAA]
 * [BBBBBB]
 *         [CCCCCC]
 *
 * Because the collisions are A-B and A-C (but never B-C), they can be laid
 * out, for example, like so:
 *
 * [BBBBBB][CCCCCC]
 *    [AAAAAAA]
 *
 * In this case, the numLayers for all events is 2, B and C are on layer 0, and
 * A is on layer 1. If C were to start a bit earlier, though, three layers would
 * be needed:
 *
 * [BBBBBB]
 *      [CCCCCC]
 *    [AAAAAAA]
 *
 * In this case the numLayers for all events is 3, and B, C, and A are on layers
 * 0, 1, and 2 respectively.
 */
class LayeredEvent {
  event: AcademicEvent;
  layer: number;
  numLayers: number;
}

/**
 * Sort events into buckets of colliding events.
 *
 * Shamelessly lifted from boazg at
 * https://github.com/lutzky/ttime/blob/master/lib/ttime/tcal/tcal.rb
 */
function layoutLayeredEvents(events: AcademicEvent[]): LayeredEvent[] {
  let result: LayeredEvent[] = [];

  let remaining = events.slice();

  while (remaining.length > 0) {
    let selected = new Set([remaining[0]]);
    let selectedMoreEvents = true;

    while (selectedMoreEvents) {
      selectedMoreEvents = false;
      let oldSelected = selected;
      selected = new Set();
      oldSelected.forEach(function(s) {
        selected.add(s);
        remaining.forEach(function(r) {
          if (eventsCollide([r, s])) {
            selected.add(r);
            selectedMoreEvents = true;
          }
        });
      });

      remaining = remaining.filter(x => !selected.has(x));
    }

    let layers: AcademicEvent[][] = [];

    selected.forEach(function(s) {
      let assignedToLayer = false;
      layers.some(function(layer, i) {
        if (!eventsCollide(layer.concat([s]))) {
          assignedToLayer = true;
          layer.push(s);
          return true;
        }
        return false;
      });

      if (!assignedToLayer) {
        // No layer has been assigned yet, so all layers must collide with
        // s. Create a new one.
        layers.push([s]);
      }
    });

    layers.forEach(function(l, i) {
      l.forEach(function(s) {
        result.push({
          event: s,
          layer: i,
          numLayers: layers.length,
        });
      });
    });
  }

  return result;
}

/**
 * Get the start time of the earliest event in the schedule
 */
function getEarliest(schedule: Schedule): number {
  return Math.min(...schedule.events.map(x => x.startMinute));
}

/**
 * Get the end time of the latest event in the schedule
 */
function getLatest(schedule: Schedule): number {
  return Math.max(...schedule.events.map(x => x.endMinute));
}

/**
 * Render a schedule to target
 */
function renderSchedule(target: HTMLElement, schedule: Schedule, courseColors: Map<number, string[]>) {
  target.innerHTML = '';

  let earliest = getEarliest(schedule);
  let latest = getLatest(schedule);
  let scale = 100.0 / (latest - earliest);

  let layeredEvents = layoutLayeredEvents(schedule.events);

  layeredEvents.forEach(function(le) {
    let eventDiv = document.createElement('div');
    let event = le.event;
    eventDiv.className = 'event';
    let colors = courseColors.get(event.group.course.id);
    eventDiv.style.backgroundColor = colors[0];
    eventDiv.style.color = colors[1];
    positionElement(
      eventDiv,
      '%',
      /* left   */ (100 / 6.0) * (1 + event.day + le.layer / le.numLayers),
      /* top    */ scale * (event.startMinute - earliest),
      /* width  */ 100 / 6.0 / le.numLayers,
      /* height */ scale * (event.endMinute - event.startMinute)
    );
    annotateEvent(eventDiv, event);
    target.appendChild(eventDiv);
  });

  addGridLines(target, schedule);
}

/**
 * Annotate the div with the actualy contents of the event
 */
function annotateEvent(target: HTMLElement, event: AcademicEvent) {
  target.innerHTML = '';
  let courseName = document.createElement('span');
  courseName.className = 'course-name';
  courseName.innerText = displayName(event.group);
  target.appendChild(courseName);

  let eventType = document.createElement('span');
  eventType.className = 'event-type';
  eventType.innerText = event.group.type;
  target.appendChild(eventType);

  let location = document.createElement('div');
  location.className = 'location';
  location.innerText = event.location;
  target.appendChild(location);

  let forbidDiv = document.createElement('div');
  forbidDiv.className = 'forbid';
  let forbidLink = document.createElement('a');
  forbidLink.innerHTML = '<i class="fas fa-ban"></i>';
  forbidLink.href = '#/';
  forbidLink.title = 'Forbid this group';
  forbidLink.onclick = function() {
    $(forbidLink)
      .fadeOut(100)
      .fadeIn(100);
    addForbiddenGroup(event.group);
  };
  forbidDiv.appendChild(forbidLink);
  target.appendChild(forbidDiv);
}

const gridDensity = 30;

/**
 * Render grid lines on target
 */
function addGridLines(target: HTMLElement, schedule: Schedule) {
  let earliest = getEarliest(schedule);
  let latest = getLatest(schedule);
  let scale = 100.0 / (latest - earliest);

  let firstGridLine = Math.ceil(earliest / gridDensity) * gridDensity;
  let lastGridLine = Math.floor(latest / gridDensity) * gridDensity;

  for (let t = firstGridLine; t <= lastGridLine; t += gridDensity) {
    let gridDiv = document.createElement('div');
    gridDiv.className = 'grid-line';
    gridDiv.innerText = minutesToTime(t);
    positionElement(
      gridDiv,
      '%',
      /* left    */ 0,
      /* top     */ scale * (t - earliest),
      /* width   */ 100,
      /* height  */ scale * gridDensity
    );
    target.appendChild(gridDiv);
  }
}

/**
 * Position element using the given units
 */
function positionElement(element: HTMLElement, units: string, left: number, top: number, width: number, height: number) {
  element.style.left = `${left}${units}`;
  element.style.top = `${top}${units}`;
  element.style.width = `${width}${units}`;
  element.style.height = `${height}${units}`;
}
