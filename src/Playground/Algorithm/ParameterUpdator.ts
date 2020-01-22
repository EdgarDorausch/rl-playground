import { Direction } from '../Utils';
import { State, StateTensor } from '../State';

export interface ParameterUpdator {
  /**
   * @param oldState state before taking action
   * @param action action taken
   * @param reward reward yielded by taking the action
   * @param newState state after taking action
   */
  updateParameters(stateTensor: StateTensor, oldState: State, action: Direction, reward: number, newState: State): void;
}


export class TemporalDifferenceLearning implements ParameterUpdator {

  constructor(protected learningRate: number, protected discountFactor: number) {}

  updateParameters(stateTensor: StateTensor, oldState: State, action: Direction, reward: number, newState: State) {
    const newVal = 
    (1-this.learningRate) * oldState.value + 
        this.learningRate * (newState.reward + this.discountFactor*newState.value)
  
    oldState.value = newVal;
  }
}