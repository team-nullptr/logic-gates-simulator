import { Vector } from '../../../common/Vector';
import { getDistance } from '../utils';
import Color from 'color';

export class Connectors {
  constructor(public position: Vector, readonly side: 'input' | 'output', readonly states: boolean[]) {}

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

  render(ctx: CanvasRenderingContext2D, tint: string): void {
    const color = Color(tint);
    const positions = this.items;

    for (let i = 0; i < this.states.length; i++) {
      const [x, y] = positions[i];
      const state = this.states[i];
      ctx.fillStyle = (state ? color : color.lightness(90)).toString();

      ctx.beginPath();
      ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
