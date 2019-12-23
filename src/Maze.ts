import * as d3 from 'd3';
import {Agent} from './Agent';
import {ViewMode, Direction, L2Norm, directionList, chooseRandomArrayElement} from './Utils';
import { TemporalDifferenceLearning } from './Algorith';
import { State, StateTensor } from './State';



export type Maze = AbstractMazeCell[][];



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

  const stateTensor = new StateTensor(16, 16, 50);
  
  const getMazeCell = (x: number, y: number) => {
    const char = mazeStr[y].charAt(x);
    if(char === '#')
      return new SolidMazeCell([x,y], maze)
    return new MazeCell(
      1 - L2Norm(x-targetPos[0], y-targetPos[1])/L2Norm(16,16),//char === '€' ? 10 : -0,
      [x,y],
      maze,
      stateTensor
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