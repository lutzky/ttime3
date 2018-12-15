
/**
 * Layered objects for avoiding collisions
 *
 * Explanation: Suppose you have objects A, B, C, that collide like so (time
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
class Layered<T> {
  public obj: T;
  public layer: number;
  public numLayers: number;
}

/**
 * Sort events into buckets of colliding events.
 *
 * Shamelessly lifted from boazg at
 * https://github.com/lutzky/ttime/blob/master/lib/ttime/tcal/tcal.rb
 *
 * @param objects - Objects to sort into layers
 * @param collide - Function to determine if an array of objects collides
 */
export default function layerize<T>(
    objects: T[], collide: (objs: T[]) => boolean): Array<Layered<T>> {
  const result: Array<Layered<T>> = [];

  let remaining = objects.slice();

  while (remaining.length > 0) {
    let selected = new Set([remaining[0]]);
    let selectedMoreObjects = true;

    while (selectedMoreObjects) {
      selectedMoreObjects = false;
      const oldSelected = selected;
      selected = new Set();
      oldSelected.forEach((s) => {
        selected.add(s);
        remaining.forEach((r) => {
          if (collide([r, s])) {
            selected.add(r);
            selectedMoreObjects = true;
          }
        });
      });

      remaining = remaining.filter((x) => !selected.has(x));
    }

    const layers: T[][] = [];

    selected.forEach((s) => {
      let assignedToLayer = false;
      layers.some((layer, _) => {
        if (!collide(layer.concat([s]))) {
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

    layers.forEach((l, i) => {
      l.forEach((s) => {
        result.push({
          obj: s,

          layer: i,
          numLayers: layers.length,
        });
      });
    });
  }

  return result;
}
