import { Color, Point, Vec } from '../utils';
import { Model, Texture, Triangle } from './entities';

const RED = new Color(255, 0, 0);
const GREEN = new Color(0, 255, 0);
const BLUE = new Color(0, 0, 255);
const YELLOW = new Color(255, 255, 0);
const PURPLE = new Color(255, 0, 255);
const CYAN = new Color(0, 255, 255);

const woodTexture = new Texture('crate-texture.jpg');

/** A central standard cube */
export const CUBE = new Model(
  [
    new Vec(1, 1, 1),
    new Vec(-1, 1, 1),
    new Vec(-1, -1, 1),
    new Vec(1, -1, 1),
    new Vec(1, 1, -1),
    new Vec(-1, 1, -1),
    new Vec(-1, -1, -1),
    new Vec(1, -1, -1),
  ],
  /**
   * if the vertices of the triangle ABC are in clockwise order
   * when you look at them from the camera, the normal vector will point toward the camera
   * that is, the camera is looking at the front face of the triangle
   */
  [
    new Triangle(
      [0, 1, 2],
      RED,
      [new Vec(0, 0, 1), new Vec(0, 0, 1), new Vec(0, 0, 1)],
      woodTexture,
      [new Point(0, 0), new Point(1, 0), new Point(1, 1)],
    ),
    new Triangle(
      [0, 2, 3],
      RED,
      [new Vec(0, 0, 1), new Vec(0, 0, 1), new Vec(0, 0, 1)],
      woodTexture,
      [new Point(0, 0), new Point(1, 1), new Point(0, 1)],
    ),
    new Triangle(
      [4, 0, 3],
      GREEN,
      [new Vec(1, 0, 0), new Vec(1, 0, 0), new Vec(1, 0, 0)],
      woodTexture,
      [new Point(0, 0), new Point(1, 0), new Point(1, 1)],
    ),
    new Triangle(
      [4, 3, 7],
      GREEN,
      [new Vec(1, 0, 0), new Vec(1, 0, 0), new Vec(1, 0, 0)],
      woodTexture,
      [new Point(0, 0), new Point(1, 1), new Point(0, 1)],
    ),
    new Triangle(
      [5, 4, 7],
      BLUE,
      [new Vec(0, 0, -1), new Vec(0, 0, -1), new Vec(0, 0, -1)],
      woodTexture,
      [new Point(0, 0), new Point(1, 0), new Point(1, 1)],
    ),
    new Triangle(
      [5, 7, 6],
      BLUE,
      [new Vec(0, 0, -1), new Vec(0, 0, -1), new Vec(0, 0, -1)],
      woodTexture,
      [new Point(0, 0), new Point(1, 1), new Point(0, 1)],
    ),
    new Triangle(
      [1, 5, 6],
      YELLOW,
      [new Vec(-1, 0, 0), new Vec(-1, 0, 0), new Vec(-1, 0, 0)],
      woodTexture,
      [new Point(0, 0), new Point(1, 0), new Point(1, 1)],
    ),
    new Triangle(
      [1, 6, 2],
      YELLOW,
      [new Vec(-1, 0, 0), new Vec(-1, 0, 0), new Vec(-1, 0, 0)],
      woodTexture,
      [new Point(0, 0), new Point(1, 1), new Point(0, 1)],
    ),
    new Triangle(
      [1, 0, 5],
      PURPLE,
      [new Vec(0, 1, 0), new Vec(0, 1, 0), new Vec(0, 1, 0)],
      woodTexture,
      [new Point(0, 0), new Point(1, 0), new Point(1, 1)],
    ),
    new Triangle(
      [5, 0, 4],
      PURPLE,
      [new Vec(0, 1, 0), new Vec(0, 1, 0), new Vec(0, 1, 0)],
      woodTexture,
      [new Point(0, 1), new Point(1, 1), new Point(0, 0)],
    ),
    new Triangle(
      [2, 6, 7],
      CYAN,
      [new Vec(0, -1, 0), new Vec(0, -1, 0), new Vec(0, -1, 0)],
      woodTexture,
      [new Point(0, 0), new Point(1, 0), new Point(1, 1)],
    ),
    new Triangle(
      [2, 7, 3],
      CYAN,
      [new Vec(0, -1, 0), new Vec(0, -1, 0), new Vec(0, -1, 0)],
      woodTexture,
      [new Point(0, 0), new Point(1, 1), new Point(0, 1)],
    ),
  ],
  new Vec(0, 0, 0),
  Math.sqrt(3),
);

/**
 * Generates a sphere model with the specified number of divisions and color.
 * @param divs The number of divisions for the sphere. Higher values result in a more detailed sphere.
 * @param color The color of the sphere.
 * @returns A Model object representing the sphere.
 */
export function generateSphereModel(divs: number, color: Color) {
  const vertices: Vec[] = [];
  const triangles: Triangle[] = [];

  const delta_angle = (2.0 * Math.PI) / divs;

  // Generate vertices and normals.
  for (let d = 0; d < divs + 1; d++) {
    const y = (2.0 / divs) * (d - divs / 2);
    const radius = Math.sqrt(1.0 - y * y);
    for (let i = 0; i < divs; i++) {
      const vertex = new Vec(
        radius * Math.cos(i * delta_angle),
        y,
        radius * Math.sin(i * delta_angle),
      );
      vertices.push(vertex);
    }
  }

  // Generate triangles.
  for (let d = 0; d < divs; d++) {
    for (let i = 0; i < divs; i++) {
      const i0 = d * divs + i;
      const i1 = (d + 1) * divs + ((i + 1) % divs);
      const i2 = divs * d + ((i + 1) % divs);
      const tri0 = [i0, i1, i2] as [number, number, number];
      const tri1 = [i0, i0 + divs, i1] as [number, number, number];
      triangles.push(
        new Triangle(tri0, color, [
          vertices[tri0[0]],
          vertices[tri0[1]],
          vertices[tri0[2]],
        ]),
      );
      triangles.push(
        new Triangle(tri1, color, [
          vertices[tri1[0]],
          vertices[tri1[1]],
          vertices[tri1[2]],
        ]),
      );
    }
  }

  return new Model(vertices, triangles, new Vec(0, 0, 0), 1.0);
}

export const SPHERE = generateSphereModel(15, GREEN);
