import React from 'react';
import './App.css';
import * as d3 from 'd3';

import {Agent} from './Agent';
import {translate, sleep, ViewMode, visibility} from './Utils';
import {constructMaze, AbstractMazeCell, SolidMazeCell} from './Maze';


const globalParams = {
  doTimeTravel: false,
  viewMode: 'value' as ViewMode,
  doStartNewEpisode: false,
}

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <h1>
          RL Playground
        </h1>
        
        <select onChange={(event) => {globalParams.viewMode = event.target.options[event.target.selectedIndex].text as ViewMode}}>
          <option>value</option>
          <option>reward</option>
          <option>simple</option>
          <option>policy</option>
          <option>q-function</option>
        </select>
        
        <button type="button" onClick={() => globalParams.doTimeTravel = true}>
          time travel
        </button>
        <button type="button" onClick={() => globalParams.doStartNewEpisode = true}>
          reset
        </button>
        
        <p id="stepCounter">
          756
        </p>
      </div>
    );
  }

  componentDidMount() {
    onLoad().then()
  }


}

const westTrianglePoints =  (cs: number) => `0,0         ${cs/2},${cs/2} 0,${cs}`;
const northTrianglePoints = (cs: number) => `0,0         ${cs/2},${cs/2} ${cs},0`;
const eastTrianglePoints =  (cs: number) => `${cs},${cs} ${cs/2},${cs/2} ${cs},0`;
const southTrianglePoints = (cs: number) => `${cs},${cs} ${cs/2},${cs/2} 0,${cs}`;



class RenderHandler {
  private cellStriding: number;
  private svgSize: number;
  private svg: d3.Selection<any, any, HTMLElement, any>;

  constructor(
    private agent: Agent,
    private maze: AbstractMazeCell[][],
    private cellDim: number,
    private cellSize: number,
    private cellPadding: number
  ) {
    this.cellStriding = cellSize + cellPadding;
    this.svgSize = cellDim*(this.cellStriding) + cellPadding;
    
    this.svg = d3.select('.App')
      .append('svg')
      .attr('width', this.svgSize)
      .attr('height', this.svgSize)
      .style('background-color', 'gray');
  }

  draw() {
    this.svg.selectAll("*").remove();
      
    const columns = this.svg
      .selectAll('g')
      .data(this.maze)
      .enter()
      .append('g')
      .attr('width', 10)

    columns
      .attr('transform', (d,i) => translate(this.cellStriding*i + this.cellPadding, this.cellPadding))

    const cellGroup = columns
      .selectAll('g')
      .data(d => d)
      .enter()
      .append('g')
      .attr('transform', (d,i) => translate(0, this.cellStriding*i))
      
    const cellRect = cellGroup.append('rect')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', d => d.getColor(globalParams.viewMode))

    const triangleSelection = columns
      .selectAll('polygon')
      .data(d => d)
      .enter()
      
    // Draw triangles
    const westTriangle = cellGroup
      .append('polygon')
      .attr('points', d => westTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(globalParams.viewMode, 'west'))
      .attr("visibility", d => visibility(d.showTriangles(globalParams.viewMode)));

    const northTriangle = cellGroup
      .append('polygon')
      .attr('points', d => northTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(globalParams.viewMode, 'north'))
      .attr("visibility", d => visibility(d.showTriangles(globalParams.viewMode)));

    const eastTriangle = cellGroup
      .append('polygon')
      .attr('points', d => eastTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(globalParams.viewMode, 'east'))
      .attr("visibility", d => visibility(d.showTriangles(globalParams.viewMode)));

    const southTriangle = cellGroup
      .append('polygon')
      .attr('points', d => southTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(globalParams.viewMode, 'south'))
      .attr("visibility", d => visibility(d.showTriangles(globalParams.viewMode)));

    // Draw agent
    const agentCircle = this.svg
      .append('circle')
      .attr('r', this.cellSize/2.2)
      .attr('cx',this.cellPadding + this.agent.state.x*this.cellStriding + this.cellSize/2)
      .attr('cy', this.cellPadding + this.agent.state.y*this.cellStriding + this.cellSize/2)
      .attr('fill', 'green')
  }
}

async function onLoad() {


  const mazeStr = [
    '....#..........€',
    '....##..########',
    '........#.......',
    '##  #########...',
    '............#..#',
    '....#......##..#',
    '#####......#....',
    '.......#####....',
    '.......#......#.',
    '...#.........##.',
    '###########.....',
    '...#............',
    '...###...#######',
    '.....#..........',
    '.....#######....',
    '$...............',
  ];
  
  const {maze, agent} = constructMaze(mazeStr);

  const renderHandler = new RenderHandler(
    agent,
    maze,
    16,
    30,
    2
  )
  
  console.log(maze)
  console.log(agent);
  

  const stepCounterDOMElem = document.getElementById('stepCounter');
  if(stepCounterDOMElem === null)
    throw new Error();

  let stepCounter = 0;
  
  
  while(true) {
    stepCounter++;
    
    if(globalParams.doStartNewEpisode) {
      globalParams.doStartNewEpisode = false;
      agent.resetPosition();
    }
    
    if(globalParams.doTimeTravel) {
      globalParams.doTimeTravel = false;
      for(let i = 0; i<10000; i++) {
        stepCounter++;
        agent.doStep();
      } 
    }
    
    agent.doStep();
    
    stepCounterDOMElem.innerHTML = stepCounter.toString();
    await sleep(50);
    renderHandler.draw();
    // break;
  }
}



export default App;
