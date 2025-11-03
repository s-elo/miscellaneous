import { Vec, Color, Point, Sphere } from '../utils';

export interface Scene {
  viewportSize: number;
  /** z axis value of the viewport */
  projectionPlanZ: number;
  backgroundColor: Color;
  /** position of the camera */
  camera: Vec;
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

  render(spheres: Sphere[]) {
    // the origin is in the center of the canvas
    for (let x = -this.canvas.width / 2; x < this.canvas.width / 2; x++) {
      for (let y = -this.canvas.height / 2; y < this.canvas.height / 2; y++) {
        const canvasPoint = new Point(x, y);
        const color = this._traceRay(spheres, canvasPoint);
        this._putPixel(canvasPoint, color);
      }
    }

    this.canvasCtx.putImageData(this.cavasBuffer, 0, 0);
  }

  /** trace the ray to find the final color that should be displayed on the canvas */
  protected _traceRay(spheres: Sphere[], canvasPoint: Point) {
    const MIN_PARAM = 1;
    const MAX_PARAM = Infinity;

    let closestT = Infinity;
    let closestSphere: Sphere | null = null;

    for (const sphere of spheres) {
      const intersectParams = this._getIntersectRaySphereParams(
        sphere,
        canvasPoint,
      );

      intersectParams.forEach((t) => {
        if (t > MIN_PARAM && t < MAX_PARAM && t < closestT) {
          closestT = t;
          closestSphere = sphere;
        }
      });
    }

    if (closestSphere === null) {
      return this.scene.backgroundColor;
    }

    return (closestSphere as Sphere).color;
  }

  /**
   * Resolve the equations to get the intersected t params
   * - <P-C, P-C> = r^2
   * - P = O + t<V - O>
   * - where O is the camera, V is the viewport point, C is the sphere center, r is the sphere radius.
   *
   * The bigger t is, the greater distance of the sphere is
   */
  protected _getIntersectRaySphereParams(
    sphere: Sphere,
    canvasPoint: Point,
  ): [number, number] {
    const OC = this.scene.camera.sub(sphere.center);
    const rayDirection = this._canvasToViewport(canvasPoint);

    const a = rayDirection.dot(rayDirection);
    const b = 2 * OC.dot(rayDirection);
    const c = OC.dot(OC) - sphere.radius * sphere.radius;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return [Infinity, Infinity];
    }

    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    return [t1, t2];
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
