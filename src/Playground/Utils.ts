// Helper functions

type Array4 = [number, number, number, number];

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

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export const numberOfDirections = 4;

type DirectionValueInitializer = (direction: Direction) => number;
export class Directional {

  protected directionValues: Array4;

  constructor(directionValueInitializer: DirectionValueInitializer = () => 0) {
    this.directionValues = [
      directionValueInitializer(Direction.NORTH),
      directionValueInitializer(Direction.EAST),
      directionValueInitializer(Direction.SOUTH),
      directionValueInitializer(Direction.WEST)
    ]
  }

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
    let maxDirection = 0;
    let maxValue = 0;
    
    // Find maximum by traversing all direction values
    for(let d=0; d<numberOfDirections; d++) {
      if(this.directionValues[d] > maxValue) {
        maxValue = this.directionValues[d];
        maxDirection = d;
      }
    }
    
    return {
      direction: maxDirection,
      directionValue: maxValue
    }
  }
}

const pseudoZero = 0.00001;
export class StochasticDirectional extends Directional {

  constructor(directionValueInitializer: DirectionValueInitializer = () => 0.25) {
    super(directionValueInitializer);
  }

   normalize() {
    const l1Norm = this.directionValues.reduce((acc, val) => val+acc, 0);
    if(l1Norm === 0) {
      throw new Error('Sum of all elements in StochasticDirectional is Zero, so normalization has failed!')
    }
    this.directionValues.map(val => val/l1Norm);
  }

  check() {
    const l1Norm = this.directionValues.reduce((acc, val) => val+acc, 0);
    if(l1Norm === 0) {
      throw new Error('Sum of all elements in StochasticDirectional is Zero, so normalization has failed!')
    }
    for(let val of this.directionValues) {
      if(val < -pseudoZero) {
        throw new Error('Elements in StochasticDirectional should not be negative!')
      }
    }
  }

  set(d: Direction, value: number): void {
    super.set(d, value);
  }

  getDirectionByDistribution(): Direction {
    let r = Math.random();

    // For all directions
    for(let d = 0; d<numberOfDirections; d++){
      const val = this.directionValues[d];
      if(r < val) {
        return d;
      } else {
        r -= val;
      }
    }

    console.warn('Encountered non normalized distribution. This could caused by rounding errors!')
    // Return last direction (this is west; id===3)
    return Direction.WEST;
  }
}