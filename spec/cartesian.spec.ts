import {expect} from 'chai';

import cartesian from '../src/cartesian';

let THOROUGH_TEST_MODE = false;

declare var ttime_thorough: boolean;

if (typeof ttime_thorough !== 'undefined') {
  console.info('Thorough test mode active');
  THOROUGH_TEST_MODE = true;
}

describe('Cartesian products', () => {
  it('should calculate correctly in trivial cases', () => {
    const a = [[1, 2]];
    expect(cartesian(...a)).to.deep.equal([[1], [2]]);
    const b = [[1, 2, 3]];
    expect(cartesian(...b)).to.deep.equal([[1], [2], [3]]);
  });
  it('should caculate correctly in nontrivial cases', () => {
    const a = [[1, 2], [3, 4, 6]];
    expect(cartesian(...a)).to.deep.equal([
      [1, 3],
      [1, 4],
      [1, 6],
      [2, 3],
      [2, 4],
      [2, 6],
    ]);
  });
  if (THOROUGH_TEST_MODE) {
    it('should not crash with large inputs', () => {
      const a = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      ];
      expect(() => cartesian(...a)).to.not.throw();
    }).timeout(10000);
  }
});
