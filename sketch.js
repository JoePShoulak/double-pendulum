const LENGTH = 100;
const MASS = 10;
const GRAVITY = 0.1;
const DAMPENING = 1;
let avoidedFirstPixel = false;
let bgCanvas;

class Pendulum {
  constructor(length, mass, root, parent = null) {
    this.length = length;
    this.mass = mass;
    this.angle = HALF_PI;
    this.parent = parent;
    this.root = root;
    this.setBob();

    this.vel = 0;
    this.acc = 0;
  }

  setBob() {
    this.bob = {
      x: this.root.x + this.length * Math.cos(this.angle),
      y: this.root.y + this.length * Math.sin(this.angle),
    };
  }

  update() {
    this.vel += this.acc;
    this.angle += this.vel;
    this.setBob();
    if (this.parent) this.root = this.parent.bob;
  }
}

function animatePendulums(p1, p2) {
  const g = GRAVITY;
  const [m1, m2] = [p1.mass, p2.mass];
  const [L1, L2] = [p1.length, p2.length];
  const [t1, t2] = [p1.angle - HALF_PI, p2.angle - HALF_PI];
  const [v1, v2] = [p1.vel, p2.vel];

  const a1_num =
    -g * (2 * m1 + m2) * sin(t1) -
    m2 * g * sin(t1 - t2) -
    2 * sin(t1 - t2) * m2 * (v2 ** 2 * L2 + v1 ** 2 * L1 * cos(t1 - t2));
  const a2_num =
    2 *
    sin(t1 - t2) *
    (v1 ** 2 * L1 * (m1 + m2) +
      g * (m1 + m2) * cos(t1) +
      v2 ** 2 * L2 * m2 * cos(t1 - t2));
  const a1_den = L1 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));
  const a2_den = L2 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));

  p1.acc = (a1_num / a1_den) * DAMPENING;
  p2.acc = (a2_num / a2_den) * DAMPENING;
}

const pendulums = [];

function drawPendulum(p) {
  line(p.root.x, p.root.y, p.bob.x, p.bob.y);
  circle(p.bob.x, p.bob.y, p.mass);
}

function createBackground() {
  const prevBg = bgCanvas;

  bgCanvas = createGraphics(width, height);
  bgCanvas.background(20);
  bgCanvas.strokeWeight(2);
  bgCanvas.stroke(128);

  if (prevBg) {
    const dx = width - prevBg.width;
    const dy = height - prevBg.height;
    bgCanvas.image(prevBg, dx / 2, dy / 2);
  }
}

function windowResized() {
  avoidedFirstPixel = false;
  resizeCanvas(innerWidth, innerHeight);
  createBackground();
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  stroke("white");
  fill("white");
  strokeWeight(2);

  const constraint = min(width, height) / 5;

  const p1 = new Pendulum(constraint, MASS, { x: 0, y: 0 });
  const p2 = new Pendulum(constraint, MASS, p1.bob, p1);
  p1.angle = random(0, TWO_PI);
  p2.angle = random(0, TWO_PI);

  pendulums.push(p1);
  pendulums.push(p2);

  createBackground();
}

let prevPx = {};

function draw() {
  image(bgCanvas, 0, 0);
  translate(width / 2, height / 2);

  animatePendulums(...pendulums);
  pendulums.forEach((p) => {
    p.update();
    drawPendulum(p);
  });

  if (avoidedFirstPixel) {
    const px = pendulums[1].bob;
    bgCanvas.line(
      prevPx.x + width / 2,
      prevPx.y + height / 2,
      px.x + width / 2,
      px.y + height / 2
    );
    prevPx = px;
  } else {
    avoidedFirstPixel = true; // FIXME
  }
}
