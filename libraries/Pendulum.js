function clampAndDamp(value, clamp, damp) {
  return max(min(value, clamp), -clamp) * damp;
}

class Pendulum {
  static gravity = 0.1;
  static damp = 0.8;
  static clamp = 0.01;
  static heavyDamp = 0.2;
  static fastCountLimit = 100;
  static fastSpeed = 0.1;

  static calculate(p1, p2) {
    if (p1.runaway || p2.runaway) {
      console.log("Pendulum has run away");
      p1.acc = 0;
      p2.acc = 0;
      p1.vel *= Pendulum.heavyDamp ** 2;
      p2.vel *= Pendulum.heavyDamp;
      return [p1, p2];
    }

    const g = Pendulum.gravity;
    const [m1, m2] = [p1.mass, p2.mass];
    const [L1, L2] = [p1.length, p2.length];
    const [t1, t2] = [p1.angle - HALF_PI, p2.angle - HALF_PI];
    const [v1, v2] = [p1.vel, p2.vel];
    const tD = t1 - t2;
    const mT = m1 + m2;

    const a1_num =
      -g * (2 * m1 + m2) * sin(t1) -
      m2 * g * sin(tD) -
      2 * sin(tD) * m2 * (v2 ** 2 * L2 + v1 ** 2 * L1 * cos(tD));
    const a2_num =
      2 *
      sin(tD) *
      (v1 ** 2 * L1 * mT + g * mT * cos(t1) + v2 ** 2 * L2 * m2 * cos(tD));

    const den_part = 2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2);
    const a1_den = L1 * den_part;
    const a2_den = L2 * den_part;

    p1.acc = clampAndDamp(a1_num / a1_den, Pendulum.clamp, Pendulum.damp);
    p2.acc = clampAndDamp(a2_num / a2_den, Pendulum.clamp, Pendulum.damp);

    return [p1, p2];
  }

  constructor(length, mass, root, parent = null) {
    this.length = length;
    this.mass = mass;
    this.angle = HALF_PI;
    this.parent = parent;
    this.root = root;
    this.runaway = false;
    this.setBob();

    this.speedCount = 0;

    this.vel = 0;
    this.acc = 0;
  }

  setBob() {
    this.bob = {
      x: this.root.x + this.length * Math.cos(this.angle),
      y: this.root.y + this.length * Math.sin(this.angle),
    };
  }

  update(cb) {
    this.vel += this.acc;
    this.angle += this.vel;
    this.setBob();
    if (this.parent) this.root = this.parent.bob;

    this.speedCount =
      Math.abs(this.vel) > Pendulum.fastSpeed ? this.speedCount + 1 : 0;
    this.runaway = this.speedCount > Pendulum.fastCountLimit;

    if (typeof cb == "function") {
      cb(this);
    }
  }
}
