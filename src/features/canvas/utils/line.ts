import { Vector } from "../../../common/Vector";

export const belongs = (point: Vector, p: Vector, q: Vector) => {
  const [x, y] = point;
  const [px, py] = p;
  const [qx, qy] = q;

  if (px === qx && x === px) return true;
  return py === qy && y === py;
};

export const towards = (from: Vector, to: Vector): Vector => {
  const [x, y] = from;
  const [tx, ty] = to;

  const vertical = x === tx;

  if (vertical) {
    const position = calculatePointPosition(y, ty);
    return [x, position];
  }

  const position = calculatePointPosition(x, tx);
  return [position, y];
};

const calculatePointPosition = (from: number, to: number): number => {
  const center = (from + to) / 2;
  if (from < to) return Math.min(from + 12, center);
  return Math.max(from - 12, center);
};
