import { Utilities } from './utilities';

describe('Utilities', () => {
  it('works 1', () => {
    expect(Utilities.flatten([[1, 2], [3, 4], 2, [5, 6]])).toEqual([
      1, 2, 3, 4, 2, 5, 6,
    ]);
  });
  it('works 2', () => {
    expect(Utilities.flatten([[1, 2], [3, [4, 5]], [6]])).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });
});
