import { Vector } from "./Vector";
import { Area } from "../features/canvas/types/Area";
import {
  distributePoints,
  getDistance,
  isOver,
} from "../features/canvas/utils";
import { Connector } from "../features/canvas/types/Connector";

export class Block {
  constructor(
    readonly id: string,
    public text: string,
    public color: string,
    public position: Vector,
    readonly inputs: boolean[],
    readonly outputs: boolean[]
  ) {}

  get size(): Vector {
    const height = Math.max(this.inputs.length, this.outputs.length, 1) * 48;
    return [96, height];
  }

  get area(): Area {
    const [x, y] = this.position.map((v) => v * 48);
    const [w, h] = this.size;

    return [x, y, x + w, y + h];
  }

  get connectors(): Connector[] {
    const [x, y, tx] = this.area;
    const h = this.size[1];

    const inputs: Connector[] = distributePoints(
      [x, y],
      h,
      this.inputs.length
    ).map((position, index) => ({
      position,
      index,
      type: "input",
    }));

    const outputs: Connector[] = distributePoints(
      [tx, y],
      h,
      this.outputs.length
    ).map((position, index) => ({
      position,
      index,
      type: "output",
    }));

    return [...inputs, ...outputs];
  }

  collides(other: Vector): [boolean, Connector?] {
    const over = isOver(other, this.area);
    const connector = this.connectors.find(
      (it) => getDistance(it.position, other) <= 12
    );

    return [over, connector];
  }
}
