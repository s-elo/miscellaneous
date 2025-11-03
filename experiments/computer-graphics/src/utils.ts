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
}

export class Color {
  constructor(public r: number, public g: number, public b: number) {}
}

/** 2D points in canvas */
export class Point {
  constructor(public x: number, public y: number) {}
}

export class Sphere {
  constructor(public center: Vec, public radius: number, public color: Color) {}
}
