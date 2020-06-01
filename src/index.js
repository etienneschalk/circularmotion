import './style.css';

const config = {
  darkMode: true,
  coneEffect: false,
  ellipses: false,
  numberOfParticles: 256,
  dragLag: 0.08,
  fadeOut: 0.08,
  particleRadiuses: [ 4, 5, 6, 7, 8 ],
  // particleDistanceFromCenterRange: [100, 350],
  particleDistanceFromCenterRange: [200, 350],
  particleVelocityRange: [0.01, 0.05],
  particleColors: [
    '#ff9cf3',
    '#a8f6ff',
    '#e9b5ff',
  ],
};

var mouseX = 0;
var mouseY = 0;

function randomIntRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomIntRangeFromArray(range) {
  return randomIntRange(range[0], range[1]);
}

function pickRandomly(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rgba(red, green, blue, alpha = 1) {
  if (alpha == 1)
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
}

function initCanvas() {
  let canvas = document.createElement('canvas');
  canvas.id = "surface";
  canvas.addEventListener('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
  document.body.appendChild(canvas);

  return canvas;
}

function initCanvasContext(canvas) {
  let ctx = canvas.getContext('2d');
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  return ctx;
}

function Particle(x, y, radius, color, velocity, distanceFromCentreX, distanceFromCentreY) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.distanceFromCentreX = distanceFromCentreX;
  this.distanceFromCentreY = distanceFromCentreY;
  this.velocity = velocity;

  this.centerX = x;
  this.centerY = y;

  this.previousX = x;
  this.previousY = y;

  this.previousMouseX = x;
  this.previousMouseY = y;

  this.radians = 0;


  this.update = () => {
    this.radians += velocity;

    if (!config.coneEffect) {
      this.previousX = this.x;
      this.previousY = this.y;
    }

    this.previousMouseX += (mouseX - this.previousMouseX) * config.dragLag;
    this.previousMouseY += (mouseY - this.previousMouseY) * config.dragLag;

    this.x = this.previousMouseX + Math.cos(this.radians) * distanceFromCentreX;
    this.y = this.previousMouseY + Math.sin(this.radians) * distanceFromCentreY;

    this.draw();
  };

  this.draw = () => {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.radius;
    ctx.lineCap = 'round';
    ctx.moveTo(this.previousX, this.previousY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.closePath();
  };
}

let particles;

function init() {
  particles = [];

  let distanceFromCentreX, distanceFromCentreY;
  for (let i = 0; i < config.numberOfParticles; ++i) {
    distanceFromCentreX = randomIntRangeFromArray(config.particleDistanceFromCenterRange);
    distanceFromCentreY = config.ellipses
      ? randomIntRangeFromArray(config.particleDistanceFromCenterRange)
      : distanceFromCentreX;
    particles.push(new Particle(
      canvas.width / 2,
      canvas.height / 2,
      pickRandomly(config.particleRadiuses),
      pickRandomly(config.particleColors),
      Math.random() * (config.particleVelocityRange[1] - config.particleVelocityRange[0]) + config.particleVelocityRange[0],
      distanceFromCentreX,
      distanceFromCentreY
    ));
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = config.darkMode ? rgba(0, 0, 0, config.fadeOut) : rgba(255, 255, 255, config.fadeOut);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
  })
}

const canvas = initCanvas();
const ctx = initCanvasContext(canvas);

init();
animate();