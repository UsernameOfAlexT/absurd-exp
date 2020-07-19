import React from 'react';
import * as utils from '../Utils.js';
import '../style/spiral.css';

const CANVASID = "spiral-canvas"
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;
const OBJ_WIDTH = 2;
const OBJ_HEIGHT = 2;
const MAX_POINTS_ALLOWED = 2048;

class Spiral extends React.Component {
  constructor(props) {
    super(props);
    // canvas can handle most things on its own
    this.state = {
      pts: 8,
      angulardelta: Math.PI/128
    };
    this.handlePointCountUpdate = this.handlePointCountUpdate.bind(this);
    this.handleAngleUpdate = this.handleAngleUpdate.bind(this);
    this.handleDrawing = this.handleDrawing.bind(this);
    this.cachedCanvas = null;
    this.currentDelta = 0;
    this.origcoords = [];
  }

  componentDidMount() {
    this.initCoords();
  }

  componentDidUpdate() {
    this.initCoords();
  }

  handlePointCountUpdate(e) {
    this.setState({pts: e.target.value});
  }

  handleAngleUpdate(e) {
    let actualAngle = Math.PI / 256 * e.target.value;
    this.setState({angulardelta: actualAngle});
  }

  getCachedCanvas() {
    if (!this.cachedCanvas) {
      this.cachedCanvas = document.getElementById(CANVASID);
    }

    return this.cachedCanvas;
  }

  initCoords() {
    let newCoords = [];
    this.clearCanvas();

    for (let i = 0; i < this.state.pts; i++) {
      newCoords.push({
        x: utils.randomInt(CANVAS_WIDTH - OBJ_WIDTH),
        y: utils.randomInt(CANVAS_HEIGHT - OBJ_HEIGHT)
      });
    }
    this.origcoords = newCoords;
    this.handleDrawing();
  }

  clearCanvas() {
    let canvas = this.getCachedCanvas();
    if (canvas.getContext) {
      let cnx = canvas.getContext('2d');
      this.clear(cnx);
    }
  }

  handleDrawing() {
    let canvas = this.getCachedCanvas();
    if (canvas.getContext) {
      let cnx = canvas.getContext('2d');
      this.draw(cnx);
      this.currentDelta += this.state.angulardelta;
    }
  }

  clear(canvasContext) {
    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.currentDelta = 0;
  }

  draw(canvasContext) {
    canvasContext.save();
    canvasContext.fillStyle = 'rgb(40, 40, 100, 255)';
    canvasContext.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    canvasContext.rotate(this.currentDelta);
    canvasContext.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
    for (let toDraw of this.origcoords) {
      canvasContext.fillRect(toDraw.x, toDraw.y, OBJ_WIDTH, OBJ_HEIGHT);
    }
    canvasContext.restore();
  }

  render() {
    return (
      <div>
        <canvas id={CANVASID} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          Canvas appears to be unsupported :(
        </canvas>
        <div id="spiral-canvas-controls">
          <input type="range" id="spiralpoints" min="1" max={MAX_POINTS_ALLOWED} onChange={this.handlePointCountUpdate}/>
          <label htmlFor="spiralpoints">Number of Points</label>
          <input id="angle" onChange={this.handleAngleUpdate}/>
          <label>Change in Angle (currently: {this.state.angulardelta} radians)</label>
        </div>
        <button className="btn equalbtn" onClick={this.handleDrawing}>Draw More</button>
      </div>
    )
  }
}

export default Spiral;