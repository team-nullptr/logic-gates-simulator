import { Block } from '../types/Block';
import { Area } from '../types/Area';

export const renderGate = (block: Block, ctx: CanvasRenderingContext2D) => {
  const { area } = block;

  drawRoundedRect(ctx, area, 8);
  drawText(ctx, block);
  drawUnderline(ctx, block);
};

const drawText = (ctx: CanvasRenderingContext2D, block: Block) => {
  const { text, area } = block;
  const [x, y, tx, ty] = area;

  const centerX = (x + tx) / 2;
  const centerY = (y + ty) / 2;

  ctx.fillStyle = '#000';
  ctx.font = "700 14px 'Ubuntu', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), centerX, centerY);
};

const drawUnderline = (ctx: CanvasRenderingContext2D, block: Block) => {
  const { area, color } = block;
  const [x, y, tx, ty] = area;

  const centerX = (x + tx) / 2 - 12;
  const centerY = (y + ty) / 2;

  ctx.fillStyle = color;
  ctx.fillRect(centerX, centerY + 12, 24, 3);
};

const drawRoundedRect = (ctx: CanvasRenderingContext2D, area: Area, r: number) => {
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

  ctx.fillStyle = '#fff';
  ctx.fill();
};
