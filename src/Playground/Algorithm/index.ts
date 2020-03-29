import { Direction } from '../Utils';
import { State, StateTensor } from '../State';
import { PolicyUpdator } from './PolicyUpdator';
import { ParameterUpdator } from './ParameterUpdator';


/**
 * Handles the controlling and learning of the agent
 */
export class Algorithm {

  // TODO: parameter initializer
  constructor(
    private parameterUpdator: ParameterUpdator,
    private policyUpdator: PolicyUpdator,
  ) {}

  /**
   * This method should be invoked after the agent has taken an action. It updates the parameters of the 
   * algorithm (e.g value/q-function) and the policy-distribution according to the `parameterUpdator` and the
   * `policyUpdator` of the algorith.
   * 
   * @param stateTensor whole state tensor
   * @param oldState state before taking action
   * @param action action taken
   * @param reward reward yielded by taking the action
   * @param newState state after taking action
   */
  afterAction(stateTensor: StateTensor, oldState: State, action: Direction, reward: number, newState: State): void {
    this.parameterUpdator.updateParameters(stateTensor, oldState, action, reward, newState);
    this.policyUpdator.updatePolicy(stateTensor, newState);
  }
  /**
   * Selecting an action according the policy (of the current state of the agent)
   * @param state current state of the agent 
   */
  chooseAction(state: State): Direction {
    return state.policy.getDirectionByDistribution();
  }

  startNewEpisode(): void {
    throw Error('Method has to be implemented!')
  };
  endEpisode(): void {
    throw Error('Method has to be implemented!')
  }
}