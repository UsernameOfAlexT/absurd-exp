import React from 'react';
import * as utils from '../Utils.js';
import '../style/spiral.css';

const CANVASID = "spiral-canvas"
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;
const OBJ_WIDTH = 2;
const OBJ_HEIGHT = 2;
const MAX_POINTS_ALLOWED = 2048;
// maybe use a map instead?
const PTS_GENERATORS = {
  random: randGenerator,
  uniform: uniformGenerator,
  uniformVar : uniformGeneratorWithVariance
}

function randGenerator(pointsToGen) {
  let newCoords = [];
  for (let i = 0; i < pointsToGen; i++) {
    newCoords.push({
      x: utils.randomInt(CANVAS_WIDTH - OBJ_WIDTH),
      y: utils.randomInt(CANVAS_HEIGHT - OBJ_HEIGHT)
    });
  }
  return newCoords;
}

// varFunction should take the step for that dimension, then return some offset amount
function uniformBaseGenerator(pointsToGen, varFunction) {
  let newCoords = [];
  // premature optimization is the root of all evil; but this can probably be better
  let ptsPerSide = Math.ceil(Math.sqrt(pointsToGen));
  let ystep = Math.round(CANVAS_HEIGHT / ptsPerSide);
  let xstep = Math.round(CANVAS_WIDTH / ptsPerSide);
  for (let i = 0; i < ptsPerSide; i++) {
    for (let j = 0; j < ptsPerSide; j++) {
      newCoords.push({
        x: xstep * i + Math.round(xstep / 2) + varFunction(xstep),
        y: ystep * j + Math.round(ystep / 2) + varFunction(ystep)
      });
    }
  }
  return newCoords;
}

function uniformGenerator(pointsToGen) {
  return uniformBaseGenerator(pointsToGen, (step) => 0);
}

function uniformGeneratorWithVariance(pointsToGen) {
  return uniformBaseGenerator(pointsToGen, (step) => utils.randomIntEitherSign(step/2));
}

class Spiral extends React.Component {
  constructor(props) {
    super(props);
    // canvas can handle most things on its own
    this.state = {
      pointdist: 'random',
      pts: 8,
      angulardelta: Math.PI/128,
      scale: 1
    };
    this.handleDistUpdate = this.handleDistUpdate.bind(this);
    this.handlePointCountUpdate = this.handlePointCountUpdate.bind(this);
    this.handleAngleUpdate = this.handleAngleUpdate.bind(this);
    this.handleScaleUpdate = this.handleScaleUpdate.bind(this);
    this.handleDrawing = this.handleDrawing.bind(this);
    this.cachedCanvas = null;
    this.currentDelta = 0;
    this.currentScale = 1;
    this.origcoords = [];
  }

  componentDidMount() {
    this.initCoords();
  }

  componentDidUpdate() {
    this.initCoords();
  }

  handleDistUpdate(e) {
    this.setState({pointdist: e.target.value});
  }

  handlePointCountUpdate(e) {
    this.setState({pts: e.target.value});
  }

  handleAngleUpdate(e) {
    let actualAngle = Math.PI / 256 * e.target.value;
    this.setState({angulardelta: actualAngle});
  }

  handleScaleUpdate(e) {
    let actualScale = e.target.value * 0.01
    this.setState({scale: actualScale});
  }

  getCachedCanvas() {
    if (!this.cachedCanvas) {
      this.cachedCanvas = document.getElementById(CANVASID);
    }

    return this.cachedCanvas;
  }

  initCoords() {
    this.clearCanvas();
    // generate new initial coords
    this.origcoords = PTS_GENERATORS[this.state.pointdist](this.state.pts);
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
      this.currentScale *= this.state.scale;
    }
  }

  clear(canvasContext) {
    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.currentDelta = 0;
    this.currentScale = 1;
  }

  draw(canvasContext) {
    canvasContext.save();
    canvasContext.fillStyle = 'rgb(40, 40, 100, 255)';
    canvasContext.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    canvasContext.scale(this.currentScale, this.currentScale);
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
          <select id="distribution" onChange={this.handleDistUpdate}>
            <option value="random">Random Distribution</option>
            <option value="uniform">Uniform Distribution</option>
            <option value="uniformVar">Uniform Distribution with random variance</option>
          </select>
          <input type="range" id="spiralpoints" min="1" max={MAX_POINTS_ALLOWED} onChange={this.handlePointCountUpdate}/>
          <label htmlFor="spiralpoints">Number of Points</label>
          <input id="angle" onChange={this.handleAngleUpdate}/>
          <label>Change in Angle (currently: {this.state.angulardelta} radians; The given value is in steps of π/256)</label>
          <input id="scaling" onChange={this.handleScaleUpdate}/>
          <label>Scaling Factor (in percent of previous)</label>
          <button className="btn equalbtn" onClick={this.handleDrawing}>Draw More</button>
        </div>
      </div>
    )
  }
}

export default Spiral;