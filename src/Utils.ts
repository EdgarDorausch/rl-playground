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

export type ViewMode = 'simple' | 'reward' | 'value' | 'q-function' | 'policy';
export type Direction = 'north' | 'east' | 'west' | 'south';
export const directionList: Direction[] = ['north' , 'east' , 'west' , 'south'];

export class Directional {
  private directionValues: {[direction in Direction]: number};

  constructor() {
    this.directionValues = {'north': 0, 'east': 0, 'south': 0, 'west': 0};
  }

  get(d: Direction): number {
    return this.directionValues[d];
  }
  set(d: Direction, value: number): void {
    this.directionValues[d] = value;
  }

  getMaximum(): {direction: Direction, directionValue: number} {
    const maxValue = Math.max(...directionList.map(d => this.directionValues[d]));
    const maxDirection = chooseRandomArrayElement(directionList.filter(d => this.directionValues[d] === maxValue));
    
    return {
      direction: maxDirection,
      directionValue: maxValue
    }
  }
}
