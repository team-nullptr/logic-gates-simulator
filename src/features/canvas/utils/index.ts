import { Vector } from "../../../common/Vector";
import { Area } from "../types/Area";

export const isOver = (point: Vector, area: Area): boolean => {
  const [x, y, tx, ty] = area;
  const [px, py] = point;
  return x <= px && px <= tx && y <= py && py <= ty;
};

export const getDistance = (a: Vector, b: Vector): number => {
  const [ax, ay] = a;
  const [bx, by] = b;

  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
};

export const distributePoints = (
  offset: Vector,
  height: number,
  count: number
): Vector[] => {
  const [x, y] = offset;
  const shift = (height - (count - 1) * 48) / 2;

  const result: Vector[] = [];
  for (let i = 0; i < count; i++) {
    result.push([x, y + shift + i * 48]);
  }

  return result;
};
