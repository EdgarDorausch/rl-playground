import { Direction } from '../Utils';
import { State, StateTensor } from '../State';

/**
 * A `ParameterUpdator` is responsible for updating the parameters of the algorith (e.g. value/q-function)
 * after the agent has taken an action.
 */
export interface ParameterUpdator {
  /**
   * After the agent has taken an action, this method should be invoked to update the parameters of the algorith (e.g. value/q-function)
   * The input follows the SARS-Principle _((old-)state, action, reward, (new-)state)_.
   * If the algorithm has to change the parameter for an arbitrary state the whole state tensor is given.
   * 
   * @param stateTensor whole state tensor
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