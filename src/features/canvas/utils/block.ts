import { Gate } from "../types/Gate";
import { BoundingBox } from "../types/BoundingBox";

export const getGateBoundary = (gate: Gate): BoundingBox => {
  const { special, inputs, outputs } = gate;

  const [x, y] = gate.position.map((v) => v * 48);

  const width = special ? 48 : 96;
  const height = Math.max(inputs.length, outputs.length, 2) * 24;

  return {
    area: [x, y, x + width, y + height],
    size: [width, height],
  };
};
