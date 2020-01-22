import { directionList, chooseRandomArrayElement, Direction, Directional, numberOfDirections } from './Utils';
import { State, StateTensor } from './State';

export class Algorithm {

  constructor(
    private initParameters: () => {},
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

interface ParameterUpdator {
  /**
   * @param oldState state before taking action
   * @param action action taken
   * @param reward reward yielded by taking the action
   * @param newState state after taking action
   */
  updateParameters(stateTensor: StateTensor, oldState: State, action: Direction, reward: number, newState: State): void
}

interface PolicyUpdator {
  updatePolicy(stateTensor: StateTensor, currentState: State): void
}

class EpsilonGreedyPolicyUpdator implements PolicyUpdator {

  constructor(protected Ɛ: number) {}

  updatePolicy(stateTensor: StateTensor, currentState: State) {
    const neighbors = new Directional();
    directionList.forEach(d => {
      const nextState = currentState.getNeighbor(d);
      neighbors.set(d, nextState.value);
    })

    const greedyAction = neighbors.getMaximum().direction;
    const newPolicy = new Directional();
    directionList.forEach(action => newPolicy.set(action,
      action === greedyAction ? this.Ɛ / numberOfDirections + 1-this.Ɛ : this.Ɛ / numberOfDirections
    ));
    currentState.policy = newPolicy;
  }
}

export class GreedyPolicyUpdator extends EpsilonGreedyPolicyUpdator {
  constructor() {
    super(0);
  }
}


/*
this.reductionFactor *= 0.99999956;
if(this.iteration % 1000000 === 0) {
  console.log('reductionFactor', this.reductionFactor);
}
*/

type UpdateEpsilon = (Ɛ: number, iteration: number) => number;
export class UpdatedEpsilonGreedyPolicyUpdator extends EpsilonGreedyPolicyUpdator {
  iteration: number = 0;

  constructor(protected updateEpsilon: UpdateEpsilon, protected init: number = 1) {
    super(init)
    this.Ɛ = init;
  }

  updatePolicy(stateTensor: StateTensor, currentState: State) {
    this.iteration++;
    this.Ɛ = this.updateEpsilon(this.Ɛ, this.iteration);
    super.updatePolicy(stateTensor, currentState);
  }
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