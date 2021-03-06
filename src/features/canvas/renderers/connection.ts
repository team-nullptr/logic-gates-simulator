import { curve, route } from '../utils/path';
import { Vector } from '../../../common/Vector';
import Color from 'color';

export const renderConnection = (
  [start, end]: [Vector, Vector],
  state: boolean,
  ctx: CanvasRenderingContext2D,
  grayed = false
) => {
  const path = route(start, end);

  if (state) {
    renderPath(ctx, path, 'rgb(102 1 235)', grayed, 2);
    renderPath(ctx, path, 'rgb(102 1 235 / 12%)', grayed, 8);
  } else {
    renderPath(ctx, path, '#ddd', grayed, 2);
  }
};

export const renderPath = (
  ctx: CanvasRenderingContext2D,
  path: Vector[],
  color: string,
  grayed: boolean,
  width: number
) => {
  const curved = curve(path);

  const start = path[0];
  const end = path[path.length - 1];

  ctx.strokeStyle = grayed ? Color(color).lightness(95).toString() : color;
  ctx.lineWidth = width;

  ctx.beginPath();
  ctx.moveTo(...start);

  for (const curve of curved) {
    ctx.lineTo(...curve[0]);
    ctx.quadraticCurveTo(...curve[1], ...curve[2]);
  }

  ctx.lineTo(...end);
  ctx.stroke();
};

const inRange = (value: number, a: number, b: number) => a <= value && value <= b;

export const collides = (start: Vector, end: Vector, other: Vector): boolean => {
  const path = route(start, end);
  const [x, y] = other;

  for (let i = 1; i < path.length; i++) {
    const [cx, cy] = path[i];
    const [px, py] = path[i - 1];
    const vertical = cx === px;

    if (vertical) {
      if (!inRange(x, cx - 8, cx + 8)) continue;
      if (cy > py) {
        if (inRange(y, py, cy)) return true;
      } else {
        if (inRange(y, cy, py)) return true;
      }
    } else {
      if (!inRange(y, cy - 8, cy + 8)) continue;
      if (cx > px) {
        if (inRange(x, px, cx)) return true;
      } else {
        if (inRange(x, cx, px)) return true;
      }
    }
  }

  return false;
};
