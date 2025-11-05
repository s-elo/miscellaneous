export class Vec {
  constructor(public x: number, public y: number, public z: number) {}

  add(other: Vec) {
    return new Vec(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  sub(other: Vec) {
    return new Vec(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  dot(other: Vec) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  mul(scalar: number) {
    return new Vec(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  nor() {
    return this.mul(1 / this.length());
  }
}

export class Color {
  constructor(public r: number, public g: number, public b: number) {}

  mul(scalar: number) {
    return new Color(this.r * scalar, this.g * scalar, this.b * scalar);
  }
}

/** 2D points in canvas */
export class Point {
  constructor(public x: number, public y: number) {}
}

export class Sphere {
  constructor(
    public center: Vec,
    public radius: number,
    public color: Color,
    public specular: number = -1,
  ) {}
}
