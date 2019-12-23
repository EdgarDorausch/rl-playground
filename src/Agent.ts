import { Algorithm } from './Algorith';
import { State } from './State';

export class Agent {
  public state: State;

  constructor(
    startState: State,
    private algorithm: Algorithm
  ) {
    this.state = startState;
  }
   
  doStep() {
    const oldState = this.state;
    const action = this.algorithm.chooseAction(this.state);
    const newState = this.state.getNeighbor(action) ?? this.state;
    const reward = newState.reward;

    this.state = newState;

    this.algorithm.afterAction(oldState, action, reward, newState)
  }
}