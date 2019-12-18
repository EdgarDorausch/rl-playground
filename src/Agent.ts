import {AbstractMazeCell, MazeCell} from './Maze';
import {chooseRandomArrayElement, ViewMode, directionList, Direction} from './Utils';
import { Algorithm } from './Algorith';

export class Agent {
  startCell: MazeCell;
  state: MazeCell;
  maze: AbstractMazeCell[][];
  mazeDim: [number, number];


  constructor(startCell: MazeCell, maze: AbstractMazeCell[][], private algorithm: Algorithm) {
    this.startCell = startCell;
    this.state = startCell;
    this.maze = maze;
    this.mazeDim = [maze[0].length, maze.length];
    this.algorithm.init(this.maze, this);
  }
  
  
  takeAction(action: Direction) {
    let nextState = this.state.getNeighbor(action);
    
    if(nextState === null){
      // console.log(`Cant take action: ${action};`);
      nextState = this.state;
    }

    this.algorithm.updateParams(nextState)
    
    this.state = nextState;
  }
  
  doStep() {
    const action = this.algorithm.chooseAction();
    this.takeAction(action);
  }
  
  resetPosition() {
    this.state = this.startCell;
  }
}