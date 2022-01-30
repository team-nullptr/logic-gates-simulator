import { Vector } from "../../../common/Vector";
import { belongs, towards } from "./line";

export const route = (start: Vector, end: Vector): Vector[] => {
  const [x, y] = start;
  const [tx, ty] = end;

  const length = Math.max((tx - x) / 2, 24);
  const height = (ty - y) / 2;

  const points: Vector[] = [];

  points.push([x, y]);
  points.push([x + length, y]);
  points.push([x + length, y + height]);
  points.push([tx - length, ty - height]);
  points.push([tx - length, ty]);
  points.push([tx, ty]);

  return cleanup(points);
};

export const cleanup = (path: Vector[]): Vector[] => {
  const result: Vector[] = [];
  result.push(path[0]);

  for (let i = 1; i < path.length - 1; i++) {
    if (!belongs(path[i], path[i - 1], path[i + 1])) {
      result.push(path[i]);
    }
  }

  result.push(path[path.length - 1]);
  return result;
};

export type Curve = [Vector, Vector, Vector];

export const curve = (path: Vector[]): Curve[] => {
  const result: Curve[] = [];

  for (let i = 1; i < path.length - 1; i++) {
    const curve: Vector[] = [
      towards(path[i], path[i - 1]),
      path[i],
      towards(path[i], path[i + 1]),
    ];

    result.push(curve as Curve);
  }

  return result;
};
