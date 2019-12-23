import {Agent} from './Agent';
import {L2Norm} from './Utils';
import { TemporalDifferenceLearning } from './Algorith';
import { StateTensor, StateBuilder } from './State';


export function constructMaze(mazeStr: string[]): {stateTensor: StateTensor, agent: Agent} {
  let startPos = [0,0];
  let targetPos = [0,0];
  const cellDim = 16;

  const map: (string|null)[][] = new Array(cellDim).fill(null).map(
    (_) => new Array(cellDim).fill(null));
  
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
  const stateBuilder: StateBuilder = (x, y) => {
    const char = map[x][y];

    return {
      isValid: char !== '#',
      reward: 1 - L2Norm(x-tX, y-tY)/L2Norm(16,16)
    }
  }
  
  const stateTensor = new StateTensor(16, 16, 1, stateBuilder);

  const [sX, sY] = startPos;
  const startState = stateTensor.unsafeGet(sX, sY, 0)
  
  const agent = new Agent(
    startState,
    new TemporalDifferenceLearning(0.25, 0.5, 0.6)
  );
  
  return {stateTensor, agent};  
}