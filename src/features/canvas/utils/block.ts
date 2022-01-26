import { Block } from "../../../common/Block";
import { BoundingBox } from "../types/BoundingBox";
import { Vector } from "../../../common/Vector";
import { getDistance, isOver } from "./index";
import { Port } from "../types/Port";

export const getGateBoundary = (gate: Block): BoundingBox => {
  const { inputs, outputs } = gate;

  const [x, y] = gate.position.map((v) => v * 48);

  const height = Math.max(inputs.length, outputs.length, 1) * 48;

  return {
    area: [x, y, x + 96, y + height],
    size: [96, height],
  };
};

const getConnectorPoints = (
  corner: Vector,
  height: number,
  count: number
): Vector[] => {
  if (count < 1) return [];

  const [x, y] = corner;
  const offset = (height - (count - 1) * 48) / 2;

  const result: Vector[] = [];
  for (let i = 0; i < count; i++) {
    result.push([x, y + offset + i * 48]);
  }

  return result;
};

export const getCollisionEffect = (
  block: Block,
  pointer: Vector
): Port | boolean => {
  const { area, size } = getGateBoundary(block);
  const [x, y, tx] = area;

  const inputs = getConnectorPoints([x, y], size[1], block.inputs.length);
  let collision = inputs.findIndex((input) => getDistance(input, pointer) < 12);
  if (collision !== -1) return { type: "input", index: collision };

  const outputs = getConnectorPoints([tx, y], size[1], block.outputs.length);
  collision = outputs.findIndex((output) => getDistance(output, pointer) < 12);
  if (collision !== -1) return { type: "output", index: collision };

  return isOver(pointer, area);
};
