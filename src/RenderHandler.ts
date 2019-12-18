import { translate, visibility, ViewMode, sleep } from './Utils';
import { Agent } from './Agent';
import { AbstractMazeCell } from './Maze';
import * as d3 from 'd3';

const westTrianglePoints =  (cs: number) => `0,0         ${cs/2},${cs/2} 0,${cs}`;
const northTrianglePoints = (cs: number) => `0,0         ${cs/2},${cs/2} ${cs},0`;
const eastTrianglePoints =  (cs: number) => `${cs},${cs} ${cs/2},${cs/2} ${cs},0`;
const southTrianglePoints = (cs: number) => `${cs},${cs} ${cs/2},${cs/2} 0,${cs}`;


export class RenderHandler {
  private cellStriding: number;
  private svgSize: number;
  private svg: d3.Selection<any, any, HTMLElement, any>|null = null;

  public doTimeTravel =  false;
  public viewMode =  'value' as ViewMode;
  public doStartNewEpisode =  false;
  
  private stepCounter = 0;
  private stepCounterDOMElem: HTMLElement|null = null;

  constructor(
    private agent: Agent,
    private maze: AbstractMazeCell[][],
    private cellDim: number,
    private cellSize: number,
    private cellPadding: number
  ) {
    this.cellStriding = cellSize + cellPadding;
    this.svgSize = cellDim*(this.cellStriding) + cellPadding;
  }

  private setup() {
    this.svg = d3.select('.App')
      .append('svg')
      .attr('width', this.svgSize)
      .attr('height', this.svgSize)
      .style('background-color', 'gray');

    this.stepCounterDOMElem = document.getElementById('stepCounter');
  }

  private draw() {
    if(this.svg === null)
      throw new Error('Svg is null! Is setup called before draw?');
    if(this.stepCounterDOMElem === null)
      throw new Error('stepCounter DOM Element is null! Is setup called before draw?');

    this.stepCounterDOMElem.innerHTML = this.stepCounter.toString();

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
      .attr('fill', d => d.getColor(this.viewMode))

    const triangleSelection = columns
      .selectAll('polygon')
      .data(d => d)
      .enter()
      
    // Draw triangles
    const westTriangle = cellGroup
      .append('polygon')
      .attr('points', d => westTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(this.viewMode, 'west'))
      .attr("visibility", d => visibility(d.showTriangles(this.viewMode)));

    const northTriangle = cellGroup
      .append('polygon')
      .attr('points', d => northTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(this.viewMode, 'north'))
      .attr("visibility", d => visibility(d.showTriangles(this.viewMode)));

    const eastTriangle = cellGroup
      .append('polygon')
      .attr('points', d => eastTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(this.viewMode, 'east'))
      .attr("visibility", d => visibility(d.showTriangles(this.viewMode)));

    const southTriangle = cellGroup
      .append('polygon')
      .attr('points', d => southTrianglePoints(this.cellSize))
      .attr('fill', d => d.getTriangleColor(this.viewMode, 'south'))
      .attr("visibility", d => visibility(d.showTriangles(this.viewMode)));

    // Draw agent
    const agentCircle = this.svg
      .append('circle')
      .attr('r', this.cellSize/2.2)
      .attr('cx',this.cellPadding + this.agent.state.x*this.cellStriding + this.cellSize/2)
      .attr('cy', this.cellPadding + this.agent.state.y*this.cellStriding + this.cellSize/2)
      .attr('fill', 'green')
  }

  private update() {
    this.stepCounter++;

    if(this.doStartNewEpisode) {
      this.doStartNewEpisode = false;
      this.agent.resetPosition();
    }
    
    if(this.doTimeTravel) {
      this.doTimeTravel = false;
      for(let i = 0; i<10000; i++) {
        this.stepCounter++;
        this.agent.doStep();
      } 
    }
    
    this.agent.doStep();
  }

  public async start() {
    this.setup();

    while(true) {
      this.update();
      await sleep(30);
      this.draw();
    }
  }
}
