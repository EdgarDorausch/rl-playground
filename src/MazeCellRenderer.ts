import { ViewMode, Direction } from './Utils';
import { State, StateTensor } from './State';
import * as d3 from 'd3';

export interface MazeCellRenderer {
  getColor(viewMode: ViewMode, state: State): string
  getTriangleColor(viewMode: ViewMode, direction: Direction, state: State): string
  showTriangles(viewMode: ViewMode, state: State): boolean
}

export class MyMazeCellRenderer implements MazeCellRenderer {

  private linScale = d3.scaleSequential(d3.interpolatePuOr).domain([0,1]);
  private powerScale = (t: number) => d3.scaleSequential(d3.interpolatePuOr).domain([0,1])(Math.pow(t, 1/10));

  constructor(private stateTensor: StateTensor) {}

  getColor(viewMode: ViewMode, state: State) {  
    if(!state.isValid) {
      return '#777';
    }

    switch(viewMode){
      case 'reward':
        return this.powerScale(state.reward);
      case 'value':
        return this.powerScale(state.value);
      case 'policy':
      case 'q-function':
        return 'red';
    }
  }

  getTriangleColor(viewMode: ViewMode, direction: Direction, state: State) {

    if(!state.isValid){
      return '#777';
    }

    switch(viewMode) {
      case 'policy':
        const itNum = 20;
        const itNumHalf = Math.floor(itNum/2);
        let acc = 0;
        const {x, y, t} = state;
        for(let i = 0; i < itNum; i++) {
          acc += this.stateTensor.unsafeGet(x,y,t+i-itNumHalf).policy === direction ? 1 : 0
        }
        return this.linScale(acc/itNum);
        // return direction === state.policy ? '#222' : '#eee';
      case 'q-function':
        return this.linScale(state.q.get(direction));
      case 'reward':
      case 'value':
        return 'red';
    }
  }

  showTriangles(viewMode: ViewMode, state: State) {

    if(!state.isValid){
      return false;
    }

    switch(viewMode) {
      case 'policy':
      case 'q-function':
        return true;
      case 'reward':
      case 'value':
        return false;
    }
  }
}