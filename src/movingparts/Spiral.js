import React from 'react';
import * as utils from '../Utils.js';
import '../style/spiral.css';
import '../style/commondraw.css';
import '../common/ErrorGroup.js'
import ErrorGroup from '../common/ErrorGroup.js';

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
const SCALE_CONDITIONS = {
  precondition : {
    validate : (input) => Number.isNaN(parseFloat(input)),
    errmsg : "Value given for scaling factor isn't a number"
  },
  postcondition : {
    validate : (input) => input === 0 || Math.abs(input) > 10,
    errmsg : "You aren't going to see anything with that scaling factor"
  }
}

const ANGLE_CONDITIONS = {
  precondition : {
    validate : (input) => Number.isNaN(parseFloat(input)),
    errmsg : "Value given for angle isn't a number"
  },
  postcondition : {
    validate : (input) => Math.abs(input) > 2 * Math.PI,
    errmsg : "You don't need to be using that large an angle"
  }
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

function uniformGenerator(pointsToGen) {
  return utils.uniformBaseGenerator(pointsToGen, (step) => 0,
   CANVAS_HEIGHT, CANVAS_WIDTH);
}

function uniformGeneratorWithVariance(pointsToGen) {
  return utils.uniformBaseGenerator(pointsToGen, (step) => utils.randomIntEitherSign(step/2),
   CANVAS_HEIGHT, CANVAS_WIDTH);
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
    // just using straight strings for now. 
    // Will need to change if we ever want dynamic messages
    this.inputIssues = new Set();
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
    let actualAngle = this.checkForInputIssuesAndUpdate(
      ANGLE_CONDITIONS.precondition,
      ANGLE_CONDITIONS.postcondition,
      (input) => Math.PI / 256 * input,
      e.target.value,
      0
    );
    this.setState({angulardelta: actualAngle});
  }

  handleScaleUpdate(e) {
    let actualScale = this.checkForInputIssuesAndUpdate(
      SCALE_CONDITIONS.precondition,
      SCALE_CONDITIONS.postcondition,
      (input) => input * 0.01,
      e.target.value,
      1
    );
    this.setState({scale: actualScale});
  }

  /**
   * Check whether the current inputs are problematic and flag/construct error string if they are
   * Returns result of operation if no issues, default value o/w
   * 
   * @param {object} preCond has validate to check inputs and errmsg, a log string
   * @param {object} postCond has validate to check inputs and errmsg, a log string
   * @param {function} inputOp operation to perform on input if it passed precond
   * @param {*} input  input to input op
   * @param {*} defaultValue default value to return on errors
   */
  checkForInputIssuesAndUpdate(preCond, postCond, inputOp, input, defaultValue) {
    if (this.handleAndFlagIssues(preCond, input)) {
      return defaultValue;
    }
    let tempResult = inputOp(input);
    if (this.handleAndFlagIssues(postCond, tempResult)) {
      return defaultValue;
    }
    return tempResult;
  }

  /**
   * 
   * @param {object} criteria object with validate to check inputs, and an error string
   * @param {*} value value to call validate on
   * @returns whether the value meets the criteria
   */
  handleAndFlagIssues(criteria, value) {
    let hasFailed = criteria.validate(value)
    if (hasFailed) {
      this.inputIssues.add(criteria.errmsg);
    } else {
      this.inputIssues.delete(criteria.errmsg);
    }
    return hasFailed;
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
      <div className="canvas-container">
        <canvas id={CANVASID} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          Canvas appears to be unsupported :(
        </canvas>
        <ErrorGroup errorList={[...this.inputIssues]}/>
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
          <button className="btn equalbtn" disabled={this.inputIssues.size !== 0} onClick={this.handleDrawing}>Draw More</button>
        </div>
      </div>
    )
  }
}

export default Spiral;