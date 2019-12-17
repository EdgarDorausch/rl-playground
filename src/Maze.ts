import * as d3 from 'd3';
import {Agent} from './Agent';
import {ViewMode} from './Utils';

const colorScale = d3.scaleSequential(d3.interpolatePuOr).domain([-10,10]);


export abstract class AbstractMazeCell {
  maze: AbstractMazeCell[][];
  x: number;
  y: number;
  mazeDim: [number, number];
  
  constructor(position: [number, number], maze: AbstractMazeCell[][]) {
    this.x = position[0];
    this.y = position[1];
    this.maze = maze;
    this.mazeDim = [maze[0].length, maze.length];
  }
  
  /**
   * Checks if a maze position is valid
   */
  checkPosition(_x: number,_y: number) {
    return 0 <= _x && _x < this.mazeDim[0] && // 0 <= x < dim_x
      0 <= _y && _y < this.mazeDim[1];       // 0 <= y < dim_y
  }
  
  getNeighbor(direction: string): MazeCell|null {
    let newPos;
    const x = this.x;
    const y = this.y;
    switch(direction) {
      case 'north':
        newPos = [x, y-1];
        break;
      case 'east':
        newPos = [1, y];
        break;
      case 'south':
        newPos = [x, y+1];
        break;
      case 'west':
        newPos = [x-1, y];
        break;
      default:
        throw new Error(`Unknown direction: ${direction}`)
    }
    
    const [newX,newY] = newPos;
    
    if(!this.checkPosition(newX,newY)){
      return null;
    }
    
    const neighbor = this.maze[newX][newY];
    
    if(neighbor instanceof SolidMazeCell)
      return null;
      
    return neighbor as MazeCell;
  }

  abstract getColor(viewMode: ViewMode): string
}

export class MazeCell extends AbstractMazeCell {
  reward: number;
  x: number;
  y: number;
  value: number;

  constructor(reward: number , position: [number, number], maze: AbstractMazeCell[][]) {
    super(position, maze)
    this.x = position[0];
    this.y = position[1]
    this.reward = reward;
    this.value = 0;
  }
  
  getColor(viewMode: ViewMode) {    
    switch(viewMode){
      case 'simple':
        return 'darkgray';
      case 'reward':
        return colorScale(this.reward);
      case 'value':
        return colorScale(this.value);
    }
    throw new Error();
  }
}

export class SolidMazeCell extends AbstractMazeCell {
  getColor() {
    return '#444';
  }
}




export function constructMaze(mazeStr: string[]) {
  let startPos = [0,0];
  let targetPos = [0,0];
  const cellDim = 16;
  
  for(let x = 0; x < 16; x++){
    for(let y = 0; y < 16; y++) {
      const char = mazeStr[y].charAt(x);
      
      if (char === '€')
        targetPos = [x,y];
      
      if(char === '$')
        startPos = [x,y];
    }
  }
  
  let maze = new Array(cellDim)
    .fill(null)
    .map((_, x) => new Array(cellDim)
      .fill(42));
  
  const getMazeCell = (x: number, y: number) => {
    const char = mazeStr[y].charAt(x);
    if(char === '#')
      return new SolidMazeCell([x,y], maze)
    return new MazeCell(
      char === '€' ? 10 : -0,
      [x,y],
      maze
    );
  }
  
  for(let x = 0; x < 16; x++){
    for(let y = 0; y < 16; y++) {
      maze[x][y] = getMazeCell(x,y);
    }
  }
  
  const agent = new Agent(maze[startPos[0]][startPos[1]], maze);
  
  return {maze, agent};  
}