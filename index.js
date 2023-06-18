// Variables
const canvas = document.getElementById('canvas');
const canvasLine = document.getElementById('canvas-line');
const ctx = canvas.getContext('2d');
const ctxLine = canvasLine.getContext('2d');
const FPS = 60;
const INTERVAL = Math.round(1000 / FPS) // ms
const gui = new dat.GUI({
  closeOnTop: true,
  width: 320,
});

var pendulum = {
  gravity: 1,
  dampening: 0.9998,
  playing: true,
  maxRodSize: (Math.min(innerWidth, innerHeight) * 0.9) / 4,
  rodColor: '#275e93',
  discColor: '#1e82e3'
}

var line = {
  x: 0,
  y: 0,
  alphaDelay: 0,
  color: '#ff6914',
  fadedColor: hexToRGB('#283347', 0.15),
}

var b1 = {
  mass: 100,
  x: 0,
  y: 0,
  angle: Math.PI * 0.75,
  dist: pendulum.maxRodSize,
  vel: 0,
  acc: 0
}

var b2 = {
  mass: 100,
  x: 0,
  y: 0,
  angle: Math.PI * 0.85,
  dist: pendulum.maxRodSize,
  vel: 0,
  acc: 0
}


// GUI
gui.close();
gui.add(pendulum, 'gravity', -1, 1, 0.05).name('Gravity');
gui.add(pendulum, 'dampening', 0.9950, 1, 0.0001).name('Dampening');
let b1Folder = gui.addFolder('Bob 1');
b1Folder.open(); 
b1Folder.add(b1, 'mass', 1, 200, 1).name('Mass');
b1Folder.add(b1, 'dist', 20, pendulum.maxRodSize).name('Distance');
let b2Folder = gui.addFolder('Bob 2');
b2Folder.open();
b2Folder.add(b2, 'mass', 1, 200, 1).name('Mass');
b2Folder.add(b2, 'dist', 20, pendulum.maxRodSize).name('Distance');

let buttons = {
  resetLines: function () {
    ctxLine.clearRect(0, 0, dpi(innerWidth), dpi(innerHeight));
  },
  toggle: function () {
    if (pendulum.playing == true) {
      pendulum.playing = false
    } else {
      pendulum.playing = true
      requestAnimationFrame(updateGameDisplay);
    }
  },
};
gui.add(buttons, 'resetLines').name('Erase lines');
gui.add(buttons, 'toggle').name('Pause/Play');


// Functions
function calculateBobs() {
  const g = pendulum.gravity / 3;

  let num1 = -g * (2 * b1.mass + b2.mass) * Math.sin(b1.angle);
  let num2 = -b2.mass * g * Math.sin(b1.angle - 2 * b2.angle);
  let num3 = -2 * Math.sin(b1.angle - b2.angle) * b2.mass;
  let num4 = b2.vel * b2.vel * b2.dist + b1.vel * b1.vel * b1.dist * Math.cos(b1.angle - b2.angle);
  let den = b1.dist * (2 * b1.mass + b2.mass - b2.mass * Math.cos(2 * b1.angle - 2 * b2.angle));
  b1.acc = (num1 + num2 + num3 * num4) / den;

  num1 = 2 * Math.sin(b1.angle - b2.angle);
  num2 = b1.vel * b1.vel * b1.dist * (b1.mass + b2.mass);
  num3 = g * (b1.mass + b2.mass) * Math.cos(b1.angle);
  num4 = b2.vel * b2.vel * b2.dist * b2.mass * Math.cos(b1.angle - b2.angle);
  den = b2.dist * (2 * b1.mass + b2.mass - b2.mass * Math.cos(2 * b1.angle - 2 * b2.angle));
  b2.acc = (num1 * (num2 + num3 + num4)) / den;

  b1.vel += b1.acc;
  b2.vel += b2.acc;
  b1.angle += b1.vel;
  b2.angle += b2.vel;

  b1.x = b1.dist * Math.sin(b1.angle);
  b1.y = b1.dist * Math.cos(b1.angle);
  b2.x = b1.x + b2.dist * Math.sin(b2.angle);
  b2.y = b1.y + b2.dist * Math.cos(b2.angle);

  b1.vel *= pendulum.dampening;
  b2.vel *= pendulum.dampening;
}

function drawPendulum(x, y) {
  // Draw Center
  ctx.beginPath();
  ctx.arc(dpi(innerWidth / 2), dpi(innerHeight / 2), dpi(3), 0, 2 * Math.PI);
  ctx.fillStyle = pendulum.rodColor;
  ctx.fill();
  ctx.closePath();

  // Draw Rods
  ctx.beginPath();
  ctx.moveTo(dpi(x), dpi(y));
  ctx.lineTo(dpi(b1.x + x), dpi(b1.y + y));
  ctx.lineTo(dpi(b2.x + x), dpi(b2.y + y));
  ctx.lineWidth = 3;
  ctx.strokeStyle = pendulum.rodColor;
  ctx.stroke();

  // Fade the line's color away
  line.alphaDelay++
  if (line.alphaDelay > 20) {
    line.alphaDelay = 0;
    ctxLine.globalCompositeOperation = 'source-atop';
    ctxLine.beginPath();
    ctxLine.fillStyle = line.fadedColor;
    ctxLine.fillRect(0, 0, dpi(innerWidth), dpi(innerHeight));
  }

  // Draw the line
  ctxLine.globalCompositeOperation = 'source-over';
  ctxLine.beginPath();
  ctxLine.moveTo(dpi(line.x), dpi(line.y));
  ctxLine.lineTo(dpi(b2.x + x), dpi(b2.y + y));
  ctxLine.lineWidth = dpi(1);
  ctxLine.strokeStyle = line.color;
  ctxLine.stroke();

  // Draw first disc
  ctx.beginPath();
  ctx.arc(dpi(b1.x + x), dpi(b1.y + y), dpi(6), 0, 2 * Math.PI);
  ctx.fillStyle = pendulum.discColor;
  ctx.fill();

  // Draw second disc
  ctx.beginPath();
  ctx.arc(dpi(b2.x + x), dpi(b2.y + y), dpi(6), 0, 2 * Math.PI);
  ctx.fill();

  line.x = b2.x + x;
  line.y = b2.y + y;
}

function updateGameLogic() {
  if (pendulum.playing) {
    calculateBobs();
  }
}

function updateGameDisplay() {
  if (pendulum.playing) {
    ctx.clearRect(0, 0, dpi(innerWidth), dpi(innerHeight));
    drawPendulum(innerWidth / 2, innerHeight / 2);
    requestAnimationFrame(updateGameDisplay);
  }
}

function resizeWindow() {
  canvas.width = dpi(innerWidth);
  canvas.height = dpi(innerHeight);

  canvasLine.width = dpi(innerWidth);
  canvasLine.height = dpi(innerHeight);
}



// Initializations
let gameLogicInterval = new AdjustingInterval(updateGameLogic, INTERVAL);
gameLogicInterval.start();
updateGameDisplay();

resizeWindow();

// Event Listeners
window.addEventListener('resize', function () {
  resizeWindow();
});

canvas.addEventListener('click', function () {
  if (gui.closed) {
    gui.open();
  } else {
    gui.close();
  }
});

document.getElementById('back').addEventListener('click', function(e) {
  e.stopPropagation();
});