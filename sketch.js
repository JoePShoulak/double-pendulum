/* == SETTINGS == */
const MASS = 5;
const BG_COLOR = 0;
const MAIN_STROKE = 180;
const STROKE_RATE = 0.3;

/* == VARIABLES == */
let bgCanvas;
let strokeColor;
let p1, p2;
let prevPx = {};

/* == HELPER CLASS == */

function drawPendulum(p) {
  line(p.root.x, p.root.y, p.bob.x, p.bob.y);
  circle(p.bob.x, p.bob.y, p.mass);
}

function createBackground(reset = false) {
  const prevBg = bgCanvas;

  bgCanvas = createGraphics(width, height);
  bgCanvas.background(BG_COLOR);
  bgCanvas.strokeWeight(2);
  bgCanvas.stroke(strokeColor);

  if (prevBg && !reset) {
    const dx = width - prevBg.width;
    const dy = height - prevBg.height;
    bgCanvas.image(prevBg, dx / 2, dy / 2);
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  createBackground();
}

function resetPendulumns() {
  const constraint = min(width, height) / 5;

  p1 = new Pendulum(constraint, MASS, { x: 0, y: 0 });
  p2 = new Pendulum(constraint, MASS, p1.bob, p1);
  p1.angle = random(TWO_PI);
  p2.angle = random(TWO_PI);

  strokeColor = BG_COLOR;
}

function resetSketch(e = null) {
  e?.preventDefault();
  resetPendulumns();
  createBackground(true);
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  stroke("white");
  fill("white");
  strokeWeight(2);
  document
    .querySelector(".p5Canvas")
    .addEventListener("contextmenu", resetSketch);

  resetPendulumns();
  createBackground();
}

function draw() {
  strokeColor += STROKE_RATE;
  strokeColor = min(MAIN_STROKE, strokeColor);
  bgCanvas.stroke(strokeColor);
  bgCanvas.background(BG_COLOR, 3);

  image(bgCanvas, 0, 0);
  translate(width / 2, height / 2);

  Pendulum.calculate(p1, p2).forEach((p) => {
    p.update();
    drawPendulum(p);
  });

  if (true) {
    const px = p2.bob;

    bgCanvas.line(
      prevPx.x + width / 2,
      prevPx.y + height / 2,
      px.x + width / 2,
      px.y + height / 2
    );

    prevPx = px;
  }
}
