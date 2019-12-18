import * as d3 from 'd3';
import {Agent} from './Agent';
import {ViewMode, Direction, L2Norm, directionList, chooseRandomArrayElement} from './Utils';
import { TemporalDifferenceLearning } from './Algorith';

const colorScale = d3.scaleSequential(d3.interpolatePuOr).domain([0,1]);

export type Maze = AbstractMazeCell[][];


export abstract class AbstractMazeCell {
  maze: Maze;
  x: number;
  y: number;
  mazeDim: [number, number];
  
  constructor(position: [number, number], maze: Maze) {
    this.x = position[0];
    this.y = position[1];
    this.maze = maze;
    this.mazeDim = [maze[0].length, maze.length];
  }
  
  /**
   * Checks if a maze position is valid
   */
  private checkPosition(_x: number,_y: number) {
    return 0 <= _x && _x < this.mazeDim[0] && // 0 <= x < dim_x
      0 <= _y && _y < this.mazeDim[1];       // 0 <= y < dim_y
  }
  
  /**
   * Returning the neighbor cell according to the given direction.
   * `null` is returned if there is no neighbor inside the maze or the neighbor is a solid cell
   */
  getNeighbor(direction: Direction): MazeCell|null {
    let newPos;
    const x = this.x;
    const y = this.y;
    switch(direction) {
      case 'north':
        newPos = [x, y-1];
        break;
      case 'east':
        newPos = [1+x, y];
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
  abstract getTriangleColor(viewMode: ViewMode, direction: Direction): string
  abstract showTriangles(viewMode: ViewMode): boolean
}

type Q = {[direction in Direction]: number};

export class MazeCell extends AbstractMazeCell {
  reward: number;
  x: number;
  y: number;
  value: number;
  policy: Direction;
  q: Q;

  constructor(reward: number , position: [number, number], maze: Maze) {
    super(position, maze)
    this.x = position[0];
    this.y = position[1]
    this.reward = reward;
    this.value = 0;
    this.policy = chooseRandomArrayElement(directionList);
    this.q = {north: 0, south: 0, west: 0, east: 0};
  }
  
  getColor(viewMode: ViewMode) {    
    switch(viewMode){
      case 'reward':
        return colorScale(this.reward);
      case 'value':
        return colorScale(this.value);
      case 'simple':
      case 'policy':
      case 'q-function':
        return 'darkgray';
    }
  }

  getTriangleColor(viewMode: ViewMode, direction: Direction) {
    switch(viewMode) {
      case 'policy':
        return direction === this.policy ? '#222' : '#eee';
      case 'q-function':
        return colorScale(this.q[direction]);
      case 'reward':
      case 'simple':
      case 'value':
        return 'red';
    }
  }

  showTriangles(viewMode: ViewMode) {
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




export class SolidMazeCell extends AbstractMazeCell {
  getColor() {
    return '#444';
  }
  getTriangleColor() {
    return '#444';
  }
  showTriangles() {
    return false;
  }
}




export function constructMaze(mazeStr: string[]): {maze: Maze, agent: Agent} {
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
  
  let maze = new Array(cellDim).fill(null).map(
    (_, x) => new Array(cellDim).fill(42));
  
  const getMazeCell = (x: number, y: number) => {
    const char = mazeStr[y].charAt(x);
    if(char === '#')
      return new SolidMazeCell([x,y], maze)
    return new MazeCell(
      1 - L2Norm(x-targetPos[0], y-targetPos[1])/L2Norm(16,16),//char === '€' ? 10 : -0,
      [x,y],
      maze
    );
  }
  
  for(let x = 0; x < 16; x++){
    for(let y = 0; y < 16; y++) {
      maze[x][y] = getMazeCell(x,y);
    }
  }
  
  const agent = new Agent(
    maze[startPos[0]][startPos[1]],
    maze,
    new TemporalDifferenceLearning(
      0.25,
      0.5,
      0.6
    )
  );
  
  return {maze, agent};  
}