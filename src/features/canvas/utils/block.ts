import { Block } from "../../../common/Block";
import { BoundingBox } from "../types/BoundingBox";

export const getGateBoundary = (gate: Block): BoundingBox => {
  const { inputs, outputs } = gate;

  const [x, y] = gate.position.map((v) => v * 48);

  const height = Math.max(inputs.length, outputs.length, 1) * 48;

  return {
    area: [x, y, x + 96, y + height],
    size: [96, height],
  };
};
