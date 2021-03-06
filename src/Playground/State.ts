import { Directional, StochasticDirectional, Direction } from './Utils';

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
    public policy: StochasticDirectional
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
  getNeighbor(direction: Direction): State {
    let newPos;
    const x = this._x;
    const y = this._y;
    const t = this._t;
    switch(direction) {
      case Direction.NORTH:
        newPos = [x, y-1, t+1];
        break;
      case Direction.EAST:
        newPos = [1+x, y, t+1];
        break;
      case Direction.SOUTH:
        newPos = [x, y+1, t+1];
        break;
      case Direction.WEST:
        newPos = [x-1, y, t+1];
        break;
      case Direction.NORTH_EAST:
        newPos = [x+1, y-1, t+1];
        break;
      case Direction.SOUTH_EAST:
        newPos = [1+x, y+1, t+1];
        break;
      case Direction.SOUTH_WEST:
        newPos = [x-1, y+1, t+1];
        break;
      case Direction.NORTH_WEST:
        newPos = [x-1, y-1, t+1];
        break;
      case Direction.STALL:
        newPos = [x, y, t+1];
        break;
    default:
        throw new Error(`Unknown direction: ${direction}`)
    }
    
    const [newX,newY,newT] = newPos;
    const neighbor = this.stateTensor.get(newX, newY, newT);

    if (neighbor === null || !neighbor.isValid) {
      return this.getFutureState();
    }

    return neighbor;
  }

  /**
   * Returns the state with the same x and y coordinates but one time tick in the future
   * TODO: write unit test 
   */
  getFutureState() {
    const {x, y, t} = this;
    return this.stateTensor.unsafeGet(x,y,t+1); // entry with this indices should always exist
  } 
}


export type StateBuilder = (x: number, y: number, t: number) => ({
  isValid?: boolean,
  reward?: number,
  value?: number,
  q?: Directional,
  policy?: StochasticDirectional 
})

type State3DList = State[][][];
export class StateTensor {

  private state3DList: State3DList;

  constructor(
    private maxX: number,
    private maxY: number,
    private maxTimer: number,
    stateBuilder: StateBuilder
  ) {
    
    this.state3DList = 
      new Array(maxX    ).fill(null).map((_,x) => 
      new Array(maxY    ).fill(null).map((_,y) => 
      new Array(maxTimer).fill(null).map((_,t) => {
        const {
          isValid,
          reward,
          value,
          policy,
          q
        } = stateBuilder(x,y,t);
        return new State(
          this,
          x,y,t,
          isValid ?? true,
          reward  ?? 0,
          value   ?? 0,
          q       ?? new Directional(),
          policy  ?? new StochasticDirectional()
        )}
      )))
  }

  get(x: number, y: number, t: number): State|null {

    // Check if x,y in bounds
    if(0 <= x && x < this.maxX &&
       0 <= y && y < this.maxY) {
      const modT = ((t % this.maxTimer)+this.maxTimer) % this.maxTimer; // Map t to [0,maxTimer) interval
      return(this.state3DList[x][y][modT])
      
    } else {
      return null
    }

    
  }

  unsafeGet(x: number, y: number, t: number): State {

    const state = this.get(x,y,t);
    if(state === null) {
      throw new Error(`Could not return state for (x,y,t)=(${x},${y},${t})`)
    }

    return state;
  }

  get sizeX() {
    return this.maxX;
  }

  get sizeY() {
    return this.maxY;
  }

  get sizeT() {
    return this.maxTimer;
  }
}