import { Maze, MazeCell } from './Maze';
import { directionList, chooseRandomArrayElement, Direction } from './Utils';
import { Agent } from './Agent';



export interface Algorithm {
  init(maze: Maze, agent: Agent): void;
  chooseAction(): Direction;
  updateParams(nextState: MazeCell): void;
  startNewEpisode(): void;
  endEpisode(): void;
}


export class TemporalDifferenceLearning implements Algorithm {
  private maze: Maze|null = null;
  private agent: Agent|null = null;

  constructor(
    private discountFactor: number,
    private learningRate: number,
    private explorationFactor: number,
  ) {}

  init(maze: Maze, agent: Agent) {
    this.maze = maze;
    this.agent = agent;
  }
    
  private chooseGreedyAction(): Direction {
    if(this.agent === null)
      throw new Error();

    if(this.maze === null)
      throw new Error();

    const valuedActions = directionList.map(action => {
      if(this.agent === null)
        throw new Error();

      const nextState = this.agent.state.getNeighbor(action);
      
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
  
  private chooseRandomAction(): Direction {
    return chooseRandomArrayElement(directionList);
  }
  
  chooseAction(): Direction {
    if(Math.random() < this.explorationFactor) {
      return this.chooseRandomAction();
    } else {
      return this.chooseGreedyAction();
    }
  }

  updateParams(nextState: MazeCell) {
    if(this.agent === null)
      throw new Error();

    if(this.maze === null)
      throw new Error();

    const newVal = (1-this.learningRate)*this.agent.state.value + 
      this.learningRate*(
        nextState.reward +
        this.discountFactor*nextState.value
      )
    
    this.agent.state.value = newVal;
  }

  startNewEpisode() {}

  endEpisode() {}

}