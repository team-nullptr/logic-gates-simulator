import { Vector } from "../../../common/Vector";
import { Area } from "./Area";
import { distributePoints, getDistance, isOver } from "../utils";
import { Connector } from "./Connector";

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

  get connectors(): Required<Connector>[] {
    const inputs = this.distributeConnectors("input");
    const outputs = this.distributeConnectors("output");

    return inputs.concat(outputs);
  }

  findConnector(
    type: "input" | "output",
    index: number
  ): Required<Connector> | undefined {
    return this.connectors.find((connector) => {
      return connector.type === type && connector.index === index;
    });
  }

  collides(other: Vector): [boolean, Connector?] {
    const over = isOver(other, this.area);
    const connector = this.connectors.find(
      (it) => getDistance(it.position, other) <= 12
    );

    return [over, connector];
  }

  private distributeConnectors(type: Connector["type"]): Required<Connector>[] {
    const [sx, y, tx] = this.area;

    const h = this.size[1];
    const x = type === "input" ? sx : tx;

    const offset = [x, y];
    const count = type === "input" ? this.inputs.length : this.outputs.length;

    const points = distributePoints(offset as Vector, h, count);
    return points.map((position, i) => ({
      block: this,
      position,
      type,
      index: i,
    }));
  }
}
