import { cross, range } from './Utils'

describe('cross', () => {
  it('should return empty list if one given list is empty', () => {
    expect(cross([], [2,3,5])).toEqual([]);
    expect(cross([2,3,5], [])).toEqual([]);
  })

  it('should return the right result if both list are not empty', () => {
    expect(cross([1,2], [3,4])).toEqual([[1,3],[1,4],[2,3],[2,4]]);
  })
})

describe('range', () => {
  it('should return an empty list for values less or equal zero', () => {
    expect(range(-4)).toEqual([]);
    expect(range(0)).toEqual([]);

  })

  it('should return the right result for values greater than zero', () => {
    expect(range(3)).toEqual([0,1,2]);

  })
})