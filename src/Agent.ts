import {AbstractMazeCell, MazeCell} from './Maze';
import {chooseRandomArrayElement, ViewMode} from './Utils';

export class Agent {
  startCell: MazeCell;
  state: MazeCell;
  maze: AbstractMazeCell[][];
  mazeDim: [number, number];
  discountFactor: number;
  learningRate: number;
  explorationFactor: number;
  actionList = ['north', 'east', 'south', 'west'];

  constructor(startCell: MazeCell, maze: AbstractMazeCell[][]) {
    this.startCell = startCell;
    this.state = startCell;
    this.maze = maze;
    this.mazeDim = [maze[0].length, maze.length]
    this.discountFactor = 0.15;
    this.learningRate = 0.5;
    this.explorationFactor = 0.7;
  }
  
  
  chooseGreedyAction() {
    const valuedActions = this.actionList.map(action => {
      const nextState = this.state.getNeighbor(action);
      
      const value = nextState !== null ? 
        nextState.value:
        Number.NEGATIVE_INFINITY;
      
      return {action, value};
    });
    
    const maxValue = Math.max(...valuedActions.map(action=>action.value))
    if(maxValue === Number.NEGATIVE_INFINITY) {
      console.log(valuedActions)
      throw new Error('Cant choose greedy action! Deadlock!');
    }
    
    const maxActions = valuedActions.filter(action => action.value === maxValue);
    const randomValuedAction = chooseRandomArrayElement(maxActions);

    return randomValuedAction.action;
  }
  
  chooseRandomAction() {
    return chooseRandomArrayElement(this.actionList);
  }
  
  chooseAction() {
    if(Math.random() < this.explorationFactor) {
      return this.chooseRandomAction();
    } else {
      return this.chooseGreedyAction();
    }
  }
  
  updateValue(nextState: MazeCell) {
    const newVal = (1-this.learningRate)*this.state.value + 
      this.learningRate*(
        nextState.reward +
        this.discountFactor*nextState.value
      )
    
    this.state.value = newVal;
  }
  
  takeAction(action: string) {
    let nextState = this.state.getNeighbor(action);
    
    if(nextState === null){
      console.log(`Cant take action: ${action};`);
      nextState = this.state;
    }

    this.updateValue(nextState)
    
    this.state = nextState;
  }
  
  doStep() {
    const action = this.chooseAction();
    this.takeAction(action);
  }
  
  resetPosition() {
    this.state = this.startCell;
  }
}