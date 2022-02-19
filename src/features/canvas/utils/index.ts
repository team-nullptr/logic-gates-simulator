import { Vector } from "../../../common/Vector";
import { Area } from "../types/Area";
import { ToolType } from "../tools/ToolFactory";
import { Block } from "../types/Block";
import { Target } from "../types/Target";

export const findToolName = (target: Target): ToolType => {
  if (target === undefined) return "pan";
  if (target instanceof Block) return "move";
  return "connect";
};

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

export const snapToGrid = (position: Vector): Vector => {
  return position.map((it) => Math.round(it / 48)) as Vector;
};
