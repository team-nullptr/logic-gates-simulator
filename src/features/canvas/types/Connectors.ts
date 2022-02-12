import { Vector } from "../../../common/Vector";
import { getDistance } from "../utils";

export class Connectors {
  constructor(
    public position: Vector,
    readonly side: "input" | "output",
    readonly states: boolean[]
  ) {}

  get items(): Vector[] {
    const [x, y] = this.position;
    const offset = ((this.states.length - 1) * 48) / 2;
    return this.states.map((_, i) => [x, y + 48 * i - offset]);
  }

  collides(other: Vector): number | undefined {
    for (const [i, item] of this.items.entries()) {
      if (getDistance(item, other) <= 16) return i;
    }
  }

  render(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.fillStyle = color;
    for (const [x, y] of this.items) {
      ctx.beginPath();
      ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
