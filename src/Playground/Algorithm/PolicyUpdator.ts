import { State, StateTensor } from '../State';
import { Directional, StochasticDirectional } from '../Utils';

export interface PolicyUpdator {
  updatePolicy(stateTensor: StateTensor, currentState: State): void;
}

export class EpsilonGreedyPolicyUpdator implements PolicyUpdator {

  constructor(protected Ɛ: number) {}

  updatePolicy(stateTensor: StateTensor, currentState: State) {
    const neighbors = new Directional(d => currentState.getNeighbor(d).value);

    const greedyAction = neighbors.getMaximum().direction;
    const newPolicy = new StochasticDirectional(action => 
      action === greedyAction ?
      this.Ɛ / 4 + 1-this.Ɛ :
      this.Ɛ / 4
    );
    currentState.policy = newPolicy;
  }
}

export class GreedyPolicyUpdator extends EpsilonGreedyPolicyUpdator {
  constructor() {
    super(0);
  }
}


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