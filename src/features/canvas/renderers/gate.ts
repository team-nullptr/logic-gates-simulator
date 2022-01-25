import { Block } from "../../../common/Block";
import { getGateBoundary } from "../utils/block";
import { Area } from "../types/Area";
import { Vector } from "../../../common/Vector";

export const renderGate = (gate: Block, ctx: CanvasRenderingContext2D) => {
  const { area, size } = getGateBoundary(gate);

  drawRoundedRect(ctx, area, 5);
  drawText(ctx, gate.text, area);
  drawUnderline(ctx, gate.color, area);

  drawConnectors(ctx, gate.color, [area[0], area[1]], size[1], gate.inputs);
  drawConnectors(ctx, gate.color, [area[2], area[1]], size[1], gate.outputs);
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  area: Area,
  r: number
) => {
  const [x, y, tx, ty] = area;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(tx - r, y);
  ctx.quadraticCurveTo(tx, y, tx, y + r);
  ctx.lineTo(tx, ty - r);
  ctx.quadraticCurveTo(tx, ty, tx - r, ty);
  ctx.lineTo(x + r, ty);
  ctx.quadraticCurveTo(x, ty, x, ty - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);

  ctx.fillStyle = "#1C1B20";
  ctx.fill();
};

const drawText = (ctx: CanvasRenderingContext2D, text: string, area: Area) => {
  const [x, y, tx, ty] = area;
  const centerX = (x + tx) / 2;
  const centerY = (y + ty) / 2;

  ctx.fillStyle = "#ddd";
  ctx.font = "700 14px 'Ubuntu', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, centerX, centerY);
};

const drawUnderline = (
  ctx: CanvasRenderingContext2D,
  color: string,
  area: Area
) => {
  const [x, y, tx, ty] = area;
  const centerX = (x + tx) / 2 - 12;
  const centerY = (y + ty) / 2;

  ctx.fillStyle = color;
  ctx.fillRect(centerX, centerY + 12, 24, 3);
};

const drawConnectors = (
  ctx: CanvasRenderingContext2D,
  color: string,
  corner: Vector,
  height: number,
  inputs: boolean[]
) => {
  if (inputs.length < 1) return;

  const [x, y] = corner;
  const offset = (height - (inputs.length - 1) * 48) / 2;

  ctx.fillStyle = color;

  inputs.forEach((input, i) => {
    ctx.beginPath();
    ctx.ellipse(x, y + i * 48 + offset, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  });
};
