import { Vector } from '../../../common/Vector';
import { Area } from '../types/Area';
import { ToolType } from '../tools/ToolFactory';
import { Block } from '../types/Block';
import { Target } from '../types/Target';
import { isConnector } from '../types/Connector';

export const findToolName = (target: Target): ToolType => {
  if (target instanceof Block) return 'move';
  if (isConnector(target)) return 'connect';
  return 'pan';
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
  return position.map((it) => Math.round(it / 24)) as Vector;
};
