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
import { Connectors } from '../canvas/types/Connectors';
import { ConnectRequest } from '../../core/simulator/Simulator';
import { UserError } from '../../core/simulator/elements/util/UserError';
import { messageBus } from '../message-bus/MessageBus';

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
    this.readCircuit();
  }

  get available(): Prototype[] {
    const gates = this.project.simulator.createdGates;
    return [...gates.values(), ...baseGates.values()].map((it) => ({
      type: it.type,
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

  private static connectionToConnectRequest(connection: Connection): ConnectRequest {
    const { from, to } = connection;
    return { emitterId: from.group.parent.id, receiverId: to.group.parent.id, from: from.at, to: to.at };
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
    const request = Adapter.connectionToConnectRequest(connection);

    try {
      this.project.simulator.connect(request);
      this.connections.push(connection);
      this.notify();
    } catch (error) {
      if (!(error instanceof UserError)) return;
      messageBus.push({ type: 'error', body: error.message });
    }
  }

  createGate(name: string, color: string) {
    try {
      this.project.simulator.createGate(name, color);

      this.connections = [];
      this.gates.clear();
      this._buttons.clear();

      this.notify();
    } catch (error) {
      if (!(error instanceof UserError)) return;
      messageBus.push({ type: 'error', body: error.message });
    }
  }

  editCreatedGate(type: string): void {
    this.project.simulator.editCreatedGate(type);
    this.readCircuit();
    this.notify();
  }

  renameCreatedGate(type: string, name: string): void {
    this.project.simulator.renameCreatedGate(type, name);
    this.notify();
  }

  updateCreatedGate(): void {
    try {
      this.project.simulator.updateCreatedGate();
      this.readCircuit();
    } catch (error) {
      if (!(error instanceof UserError)) return;
      messageBus.push({ type: 'error', body: error.message });
    }
    this.notify();
  }

  cancelCreatedGateUpdate(): void {
    this.project.simulator.cancelCreatedGateUpdate();
    this.readCircuit();
    this.notify();
  }

  removeCreatedGate(type: string): void {
    try {
      this.project.simulator.removeCreatedGate(type);
    } catch (error) {
      if (!(error instanceof UserError)) return;
      messageBus.push({ type: 'error', body: error.message });
    }

    this.notify();
  }

  addGate(type: string, mouse: Vector): void {
    const position = subtract(mouse, this.offset);
    const snapped = snapToGrid(position);

    const { simulator } = this.project;

    try {
      const gate = simulator.addGate(type);
      if (!gate) return;

      const { id, color, inputs, states, name } = gate;
      const block = new Block(id, name, color, snapped, inputs, states);
      this.gates.set(id, block);
    } catch (error) {
      if (!(error instanceof UserError)) return;
      messageBus.push({ type: 'error', body: error.message });
    }
  }

  removeGate(id: string): void {
    const gate = this.gates.get(id);
    if (!gate) return;

    this.disconnectAll(gate.inputs);
    this.disconnectAll(gate.outputs);

    this.project.simulator.removeGate(id);
    this.gates.delete(id);
    this.notify();
  }

  removeConnection(connection: Connection): void {
    this.connections = this.connections.filter((it) => it !== connection);
    const request = Adapter.connectionToConnectRequest(connection);
    this.project.simulator.disconnect(request);
    this.notify();
  }

  disconnectFrom(connector: Connector): void {
    const connected = new Set<Connection>();

    const compareConnectors = (a: Connector, b: Connector) => {
      return a.group === b.group && a.at === b.at;
    };

    for (const connection of this.connections) {
      const { from, to } = connection;
      const isConnected = compareConnectors(from, connector) || compareConnectors(to, connector);
      if (isConnected) connected.add(connection);
    }

    this.connections = this.connections.filter((it) => !connected.has(it));

    for (const connection of connected) {
      const request = Adapter.connectionToConnectRequest(connection);
      this.project.simulator.disconnect(request);
    }

    this.notify();
  }

  disconnectAll(connectors: Connectors): void {
    for (const i in connectors.states) {
      this.disconnectFrom({ group: connectors, at: parseInt(i) });
    }
  }

  addPort(type: PortType, connectors: number): void {
    const { simulator } = this.project;
    const { id, states, name } = simulator.addPort(type, connectors);

    const button = new Button(id, [0, 0], type, states, name);
    this._buttons.set(id, button);
    this.notify();
  }

  removePort(id: string): void {
    const button = this._buttons.get(id);
    if (!button) return;

    this.disconnectAll(button.connectors);

    this.project.simulator.removeGate(id);
    this._buttons.delete(id);

    this.notify();
  }

  toggleInput(id: string, index: number) {
    this.project.simulator.toggleInput(id, index);
    this.notify();
    console.log(this.project.simulator.circuit);
  }

  private clearProject(): void {
    this.connecting = undefined;
    this.offset = [0, 0];
    this.connecting = undefined;
    this.gates.clear();
    this.connections = [];
    this._buttons.clear();
  }

  private readCircuit(): void {
    this.clearProject();
    const { gates, inputs, outputs } = this.project.simulator.circuit;

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

  private notify() {
    this.subscribers.forEach((it) => it());
  }
}
