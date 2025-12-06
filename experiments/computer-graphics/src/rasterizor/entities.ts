import type { Color, Vec } from '../utils';
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
    public v0: number,
    public v1: number,
    public v2: number,
    public color: Color,
  ) {}
}

/** Each model can be composed by triangles based on its vertices */
export class Model {
  constructor(public vertices: Vec[], public triangles: Triangle[]) {}
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

export class Camera {
  constructor(public position: Vec, public orientation: Mat4x4) {}
}
