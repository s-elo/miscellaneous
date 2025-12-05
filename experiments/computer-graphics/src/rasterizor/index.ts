import { Color, interpolate, Point, putPixel, swapPoints, Vec } from '../utils';

interface Scene {
  viewportSize: number;
  projectionPlanZ: number;
}

export interface Options {
  canvas: HTMLCanvasElement;
  scene?: Partial<Scene>;
}

const getDefaultSecene = () => ({
  viewportSize: 1,
  projectionPlanZ: 1,
});

export class Rasterizor {
  canvas: HTMLCanvasElement;

  canvasCtx: CanvasRenderingContext2D;

  cavasBuffer: ImageData;

  scene: Scene;

  constructor({ canvas, scene = {} }: Options) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    this.canvas = canvas;
    this.canvasCtx = ctx;
    this.cavasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);

    this.scene = {
      ...getDefaultSecene(),
      ...scene,
    };
  }

  render() {
    this.canvasCtx.putImageData(this.cavasBuffer, 0, 0);
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
  drawShadedTriangle(p0: Point, p1: Point, p2: Point, color: Color) {
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
    const m = Math.floor(x012.length / 2);
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
      const xl = xLeft[Math.floor(y - p0.y)];
      const xr = xRight[Math.floor(y - p0.y)];
      const hl = hLeft[y - p0.y];
      const hr = hRight[y - p0.y];
      const hSegment = interpolate(new Point(xl, hl), new Point(xr, hr));

      for (let x = xl; x <= xr; x++) {
        const h = hSegment[Math.floor(x - xl)];
        putPixel(new Point(x, y), color.mul(h), this.canvas, this.cavasBuffer);
      }
    }
  }

  /** should draw after drawFilledTriangle to cover the edges */
  drawWireframeTriangle(p0: Point, p1: Point, p2: Point, color: Color) {
    this.drawLine(p0, p1, color);
    this.drawLine(p1, p2, color);
    this.drawLine(p2, p0, color);
  }

  drawLine(p0: Point, p1: Point, color: Color) {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // The line is horizontal-ish. Make sure it's left to right.
      if (dx < 0) {
        [p0, p1] = swapPoints(p0, p1);
      }

      const yValues = interpolate(p0, p1);
      for (let x = p0.x; x <= p1.x; x++) {
        const y = yValues[Math.floor(x - p0.x)];
        putPixel(new Point(x, y), color, this.canvas, this.cavasBuffer);
      }
    } else {
      // The line is verical-ish. Make sure it's bottom to top.
      if (dy < 0) {
        [p0, p1] = swapPoints(p0, p1);
      }

      const xValues = interpolate(p0.reverse(), p1.reverse());
      for (let y = p0.y; y <= p1.y; y++) {
        const x = xValues[Math.floor(y - p0.y)];
        putPixel(new Point(x, y), color, this.canvas, this.cavasBuffer);
      }
    }
  }

  drawProjectedSquare() {
    // The four "front" vertices
    const vAf = new Vec(-2, -0.5, 5);
    const vBf = new Vec(-2, 0.5, 5);
    const vCf = new Vec(-1, 0.5, 5);
    const vDf = new Vec(-1, -0.5, 5);

    // The four "back" vertices
    const vAb = new Vec(-2, -0.5, 6);
    const vBb = new Vec(-2, 0.5, 6);
    const vCb = new Vec(-1, 0.5, 6);
    const vDb = new Vec(-1, -0.5, 6);

    // The front face
    this.drawLine(
      this._projectVertex(vAf),
      this._projectVertex(vBf),
      new Color(0, 0, 255),
    );
    this.drawLine(
      this._projectVertex(vBf),
      this._projectVertex(vCf),
      new Color(0, 0, 255),
    );
    this.drawLine(
      this._projectVertex(vCf),
      this._projectVertex(vDf),
      new Color(0, 0, 255),
    );
    this.drawLine(
      this._projectVertex(vDf),
      this._projectVertex(vAf),
      new Color(0, 0, 255),
    );

    // The back face
    this.drawLine(
      this._projectVertex(vAb),
      this._projectVertex(vBb),
      new Color(255, 0, 0),
    );
    this.drawLine(
      this._projectVertex(vBb),
      this._projectVertex(vCb),
      new Color(255, 0, 0),
    );
    this.drawLine(
      this._projectVertex(vCb),
      this._projectVertex(vDb),
      new Color(255, 0, 0),
    );
    this.drawLine(
      this._projectVertex(vDb),
      this._projectVertex(vAb),
      new Color(255, 0, 0),
    );

    // The front-to-back edges
    this.drawLine(
      this._projectVertex(vAf),
      this._projectVertex(vAb),
      new Color(0, 255, 0),
    );
    this.drawLine(
      this._projectVertex(vBf),
      this._projectVertex(vBb),
      new Color(0, 255, 0),
    );
    this.drawLine(
      this._projectVertex(vCf),
      this._projectVertex(vCb),
      new Color(0, 255, 0),
    );
    this.drawLine(
      this._projectVertex(vDf),
      this._projectVertex(vDb),
      new Color(0, 255, 0),
    );

    this.render();
  }

  protected _viewportToCanvas(viewportPoint: Point) {
    const { x, y, h } = viewportPoint;
    return new Point(
      x * (this.canvas.width / this.scene.viewportSize),
      y * (this.canvas.height / this.scene.viewportSize),
      h,
    );
  }

  protected _projectVertex(vertex: Vec) {
    const { x, y, z } = vertex;
    return this._viewportToCanvas(
      new Point(
        x * (this.scene.projectionPlanZ / z),
        y * (this.scene.projectionPlanZ / z),
      ),
    );
  }
}
