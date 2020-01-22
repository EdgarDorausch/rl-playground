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


export class Directional {
  private directionValues: {[direction in Direction]: number};

  constructor(initValues?: {[direction in Direction]: number}) {
    this.directionValues = initValues ?? {'north': 0, 'east': 0, 'south': 0, 'west': 0};
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
    const maxValue = Math.max(...directionList.map(d => this.directionValues[d]));
    const maxDirection = chooseRandomArrayElement(directionList.filter(d => this.directionValues[d] === maxValue));
    
    return {
      direction: maxDirection,
      directionValue: maxValue
    }
  }

  getDirectionByDistribution(): Direction {
    const directionValueList = Object.entries(this.directionValues) as [Direction, number][]
    const sum = directionValueList.reduce( (acc,[_, val]) => acc+val, 0);
    let r = Math.random()*sum;

    for(let [direction, val] of directionValueList) {
      if(r < val) {
        return direction;
      } else {
        r -= val;
      }
    }

    console.warn('Encountered non normalized distribution. This could caused by rounding errors!')
    const [direction, _] =  directionValueList[directionValueList.length];
    return direction;
  }
}
