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
import { swap } from './utils/swap';
import { sort } from './utils/sort';

export class Adapter {
  offset: Vector = [0, 0];
  size: Vector = [0, 0];

  readonly ports = new Map<string, Button>();
  readonly gates = new Map<string, Block>();
  connections: Connection[] = [];

  connecting?: [Connector, Vector];
  hoveredConnection?: Connection;

  labels = false;
  private portOrder: string[] = [];
  private readonly subscribers = new Set<() => void>();

  constructor(
    private readonly project: Project,
    private readonly scrolls: MutableRefObject<{ inputs: number; outputs: number }>
  ) {
    this.readCircuit();
  }

  get availableGates(): Prototype[] {
    const gates = this.project.simulator.createdGates;
    const all = [...gates.values(), ...baseGates.values()];
    return all.map(({ type, name, color }) => ({ type, name, color }));
  }

  get orderedPorts(): Button[] {
    const ports: Button[] = [];
    this.portOrder.forEach((id) => {
      const port = this.ports.get(id);
      if (port) ports.push(port);
    });

    return ports;
  }

  get inputs(): Button[] {
    return this.orderedPorts.filter((it) => it.side === 'input');
  }

  get outputs(): Button[] {
    return this.orderedPorts.filter((it) => it.side === 'output');
  }

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

    this.disconnectGroup(gate.inputs);
    this.disconnectGroup(gate.outputs);

    this.project.simulator.removeGate(id);
    this.gates.delete(id);
  }

  addPort(type: PortType, connectors: number): void {
    const port = this.project.simulator.addPort(type, connectors);

    const button = Builder.buildButton(port);
    this.ports.set(button.id, button);
    this.portOrder.push(button.id);

    this.notify();
  }

  removePort(id: string): void {
    const button = this.ports.get(id);
    if (!button) return;

    this.disconnectGroup(button.connectors);

    this.project.simulator.removeGate(id);
    this.ports.delete(id);
    this.portOrder = this.portOrder.filter((it) => it !== id);

    this.notify();
  }

  togglePort(id: string, index: number) {
    this.project.simulator.toggleInput(id, index);
    this.notify();
  }

  renamePort(id: string, name: string) {
    const button = this.ports.get(id);
    if (!button) return;

    this.project.simulator.renamePort(id, name);
    button.slug = name;

    this.notify();
  }

  movePort(id: string, to: number): void {
    const button = this.ports.get(id);
    if (!button) return;

    this.project.simulator.movePort(id, to, button.side);

    const a = this.portOrder.indexOf(id);
    const offset = button.side === 'input' ? 0 : this.inputs.length;
    swap(this.portOrder, a, to + offset);

    this.notify();
  }

  createCustomGate(name: string, color: string) {
    attempt(() => {
      this.project.simulator.createGate(name, color);
      this.readCircuit();
      this.notify();
    });
  }

  removeCustomGate(type: string): void {
    attempt(() => {
      this.project.simulator.removeCreatedGate(type);
      this.notify();
    });
  }

  editCustomGate(type: string): void {
    this.project.simulator.editCreatedGate(type);
    this.readCircuit();
    this.notify();
  }

  renameCustomGate(type: string, name: string): void {
    this.project.simulator.renameCreatedGate(type, name);
    this.notify();
  }

  updateCustomGate(): void {
    attempt(() => {
      this.project.simulator.updateCreatedGate();
      this.readCircuit();
      this.notify();
    });
  }

  cancelCustomGateUpdate(): void {
    this.project.simulator.cancelCreatedGateUpdate();
    this.readCircuit();
    this.notify();
  }

  connect(connection: Connection) {
    if (
      (connection.from.group.side === 'output' && connection.to.group.side === 'output') ||
      (connection.from.group.side === 'input' && connection.to.group.side === 'input')
    )
      return;

    const request = Builder.buildConnectRequest(connection);
    const [result] = attempt(() => this.project.simulator.connect(request));
    if (!result) return;
    this.connections.push(connection);
    this.notify();
  }

  disconnect(connection: Connection): void {
    const request = Builder.buildConnectRequest(connection);
    this.project.simulator.disconnect(request);
    this.connections = this.connections.filter((it) => it !== connection);
    this.notify();
  }

  disconnectGroup(group: Connectors): void {
    for (const i in group.states) {
      this.disconnectConnector({ group, at: parseInt(i) });
    }
  }

  disconnectConnector(connector: Connector): void {
    const updated: Connection[] = [];

    const compare = (a: Connector, b: Connector) => {
      return a.group === b.group && a.at === b.at;
    };

    for (const connection of this.connections) {
      const { from, to } = connection;
      const connected = compare(from, connector) || compare(to, connector);

      if (connected) {
        const request = Builder.buildConnectRequest(connection);
        this.project.simulator.disconnect(request);
      } else {
        updated.push(connection);
      }
    }

    this.connections = updated;
    this.notify();
  }

  cleanup(): void {
    this.offset = [96, 52];
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

    const beginnings: string[] = [];
    for (const input of this.project.simulator.circuit.inputs.values()) {
      input.connections.forEach((it) => beginnings.push(it.receiverId));
    }

    cleanup(blocks, sort(new Set([...unvisited, ...beginnings]), beginnings));

    for (const [id, { position }] of blocks) {
      const [x, y] = position;
      this.gates.get(id)?.move([x * 8, y * 2]);
    }
  }

  updateButtons(): void {
    const top = [48, 48];
    const scrolls = this.scrolls.current;

    for (const port of this.orderedPorts) {
      const position: Vector = [0, 0];

      if (port.side === 'input') {
        position[0] = -this.offset[0] + 12;
        position[1] = top[0] - this.offset[1] - scrolls.inputs;
        top[0] += port.height;
      } else {
        position[0] = this.size[0] - this.offset[0] - 12;
        position[1] = top[1] - this.offset[1] - scrolls.outputs;
        top[1] += port.height;
      }

      port.move(position);
    }
  }

  toggleLabels(): void {
    this.labels = !this.labels;
    this.notify();
  }

  subscribe(listener: () => void) {
    this.subscribers.add(listener);
  }

  unsubscribe(listener: () => void) {
    this.subscribers.delete(listener);
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
      this.ports.set(button.id, button);
      this.portOrder.push(button.id);
    };

    [...inputs.values()].forEach((it) => placePort(it));
    [...outputs.values()].forEach((it) => placePort(it));

    for (const element of [...inputs.values(), ...gates.values()]) {
      for (const connection of element.connections) {
        const emitter = this.gates.get(element.id)?.outputs ?? this.ports.get(element.id)?.connectors;
        const target =
          this.ports.get(connection.receiverId)?.connectors ?? this.gates.get(connection.receiverId)?.inputs;

        if (!emitter || !target) continue;

        this.connections.push({
          from: { group: emitter, at: connection.from },
          to: { group: target, at: connection.to }
        });
      }
    }

    this.cleanup();
  }

  private clearProject(): void {
    this.offset = [0, 0];
    this.ports.clear();
    this.gates.clear();
    this.connections = [];
    this.connecting = undefined;
    this.hoveredConnection = undefined;
    this.portOrder = [];
    this.scrolls.current = { inputs: 0, outputs: 0 };
  }

  private notify() {
    this.subscribers.forEach((it) => it());
  }
}
