import React from 'react';
import { Button, ControlGroup } from '@blueprintjs/core';
import './App.css';

import {ViewMode, viewModeList} from './Utils';
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

  constructor(props: {}) {
    super(props);

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
      <div className="App bp3-dark">
        <h1>
          RL Playground
        </h1>
        
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <ControlGroup fill={false} vertical={false} >
            <div className="bp3-select">
              <select onChange={(event) => {this.renderHandler.viewMode = event.target.options[event.target.selectedIndex].text as ViewMode}}>
                {viewModeList.map(
                  viewMode =>
                  <option>{viewMode}</option>
                )}
              </select>
            </div>
        
            <Button
              text="time travel"
              onClick={() => this.renderHandler.doTimeTravel = true}
            />
            {/* <Button
              text="reset"
              onClick={() => this.renderHandler.doStartNewEpisode = true}
            /> */}
          </ControlGroup>
        </div>
        
        {/* <Divider/> */}
        <p>
          <br/>
          iteration: <i id="stepCounter"></i>
          <br/>
          timer: <i id="timer">55</i>
        </p>

        <canvas id="canvas" style={{
          backgroundColor: '#354553',
          border: 'thick double rgb(64, 95, 112)',
          borderRadius: 6
        }}></canvas>
      </div>
    );
  }

  componentDidMount() {
    this.renderHandler.start().then();
  }
}


export default App;
