import { Direction, directionList, chooseRandomArrayElement, Directional } from './Utils';

export class State {

  constructor(
    private stateTensor: StateTensor,
    
    private _x: number,
    private _y: number,
    private _t: number,

    public isValid: boolean,

    public reward: number,
    public value: number,
    public q: Directional,
    public policy: Directional
  ) {}

  get t() {
    return this._t;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }


  /**
   * Returning the neighbor state according to the given direction.
   * `null` is returned if there is no neighbor inside the stateTensor or the neighbor is not valid
   */
  getNeighbor(direction: Direction): State|null {
    let newPos;
    const x = this._x;
    const y = this._y;
    const t = this._t;
    switch(direction) {
      case 'north':
        newPos = [x, y-1, t+1];
        break;
      case 'east':
        newPos = [1+x, y, t+1];
        break;
      case 'south':
        newPos = [x, y+1, t+1];
        break;
      case 'west':
        newPos = [x-1, y, t+1];
        break;
      default:
        throw new Error(`Unknown direction: ${direction}`)
    }
    
    const [newX,newY,newT] = newPos;
    const neighbor = this.stateTensor.get(newX, newY, newT);

    if (neighbor === null) {
      return null;
    }
    
    if(!neighbor.isValid)
      return null;
      
    return neighbor;
  }
}


type State3DList = State[][][];
export class StateTensor {

  private state3DList: State3DList;

  constructor(
    private maxX: number,
    private maxY: number,
    private maxTimer: number
  ) {
    
    this.state3DList = 
      new Array(maxX    ).fill(null).map((_,x) => 
      new Array(maxY    ).fill(null).map((_,y) => 
      new Array(maxTimer).fill(null).map((_,t) =>
        new State(
          this,
          x,y,t,
          true,
          0,0,
          new Directional(),
          new Directional()
        )
      )))
  }

  get(x: number, y: number, t: number): State|null {

    // Check if x,y in bounds
    if(0 <= x && x < this.maxX &&
       0 <= y && y < this.maxY) {
      return null;
    }

    const modT = t % this.maxTimer; 

    return(this.state3DList[x][y][modT])
  }

  unsafeGet(x: number, y: number, t: number): State {

    const state = this.get(x,y,t);
    if(state === null) {
      throw new Error()
    }

    return state;
  }
}