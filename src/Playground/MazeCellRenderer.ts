import { ViewMode, Direction, numberOfDirections, StochasticDirectional } from './Utils';
import { State, StateTensor } from './State';
import * as d3 from 'd3';

export interface MazeCellRenderer {
  getColor(viewMode: ViewMode, state: State): string
  getTriangleColor(viewMode: ViewMode, direction: Direction, state: State): string
  showTriangles(viewMode: ViewMode, state: State): boolean
}

type PolicyMode = 'Accumulated' | 'InverseEntropy'

export class MyMazeCellRenderer implements MazeCellRenderer {

  private linScale = d3.scaleSequential(d3.interpolatePuOr).domain([0,1]);
  private powerScale = (t: number) => d3.scaleSequential(d3.interpolatePuOr).domain([0,1])(Math.pow(t, 1/10));

  private currentTime = 0;
  private policyBuffer: StateTensor;

  private itNum = 10;
  private itNumHalf = Math.floor(this.itNum/2);

  private maxEntropy = Math.log(numberOfDirections);

  constructor(private stateTensor: StateTensor, private policyMode: PolicyMode = 'Accumulated') {
    this.policyBuffer = new StateTensor(stateTensor.sizeX, stateTensor.sizeY, 1, () => ({policy: new StochasticDirectional(() => 0)}));
    // this.initPolicyBuffer();
    console.log(this.maxEntropy);
  }

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
        if(this.currentTime !== state.t) 
          this.updatePolicyBuffer(state.t)
        
        const {x, y} = state;
        const val = this.policyBuffer.unsafeGet(x,y,0).policy.get(direction);
        return this.linScale(val);
      case 'q-function':
        return this.linScale(state.q.get(direction));
      case 'reward':
      case 'value':
        return 'red';
    }
  }

  private updatePolicyBuffer(newT: number) {
    this.currentTime = newT;
    for(let x = 0; x < this.policyBuffer.sizeX; x++) {
      for(let y = 0; y < this.policyBuffer.sizeY; y++) {
        const currentPolicyField = this.policyBuffer.unsafeGet(x,y,0).policy;
        currentPolicyField.sub(currentPolicyField);

        for(let t=0; t < this.itNum; t++) {
          currentPolicyField.add(this.stateTensor.unsafeGet(x,y,this.currentTime-t+this.itNumHalf).policy)
        }

        currentPolicyField.normalize()
        const inverseEntropy = (this.maxEntropy - currentPolicyField.getEntropy())/this.maxEntropy;
        currentPolicyField.scale(inverseEntropy);
      }
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