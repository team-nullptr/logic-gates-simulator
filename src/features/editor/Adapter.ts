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
import { baseGates } from '../../core/simulator/elements/ElementFactory';
import { PortType } from '../../core/simulator/elements/Port';

export class Adapter {
  offset: Vector = [0, 0];
  size: Vector = [0, 0];

  connecting: [Connector, Vector] | undefined;
  readonly subscribers = new Set<() => void>();

  readonly gates = new Map<string, Block>();
  connections: Connection[] = [];

  private readonly _buttons = new Map<string, Button>();

  constructor(
    private readonly project: Project,
    readonly scrolls: MutableRefObject<{ inputs: number; outputs: number }>
  ) {
    const { gates, inputs, outputs } = project.simulator.circuit;

    //TODO: add project's meta to meta project.meta.name etc
    //TODO: position the gates (maybe abstract that to separate func vvvvvvv)
    for (const gate of gates.values()) {
      const { id, color, inputs, states, name } = gate;
      const block = new Block(id, name, color, [0, 0], inputs, states);
      this.gates.set(id, block);
    }

    for (const input of inputs.values()) {
      const { id, states, name } = input;
      const button = new Button(id, [0, 0], 'input', states, name);
      this._buttons.set(id, button);
    }

    for (const output of outputs.values()) {
      const { id, states, name } = output;
      const button = new Button(id, [0, 0], 'output', states, name);
      this._buttons.set(id, button);
    }

    for (const element of [...inputs.values(), ...gates.values()]) {
      for (const connection of element.connections) {
        const emitter = this.gates.get(element.id)?.outputs ?? this._buttons.get(element.id)?.connectors;
        const target =
          this._buttons.get(connection.receiverId)?.connectors ?? this.gates.get(connection.receiverId)?.inputs;

        if (!emitter || !target) continue;

        this.connections.push({
          from: { group: emitter, at: connection.from },
          to: { group: target, at: connection.to }
        });
      }
    }
  }

  get available(): Prototype[] {
    const gates = this.project.simulator.createdGates;
    return [...gates.values(), ...baseGates.values()].map((it) => ({
      id: it.type,
      name: it.name,
      color: it.color
    }));
  }

  get buttons(): Button[] {
    this.updateButtons();
    return [...this._buttons.values()];
  }

  get inputs(): Button[] {
    return this.buttons.filter((it) => it.side === 'input');
  }

  get outputs(): Button[] {
    return this.buttons.filter((it) => it.side === 'output');
  }

  updateButtons(): void {
    const top = [0, 0];
    const scrolls = this.scrolls.current;

    for (const button of this._buttons.values()) {
      const position: Vector = [0, 0];

      if (button.side === 'input') {
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
  }

  subscribe(listener: () => void) {
    this.subscribers.add(listener);
  }

  unsubscribe(listener: () => void) {
    this.subscribers.delete(listener);
  }

  connect(connection: Connection) {
    const output =
      [...this.gates.values()].find((it) => it.outputs === connection.from.group) ??
      this.inputs.find((it) => it.connectors === connection.from.group);

    const input =
      [...this.gates.values()].find((it) => it.inputs === connection.to.group) ??
      this.outputs.find((it) => it.connectors === connection.to.group);

    if (!output || !input) return;

    this.project.simulator.connect({
      emitterId: output.id,
      receiverId: input.id,
      from: connection.from.at,
      to: connection.to.at
    });

    this.connections.push(connection);
    this.notify();
  }

  createGate(name: string, color: string) {
    this.project.simulator.createGate(name, color);

    this.connections = [];
    this.gates.clear();
    this._buttons.clear();

    this.notify();
  }

  addGate(type: string, mouse: Vector): void {
    const position = subtract(mouse, this.offset);
    const snapped = snapToGrid(position);

    const { simulator } = this.project;
    const { id, color, inputs, states, name } = simulator.addGate(type);

    const block = new Block(id, name, color, snapped, inputs, states);
    this.gates.set(id, block);
  }

  addPort(type: PortType, connectors: number): void {
    const { simulator } = this.project;
    const { id, states, name } = simulator.addPort(type, connectors);

    const button = new Button(id, [0, 0], type, states, name);
    this._buttons.set(id, button);
    this.notify();
  }

  toggleInput(id: string, index: number) {
    this.project.simulator.toggleInput(id, index);
    this.notify();
  }

  private notify() {
    this.subscribers.forEach((it) => it());
  }
}
