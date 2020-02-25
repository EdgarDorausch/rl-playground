import { ViewMode, sleep, cross, range, viewModeList, Direction } from './Utils';
import { Agent } from './Agent';
import { State, StateTensor } from './State';
import { MazeCellRenderer } from './MazeCellRenderer';


export class RenderHandler {
  private cellStriding: number;
  private canvasSize: number;
  private halfCellSize: number;
  private halfDiagonalSectionSize: number;

  private ctx: CanvasRenderingContext2D|null = null;

  private travelTime = 5_000_000; 
  public doTimeTravel =  false;
  public viewMode: ViewMode = viewModeList[0];
  public doStartNewEpisode =  false;
  
  private stepCounter = 0;
  private stepCounterDOMElem: HTMLElement|null = null;

  private timer = 0;
  private timerDOMElem: HTMLElement|null = null;

  private positions: [number, number][];


  constructor(
    private agent: Agent,
    private stateTensor: StateTensor,
    cellDim: number,
    private cellSize: number,
    private cellPadding: number,
    private mazeCellRenderer: MazeCellRenderer,
    private onTimeTravelProgressChange?: (t: number) => void
  ) {
    this.cellStriding = cellSize + cellPadding;
    this.canvasSize = cellDim*(this.cellStriding) + cellPadding;
    this.positions = cross(range(cellDim), range(cellDim));

    this.halfCellSize = cellSize/2;
    this.halfDiagonalSectionSize = cellSize/6;
    this.getCellColor = this.getCellColor.bind(this);
    this.getTriangleVisibility = this.getTriangleVisibility.bind(this);
    this.draw = this.draw.bind(this);
  }

  private setup() {

    this.stepCounterDOMElem = document.getElementById('stepCounter');
    this.timerDOMElem = document.getElementById('timer');

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;
    this.ctx = canvas.getContext('2d');
  }

  private getCellColor(state: State): string {
    return this.mazeCellRenderer.getColor(this.viewMode, state);
  }

  private getTriangleColor(direction: Direction, state: State): string {
    return this.mazeCellRenderer.getTriangleColor(this.viewMode, direction, state);
  }

  private getTriangleVisibility(state: State): boolean {
    return this.mazeCellRenderer.showTriangles(this.viewMode, state);
  }

  private draw() {

    if(this.ctx === null)
      throw new Error('canvas 2d context is null! Is setup called before draw?');

    this.timer = this.agent.state.t;

    for(let pos of this.positions) {
      const [x,y] = pos;
      const state = this.stateTensor.unsafeGet(x, y, this.timer);

      this.ctx.resetTransform()
      this.ctx.translate(this.cellStriding*x + this.cellPadding, this.cellStriding*y + this.cellPadding);

      const showTriangles = this.getTriangleVisibility(state);

      if(showTriangles) {

        this.ctx.translate(this.halfCellSize, this.halfCellSize);

        // Render "straight" cell-sections
        for(let direction=0; direction<4; direction++) {
          this.ctx.fillStyle = this.getTriangleColor(direction, state);

          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);

          this.ctx.lineTo(-this.halfDiagonalSectionSize, -this.halfDiagonalSectionSize);
          this.ctx.lineTo(-this.halfDiagonalSectionSize, -this.halfCellSize);
          this.ctx.lineTo(this.halfDiagonalSectionSize, -this.halfCellSize);
          this.ctx.lineTo(this.halfDiagonalSectionSize, -this.halfDiagonalSectionSize);

          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.rotate(Math.PI / 2)
        }

        // Render "diagonal" cell-sections
        for(let direction=4; direction<8; direction++) {
          this.ctx.fillStyle = this.getTriangleColor(direction, state);

          this.ctx.rotate(Math.PI / 2)

          this.ctx.beginPath();
          this.ctx.moveTo(this.halfDiagonalSectionSize, -this.halfDiagonalSectionSize);

          this.ctx.lineTo(this.halfDiagonalSectionSize, -this.halfCellSize);
          this.ctx.lineTo(this.halfCellSize, -this.halfCellSize);
          this.ctx.lineTo(this.halfCellSize, -this.halfDiagonalSectionSize);

          this.ctx.closePath();
          this.ctx.fill();

        }

      } else {
        this.ctx.fillStyle = this.getCellColor(state);
        this.ctx.fillRect(0,0, this.cellSize, this.cellSize);
      }
    }

    this.ctx.resetTransform()
    this.ctx.translate(
      this.cellPadding + this.agent.state.x*this.cellStriding + this.cellSize/2,
      this.cellPadding + this.agent.state.y*this.cellStriding + this.cellSize/2
    );

    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.cellSize/2.2, 0, 2 * Math.PI);
    this.ctx.fill();

    window.requestAnimationFrame(this.draw);
  }

  private async update() {
    this.stepCounter++;

    if(this.doStartNewEpisode) {
      this.doStartNewEpisode = false;
      // TODO: this.agent.resetPosition();
    }
    
    if(this.doTimeTravel) {
      this.doTimeTravel = false;
      for(let i = 0; i<this.travelTime; i++) {
        this.stepCounter++;
        this.agent.doStep();
        const progress = i/this.travelTime;
        if(progress%0.01 < 0.0000001) {
          this.onTimeTravelProgressChange?.(progress);
          this.updateHTML()
          await sleep(1);
        }
      }
      this.onTimeTravelProgressChange?.(0);
    }
    
    this.agent.doStep();
  }

  private updateHTML() {
    if(this.stepCounterDOMElem === null)
      throw new Error('stepCounter DOM Element is null! Is setup called before draw?');
    if(this.timerDOMElem === null)
      throw new Error('timer DOM Element is null! Is setup called before draw?');

    this.stepCounterDOMElem.innerHTML = this.stepCounter.toString();
    this.timerDOMElem.innerHTML = this.timer.toString();
  }

  public async start() {
    this.setup();

    window.requestAnimationFrame(this.draw);

    while(true) {
      await this.update();
      this.updateHTML()
      await sleep(40);
      // break;
    }
  }
}