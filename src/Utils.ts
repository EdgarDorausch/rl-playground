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