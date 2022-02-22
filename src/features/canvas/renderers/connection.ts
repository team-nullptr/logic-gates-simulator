import { curve, route } from '../utils/path';
import { Vector } from '../../../common/Vector';

export const renderConnection = ([start, end]: [Vector, Vector], state: boolean, ctx: CanvasRenderingContext2D) => {
  const path = route(start, end);

  if (state) {
    renderPath(ctx, path, 'rgb(102 1 235)', 2);
    renderPath(ctx, path, 'rgb(102 1 235 / 12%)', 8);
  } else {
    renderPath(ctx, path, '#eee', 2);
  }
};

export const renderPath = (ctx: CanvasRenderingContext2D, path: Vector[], color: string, width: number) => {
  const curved = curve(path);

  const start = path[0];
  const end = path[path.length - 1];

  ctx.strokeStyle = color;
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
