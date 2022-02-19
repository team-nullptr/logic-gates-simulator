import { Connection } from '../canvas/types/Connection';
import { Vector } from '../../common/Vector';
import { Connector } from '../canvas/types/Connector';
import { MutableRefObject } from 'react';
import { Button } from '../canvas/types/Button';
import { Block } from '../canvas/types/Block';
import { Prototype } from '../sidebar/types/Prototype';
import { subtract } from '../../common/utils';
import { snapToGrid } from '../canvas/utils';

export class Adapter {
  offset: Vector = [0, 0];
  size: Vector = [0, 0];

  connecting: [Connector, Vector] | undefined;

  readonly gates: Block[] = [];
  readonly connections: Connection[] = [];
  readonly available: { base: Prototype[]; custom: Prototype[] } = { base: [], custom: [] };

  private readonly _buttons: Button[] = [];

  constructor(readonly scrolls: MutableRefObject<{ inputs: number; outputs: number }>) {
  }

  get buttons(): Button[] {
    const top = [0, 0];
    const scrolls = this.scrolls.current;

    for (const button of this._buttons) {
      const position: Vector = [0, 0];

      if (button.side === 'output') {
        position[0] = -this.offset[0] + 12;
        position[1] = top[0] - this.offset[1] - scrolls.inputs;
        top[0] += button.height;
      } else {
        position[0] = this.size[0] - this.offset[0] - 12;
        position[1] = top[1] - this.offset[1] - scrolls.outputs;
        top[1] += button.height;
      }

      button.move(position);
    }

    return this._buttons;
  }

  connect(connection: Connection) {
    this.connections.push(connection);
  }

  add(type: string, mouse: Vector): boolean {
    const position = subtract(mouse, this.offset);
    const snapped = snapToGrid(position);

    // TODO: Fetch data from core
    const block = new Block('1234', 'text', 'blue', snapped, [true, false], [false]);
    this.gates.push(block);

    return true;
  }
}
