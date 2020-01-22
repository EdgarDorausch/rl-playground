// Helper functions

export function translate(x: number, y: number): string {
  return `translate(${x},${y})`
}

export function visibility(visibility: boolean) {
  return visibility ? 'visible' : 'hidden';
}

export function sleep(milliseconds: number): Promise<void> {
   return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function L2Norm(x: number, y: number): number {
  return Math.sqrt(x*x + y*y);
}

export function chooseRandomArrayElement<T>(a: T[]): T {
  const len = a.length;
  const idx = Math.floor(Math.random() * len);
  return a[idx];
}

export function range(stop: number): number[] {
  const out: number[] = [];
  for(let i=0; i<stop; i++) {
    out.push(i)
  }
  return out;
}

export function cross<A,B>(as: A[], bs: B[]): [A,B][] {
  const out: [A,B][] = [];
  for(let a of as) {
    for(let b of bs) {
      out.push([a,b]);
    }
  }
  return out;
}

export const viewModeList = ['reward' , 'value' , 'q-function' , 'policy'] as ['reward' , 'value' , 'q-function' , 'policy'];
export type ViewMode = typeof viewModeList[number];

export const directionList = ['north' , 'east' , 'west' , 'south'] as ['north' , 'east' , 'west' , 'south'];
export type Direction = typeof directionList[number];
export const numberOfDirections = directionList.length;


type DirectionValues = {[direction in Direction]: number};
export class Directional {

  constructor(protected directionValues: DirectionValues = {'north': 0, 'east': 0, 'south': 0, 'west': 0}) {}

  get(d: Direction): number {
    return this.directionValues[d];
  }
  set(d: Direction, value: number): void {
    this.directionValues[d] = value;
  }

  /**
   * Returns an object with the direction whose value is maximal and the according value
   */
  getMaximum(): {direction: Direction, directionValue: number} {
    const maxValue = Math.max(...directionList.map(d => this.directionValues[d]));
    const maxDirection = chooseRandomArrayElement(directionList.filter(d => this.directionValues[d] === maxValue));
    
    return {
      direction: maxDirection,
      directionValue: maxValue
    }
  }
}

const pseudoZero = 0.00001;

export class StochasticDirectional extends Directional {

  constructor(initValues: DirectionValues = {'north': 1, 'east': 1, 'south': 1, 'west': 1}) {
    super(initValues);
    this.normalizeDirectionValues();
  }

  private normalizeDirectionValues() {
    const l1Norm = directionList.reduce((acc, direction) => this.directionValues[direction], 0);
    if(l1Norm === 0) {
      throw new Error('Sum of all elements in StochasticDirectional is Zero, so normalization has failed!')
    }
    for(let direction of directionList) {
      this.directionValues[direction] /= l1Norm;
      if(this.directionValues[direction] < -pseudoZero) {
        throw new Error('Elements in StochasticDirectional should not be negative!')
      }
    }
  }

  set(d: Direction, value: number): void {
    super.set(d, value);
    this.normalizeDirectionValues();
  }

  getDirectionByDistribution(): Direction {
    const directionValueList = Object.entries(this.directionValues) as [Direction, number][];
    let r = Math.random();

    for(let [direction, val] of directionValueList) {
      if(r < val) {
        return direction;
      } else {
        r -= val;
      }
    }

    console.warn('Encountered non normalized distribution. This could caused by rounding errors!')
    // Get direction of the last element in directionValueList
    const direction = directionValueList[directionValueList.length-1][0];
    return direction;
  }
}