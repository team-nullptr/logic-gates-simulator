import { Block } from "../../../common/Block";
import { Connection } from "../types/Connection";
import { curve, route } from "../utils/path";
import { Vector } from "../../../common/Vector";

export const renderConnection = (
  { source, receiver }: Connection,
  gates: Map<string, Block>,
  ctx: CanvasRenderingContext2D
) => {
  const input = gates.get(source[0]);
  const output = gates.get(receiver[0]);

  if (!input || !output) return;

  const start = input.findConnector("output", source[1]);
  const end = output.findConnector("input", receiver[1]);

  if (!start || !end) return;

  const path = route(start.position, end.position);
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
