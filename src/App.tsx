import React from 'react';
import { Button, ControlGroup, ProgressBar } from '@blueprintjs/core';
import './App.css';

import {ViewMode, viewModeList} from './Utils';
import {constructMaze} from './Maze';
import { RenderHandler } from './RenderHandler';
import { MyMazeCellRenderer } from './MazeCellRenderer';


const FlexContainer: React.SFC<{width?: string|number}> = ({width, children}) => (
  <div
    className="FlexContainer"
    style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }}
  >
    <div style={{width}}>
      {children}
    </div>
  </div>
)


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



class App extends React.Component<{},{timeTravelProgress: number}> {

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
      new MyMazeCellRenderer(stateTensor),
      (t) => {this.setState({timeTravelProgress: t});}
    )
    
    console.log(stateTensor)
    console.log(agent);

    this.state = {
      timeTravelProgress: 0
    }
  }

  render() {
    return (
      <div className="App bp3-dark">
        <h1>
          RL Playground
        </h1>
        
        
        <FlexContainer>
          <ControlGroup fill={false} vertical={false} >
            <div className="bp3-select">
              <select onChange={(event) => {this.renderHandler.viewMode = event.target.options[event.target.selectedIndex].text as ViewMode}}>
                {viewModeList.map(
                  viewMode =>
                  <option key={viewMode}>{viewMode}</option>
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
          
        </FlexContainer>

        <br/>
        <FlexContainer width={300}>
            <ProgressBar
              value={this.state.timeTravelProgress}
              intent="success"
              animate={false}
            />
        </FlexContainer>
       
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
