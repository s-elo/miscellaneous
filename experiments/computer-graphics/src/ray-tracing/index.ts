import { EPSILON } from '../constants';
import {
  Vec,
  Color,
  Point,
  Sphere,
  getClosestIntersectedParams,
  getReflectionDirection,
} from '../utils';
import { LightType, Light } from './light';

export interface Scene {
  /** the greater the viewport size is, the bigger the image is and the further the objects are  */
  viewportSize: number;
  /** z axis value of the viewport */
  projectionPlanZ: number;
  backgroundColor: Color;
  /** position of the camera */
  camera: Vec;
  lights: Light[];
  spheres: Sphere[];
}

export interface Options {
  canvas: HTMLCanvasElement;
  scene?: Partial<Scene>;
}

export class RayTracer {
  canvas: HTMLCanvasElement;

  canvasCtx: CanvasRenderingContext2D;

  cavasBuffer: ImageData;

  scene: Scene = {
    viewportSize: 1,
    projectionPlanZ: 1,
    backgroundColor: new Color(255, 255, 255),
    camera: new Vec(0, 0, 0),
    spheres: [],
    lights: [
      new Light(LightType.AMBIENT, 0.2),
      new Light(LightType.POINT, 0.6, new Vec(2, 1, 0)),
      new Light(LightType.DIRECTIONAL, 0.2, new Vec(1, 4, 4)),
    ],
  };

  constructor({ canvas, scene = {} }: Options) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    this.canvas = canvas;
    this.canvasCtx = ctx;
    this.cavasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.scene = {
      ...this.scene,
      ...scene,
    };
  }

  render(reflectiveDepth = 3) {
    // the origin is in the center of the canvas
    for (let x = -this.canvas.width / 2; x < this.canvas.width / 2; x++) {
      for (let y = -this.canvas.height / 2; y < this.canvas.height / 2; y++) {
        const canvasPoint = new Point(x, y);
        const rayDirection = this._canvasToViewport(canvasPoint);

        const color = this._traceRay(
          this.scene.camera,
          rayDirection,
          // object behind the projection plane are not visible
          this.scene.projectionPlanZ,
          Infinity,
          reflectiveDepth,
        );
        this._putPixel(canvasPoint, color);
      }
    }

    this.canvasCtx.putImageData(this.cavasBuffer, 0, 0);
  }

  /** trace the ray to find the final color that should be displayed on the canvas */
  protected _traceRay(
    origin: Vec,
    rayDirection: Vec,
    tMin: number,
    tMax: number,
    recursionDepth = 0,
  ): Color {
    const spheres = this.scene.spheres;

    const { closestT, closestSphere } = getClosestIntersectedParams(
      origin,
      rayDirection,
      spheres,
      tMin,
      tMax,
    );
    if (closestSphere === null) {
      return this.scene.backgroundColor;
    }

    const intersectPoint = origin.add(rayDirection.mul(closestT));
    const surfaceNormal = intersectPoint.sub(closestSphere.center).nor();

    const lightIntensity = this.scene.lights.reduce((acc, light) => {
      return (
        acc +
        light.getIntensityAtPoint(
          intersectPoint,
          surfaceNormal,
          rayDirection.mul(-1),
          spheres,
          closestSphere.specular,
        )
      );
    }, 0);

    const localColor = closestSphere.color.mul(lightIntensity);

    // no reflection
    const shpereReflective = closestSphere.reflective;
    if (recursionDepth <= 0 || shpereReflective <= 0) {
      return localColor;
    }

    const reflectionDirection = getReflectionDirection(
      rayDirection.mul(-1),
      surfaceNormal,
    );
    const reflectionColor = this._traceRay(
      intersectPoint,
      reflectionDirection,
      EPSILON,
      Infinity,
      recursionDepth - 1,
    );

    const localProportion = localColor.mul(1 - shpereReflective);
    const reflectionProportion = reflectionColor.mul(shpereReflective);
    return localProportion.add(reflectionProportion);
  }

  /**
   * Convert canvas coordinates to viewport coordinates.
   * Vx=Cx⋅Vw/Cw
   * Vy=Cy⋅Vh/Ch
   */
  protected _canvasToViewport({ x, y }: Point) {
    return new Vec(
      x * (this.scene.viewportSize / this.canvasCtx.canvas.width),
      y * (this.scene.viewportSize / this.canvasCtx.canvas.height),
      this.scene.projectionPlanZ,
    );
  }

  protected _putPixel(point: Point, color: Color) {
    const { x, y } = this._transformOriginToTopLeft(point);

    if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
      throw new Error('Pixel out of bounds');
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
    let offset = 4 * (x + this.cavasBuffer.width * y);
    this.cavasBuffer.data[offset++] = color.r;
    this.cavasBuffer.data[offset++] = color.g;
    this.cavasBuffer.data[offset++] = color.b;
    this.cavasBuffer.data[offset++] = 255; // Alpha = 255 (full opacity)
  }

  /**
   * transform the origin from center to top-left
   * Sx=Cw/2+Cx
   * Sy=Ch/2−Cy
   */
  protected _transformOriginToTopLeft({ x, y }: Point) {
    return new Point(this.canvas.width / 2 + x, this.canvas.height / 2 - y);
  }
}
