import { Direction } from '../Utils';
import { State, StateTensor } from '../State';
import { PolicyUpdator } from './PolicyUpdator';
import { ParameterUpdator } from './ParameterUpdator';

export class Algorithm {

  // TODO: parameter initializer
  constructor(
    private parameterUpdator: ParameterUpdator,
    private policyUpdator: PolicyUpdator,
  ) {}

  afterAction(stateTensor: StateTensor, oldState: State, action: Direction, reward: number, newState: State): void {
    this.parameterUpdator.updateParameters(stateTensor, oldState, action, reward, newState);
    this.policyUpdator.updatePolicy(stateTensor, newState);
  }
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