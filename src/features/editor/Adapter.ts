import { Connection } from '../canvas/types/Connection';
import { Vector } from '../../common/Vector';
import { Connector } from '../canvas/types/Connector';
import { MutableRefObject } from 'react';
import { Button } from '../canvas/types/Button';
import { Block } from '../canvas/types/Block';
import { Prototype } from '../sidebar/types/Prototype';
import { subtract } from '../../common/utils';
import { Project } from '../../core/project-manager/ProjectManager';
import { baseGates } from '../../core/simulator/elements/ElementFactory';
import { Port, PortType } from '../../core/simulator/elements/Port';
import { Connectors } from '../canvas/types/Connectors';
import { Block as PositionedBlock, cleanup } from './utils/cleanup';
import { Builder } from './Builder';
import { attempt } from './utils/attepmt';

export class Adapter {
  offset: Vector = [0, 0];
  size: Vector = [0, 0];
  labels = false;

  connecting: [Connector, Vector] | undefined;
  readonly subscribers = new Set<() => void>();

  readonly gates = new Map<string, Block>();
  connections: Connection[] = [];

  hoveredConnection?: Connection;

  private readonly _buttons = new Map<string, Button>();
  private buttonOrder: string[] = [];

  constructor(
    private readonly project: Project,
    readonly scrolls: MutableRefObject<{ inputs: number; outputs: number }>
  ) {
    this.readCircuit();
  }

  get available(): Prototype[] {
    const gates = this.project.simulator.createdGates;
    const all = [...gates.values(), ...baseGates.values()];
    return all.map(({ type, name, color }) => ({ type, name, color }));
  }

  get buttons(): Button[] {
    this.updateButtons();

    const sorted: Button[] = [];
    for (const id of this.buttonOrder) {
      const button = this._buttons.get(id);
      if (button) sorted.push(button);
    }

    return sorted;
  }

  get inputs(): Button[] {
    return this.buttons.filter((it) => it.side === 'input');
  }

  get outputs(): Button[] {
    return this.buttons.filter((it) => it.side === 'output');
  }

  //
  //
  //
  //
  //
  //
  //
  // FIXED

  addGate(type: string, mouse: Vector): void {
    const [gate] = attempt(() => this.project.simulator.addGate(type));
    if (!gate) return;

    const position = subtract(mouse, this.offset);
    const block = Builder.buildBlock(gate, position);
    this.gates.set(gate.id, block);
  }

  removeGate(id: string): void {
    const gate = this.gates.get(id);
    if (!gate) return;

    this.disconnectAll(gate.inputs);
    this.disconnectAll(gate.outputs);

    this.project.simulator.removeGate(id);
    this.gates.delete(id);
  }

  addPort(type: PortType, connectors: number): void {
    const port = this.project.simulator.addPort(type, connectors);

    const button = Builder.buildButton(port);
    this._buttons.set(button.id, button);
    this.buttonOrder.push(button.id);

    this.notify();
  }

  removePort(id: string): void {
    const button = this._buttons.get(id);
    if (!button) return;

    this.disconnectAll(button.connectors);

    this.project.simulator.removeGate(id);
    this._buttons.delete(id);
    this.buttonOrder = this.buttonOrder.filter((it) => it !== id);

    this.notify();
  }

  // FIXED
  //
  //
  //
  //
  //
  //
  //

  toggleLabels(): void {
    this.labels = !this.labels;
    this.notify();
  }

  cleanup(): void {
    this.offset = [96, 96];
    const blocks = new Map<string, PositionedBlock>();

    for (const block of this.project.simulator.circuit.gates.values()) {
      const { id, inputs, states, connections } = block;
      const height = Math.max(inputs.length, states.length);
      const receivers = connections.map((it) => it.receiverId);
      blocks.set(id, { height, position: [0, Infinity], connections: receivers });
    }

    const unvisited = new Set(blocks.keys());
    for (const block of blocks.values()) {
      block.connections.forEach((it) => unvisited.delete(it));
    }

    cleanup(blocks, Array.from(unvisited));

    for (const [id, { position }] of blocks) {
      const [x, y] = position;
      this.gates.get(id)?.move([x * 6, y * 2]);
    }
  }

  updateButtons(): void {
    const top = [48, 48];
    const scrolls = this.scrolls.current;

    for (const id of this.buttonOrder) {
      const button = this._buttons.get(id);
      if (!button) continue;

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
    const request = Builder.buildConnectRequest(connection);
    const [, success] = attempt(() => this.project.simulator.connect(request));
    if (!success) return;
    this.connections.push(connection);
    this.notify();
  }

  createGate(name: string, color: string) {
    const [, success] = attempt(() => this.project.simulator.createGate(name, color));
    if (!success) return;
    this.readCircuit();
    this.notify();
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
    attempt(() => {
      this.project.simulator.updateCreatedGate();
      this.readCircuit();
      this.notify();
    });
  }

  cancelCreatedGateUpdate(): void {
    this.project.simulator.cancelCreatedGateUpdate();
    this.readCircuit();
    this.notify();
  }

  removeCreatedGate(type: string): void {
    attempt(() => {
      this.project.simulator.removeCreatedGate(type);
      this.notify();
    });
  }

  removeConnection(connection: Connection): void {
    this.connections = this.connections.filter((it) => it !== connection);
    const request = Builder.buildConnectRequest(connection);
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
      const request = Builder.buildConnectRequest(connection);
      this.project.simulator.disconnect(request);
    }

    this.notify();
  }

  disconnectAll(connectors: Connectors): void {
    for (const i in connectors.states) {
      this.disconnectFrom({ group: connectors, at: parseInt(i) });
    }
  }

  renamePort(id: string, name: string) {
    this.project.simulator.renamePort(id, name);
    const button = this._buttons.get(id);
    if (button) button.slug = name;
    this.notify();
  }

  movePort(id: string, to: number): void {
    const button = this._buttons.get(id);
    if (!button) return;

    const index = this.buttonOrder.indexOf(id);
    if (index === -1) return;

    this.project.simulator.movePort(id, to, button.side);

    const offset = button.side === 'input' ? 0 : this.inputs.length;
    const [removed] = this.buttonOrder.splice(index, 1);
    this.buttonOrder.splice(offset + to, 0, removed);
    this.notify();
  }

  toggleInput(id: string, index: number) {
    this.project.simulator.toggleInput(id, index);
    this.notify();
  }

  private clearProject(): void {
    this.connecting = undefined;
    this.offset = [0, 0];
    this.connecting = undefined;
    this.gates.clear();
    this.connections = [];
    this._buttons.clear();
    this.buttonOrder = [];
  }

  private readCircuit(): void {
    this.clearProject();
    const { gates, inputs, outputs } = this.project.simulator.circuit;

    for (const gate of gates.values()) {
      const block = Builder.buildBlock(gate, [0, 0]);
      this.gates.set(gate.id, block);
    }

    const placePort = (port: Port) => {
      const button = Builder.buildButton(port);
      this._buttons.set(button.id, button);
      this.buttonOrder.push(button.id);
    };

    [...inputs.values()].forEach((it) => placePort(it));
    [...outputs.values()].forEach((it) => placePort(it));

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

    this.cleanup();
  }

  private notify() {
    this.subscribers.forEach((it) => it());
  }
}
