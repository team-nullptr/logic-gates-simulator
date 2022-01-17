import { Block } from "../../../common/Block";
import { getGateBoundary } from "../utils/block";

export const renderGate = (gate: Block, ctx: CanvasRenderingContext2D) => {
  const { area, size } = getGateBoundary(gate);
  const [x, y] = area;
  const [width, height] = size;

  ctx.fillStyle = gate.color;
  ctx.fillRect(x, y, width, height);
};
