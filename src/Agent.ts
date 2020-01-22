import { Algorithm } from './Algorith';
import { State, StateTensor } from './State';

export class Agent {
  public state: State;

  constructor(
    startState: State,
    protected stateTensor: StateTensor,
    private algorithm: Algorithm
  ) {
    this.state = startState;
  }
   
  doStep() {
    const oldState = this.state;
    const action = this.algorithm.chooseAction(this.state);
    const newState = this.state.getNeighbor(action);
    const reward = newState.reward;

    this.state = newState;

    this.algorithm.afterAction(this.stateTensor,oldState, action, reward, newState);
  }
}