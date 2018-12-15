/**
 * Return a cartesian product of arrays
 *
 * Note: If changing this method, test with "make karma_thorough".
 */
export default function cartesian<T>(...arrays: T[][]): T[][] {
  if (arrays.length === 0) {
    return [[]];
  }

  const subCart = cartesian(...arrays.slice(1));
  return arrays[0]
      .map((x) => subCart.map((y) => [x].concat(y)))
      .reduce((a, b) => a.concat(b));
}
