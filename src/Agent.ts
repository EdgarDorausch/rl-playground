import {Direction} from './Utils';
import { Algorithm } from './Algorith';
import { State } from './State';

export class Agent {
  public state: State;

  constructor(
    startState: State,
    // private maze: AbstractMazeCell[][],
    private algorithm: Algorithm
  ) {
    this.state = startState;
  }
  
  takeAction(action: Direction) {
    const oldState = this.state;
    const newState = this.state.getNeighbor(action) ?? this.state;
    const reward = newState.reward;

    this.state = newState;

    this.algorithm.afterAction(oldState, action, reward, newState)
  }
  
  doStep() {
    const action = this.algorithm.chooseAction(this.state);
    this.takeAction(action);
  }
}