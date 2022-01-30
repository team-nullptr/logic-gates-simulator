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

  if (x === tx) {
    const diff = ty > y ? 12 : -12;
    return [x, y + diff];
  } else {
    const diff = tx > x ? 12 : -12;
    return [x + diff, y];
  }
};
