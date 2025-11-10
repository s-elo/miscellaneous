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
  constructor(public x: number, public y: number) {}
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
