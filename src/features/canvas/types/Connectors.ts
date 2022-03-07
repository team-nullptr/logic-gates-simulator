import { Vector } from '../../../common/Vector';
import { getDistance } from '../utils';
import Color from 'color';
import { Block } from './Block';
import { Button } from './Button';

export class Connectors {
  constructor(
    readonly parent: Block | Button,
    public position: Vector,
    readonly side: 'input' | 'output',
    readonly states: boolean[],
    readonly names: (string | undefined)[] = []
  ) {}

  get items(): Vector[] {
    const [x, y] = this.position;
    const offset = ((this.states.length - 1) * 48) / 2;
    return this.states.map((_, i) => [x, y + 48 * i - offset]);
  }

  collides(other: Vector): number | undefined {
    for (const [i, item] of this.items.entries()) {
      if (getDistance(item, other) <= 20) return i;
    }
  }

  render(ctx: CanvasRenderingContext2D, tint: string, labels = false): void {
    const color = Color(tint);
    const positions = this.items;

    for (let i = 0; i < this.states.length; i++) {
      const [x, y] = positions[i];
      const state = this.states[i];
      ctx.fillStyle = (state ? color : color.lightness(90)).toString();

      ctx.beginPath();
      ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      const name = this.names[i];
      if (!labels || !name) continue;

      this.renderLabel(ctx, name, [x, y]);
    }
  }

  private renderLabel = (ctx: CanvasRenderingContext2D, text: string, [x, y]: Vector) => {
    ctx.font = '12px "Ubuntu"';
    ctx.fillStyle = '#000';

    const left = this.side === 'input';
    ctx.textAlign = left ? 'right' : 'left';
    const offset = left ? -12 : 12;

    ctx.fillText(text, x + offset, y);
  };
}
