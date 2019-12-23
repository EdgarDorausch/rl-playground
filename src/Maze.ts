import * as d3 from 'd3';
import {Agent} from './Agent';
import {ViewMode, Direction, L2Norm, directionList, chooseRandomArrayElement} from './Utils';
import { TemporalDifferenceLearning } from './Algorith';
import { State, StateTensor, StateBuilder } from './State';




export function constructMaze(mazeStr: string[]): {stateTensor: StateTensor, agent: Agent} {
  let startPos = [0,0];
  let targetPos = [0,0];
  const cellDim = 16;

  const map: (string|null)[][] = new Array(cellDim).fill(null).map(
    (_, x) => new Array(cellDim).fill(null));
  
  for(let x = 0; x < 16; x++){
    for(let y = 0; y < 16; y++) {
      const char = mazeStr[y].charAt(x);
      map[x][y] = char;
      
      if (char === '€')
        targetPos = [x,y];
      
      if(char === '$')
        startPos = [x,y];
    }
  }

  const [tX, tY] = targetPos;
  const stateBuilder: StateBuilder = (x, y, t) => {
    const char = map[x][y];

    return {
      isValid: char !== '#',
      reward: 1 - L2Norm(x-tX, y-tY)/L2Norm(16,16)
    }
  }
  
  const stateTensor = new StateTensor(16, 16, 50, stateBuilder);

  const [sX, sY] = startPos;
  const startState = stateTensor.unsafeGet(sX, sY, 0)
  
  const agent = new Agent(
    startState,
    new TemporalDifferenceLearning(0.25, 0.5, 0.6)
  );
  
  return {stateTensor, agent};  
}