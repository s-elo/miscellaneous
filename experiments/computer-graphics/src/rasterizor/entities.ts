import { Color, Point } from '../utils';
import { floor, Vec } from '../utils';
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
    public normals: Vec[],
    public texture?: Texture,
    /** corresponding texture coordinates to the triangle vertexes */
    public uvs?: Point[],
  ) {}

  async load() {
    if (this.texture) {
      await this.texture.load();
    }
  }

  /**
   * Get the Normals of a triangle
   * @param vertices the full vertices list
   * @returns
   */
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

  async load() {
    return Promise.all(this.triangles.map((triangle) => triangle.load()));
  }
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

export class Texture {
  private image: HTMLImageElement = new Image();

  private iw = 0;
  private ih = 0;

  private canvas: HTMLCanvasElement | null = null;
  private pixelData: ImageData | null = null;

  constructor(public url: string) {}

  async load() {
    this.image.src = this.url;

    if (this.image.complete || this.image.onload) return;

    return new Promise<void>((resolve, reject) => {
      this.image.onload = () => {
        try {
          this.iw = this.image.width;
          this.ih = this.image.height;

          this.canvas = document.createElement('canvas');
          this.canvas.width = this.iw;
          this.canvas.height = this.ih;
          const c2d = this.canvas.getContext('2d');
          if (!c2d) {
            throw new Error('Failed to get canvas context');
          }

          c2d.drawImage(this.image, 0, 0, this.iw, this.ih);
          this.pixelData = c2d.getImageData(0, 0, this.iw, this.ih);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
    });
  }

  getTexel(u: number, v: number): Color {
    const iu = floor(u * this.iw);
    const iv = floor(v * this.ih);

    const offset = iv * this.iw * 4 + iu * 4;
    if (!this.pixelData) {
      throw new Error('Texture image not loaded yet');
    }

    return new Color(
      this.pixelData.data[offset + 0],
      this.pixelData.data[offset + 1],
      this.pixelData.data[offset + 2],
    );
  }
}
