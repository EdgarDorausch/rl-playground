import {Agent} from './Agent';
import { Algorithm } from './Algorithm';
import { StateTensor, StateBuilder } from './State';
import { UpdatedEpsilonGreedyPolicyUpdator } from './Algorithm/PolicyUpdator';
import { TemporalDifferenceLearning } from './Algorithm/ParameterUpdator';


export function constructMaze(mazeStr: string[]): {stateTensor: StateTensor, agent: Agent} {
  let startPos = [0,0];
  let targetPositions: [number,number][] = [];
  const cellDim = 16;

  const map: (string|null)[][] = new Array(cellDim).fill(null).map(
    (_) => new Array(cellDim).fill(null));
  
  for(let x = 0; x < 16; x++){
    for(let y = 0; y < 16; y++) {
      const char = mazeStr[y].charAt(x);
      map[x][y] = char;
      
      if (char === '€')
        targetPositions.push([x,y]);
      
      if(char === '$')
        startPos = [x,y];
    }
  }

  const numberOfTargets = targetPositions.length;
  const maxTimer = 179;
  const stateBuilder: StateBuilder = (x, y, t) => {
    const char = map[x][y];

    const [tX, tY] = targetPositions[Math.floor(t*numberOfTargets/maxTimer)];

    return {
      isValid: char !== '#',
      reward:  x===tX && y===tY ? 1 : 0, // 1 - L2Norm(x-tX, y-tY)/L2Norm(16,16)
      value: 5 // initializing with a high/optimistic value yields to faster convergence
    }
  }
  
  const stateTensor = new StateTensor(16, 16, maxTimer, stateBuilder);

  const [sX, sY] = startPos;
  const startState = stateTensor.unsafeGet(sX, sY, 0)
  
  const agent = new Agent(
    startState,
    stateTensor,
    new Algorithm(
      new TemporalDifferenceLearning(0.3, 0.5),
      new UpdatedEpsilonGreedyPolicyUpdator(e => e*0.9999998),
    )
  );
  
  return {stateTensor, agent};  
}