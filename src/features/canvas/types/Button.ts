import { Vector } from "../../../common/Vector";
import { getDistance } from "../utils";
import { Target } from "./Target";
import { Connector } from "./Connector";

export class Button {
  constructor(
    readonly id: string,
    public position: Vector,
    private readonly type: "single" | "compound",
    private readonly side: "input" | "output" = "output",
    private readonly length: number
  ) {}

  get connectors(): Required<Connector>[] {
    const result: Required<Connector>[] = [];
    const [x, y] = this.position;
    const offset = this.type === "single" ? 28 : 80;

    for (let i = 0; i < this.length; i++) {
      const position: Vector = [x, y + offset + i * 48];
      const type = this.side === "input" ? "output" : "input";
      result.push({ block: this, position, index: i, type });
    }

    return result;
  }

  get height(): number {
    if (this.type === "single") return 48;
    return 56 + length * 48;
  }

  findConnector(
    type: "input" | "output",
    index: number
  ): Required<Connector> | undefined {
    return this.connectors.find((connector) => {
      return connector.type === type && connector.index === index;
    });
  }

  collides(other: Vector): Target | undefined {
    for (let i = 0; i < this.connectors.length; i++) {
      const connector = this.connectors[i];
      if (getDistance(connector.position, other) <= 12) {
        return connector;
      }
    }

    return undefined;
  }
}
