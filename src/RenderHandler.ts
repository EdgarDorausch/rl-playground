import { translate, ViewMode, sleep, Direction } from './Utils';
import { Agent } from './Agent';
import * as d3 from 'd3';
import { State, StateTensor } from './State';



export class RenderHandler {
  private cellStriding: number;
  private svgSize: number;
  private svg: d3.Selection<any, any, HTMLElement, any>|null = null;

  public doTimeTravel =  false;
  public viewMode =  'value' as ViewMode;
  public doStartNewEpisode =  false;
  
  private stepCounter = 0;
  private stepCounterDOMElem: HTMLElement|null = null;

  private timer = 0;

  private positions: [number, number][];

  constructor(
    private agent: Agent,
    private stateTensor: StateTensor,
    cellDim: number,
    private cellSize: number,
    private cellPadding: number,
    private mazeCellRenderer: MazeCellRenderer
  ) {
    this.cellStriding = cellSize + cellPadding;
    this.svgSize = cellDim*(this.cellStriding) + cellPadding;
    this.positions = d3.cross(d3.range(cellDim), d3.range(cellDim));

    this.getCellColor.bind(this);
  }

  private setup() {
    this.svg = d3.select('.App')
      .append('svg')
      .attr('width', this.svgSize)
      .attr('height', this.svgSize)
      .style('background-color', 'gray');

    this.stepCounterDOMElem = document.getElementById('stepCounter');
  }

  private getCellColor(state: State) {
    return this.mazeCellRenderer.getColor(this.viewMode, state)
  }

  private draw() {
    if(this.svg === null)
      throw new Error('Svg is null! Is setup called before draw?');
    if(this.stepCounterDOMElem === null)
      throw new Error('stepCounter DOM Element is null! Is setup called before draw?');

    this.stepCounterDOMElem.innerHTML = this.stepCounter.toString();

    this.svg.selectAll("*").remove();

    const states = this.positions.map( ([x,y]) => this.stateTensor.unsafeGet(x, y, this.timer));
    

    const cellGroup = this.svg
      .selectAll('g')
      .data(states)
      .enter()
      .append('g')
      .attr('transform', ({x, y}) => translate(this.cellStriding*x + this.cellPadding, this.cellStriding*y + this.cellPadding))
      

  }

  private update() {
    this.stepCounter++;

    if(this.doStartNewEpisode) {
      this.doStartNewEpisode = false;
      // TODO: this.agent.resetPosition();
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
      break;
    }
  }
}



export interface MazeCellRenderer {
  getColor(viewMode: ViewMode, state: State): string
  getTriangleColor(viewMode: ViewMode, direction: Direction, state: State): string
  showTriangles(viewMode: ViewMode, state: State): boolean
}

export class MyMazeCellRenderer implements MazeCellRenderer {

  private colorScale = d3.scaleSequential(d3.interpolatePuOr).domain([0,1]);

  getColor(viewMode: ViewMode, state: State) {  
    if(!state.isValid) {
      return '#444';
    }

    switch(viewMode){
      case 'reward':
        return this.colorScale(state.reward);
      case 'value':
        return this.colorScale(state.value);
      case 'simple':
      case 'policy':
      case 'q-function':
        return 'darkgray';
    }
  }

  getTriangleColor(viewMode: ViewMode, direction: Direction, state: State) {

    if(!state.isValid){
      return '#444';
    }

    switch(viewMode) {
      case 'policy':
        return direction === state.policy.getMaximum().direction ? '#222' : '#eee';
      case 'q-function':
        return this.colorScale(state.q.get(direction));
      case 'reward':
      case 'simple':
      case 'value':
        return 'red';
    }
  }

  showTriangles(viewMode: ViewMode, state: State) {

    if(!state.isValid){
      return false;
    }

    switch(viewMode) {
      case 'policy':
      case 'q-function':
        return true;
      case 'reward':
      case 'simple':
      case 'value':
        return false;
    }
  }
}