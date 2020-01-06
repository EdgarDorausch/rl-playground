import { directionList, chooseRandomArrayElement, Direction, Directional } from './Utils';
import { State } from './State';



export interface Algorithm {
  chooseAction(state: State): Direction;
  afterAction(oldState: State, action: Direction, reward: number, newState: State): void;
  startNewEpisode(): void;
  endEpisode(): void;
}


export class TemporalDifferenceLearning implements Algorithm {

  private iteration = 0;
  private reductionFactor = 1;

  constructor(
    private discountFactor: number,
    private learningRate: number,
    private explorationFactor: number = 1,
  ) {}

  //
  // ─── PRIVATE METHODS ────────────────────────────────────────────────────────────
  //

  private chooseGreedyAction(state: State): Direction {

    const neighbors = new Directional();
    directionList.forEach(d => {
      const nextState = state.getNeighbor(d);
      neighbors.set(d, nextState.value)
    })

    const action = neighbors.getMaximum().direction;
    state.policy = action;
    return action;
  }
  
  private chooseRandomAction(): Direction {
    return chooseRandomArrayElement(directionList);
  }

  private updateReductionFactor() {
    this.iteration++;
    this.reductionFactor *= 0.99999956;
    if(this.iteration % 1000000 === 0) {
      console.log('reductionFactor', this.reductionFactor);
    }
  }
  
  //
  // ─── PUBLIC METHODS ─────────────────────────────────────────────────────────────
  //

  chooseAction(state: State): Direction {
    this.updateReductionFactor();
    if(Math.random() < this.explorationFactor*this.reductionFactor) {
      return this.chooseRandomAction();
    } else {
      return this.chooseGreedyAction(state);
    }
  }

  /**
   * 
   * @param oldState state before taking action
   * @param action action taken
   * @param reward reward yielded by taking the action
   * @param newState state after taking action
   */
  afterAction(oldState: State, action: Direction, reward: number, newState: State) {

    const newVal = (1-this.learningRate)*oldState.value + 
      this.learningRate*(
        newState.reward +
        this.discountFactor*newState.value
      )
    
    oldState.value = newVal;
  }

  startNewEpisode() {}

  endEpisode() {}

}