import { ViewMode, Direction } from './Utils';
import { State } from './State';
import * as d3 from 'd3';

export interface MazeCellRenderer {
  getColor(viewMode: ViewMode, state: State): string
  getTriangleColor(viewMode: ViewMode, direction: Direction, state: State): string
  showTriangles(viewMode: ViewMode, state: State): boolean
}

export class MyMazeCellRenderer implements MazeCellRenderer {

  private colorScale = d3.scaleSequential(d3.interpolatePuOr).domain([0,1]);

  getColor(viewMode: ViewMode, state: State) {  
    if(!state.isValid) {
      return '#444';
    }

    switch(viewMode){
      case 'reward':
        return this.colorScale(state.reward);
      case 'value':
        return this.colorScale(state.value);
      case 'simple':
      case 'policy':
      case 'q-function':
        return 'darkgray';
    }
  }

  getTriangleColor(viewMode: ViewMode, direction: Direction, state: State) {

    if(!state.isValid){
      return '#444';
    }

    switch(viewMode) {
      case 'policy':
        return direction === state.policy.getMaximum().direction ? '#222' : '#eee';
      case 'q-function':
        return this.colorScale(state.q.get(direction));
      case 'reward':
      case 'simple':
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
      case 'simple':
      case 'value':
        return false;
    }
  }
}