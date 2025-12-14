import {
  Color,
  floor,
  interpolate,
  Point,
  putPixel,
  swapPoints,
  Vec,
} from '../utils';
import {
  IdenticalMatrix4x4,
  makeTranslationMatrix,
  Mat4x4,
  multiplyMM4,
  multiplyMV,
  transposed,
  Vertex4,
} from './helpers';
import { Model, Triangle, Instance, Camera } from './entities';

interface Scene {
  viewportSize: number;
  projectionPlanZ: number;
  instances: Instance[];
  camera: Camera;
}

export interface Options {
  canvas: HTMLCanvasElement;
  scene?: Partial<Scene>;
}

const getDefaultScene = () => ({
  viewportSize: 1,
  projectionPlanZ: 1,
  instances: [],
  camera: new Camera(new Vec(0, 0, 0), IdenticalMatrix4x4),
});

export class Rasterizor {
  canvas: HTMLCanvasElement;

  canvasCtx: CanvasRenderingContext2D;

  canvasBuffer: ImageData;

  scene: Scene;

  constructor({ canvas, scene = {} }: Options) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    this.canvas = canvas;
    this.canvasCtx = ctx;
    this.canvasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);

    this.scene = {
      ...getDefaultScene(),
      ...scene,
    };
  }

  /** render one frame */
  render() {
    const { camera, instances } = this.scene;
    // transform based on the camera position and orientation
    const cameraMatrix = multiplyMM4(
      transposed(camera.orientation),
      makeTranslationMatrix(camera.position.mul(-1)),
    );

    instances.forEach((instance) => {
      const transform = multiplyMM4(cameraMatrix, instance.transform);
      this._renderModel(instance.model, transform);
    });

    this._updateScene();
  }

  protected _renderModel(model: Model, transform: Mat4x4) {
    const projectedVertexes = model.vertices.reduce<Point[]>((ret, vertex) => {
      /**
       * transformed to a 4D point in homogenous coordinates
       * the h value is 1 means it is a position point, 0 is a 4D vector
       * */
      const vertexH = new Vertex4(vertex.x, vertex.y, vertex.z, 1);
      // project the vertex to 2D viewport
      ret.push(this._projectVertex(multiplyMV(transform, vertexH)));
      return ret;
    }, []);

    model.triangles.forEach((triangle) =>
      this._renderTriangle(triangle, projectedVertexes),
    );
  }

  /** render a triangle by the projected vertexes */
  protected _renderTriangle(triangle: Triangle, projectedVertexes: Point[]) {
    return this._drawWireframeTriangle(
      projectedVertexes[triangle.v0],
      projectedVertexes[triangle.v1],
      projectedVertexes[triangle.v2],
      triangle.color,
    );
  }

  /**
   * Draw a filled triangle
   * - Imaging the position of the three points is like:
   *
   *       p2
   *
   *           p1
   *
   * p0
   * - The order does not matter since we will sort the points by y values.
   * - The h values come along with x valurs which compute the interpolation based on y values;
   * then compute the interpolation based on xLeft and xRight to get the horizontal segment values.
   */
  protected _drawShadedTriangle(p0: Point, p1: Point, p2: Point, color: Color) {
    // Sort the points so that y0 <= y1 <= y2
    if (p1.y < p0.y) {
      [p0, p1] = swapPoints(p0, p1);
    }
    if (p2.y < p0.y) {
      [p0, p2] = swapPoints(p0, p2);
    }
    if (p2.y < p1.y) {
      [p1, p2] = swapPoints(p1, p2);
    }

    // Compute the x coordinates and H values of the triangle edges
    const x01 = interpolate(p0.reverse(), p1.reverse()); // x values of p0 to p1
    const h01 = interpolate(new Point(p0.y, p0.h), new Point(p1.y, p1.h));
    const x12 = interpolate(p1.reverse(), p2.reverse()); // x values of p1 to p2
    const h12 = interpolate(new Point(p1.y, p1.h), new Point(p2.y, p2.h));
    const x02 = interpolate(p0.reverse(), p2.reverse()); // x values of p0 to p2
    const h02 = interpolate(new Point(p0.y, p0.h), new Point(p2.y, p2.h));

    // Concatenate the short sides
    // the last element of x01 is the same as the first element of x12, so we need to remove it
    const x012 = [...x01.slice(0, -1), ...x12];
    const h012 = [...h01.slice(0, -1), ...h12];

    // Determine which is left and which is right
    // just pick the middle x values to compare
    const m = floor(x012.length / 2);
    let xLeft: number[] = [];
    let xRight: number[] = [];
    let hLeft: number[] = [];
    let hRight: number[] = [];
    if (x02[m] < x012[m]) {
      xLeft = x02;
      xRight = x012;
      hLeft = h02;
      hRight = h012;
    } else {
      xLeft = x012;
      xRight = x02;
      hLeft = h012;
      hRight = h02;
    }

    // Draw the horizontal segments
    for (let y = p0.y; y <= p2.y; y++) {
      const xl = xLeft[floor(y - p0.y)];
      const xr = xRight[floor(y - p0.y)];
      const hl = hLeft[y - p0.y];
      const hr = hRight[y - p0.y];
      const hSegment = interpolate(new Point(xl, hl), new Point(xr, hr));

      for (let x = xl; x <= xr; x++) {
        const h = hSegment[floor(x - xl)];
        putPixel(new Point(x, y), color.mul(h), this.canvas, this.canvasBuffer);
      }
    }
  }

  /** should draw after drawFilledTriangle to cover the edges */
  protected _drawWireframeTriangle(
    p0: Point,
    p1: Point,
    p2: Point,
    color: Color,
  ) {
    this._drawLine(p0, p1, color);
    this._drawLine(p1, p2, color);
    this._drawLine(p2, p0, color);
  }

  protected _drawLine(p0: Point, p1: Point, color: Color) {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // The line is horizontal-ish. Make sure it's left to right.
      if (dx < 0) {
        [p0, p1] = swapPoints(p0, p1);
      }

      const yValues = interpolate(p0, p1);
      for (let x = p0.x; x <= p1.x; x++) {
        const y = yValues[floor(x - p0.x)];
        putPixel(new Point(x, y), color, this.canvas, this.canvasBuffer);
      }
    } else {
      // The line is vertical-ish. Make sure it's bottom to top.
      if (dy < 0) {
        [p0, p1] = swapPoints(p0, p1);
      }

      const xValues = interpolate(p0.reverse(), p1.reverse());
      for (let y = p0.y; y <= p1.y; y++) {
        const x = xValues[floor(y - p0.y)];
        putPixel(new Point(x, y), color, this.canvas, this.canvasBuffer);
      }
    }
  }

  protected _viewportToCanvas(viewportPoint: Point) {
    const { x, y, h } = viewportPoint;
    return new Point(
      x * (this.canvas.width / this.scene.viewportSize),
      y * (this.canvas.height / this.scene.viewportSize),
      h,
    );
  }

  protected _projectVertex(vertex: Vertex4) {
    const { x, y, z } = vertex;
    return this._viewportToCanvas(
      new Point(
        x * (this.scene.projectionPlanZ / z),
        y * (this.scene.projectionPlanZ / z),
      ),
    );
  }

  protected _updateScene() {
    this.canvasCtx.putImageData(this.canvasBuffer, 0, 0);
  }
}
