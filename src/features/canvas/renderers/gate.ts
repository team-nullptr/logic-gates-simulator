import { Gate } from "../../../common/Gate";
import { getGateBoundary } from "../utils/block";

export const renderGate = (gate: Gate, ctx: CanvasRenderingContext2D) => {
  const { area, size } = getGateBoundary(gate);
  const [x, y] = area;
  const [width, height] = size;

  ctx.fillStyle = gate.color;
  ctx.fillRect(x, y, width, height);
};
