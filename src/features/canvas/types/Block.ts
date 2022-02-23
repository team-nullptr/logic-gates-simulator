import { Vector } from '../../../common/Vector';
import { Area } from './Area';
import { isOver } from '../utils';
import { Connector } from './Connector';
import { Connectors } from './Connectors';
import { Target } from './Target';
import { renderGate } from '../renderers/gate';
import { multiply } from '../../../common/utils';

export class Block {
  readonly inputs: Connectors;
  readonly outputs: Connectors;

  private position!: Vector;

  constructor(
    readonly id: string,
    public text: string,
    public color: string,
    position: Vector,
    inputs: boolean[],
    outputs: boolean[]
  ) {
    this.inputs = new Connectors(this, [0, 0], 'input', inputs);
    this.outputs = new Connectors(this, [0, 0], 'output', outputs);
    this.move(position);
  }

  get size(): Vector {
    const height = Math.max(this.inputs.states.length, this.outputs.states.length, 1) * 48;
    return [96, height];
  }

  get area(): Area {
    const [x, y] = this.position.map((v) => v * 48);
    const [w, h] = this.size;

    return [x, y, x + w, y + h];
  }

  move(to: Vector): void {
    this.position = to;

    const [x, y] = multiply(to, [48, 48]);
    const [w, h] = this.size;
    const center = y + h / 2;

    this.inputs.position = [x, center];
    this.outputs.position = [x + w, center];
  }

  collides(other: Vector): Target {
    const check = (group: Connectors): Connector | undefined => {
      const result = group.collides(other);
      if (result !== undefined) return { group, at: result };
    };

    const result = check(this.inputs) ?? check(this.outputs);

    if (result) return result;
    if (isOver(other, this.area)) return this;
    return undefined;
  }

  render(ctx: CanvasRenderingContext2D): void {
    renderGate(this, ctx);
    this.inputs.render(ctx, this.color);
    this.outputs.render(ctx, this.color);
  }
}
