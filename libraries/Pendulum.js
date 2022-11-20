class Pendulum {
  static calculate(p1, p2, dampening = 1) {
    const g = GRAVITY;
    const [m1, m2] = [p1.mass, p2.mass];
    const [L1, L2] = [p1.length, p2.length];
    const [t1, t2] = [p1.angle - HALF_PI, p2.angle - HALF_PI];
    const [v1, v2] = [p1.vel, p2.vel];

    const a1_num =
      -g * (2 * m1 + m2) * Math.sin(t1) -
      m2 * g * Math.sin(t1 - t2) -
      2 *
        Math.sin(t1 - t2) *
        m2 *
        (v2 ** 2 * L2 + v1 ** 2 * L1 * Math.cos(t1 - t2));
    const a2_num =
      2 *
      Math.sin(t1 - t2) *
      (v1 ** 2 * L1 * (m1 + m2) +
        g * (m1 + m2) * Math.cos(t1) +
        v2 ** 2 * L2 * m2 * Math.cos(t1 - t2));
    const a1_den = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2));
    const a2_den = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2));

    p1.acc = (a1_num / a1_den) * dampening;
    p2.acc = (a2_num / a2_den) * dampening;
  }

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
