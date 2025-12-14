import type { Matrix4x4 } from '../types';
import { Vec } from '../utils';

export class Mat4x4 {
  constructor(public data: Matrix4x4) {}
}

export const IdenticalMatrix4x4 = new Mat4x4([
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]);

export class Vertex4 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number,
  ) {}

  toVec3() {
    if (this.w === 0) {
      throw new Error('Cannot convert Vertex4 to Vec3 when w is 0');
    }
    return new Vec(this.x, this.y, this.z);
  }

  static fromVec3(vec: Vec) {
    return new Vertex4(vec.x, vec.y, vec.z, 1);
  }
}

/** generate a rotation matrix(Y axis rotation) by degrees */
export function makeOYRotationMatrix(degrees: number) {
  const cos = Math.cos((degrees * Math.PI) / 180.0);
  const sin = Math.sin((degrees * Math.PI) / 180.0);

  return new Mat4x4([
    [cos, 0, -sin, 0],
    [0, 1, 0, 0],
    [sin, 0, cos, 0],
    [0, 0, 0, 1],
  ]);
}

/** Makes a transform matrix for a translation. */
export function makeTranslationMatrix(translation: Vec) {
  return new Mat4x4([
    [1, 0, 0, translation.x],
    [0, 1, 0, translation.y],
    [0, 0, 1, translation.z],
    [0, 0, 0, 1],
  ]);
}

/** Makes a transform matrix for a scaling. */
export function makeScalingMatrix(scale: number) {
  return new Mat4x4([
    [scale, 0, 0, 0],
    [0, scale, 0, 0],
    [0, 0, scale, 0],
    [0, 0, 0, 1],
  ]);
}

/** Multiplies a 4x4 matrix and a 4D vector. */
export function multiplyMV(mat4x4: Mat4x4, vec4: Vertex4) {
  const result = [0, 0, 0, 0];
  const vec = [vec4.x, vec4.y, vec4.z, vec4.w];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i] += mat4x4.data[i][j] * vec[j];
    }
  }

  return new Vertex4(result[0], result[1], result[2], result[3]);
}

/** Multiplies two 4x4 matrices. */
export function multiplyMM4(matA: Mat4x4, matB: Mat4x4) {
  const result = new Mat4x4([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result.data[i][j] += matA.data[i][k] * matB.data[k][j];
      }
    }
  }

  return result;
}

/** Transposes a 4x4 matrix. */
export function transposed(mat: Mat4x4) {
  const result = new Mat4x4([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result.data[i][j] = mat.data[j][i];
    }
  }
  return result;
}
