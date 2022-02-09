import { curve, route } from "../utils/path";
import { Vector } from "../../../common/Vector";
import { Connector } from "../types/Connector";

export const renderConnection = (
  [start, end]: [Required<Connector>, Required<Connector> | Vector],
  ctx: CanvasRenderingContext2D
) => {
  const path = route(start.position, Array.isArray(end) ? end : end.position);
  renderPath(ctx, path);
};

export const renderPath = (ctx: CanvasRenderingContext2D, path: Vector[]) => {
  const curved = curve(path);

  const start = path[0];
  const end = path[path.length - 1];

  ctx.strokeStyle = "#323232";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(...start);

  for (const curve of curved) {
    ctx.lineTo(...curve[0]);
    ctx.quadraticCurveTo(...curve[1], ...curve[2]);
  }

  ctx.lineTo(...end);
  ctx.stroke();
};
