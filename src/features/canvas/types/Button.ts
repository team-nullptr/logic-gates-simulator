import { Vector } from '../../../common/Vector';
import { Connectors } from './Connectors';
import { Connector } from './Connector';

export class Button {
  readonly connectors: Connectors;
  readonly type: 'single' | 'compound';
  private position!: Vector;

  constructor(
    readonly id: string,
    position: Vector,
    readonly side: 'input' | 'output',
    public readonly state: boolean[],
    public slug?: string
  ) {
    const connectorSide = side === 'input' ? 'output' : 'input';
    this.connectors = new Connectors([0, 0], connectorSide, state);
    this.type = state.length === 1 ? 'single' : 'compound';
    this.move(position);
  }

  get height(): number {
    if (this.type === 'single') return 48;
    return 56 + this.state.length * 48;
  }

  move(to: Vector): void {
    this.position = to;

    const [x, y] = to;
    if (this.type === 'single') {
      this.connectors.position = [x, y + 28];
    } else {
      const height = this.state.length * 48;
      const center = y + 56 + height / 2;
      this.connectors.position = [x, center];
    }
  }

  collides(other: Vector): Connector | undefined {
    const result = this.connectors.collides(other);
    if (result === undefined) return undefined;
    return { group: this.connectors, at: result };
  }
}
