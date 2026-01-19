import {
  Color,
  edgeInterpolate,
  floor,
  interpolate,
  planeLineIntersectPoint,
  Point,
  putPixel,
  swapPoints,
  transformOriginToTopLeft,
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
import { Model, Triangle, Instance, Camera, ClipPlane } from './entities';
import { Light, LightingModel, LightType } from '../ray-tracing/light';

export enum ShadingModel {
  /** compute lighting for the entire triangle. */
  FLAT,
  /** Gouraud shading: compute lighting at the vertices, and interpolate. */
  GOURAUD,
  /** Phong shading: interpolate normal vectors. */
  PHONG,
}

export interface Scene {
  viewportSize: number;
  projectionPlanZ: number;
  instances: Instance[];
  camera: Camera;
  renderOptions: {
    /** if to render the outlines of triangles */
    renderTriangleOutlines: boolean;
    /** if to do backface culling */
    backfaceCulling: boolean;
    /** if to do depth buffering */
    depthBuffering: boolean;
    /**
     * if to use vertex normals from the model definition,
     * otherwise use face normals computed by triangle.nor
     * */
    useVertexNormals: boolean;
    /** which shading model to use */
    shadingModel: ShadingModel;
    /** include which lighting model, diffuse or specular or both */
    lightingModel: number;
    /** if to use perspective correct depth for texture interpolation */
    usePerspectiveCorrectDepth: boolean;
  };
  lights: Light[];
}

export interface Options {
  canvas: HTMLCanvasElement;
  scene?: Partial<Scene>;
}

export const getDefaultScene = () => ({
  viewportSize: 1,
  projectionPlanZ: 1,
  instances: [],
  camera: new Camera(new Vec(0, 0, 0), IdenticalMatrix4x4),
  renderOptions: {
    depthBuffering: true,
    backfaceCulling: true,
    renderTriangleOutlines: true,
    shadingModel: ShadingModel.GOURAUD,
    useVertexNormals: true,
    lightingModel: LightingModel.LM_DIFFUSE | LightingModel.LM_SPECULAR,
    usePerspectiveCorrectDepth: true,
  },
  lights: [
    new Light(LightType.AMBIENT, 0.2),
    new Light(LightType.DIRECTIONAL, 0.2, new Vec(-1, 0, 1)),
    new Light(LightType.POINT, 0.6, new Vec(-3, 2, -10)),
  ],
});

const initDepthBuffer = (size: number) => Array(size);

export class Rasterizor {
  canvas: HTMLCanvasElement;

  canvasCtx: CanvasRenderingContext2D;

  canvasBuffer: ImageData;

  scene: Scene;

  /** to record the biggest 1/z(smallest z) for each pixel */
  depthBuffer: number[];

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

    this.depthBuffer = initDepthBuffer(canvas.width * canvas.height);
  }

  /** render one frame */
  render() {
    const { camera, instances } = this.scene;
    // transform based on the camera position and orientation
    const cameraMatrix = multiplyMM4(
      transposed(camera.orientation),
      makeTranslationMatrix(camera.position.mul(-1)),
    );

    for (const instance of instances) {
      const transform = multiplyMM4(cameraMatrix, instance.transform);
      const transformedAndClippedModel = this._transformAndClip(
        this.scene.camera.clipPlanes,
        instance,
        transform,
      );

      transformedAndClippedModel &&
        this._renderModel(transformedAndClippedModel, instance);
    }

    this._updateScene();
  }

  reset() {
    this.canvas.width = this.canvas.width;
    this.depthBuffer = initDepthBuffer(this.canvas.width * this.canvas.height);
  }

  /** transform the vertexes of the instance and clip the instance, then return the new model */
  protected _transformAndClip(
    clipPlanes: ClipPlane[],
    instance: Instance,
    transform: Mat4x4,
  ) {
    // Transform the bounding sphere, and attempt early discard
    // if the whole model is behind the camera
    const transformedCenter = multiplyMV(
      transform,
      Vertex4.fromVec3(instance.model.boundsCenter),
    );
    const transformedRadius = instance.model.boundsRadius * instance.scale;
    for (const plane of clipPlanes) {
      // d = <N, P> + D
      const distance =
        plane.normal.dot(transformedCenter.toVec3()) + plane.distance;
      if (distance < -transformedRadius) {
        return null;
      }
    }

    const transformedVertexes = instance.model.vertices.map((vertex) => {
      /**
       * transformed to a 4D point in homogenous coordinates
       * the h value is 1 means it is a position point, 0 is a 4D vector
       * */
      const vertexH = new Vertex4(vertex.x, vertex.y, vertex.z, 1);
      return multiplyMV(transform, vertexH).toVec3();
    });

    //  Clip the entire model against each successive plane.
    let triangles = instance.model.triangles.slice();
    for (const plane of clipPlanes) {
      const newTriangles: Triangle[] = [];
      for (const triangle of triangles) {
        newTriangles.push(
          ...this._clipTriangle(triangle, plane, transformedVertexes),
        );
      }
      triangles = newTriangles;
    }

    return new Model(
      transformedVertexes,
      triangles,
      transformedCenter.toVec3(),
      transformedRadius,
    );
  }

  /* Clips a triangle against a plane. Adds output to triangles and vertices. */
  protected _clipTriangle(
    triangle: Triangle,
    plane: ClipPlane,
    /** the transformed vertices */
    vertices: Vec[],
  ) {
    const triangles: Triangle[] = [];

    const [vi0, vi1, vi2] = triangle.indexes;

    const v0 = vertices[vi0];
    const v1 = vertices[vi1];
    const v2 = vertices[vi2];

    // check if the triangle is in front of the plane
    const inFrontVertexIndexes: number[] = [];
    plane.normal.dot(v0) + plane.distance > 0 && inFrontVertexIndexes.push(vi0);
    plane.normal.dot(v1) + plane.distance > 0 && inFrontVertexIndexes.push(vi1);
    plane.normal.dot(v2) + plane.distance > 0 && inFrontVertexIndexes.push(vi2);
    const inCount = inFrontVertexIndexes.length;
    if (inCount === 0) {
      // Nothing to do - the triangle is fully clipped out.
    } else if (inCount == 3) {
      // The triangle is fully in front of the plane.
      triangles.push(triangle);
    } else if (inCount === 1) {
      console.log('clipping triangle with 1 vertex in front of plane');
      // The triangle has one vertex in. Output is one clipped triangle.
      // let A be the vertex with a positive distance
      // compute B' = Intersection(AB, plane)
      // compute C' = Intersection(AC, plane)
      // return [Triangle(A, B', C')]
      const [A] = inFrontVertexIndexes;
      const [B, C] = triangle.indexes.filter((v) => v !== A);

      const Bv1 = planeLineIntersectPoint(vertices[A], vertices[B], plane);
      const Cv1 = planeLineIntersectPoint(vertices[A], vertices[C], plane);
      vertices.push(Bv1);
      vertices.push(Cv1);

      triangles.push(
        new Triangle(
          [A, vertices.length - 2, vertices.length - 1],
          triangle.color,
          // TODO: skip normals for now
          [],
        ),
      );
    } else if (inCount === 2) {
      console.log('clipping triangle with 2 vertices in front of plane');
      // The triangle has two vertices in. Output is two clipped triangles.
      // let C be the vertex with a negative distance
      // compute A' = Intersection(AC, plane)
      // compute B' = Intersection(BC, plane)
      // return [Triangle(A, B, A'), Triangle(A', B, B')]
      const [A, B] = inFrontVertexIndexes;
      const [C] = triangle.indexes.filter((v) => v !== A && v !== B);

      const Av1 = planeLineIntersectPoint(vertices[A], vertices[C], plane);
      const Bv1 = planeLineIntersectPoint(vertices[B], vertices[C], plane);
      vertices.push(Av1);
      vertices.push(Bv1);

      triangles.push(
        new Triangle([A, B, vertices.length - 2], triangle.color, []),
        new Triangle(
          [vertices.length - 2, B, vertices.length - 1],
          triangle.color,
          // TODO: skip normals for now
          [],
        ),
      );
    }

    return triangles;
  }

  protected _renderModel(model: Model, instance: Instance) {
    const projectedVertexes = model.vertices.reduce<Point[]>((ret, vertex) => {
      // project the vertex to 2D viewport
      ret.push(this._projectVertex(vertex));
      return ret;
    }, []);

    for (const triangle of model.triangles) {
      this._renderTriangle(
        triangle,
        model.vertices,
        projectedVertexes,
        instance.orientation,
      );
    }
  }

  /** render a triangle by the projected vertexes */
  protected _renderTriangle(
    triangle: Triangle,
    vertices: Vec[],
    projectedVertexes: Point[],
    orientation: Mat4x4,
  ) {
    const { renderOptions } = this.scene;

    // Compute triangle normal. Use the unsorted vertices, otherwise the winding of the points may change.
    const normal = triangle.nor(vertices);

    // Backface culling.
    if (renderOptions.backfaceCulling) {
      // Only need to check one vertex since all vertices are in the same plane.
      const vertexToCamera = vertices[triangle.indexes[0]].mul(-1); // Should be Subtract(camera.position, vertices[triangle.indexes[0]])
      // <N, V-C> <=0 means the angle is more than 90 degrees, backface
      if (vertexToCamera.dot(normal) <= 0) {
        return;
      }
    }

    // Sort the points by projected point Y values
    const [si0, si1, si2] = this._getSortedVertexIndexes(
      triangle.indexes,
      projectedVertexes,
    );
    const v0 = vertices[triangle.indexes[si0]];
    const v1 = vertices[triangle.indexes[si1]];
    const v2 = vertices[triangle.indexes[si2]];

    // Get attribute values (X, 1/Z) at the vertices.
    const p0 = projectedVertexes[triangle.indexes[si0]];
    const p1 = projectedVertexes[triangle.indexes[si1]];
    const p2 = projectedVertexes[triangle.indexes[si2]];

    // Compute attribute values at the edges.
    const [x02, x012] = edgeInterpolate(
      new Point(p0.y, p0.x),
      new Point(p1.y, p1.x),
      new Point(p2.y, p2.x),
    );
    const [iz02, iz012] = edgeInterpolate(
      new Point(p0.y, 1.0 / v0.z),
      new Point(p1.y, 1.0 / v1.z),
      new Point(p2.y, 1.0 / v2.z),
    );

    let uz02: number[] = [],
      uz012: number[] = [];
    let vz02: number[] = [],
      vz012: number[] = [];
    if (triangle.texture && triangle.uvs) {
      if (renderOptions.usePerspectiveCorrectDepth) {
        [uz02, uz012] = edgeInterpolate(
          new Point(p0.y, triangle.uvs[si0].x / v0.z),
          new Point(p1.y, triangle.uvs[si1].x / v1.z),
          new Point(p2.y, triangle.uvs[si2].x / v2.z),
        );
        [vz02, vz012] = edgeInterpolate(
          new Point(p0.y, triangle.uvs[si0].y / v0.z),
          new Point(p1.y, triangle.uvs[si1].y / v1.z),
          new Point(p2.y, triangle.uvs[si2].y / v2.z),
        );
      } else {
        [uz02, uz012] = edgeInterpolate(
          new Point(p0.y, triangle.uvs[si0].x),
          new Point(p1.y, triangle.uvs[si1].x),
          new Point(p2.y, triangle.uvs[si2].x),
        );
        [vz02, vz012] = edgeInterpolate(
          new Point(p0.y, triangle.uvs[si0].y),
          new Point(p1.y, triangle.uvs[si1].y),
          new Point(p2.y, triangle.uvs[si2].y),
        );
      }
    }

    let normal0 = normal,
      normal1 = normal,
      normal2 = normal;
    if (this.scene.renderOptions.useVertexNormals) {
      const transform = multiplyMM4(
        transposed(this.scene.camera.orientation),
        orientation,
      );
      normal0 = multiplyMV(
        transform,
        Vertex4.fromVec3(triangle.normals[si0]),
      ).toVec3();
      normal1 = multiplyMV(
        transform,
        Vertex4.fromVec3(triangle.normals[si1]),
      ).toVec3();
      normal2 = multiplyMV(
        transform,
        Vertex4.fromVec3(triangle.normals[si2]),
      ).toVec3();
    }

    let intensity = 0;
    let [i02, i012]: number[][] = [[], []];
    let [nx02, nx012]: number[][] = [[], []];
    let [ny02, ny012]: number[][] = [[], []];
    let [nz02, nz012]: number[][] = [[], []];
    if (renderOptions.shadingModel === ShadingModel.FLAT) {
      const center = new Vec(
        (v0.x + v1.x + v2.x) / 3.0,
        (v0.y + v1.y + v2.y) / 3.0,
        (v0.z + v1.z + v2.z) / 3.0,
      );
      intensity = this._computedIllumination(center, normal0);
    } else if (renderOptions.shadingModel === ShadingModel.GOURAUD) {
      const i0 = this._computedIllumination(v0, normal0);
      const i1 = this._computedIllumination(v1, normal1);
      const i2 = this._computedIllumination(v2, normal2);
      [i02, i012] = edgeInterpolate(
        new Point(p0.y, i0),
        new Point(p1.y, i1),
        new Point(p2.y, i2),
      );
    } else if (renderOptions.shadingModel === ShadingModel.PHONG) {
      [nx02, nx012] = edgeInterpolate(
        new Point(p0.y, normal0.x),
        new Point(p1.y, normal1.x),
        new Point(p2.y, normal2.x),
      );
      [ny02, ny012] = edgeInterpolate(
        new Point(p0.y, normal0.y),
        new Point(p1.y, normal1.y),
        new Point(p2.y, normal2.y),
      );
      [nz02, nz012] = edgeInterpolate(
        new Point(p0.y, normal0.z),
        new Point(p1.y, normal1.z),
        new Point(p2.y, normal2.z),
      );
    }

    // Determine which is left and which is right.
    const m = floor(x02.length / 2);
    let [xLeft, xRight] = [x02, x012];
    let [izLeft, izRight] = [iz02, iz012];

    let [iLeft, iRight] = [i02, i012];

    let [nxLeft, nxRight] = [nx02, nx012];
    let [nyLeft, nyRight] = [ny02, ny012];
    let [nzLeft, nzRight] = [nz02, nz012];

    let [uzLeft, uzRight] = [uz02, uz012];
    let [vzLeft, vzRight] = [vz02, vz012];
    if (x02[m] >= x012[m]) {
      [xLeft, xRight] = [x012, x02];
      [izLeft, izRight] = [iz012, iz02];

      [iLeft, iRight] = [i012, i02];

      [nxLeft, nxRight] = [nx012, nx02];
      [nyLeft, nyRight] = [ny012, ny02];
      [nzLeft, nzRight] = [nz012, nz02];

      [uzLeft, uzRight] = [uz012, uz02];
      [vzLeft, vzRight] = [vz012, vz02];
    }

    // Draw horizontal segments.
    for (let y = p0.y; y <= p2.y; y++) {
      const [xl, xr] = [floor(xLeft[y - p0.y]), floor(xRight[y - p0.y])];

      // Interpolate attributes for this scanline.
      const [zl, zr] = [izLeft[y - p0.y], izRight[y - p0.y]];

      const zscan = interpolate(new Point(xl, zl), new Point(xr, zr));

      let iscan: number[] = [];
      let nxscan: number[] = [];
      let nyscan: number[] = [];
      let nzscan: number[] = [];
      let uzscan: number[] = [];
      let vzscan: number[] = [];
      if (renderOptions.shadingModel === ShadingModel.GOURAUD) {
        const [il, ir] = [iLeft[y - p0.y], iRight[y - p0.y]];
        iscan = interpolate(new Point(xl, il), new Point(xr, ir));
      } else if (renderOptions.shadingModel === ShadingModel.PHONG) {
        const [nxl, nxr] = [nxLeft[y - p0.y], nxRight[y - p0.y]];
        const [nyl, nyr] = [nyLeft[y - p0.y], nyRight[y - p0.y]];
        const [nzl, nzr] = [nzLeft[y - p0.y], nzRight[y - p0.y]];

        nxscan = interpolate(new Point(xl, nxl), new Point(xr, nxr));
        nyscan = interpolate(new Point(xl, nyl), new Point(xr, nyr));
        nzscan = interpolate(new Point(xl, nzl), new Point(xr, nzr));
      }

      if (triangle.texture) {
        uzscan = interpolate(
          new Point(xl, uzLeft[y - p0.y]),
          new Point(xr, uzRight[y - p0.y]),
        );
        vzscan = interpolate(
          new Point(xl, vzLeft[y - p0.y]),
          new Point(xr, vzRight[y - p0.y]),
        );
      }

      for (let x = xl; x <= xr; x++) {
        const invZ = zscan[x - xl];

        if (
          !renderOptions.depthBuffering ||
          this._updateDepthBufferIfCloser(new Point(x, y), invZ)
        ) {
          if (renderOptions.shadingModel === ShadingModel.FLAT) {
            // Just use the per-triangle intensity.
          } else if (renderOptions.shadingModel === ShadingModel.GOURAUD) {
            intensity = iscan[x - xl];
          } else if (renderOptions.shadingModel === ShadingModel.PHONG) {
            const vertex = this._unProjectVertex(new Point(x, y), invZ);
            const normal = new Vec(
              nxscan[x - xl],
              nyscan[x - xl],
              nzscan[x - xl],
            );
            intensity = this._computedIllumination(vertex, normal);
          }

          let color: Color;
          if (triangle.texture) {
            let u: number, v: number;
            if (renderOptions.usePerspectiveCorrectDepth) {
              u = uzscan[x - xl] / zscan[x - xl];
              v = vzscan[x - xl] / zscan[x - xl];
            } else {
              u = uzscan[x - xl];
              v = vzscan[x - xl];
            }
            color = triangle.texture.getTexel(u, v);
          } else {
            color = triangle.color;
          }

          this._putPixel(new Point(x, y), color.mul(intensity));
        }
      }
    }

    // draw triangle outlines
    if (this.scene.renderOptions.renderTriangleOutlines) {
      const outlineColor = triangle.color.mul(0.75);
      this._drawLine(p0, p1, outlineColor);
      this._drawLine(p0, p2, outlineColor);
      this._drawLine(p2, p1, outlineColor);
    }
  }

  protected _computedIllumination(v0: Vec, normal: Vec) {
    // console.time('ComputeIllumination');
    console.time('computing illumination');
    const illumination = this.scene.lights.reduce((illumination, light) => {
      illumination += light.computeIllumination(
        v0,
        normal,
        this.scene.camera,
        this.scene.renderOptions.lightingModel,
      );
      return illumination;
    }, 0);
    console.timeEnd('computing illumination');
    return illumination;
    // let illumination = 0;
    // for (let l = 0; l < this.scene.lights.length; l++) {
    //   let light = this.scene.lights[l];
    //   if (light.type == LightType.AMBIENT) {
    //     illumination += light.intensity;
    //     continue;
    //   }

    //   let vl;
    //   if (light.type == LightType.DIRECTIONAL) {
    //     console.time('transposed');
    //     let cameraMatrix = transposed(this.scene.camera.orientation);
    //     console.timeEnd('transposed');
    //     // let rotated_light = multiplyMV(
    //     //   cameraMatrix,
    //     //   // IdenticalMatrix4x4,
    //     //   Vertex4.fromVec3(light.positionOrDirection),
    //     // );
    //     // vl = rotated_light.toVec3();
    //   } else if (light.type == LightType.POINT) {
    //     // let cameraMatrix = multiplyMM4(
    //     //   transposed(this.scene.camera.orientation),
    //     //   makeTranslationMatrix(this.scene.camera.position.mul(-1)),
    //     // );
    //     // let transformed_light = multiplyMV(
    //     //   cameraMatrix,
    //     //   Vertex4.fromVec3(light.positionOrDirection),
    //     // );
    //     // vl = v0.mul(-1).add(transformed_light.toVec3());
    //   }

    // const lightingModel = this.scene.renderOptions.lightingModel;
    // // Diffuse component.
    // if (lightingModel & LightingModel.LM_DIFFUSE) {
    //   let cos_alpha = vl.dot(normal) / (vl.length() * normal.length());
    //   if (cos_alpha > 0) {
    //     illumination += cos_alpha * light.intensity;
    //   }
    // }

    // // Specular component.
    // if (lightingModel & LightingModel.LM_SPECULAR) {
    //   let reflected = normal.mul(2 * normal.dot(vl)).sub(vl);
    //   let view = this.scene.camera.position.sub(v0);

    //   let cos_beta =
    //     reflected.dot(view) / (reflected.length() * view.length());
    //   if (cos_beta > 0) {
    //     let specular = 50;
    //     illumination += Math.pow(cos_beta, specular) * light.intensity;
    //   }
    // }
    // }
    // console.timeEnd('ComputeIllumination');
    // return illumination;
  }

  protected _updateDepthBufferIfCloser(point: Point, iz: number) {
    const { x, y } = transformOriginToTopLeft(point, this.canvas);

    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
      return false;
    }

    const pos = x + this.canvas.width * y;
    if (this.depthBuffer[pos] == undefined || this.depthBuffer[pos] < iz) {
      this.depthBuffer[pos] = iz;
      return true;
    }

    return false;
  }

  // Sort the points from bottom to top.
  // Technically, sort the indexes to the vertex indexes in the triangle from bottom to top.
  protected _getSortedVertexIndexes(
    vertexIndexes: number[],
    projected: Point[],
  ) {
    const indexes = [0, 1, 2];

    if (
      projected[vertexIndexes[indexes[1]]].y <
      projected[vertexIndexes[indexes[0]]].y
    ) {
      const swap = indexes[0];
      indexes[0] = indexes[1];
      indexes[1] = swap;
    }
    if (
      projected[vertexIndexes[indexes[2]]].y <
      projected[vertexIndexes[indexes[0]]].y
    ) {
      const swap = indexes[0];
      indexes[0] = indexes[2];
      indexes[2] = swap;
    }
    if (
      projected[vertexIndexes[indexes[2]]].y <
      projected[vertexIndexes[indexes[1]]].y
    ) {
      const swap = indexes[1];
      indexes[1] = indexes[2];
      indexes[2] = swap;
    }

    return indexes;
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
        this._putPixel(new Point(x, y), color.mul(h));
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
        this._putPixel(new Point(x, y), color);
      }
    } else {
      // The line is vertical-ish. Make sure it's bottom to top.
      if (dy < 0) {
        [p0, p1] = swapPoints(p0, p1);
      }

      const xValues = interpolate(p0.reverse(), p1.reverse());
      for (let y = p0.y; y <= p1.y; y++) {
        const x = xValues[floor(y - p0.y)];
        this._putPixel(new Point(x, y), color);
      }
    }
  }

  protected _viewportToCanvas(viewportPoint: Point) {
    const { x, y, h } = viewportPoint;
    // need to floor to avoid index overflow when interpolating
    return new Point(
      floor(x * (this.canvas.width / this.scene.viewportSize)),
      floor(y * (this.canvas.height / this.scene.viewportSize)),
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

  /** Convert viewport coordinates back to 3D coordinates */
  protected _unProjectVertex({ x, y }: Point, invZ: number) {
    const oz = 1.0 / invZ;
    const ux = (x * oz) / this.scene.projectionPlanZ;
    const uy = (y * oz) / this.scene.projectionPlanZ;
    const p2d = this._canvasToViewport(new Point(ux, uy));
    return new Vec(p2d.x, p2d.y, oz);
  }

  /**
   * Convert canvas coordinates to viewport coordinates.
   * Vx=Cx⋅Vw/Cw
   * Vy=Cy⋅Vh/Ch
   */
  protected _canvasToViewport({ x, y }: Point) {
    return new Vec(
      x * (this.scene.viewportSize / this.canvas.width),
      y * (this.scene.viewportSize / this.canvas.height),
      this.scene.projectionPlanZ,
    );
  }

  protected _putPixel(point: Point, color: Color) {
    putPixel(point, color, this.canvas, this.canvasBuffer);
  }

  protected _updateScene() {
    this.canvasCtx.putImageData(this.canvasBuffer, 0, 0);
  }
}
