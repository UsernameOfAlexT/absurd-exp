import React from 'react';

const CANVASID = "drawtrial-canvas"
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;
const OBJ_WIDTH = 16;
const OBJ_HEIGHT = 16;

class DrawTrial extends React.Component {
  constructor(props) {
    super(props);
    // canvas can handle most things on its own
    this.state = {};
    this.timeId = -1;
    this.cachedCanvas = null;
    // TODO make use of react: set these from the app
    this.coords = [
      {x:256, y:256, xv:0, yv:0, xa:-2, ya:1, hitx: false, hity: false},
      {x:256, y:256, xv:0, yv:0, xa:1, ya:2, hitx: false, hity: false},
      {x:256, y:256, xv:0, yv:0, xa:-1, ya:-2, hitx: false, hity: false},
      {x:256, y:256, xv:0, yv:0, xa:2, ya:-1, hitx: false, hity: false},

      {x:256, y:256, xv:0, yv:0, xa:-4, ya:2, hitx: false, hity: false},
      {x:256, y:256, xv:0, yv:0, xa:2, ya:4, hitx: false, hity: false},
      {x:256, y:256, xv:0, yv:0, xa:-2, ya:-4, hitx: false, hity: false},
      {x:256, y:256, xv:0, yv:0, xa:4, ya:-2, hitx: false, hity: false}
      ];
  }

  componentDidMount() {
    this.timeId = setInterval(
      () => this.tick(),
      50
    );
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
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
      toUpdate.xv += toUpdate.xa;
      toUpdate.yv += toUpdate.ya;
      if (toUpdate.hitx) {
        toUpdate.xv = 0;
        toUpdate.xa = - toUpdate.xa;
        toUpdate.hitx = false;
      }

      if (toUpdate.hity) {
        toUpdate.yv = 0;
        toUpdate.ya = - toUpdate.ya;
        toUpdate.hity = false;
      }
    }
  }

  updateCoords() {
    for (let toUpdate of this.coords) {
      toUpdate.x += toUpdate.xv;
      toUpdate.y += toUpdate.yv;

      if (toUpdate.x > CANVAS_WIDTH - OBJ_WIDTH) {
        toUpdate.x = CANVAS_WIDTH - OBJ_WIDTH;
        toUpdate.xv = -toUpdate.xv;
        toUpdate.hitx = true;
      } else if (toUpdate.x < 0) {
        toUpdate.x = 0;
        toUpdate.xv = -toUpdate.xv;
        toUpdate.hitx = true;
      }

      if (toUpdate.y > CANVAS_HEIGHT - OBJ_HEIGHT) {
        toUpdate.y = CANVAS_HEIGHT - OBJ_HEIGHT;
        toUpdate.yv = -toUpdate.yv;
        toUpdate.hity = true;
      } else if (toUpdate.y < 0) {
        toUpdate.y = 0;
        toUpdate.yv = -toUpdate.yv;
        toUpdate.hity = true;
      }
    }
  }

  render() {
    return (
      <canvas id={CANVASID} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        Canvas appears to be unsupported :(
      </canvas>
    )
  }
}

export default DrawTrial;