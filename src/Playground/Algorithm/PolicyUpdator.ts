import { State, StateTensor } from '../State';
import { Directional, StochasticDirectional, numberOfDirections } from '../Utils';

/**
 * A `PolicyUpdator` is responsible for updating the policy (probability distribution) after the agent has taken an action.
 */
export interface PolicyUpdator {
  updatePolicy(stateTensor: StateTensor, currentState: State): void;
}

/**
 * Generates a policy which selects a greedy action with probability Ɛ.
 * (action which maximizes the value function locally)
 */
export class EpsilonGreedyPolicyUpdator implements PolicyUpdator {

  /**
   * @param Ɛ Probability of taking a greedy action 
   */
  constructor(protected Ɛ: number) {}

  updatePolicy(stateTensor: StateTensor, currentState: State) {
    const neighbors = new Directional(d => currentState.getNeighbor(d).value);

    const greedyAction = neighbors.getMaximum().direction;
    const newPolicy = new StochasticDirectional(action => 
      action === greedyAction ?
      this.Ɛ / numberOfDirections + 1-this.Ɛ :
      this.Ɛ / numberOfDirections
    );
    currentState.policy = newPolicy;
  }
}

/**
 * Generates a policy which always selects the greedy action.
 * (action which maximizes the value function locally)
 */
export class GreedyPolicyUpdator extends EpsilonGreedyPolicyUpdator {
  constructor() {
    super(0);
  }
}


type UpdateEpsilon = (Ɛ: number, iteration: number) => number;
/**
 * Generates a policy which selects a greedy action with a probability Ɛ.
 * This probability is updated on every iteration.
 */
export class UpdatedEpsilonGreedyPolicyUpdator extends EpsilonGreedyPolicyUpdator {
  iteration: number = 0;

  /**
   * @param updateEpsilon Defines the update rule for Ɛ
   * @param init Initial Ɛ value
   */
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