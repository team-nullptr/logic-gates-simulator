import { Connection } from '../canvas/types/Connection';
import { Vector } from '../../common/Vector';
import { Connector } from '../canvas/types/Connector';
import { MutableRefObject } from 'react';
import { Button } from '../canvas/types/Button';
import { Block } from '../canvas/types/Block';
import { Prototype } from '../sidebar/types/Prototype';
import { subtract } from '../../common/utils';
import { snapToGrid } from '../canvas/utils';
import { Project } from '../../core/project-manager/ProjectManager';

const baseGates: Prototype[] = [
  { text: 'not', color: 'red' },
  { text: 'and', color: 'blue' }
];

export class Adapter {
  offset: Vector = [0, 0];
  size: Vector = [0, 0];

  connecting: [Connector, Vector] | undefined;

  readonly gates: Block[] = [];
  readonly connections: Connection[] = [];
  private readonly _buttons: Button[] = [];

  constructor(
    private readonly project: Project,
    readonly scrolls: MutableRefObject<{ inputs: number; outputs: number }>
  ) {}

  get available(): Prototype[] {
    const gates = this.project.simulator.createdGates.values();
    return [...gates].map((it) => ({ text: it.type, color: it.color })).concat(baseGates);
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

  add(type: string, mouse: Vector): void {
    const position = subtract(mouse, this.offset);
    const snapped = snapToGrid(position);

    const { simulator } = this.project;
    const id = simulator.addGate(type);
    const created = simulator.circuit.find(id);
    const proto = simulator.createdGates.get(type) ?? baseGates.find((it) => it.text === type);

    if (!proto || !created) return;

    // FIXME: Something's wrong with the outputs - they do not show on the screen
    const block = new Block(id, type, proto.color, snapped, created.inputs, created.states);
    this.gates.push(block);
  }
}
