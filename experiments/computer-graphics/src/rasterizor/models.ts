import { Color, Vec } from '../utils';
import { Model, Triangle } from './entities';

const RED = new Color(255, 0, 0);
const GREEN = new Color(0, 255, 0);
const BLUE = new Color(0, 0, 255);
const YELLOW = new Color(255, 255, 0);
const PURPLE = new Color(255, 0, 255);
const CYAN = new Color(0, 255, 255);

/** A central standard cube */
export const CUBE = new Model(
  [
    new Vec(1, 1, 1), // 0
    new Vec(-1, 1, 1), // 1
    new Vec(-1, -1, 1), // 2
    new Vec(1, -1, 1), // 3
    new Vec(1, 1, -1), // 4
    new Vec(-1, 1, -1), // 5
    new Vec(-1, -1, -1), // 6
    new Vec(1, -1, -1), // 7
  ],
  [
    new Triangle(0, 1, 2, RED),
    new Triangle(0, 2, 3, RED),
    new Triangle(4, 0, 3, GREEN),
    new Triangle(4, 3, 7, GREEN),
    new Triangle(5, 4, 7, BLUE),
    new Triangle(5, 7, 6, BLUE),
    new Triangle(1, 5, 6, YELLOW),
    new Triangle(1, 6, 2, YELLOW),
    new Triangle(4, 5, 1, PURPLE),
    new Triangle(4, 1, 0, PURPLE),
    new Triangle(2, 6, 7, CYAN),
    new Triangle(2, 7, 3, CYAN),
  ],
);
