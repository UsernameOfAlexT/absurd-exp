import React from 'react';

const CANVASID = "drawtrial-canvas"
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;
const OBJ_WIDTH = 8;
const OBJ_HEIGHT = 8;
const MAX_POINTS_ALLOWED = 90;
const MAX_SPEED = 10;

class DrawTrial extends React.Component {
  constructor(props) {
    super(props);
    // canvas can handle most things on its own
    this.state = {
      pts: 8,
      radius: 20
    };
    this.handleRadiusUpdate = this.handleRadiusUpdate.bind(this);
    this.handlePointCountUpdate = this.handlePointCountUpdate.bind(this);
    this.timeId = -1;
    this.cachedCanvas = null;
    this.coords = [];
  }

  componentDidMount() {
    this.timeId = setInterval(
      () => this.tick(),
      50
    );
    this.initCoords();
  }

  componentDidUpdate() {
    this.initCoords();
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  handleRadiusUpdate(e) {
    this.setState({radius: e.target.value});
  }

  handlePointCountUpdate(e) {
    this.setState({pts: e.target.value});
  }

  tick() {
    if (!this.cachedCanvas) {
      this.cachedCanvas = document.getElementById(CANVASID);
    }

    let canvas = this.cachedCanvas;
    if (canvas.getContext) {
      let cnx = canvas.getContext('2d');
      this.draw(cnx);
      this.updateCoords();
      this.updateV();
    }
  }

  draw(canvasContext) {
    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let toDraw of this.coords) {
      canvasContext.save();
      canvasContext.fillStyle = 
        'rgb(' + (toDraw.y % 255)  + ', 0, 100, 100)';
      canvasContext.translate(toDraw.x, toDraw.y);
      canvasContext.fillRect(0, 0, OBJ_WIDTH, OBJ_HEIGHT);
      canvasContext.restore();
    }
  }

  updateV() {
    for (let toUpdate of this.coords) {
      toUpdate.xv += toUpdate.xv + toUpdate.xa > MAX_SPEED ? 0 : toUpdate.xa;
      toUpdate.yv += toUpdate.yv + toUpdate.ya > MAX_SPEED ? 0 : toUpdate.ya;
      // bounces
      if (toUpdate.hitx) {
        toUpdate.xv = - toUpdate.xv;
        toUpdate.xvdec = - toUpdate.xvdec;
        toUpdate.xa = - toUpdate.xa;
        toUpdate.hitx = false;
      }

      if (toUpdate.hity) {
        toUpdate.yv = - toUpdate.yv
        toUpdate.yvdec = - toUpdate.yvdec;
        toUpdate.ya = - toUpdate.ya;
        toUpdate.hity = false;
      }
    }
  }

  updateCoords() {
    for (let toUpdate of this.coords) {
      // roundoff x and y and store the decimal part toward an extra pixel of movement
      let intPartXv = toUpdate.xv > 0 ? Math.floor(toUpdate.xv) : Math.ceil(toUpdate.xv);
      let intPartYv = toUpdate.yv > 0 ? Math.floor(toUpdate.yv) : Math.ceil(toUpdate.yv);
      // TODO make this pretty
      let potentialXdec = toUpdate.xvdec + (toUpdate.xv - intPartXv)
      let potentialYdec = toUpdate.yvdec + (toUpdate.yv - intPartYv)
      let extraEarnedX = Math.abs(potentialXdec) >= 1;
      let extraEarnedY = Math.abs(potentialYdec) >= 1;
      // if an extra pixel is 'spent', reduce back to decimal parts
      toUpdate.xvdec = extraEarnedX ? potentialXdec - Math.sign(potentialXdec): potentialXdec;
      toUpdate.yvdec = extraEarnedY ? potentialYdec - Math.sign(potentialYdec): potentialYdec;

      // handle movement including partial movement
      toUpdate.x += intPartXv + (extraEarnedX ? Math.sign(potentialXdec) : 0);
      toUpdate.y += intPartYv + (extraEarnedY ? Math.sign(potentialYdec) : 0);

      // bounces
      if (toUpdate.x > CANVAS_WIDTH - OBJ_WIDTH) {
        toUpdate.x = CANVAS_WIDTH - OBJ_WIDTH;
        toUpdate.hitx = true;
      } else if (toUpdate.x < 0) {
        toUpdate.x = 0;
        toUpdate.hitx = true;
      }

      if (toUpdate.y > CANVAS_HEIGHT - OBJ_HEIGHT) {
        toUpdate.y = CANVAS_HEIGHT - OBJ_HEIGHT;
        toUpdate.hity = true;
      } else if (toUpdate.y < 0) {
        toUpdate.y = 0;
        toUpdate.hity = true;
      }
    }
  }

  initCoords() {
    let canvasCenX = CANVAS_WIDTH / 2;
    let canvasCenY = CANVAS_HEIGHT / 2;
    let curOffset = 0;
    let radialStep = (2 * Math.PI) / this.state.pts;
    let newCoords = [];

    for (let i = 0; i < this.state.pts; i++) {
      let newCoord = this.getCoordFromCentre(canvasCenX, canvasCenY, curOffset, this.state.radius);
      // TODO radial accel
      newCoords.push({
        x: newCoord.x,
        y: newCoord.y,
        xv:1.5, 
        yv:1.2,
        xvdec:0,
        yvdec:0,
        xa:0,
        ya:0,
        hitx: false,
        hity: false
      });
      curOffset += radialStep;
    }
    this.coords = newCoords;
  }

  getCoordFromCentre(xcen, ycen, radialOffset, radius) {
     let xdelta = radius * Math.cos(radialOffset);
     let ydelta = radius * Math.sin(radialOffset);
     let xfinal = xcen + xdelta;
     let yfinal = ycen + ydelta;
     return {x: xfinal, y: yfinal}
  }

  render() {
    return (
      <div>
        <canvas id={CANVASID} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          Canvas appears to be unsupported :(
        </canvas>
        <input type="range" id="radius" min="0" max={CANVAS_WIDTH / 2 - 20} onChange={this.handleRadiusUpdate}/>
        <label for ="radius">Radius</label>
        <input type="range" id="points" min="1" max={MAX_POINTS_ALLOWED} onChange={this.handlePointCountUpdate}/>
        <label for ="points">Number of Points</label>
      </div>
    )
  }
}

export default DrawTrial;