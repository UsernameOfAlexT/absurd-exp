import React from 'react';
import * as utils from '../Utils.js';
import '../style/drawtrial.css';
import '../style/commondraw.css';

const CANVASID = "drawtrial-canvas"
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;
const OBJ_WIDTH = 8;
const OBJ_HEIGHT = 8;
const MAX_SPEED = 10;

class Agents extends React.Component {
  constructor(props) {
    super(props);
    // canvas can handle most things on its own
    this.state = {
      pts: 32,
    };
    // this.handleRadiusUpdate = this.handleRadiusUpdate.bind(this);
    // this.handlePointCountUpdate = this.handlePointCountUpdate.bind(this);
    // this.handleSpeedUpdate = this.handleSpeedUpdate.bind(this);
    // this.handleAccelUpdate = this.handleAccelUpdate.bind(this);
    this.timeId = -1;
    this.cachedCanvas = null;
    this.coords = [];
  }

  componentDidMount() {
    this.timeId = setInterval(
      () => this.tick(),
      75
    );
    this.initCoords();
  }

  componentDidUpdate() {
    this.initCoords();
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  // handleRadiusUpdate(e) {
  //   this.setState({radius: e.target.value});
  // }

  // handlePointCountUpdate(e) {
  //   this.setState({pts: e.target.value});
  // }

  // handleSpeedUpdate(e) {
  //   this.setState({speed: e.target.value});
  // }

  // handleAccelUpdate(e) {
  //   this.setState({accel: e.target.value});
  // }

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
        'rgb(' + toDraw.yv * 20 + ', ' + toDraw.xv * 20 + ', 100, 100)';
      canvasContext.translate(toDraw.x, toDraw.y);
      canvasContext.fillRect(0, 0, OBJ_WIDTH, OBJ_HEIGHT);
      canvasContext.restore();
    }
  }

  updateV() {
    for (let i = 0; i < this.coords.length; i++) {
      // is this optimal?
      let otherCoord = this.coords.slice();
      let newCoord = otherCoord.splice(i, 1)[0];
      let forces = this.forceApplied(otherCoord, newCoord);

      newCoord.xv += forces.xapplied;
      newCoord.yv += forces.yapplied;
      newCoord.xv = Math.abs(newCoord.xv) > MAX_SPEED ? Math.sign(newCoord.xv) * MAX_SPEED : newCoord.xv;
      newCoord.yv = Math.abs(newCoord.yv) > MAX_SPEED ? Math.sign(newCoord.yv) * MAX_SPEED : newCoord.yv;
      this.coords[i] = newCoord;
    }
  }

  /**
   * find forces that should be applied to this point
   * @param {Object} currentcoord
   * @param {list} otherCoords 
   */
  forceApplied(otherCoords, currentcoord) {
    // use an accumulator instead? TODO
    let currentXApplied = 0;
    let currentYApplied = 0;
    for (let coord of otherCoords) {
      let xdelta = (currentcoord.x - coord.x);
      let ydelta = (currentcoord.y - coord.y);

      if(xdelta === 0 && ydelta === 0) {
        console.log("Point Overlap");
        continue;
      }

      let distsqrd = Math.pow(xdelta, 2) + Math.pow(ydelta, 2);
      let magnitude = this.logistic(Math.sqrt(distsqrd), MAX_SPEED/2);
      let angleRep = Math.abs(Math.atan(ydelta/xdelta));

      // repelling when close, attracting o/w
      let xdirection = Math.sqrt(distsqrd) < 60 ? Math.sign(xdelta) : - Math.sign(xdelta);
      let ydirection = Math.sqrt(distsqrd) < 60 ? Math.sign(ydelta) : - Math.sign(ydelta);

      currentXApplied += xdirection * (magnitude * Math.cos(angleRep));
      currentYApplied += ydirection * (magnitude * Math.sin(angleRep));
    }

    return {
      xapplied: Math.round(currentXApplied),
      yapplied: Math.round(currentYApplied)
    }
  }

  logistic(x, max) {
    return max / (1 + Math.exp(0.05 * (x - 50)));
  }

  // TODO this should be some sort of common func
  updateCoords() {
    for (let toUpdate of this.coords) {
      // handle movement including partial movement
      toUpdate.x += toUpdate.xv;
      toUpdate.y += toUpdate.yv;

      // edge collision
      if (toUpdate.x > CANVAS_WIDTH - OBJ_WIDTH) {
        toUpdate.x = CANVAS_WIDTH - OBJ_WIDTH;
      } else if (toUpdate.x < 0) {
        toUpdate.x = 0;
      }

      if (toUpdate.y > CANVAS_HEIGHT - OBJ_HEIGHT) {
        toUpdate.y = CANVAS_HEIGHT - OBJ_HEIGHT;
      } else if (toUpdate.y < 0) {
        toUpdate.y = 0;
      }
    }
  }

  initCoords() {
    this.coords = randGenerator(this.state.pts);
  }

  render() {
    return (
      <div className="canvas-container">
        <canvas id={CANVASID} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          Canvas appears to be unsupported :(
        </canvas>
        <div id="canvas-controls">
          
        </div>
      </div>
    )
  }
}

function randGenerator(pointsToGen) {
  let newCoords = [];
  for (let i = 0; i < pointsToGen; i++) {
    newCoords.push({
      x: utils.randomInt(CANVAS_WIDTH - OBJ_WIDTH),
      y: utils.randomInt(CANVAS_HEIGHT - OBJ_HEIGHT),
      xv: 0,
      yv: 0
    });
  }
  return newCoords;
}

export default Agents;