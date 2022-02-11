import { Vector } from "../../../common/Vector";

export const drawConnectors = (
  ctx: CanvasRenderingContext2D,
  connectors: Vector[],
  color: string
) => {
  ctx.fillStyle = color;

  connectors.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  });
};
