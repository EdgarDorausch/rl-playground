import React from 'react';
import './App.css';

import {ViewMode} from './Utils';
import {constructMaze} from './Maze';
import { RenderHandler } from './RenderHandler';
import { MyMazeCellRenderer } from './MazeCellRenderer';

// A simple maze
// =========================
// [
//   '....#..........€',
//   '....##..########',
//   '........#.......',
//   '##  #########...',
//   '............#..#',
//   '....#......##..#',
//   '#####......#....',
//   '.......#####....',
//   '.......#......#.',
//   '...#.........##.',
//   '###########.....',
//   '...#............',
//   '...###...#######',
//   '.....#..........',
//   '.....#######....',
//   '$...............',
// ];

// To complex structure
// =========================
// [
//   '.........#......',
//   '.........#......',
//   '..........#€....',
//   '...######.###...',
//   '...#....#...#...',
//   '...#.....#..#...',
//   '...#..##....#...',
//   '...#.########...',
//   '...#..##....#...',
//   '...#..$#€.#.#...',
//   '...#...####.#...',
//   '...#........#...',
//   '...##########...',
//   '................',
//   '................',
//   '................',
// ];

// Three targets. not enough time for traveling => interesting moves
// =========================
// [
//   '.........#......',
//   '.........#......',
//   '.........#.€....',
//   '...#####.####...',
//   '...#........#...',
//   '...#........#...',
//   '...#..##...€#...',
//   '...#.########...',
//   '...#..##....#...',
//   '...#..$.....#...',
//   '...#......€.#...',
//   '...#........#...',
//   '...##########...',
//   '................',
//   '................',
//   '................',
// ];


class App extends React.PureComponent {

  private renderHandler: RenderHandler;

  constructor() {
    super({});

    const mazeStr = [
      '.........#......',
      '.........#......',
      '.........#.€....',
      '...#####.####...',
      '...#........#...',
      '...#........#...',
      '...#..##....#...',
      '...#.########...',
      '...#..##....#...',
      '...#..$.....#...',
      '...#......€.#...',
      '...#........#...',
      '...##########...',
      '................',
      '................',
      '................',
    ];
    
    const {stateTensor, agent} = constructMaze(mazeStr);
    
    this.renderHandler = new RenderHandler(
      agent,
      stateTensor,
      16,
      30,
      2,
      new MyMazeCellRenderer(stateTensor)
    )
    
    console.log(stateTensor)
    console.log(agent);
  }

  render() {
    return (
      <div className="App">
        <h1>
          RL Playground
        </h1>
        
        <select onChange={(event) => {this.renderHandler.viewMode = event.target.options[event.target.selectedIndex].text as ViewMode}}>
          <option>value</option>
          <option>reward</option>
          <option>simple</option>
          <option>policy</option>
          <option>q-function</option>
        </select>
        
        <button type="button" onClick={() => this.renderHandler.doTimeTravel = true}>
          time travel
        </button>
        <button type="button" onClick={() => this.renderHandler.doStartNewEpisode = true}>
          reset
        </button>
        
        <p>
          iteration: <i id="stepCounter"></i>
          <br/>
          timer: <i id="timer">55</i>
        </p>

        <canvas id="canvas" style={{backgroundColor: 'gray'}}></canvas>
      </div>
    );
  }

  componentDidMount() {
    this.renderHandler.start().then();
  }
}


export default App;
