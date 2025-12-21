import type { Color } from '../utils';
import { Vec } from '../utils';
import {
  Mat4x4,
  multiplyMM4,
  makeTranslationMatrix,
  makeScalingMatrix,
  IdenticalMatrix4x4,
} from './helpers';

export class Triangle {
  constructor(
    /** vertex indices of the model */
    public indexes: [number, number, number],
    public color: Color,
  ) {}

  nor(vertices: Vec[]): Vec {
    const [v0, v1, v2] = this.indexes;

    const v0v1 = vertices[v1].sub(vertices[v0]);
    const v0v2 = vertices[v2].sub(vertices[v0]);
    return v0v1.cross(v0v2);
  }
}

/** Each model can be composed by triangles based on its vertices */
export class Model {
  constructor(
    public vertices: Vec[],
    public triangles: Triangle[],
    /** computing the bounding sphere is complex, so we just provide it manually */
    public boundsCenter: Vec,
    public boundsRadius: number,
  ) {}
}

export class Instance {
  transform: Mat4x4;

  constructor(
    public model: Model,
    /** position 3D point in world space */
    public position: Vec,
    /** rotation matrix in model space */
    public orientation: Mat4x4 = IdenticalMatrix4x4,
    /** scale in model space */
    public scale: number = 1.0,
  ) {
    this.transform = multiplyMM4(
      // transform to world space: translation
      makeTranslationMatrix(this.position),
      // transform in model space: scale and rotation
      multiplyMM4(this.orientation, makeScalingMatrix(this.scale)),
    );
  }
}

export class ClipPlane {
  constructor(public normal: Vec, public distance: number) {}
}

const s2 = 1.0 / Math.sqrt(2);
export class Camera {
  constructor(
    public position: Vec,
    public orientation: Mat4x4,
    public clipPlanes: ClipPlane[] = [
      new ClipPlane(new Vec(0, 0, 1), -1), // Near
      new ClipPlane(new Vec(s2, 0, s2), 0), // Left
      new ClipPlane(new Vec(-s2, 0, s2), 0), // Right
      new ClipPlane(new Vec(0, -s2, s2), 0), // Top
      new ClipPlane(new Vec(0, s2, s2), 0), // Bottom
    ],
  ) {}
}
