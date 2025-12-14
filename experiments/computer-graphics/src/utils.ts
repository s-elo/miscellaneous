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

  add(other: Color) {
    return new Color(this.r + other.r, this.g + other.g, this.b + other.b);
  }
}

/** 2D points in canvas */
export class Point {
  constructor(public x: number, public y: number, public h: number = 1) {}
  reverse() {
    return new Point(this.y, this.x, this.h);
  }
}

export class Sphere {
  constructor(
    public center: Vec,
    public radius: number,
    public color: Color,
    /** bigger, shinier */
    public specular: number = -1,
    /** bigger, more reflective */
    public reflective: number = -1,
  ) {}
}

/**
 * Resolve the equations to get the intersected t params
 * - <P-C, P-C> = r^2
 * - P = O + t<V - O>
 * - where O is the origin, can be the camera, V is the viewport point, C is the sphere center, r is the sphere radius.
 *
 * The bigger t is, the greater distance of the sphere is
 */
export function getIntersectRaySphereParams(
  origin: Vec,
  rayDirection: Vec,
  sphere: Sphere,
): [number, number] {
  const originToSphereCenter = origin.sub(sphere.center);

  const a = rayDirection.dot(rayDirection);
  const b = 2 * originToSphereCenter.dot(rayDirection);
  const c =
    originToSphereCenter.dot(originToSphereCenter) -
    sphere.radius * sphere.radius;

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return [Infinity, Infinity];
  }

  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  return [t1, t2];
}

export function getClosestIntersectedParams(
  origin: Vec,
  rayDirection: Vec,
  spheres: Sphere[],
  tMin: number,
  tMax: number,
): { closestT: number; closestSphere: Sphere | null } {
  let closestT = Infinity;
  let closestSphere: Sphere | null = null;

  for (const sphere of spheres) {
    const intersectParams = getIntersectRaySphereParams(
      origin,
      rayDirection,
      sphere,
    );
    intersectParams.forEach((t) => {
      if (t > tMin && t < tMax && t < closestT) {
        closestT = t;
        closestSphere = sphere;
      }
    });
  }

  return { closestT, closestSphere };
}

export function getReflectionDirection(rayDirection: Vec, surfaceNormal: Vec) {
  return surfaceNormal
    .mul(2 * surfaceNormal.dot(rayDirection))
    .sub(rayDirection);
}

export function transformOriginToTopLeft(
  point: Point,
  canvas: HTMLCanvasElement,
) {
  return new Point(
    canvas.width / 2 + floor(point.x),
    canvas.height / 2 - floor(point.y),
  );
}

export function putPixel(
  point: Point,
  color: Color,
  canvas: HTMLCanvasElement,
  canvasBuffer: ImageData,
) {
  const { x, y } = transformOriginToTopLeft(point, canvas);

  if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
    throw new Error('Pixel out of bounds');
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
  let offset = 4 * (x + canvasBuffer.width * y);
  canvasBuffer.data[offset++] = color.r;
  canvasBuffer.data[offset++] = color.g;
  canvasBuffer.data[offset++] = color.b;
  canvasBuffer.data[offset++] = 255; // Alpha = 255 (full opacity)
}

/**
 * Interpolate the y values between two points;
 * Make sure x1 > x0
 */
export function interpolate({ x: x0, y: y0 }: Point, { x: x1, y: y1 }: Point) {
  if (x0 === x1) return [y0];

  const values: number[] = [];
  const slope = (y1 - y0) / (x1 - x0);

  let y = y0;
  for (let x = x0; x <= x1; x++) {
    values.push(y);
    y += slope;
  }

  return values;
}

export function swapPoints(p0: Point, p1: Point) {
  const swap = p0;
  p0 = p1;
  p1 = swap;
  return [p0, p1];
}

/** floor the number for both positive and negative */
export function floor(num: number) {
  return num | 0;
}
