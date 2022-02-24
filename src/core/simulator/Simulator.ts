import { Circuit, SerializedCircuit } from './Circuit';
import { BaseGate, isBaseGate } from './elements/BaseGate';
import { v4 as uuid } from 'uuid';
import { ElementFactory } from './elements/ElementFactory';
import { CustomGate, SerializedCustomGate } from './elements/CustomGate';
import { Gate } from './elements/Gate';
import { Port, PortType } from './elements/Port';
import { UserError } from './elements/util/UserError';

export interface ConnectRequest {
  emitterId: string;
  receiverId: string;
  from: number;
  to: number;
}

export interface SerializedSimulator {
  circuit: SerializedCircuit;
  createdGates: [string, SerializedCustomGate][];
}

export class Simulator {
  readonly createdGates = new Map<string, SerializedCustomGate>();
  readonly subscribers = new Set<() => void>();

  meta:
    | { mode: 'GATE_EDIT'; editedGate: string; circuit: Circuit; prev: SerializedCircuit }
    | { mode: 'PROJECT_EDIT'; circuit: Circuit } = {
    mode: 'PROJECT_EDIT',
    circuit: new Circuit()
  };

  get circuit(): Circuit {
    return this.meta.circuit;
  }

  set circuit(circuit: Circuit) {
    this.meta.circuit = circuit;
  }

  /**
   * Deserializes serialized simulator from json object.
   */
  static deserialize({ circuit, createdGates }: SerializedSimulator): Simulator {
    const simulator = new Simulator();
    createdGates.forEach(([id, gate]) => simulator.createdGates.set(id, gate));
    simulator.circuit = Circuit.deserialize(circuit, simulator.createdGates);
    return simulator;
  }

  subscribe(listener: () => void): void {
    this.subscribers.add(listener);
  }

  unsubscribe(listener: () => void): void {
    this.subscribers.delete(listener);
  }

  createGate(name: string, color: string): void {
    if (this.meta.mode === 'GATE_EDIT') throw new UserError('Cannot create a new gate while editing another one');

    const serialized = this.circuit.serialize();

    if (serialized.inputs.length === 0 || serialized.outputs.length === 0)
      throw new UserError('Gate must have at least one input and output');

    const type = uuid();

    let dependencies = new Set<string>();
    ([...this.circuit.gates.values()].filter((it) => !(it instanceof BaseGate)) as CustomGate[]).forEach((it) => {
      dependencies = new Set<string>([...dependencies, ...it.dependencies, it.type]);
    });

    this.createdGates.set(type, {
      type,
      name,
      color,
      circuit: serialized,
      dependencies: [...dependencies] // FIXME: Maybe this can be just Set idk (JSON.stringify)
    });

    this.circuit = new Circuit();

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  removeCreatedGate(type: string) {
    this.createdGates.delete(type);
    this.notify();
  }

  renameCreatedGate(type: string, name: string): void {
    const gate = this.createdGates.get(type);
    if (!gate) return;

    this.createdGates.set(type, { ...gate, name });
    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  addGate(type: string): BaseGate | CustomGate | undefined {
    // TODO: add custom gate's dependency
    if (this.meta.mode === 'GATE_EDIT' && this.meta.editedGate === type) return;

    const id = uuid();
    let gate: BaseGate | CustomGate;

    if (isBaseGate(type)) gate = ElementFactory.createBaseGate(id, type);
    else gate = ElementFactory.createCustomGate(id, type, this.createdGates);

    this.circuit.gates.set(id, gate);

    this.circuit.update(gate);
    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
    return gate;
  }

  addPort(type: PortType, connectors = 1): Port {
    const id = uuid();

    let port: Port;
    switch (type) {
      case 'input':
        port = ElementFactory.createPort(id, type, connectors);
        this.circuit.inputs.set(id, port);
        break;
      case 'output':
        port = ElementFactory.createPort(id, type, connectors);
        this.circuit.outputs.set(id, port);
        break;
    }

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
    return port;
  }

  toggleInput(id: string, index: number): void {
    const input = this.circuit.inputs.get(id);
    if (!input) return;

    input.states[index] = !input.states[index];
    this.circuit.simulate();

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  renamePort(id: string, name: string): void {
    const port = this.circuit.inputs.get(id) || this.circuit.outputs.get(id);
    if (!port) throw new Error('Port not found');
    port.name = name;

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  connect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);
    const receiver = this.circuit.find(receiverId);
    if (!emitter || !receiver) return;

    const isDoubler = [...this.circuit.inputs.values(), ...this.circuit.gates.values()].some((it) =>
      it.connections.some((it) => it.receiverId === receiverId && it.to === to)
    );
    if (isDoubler) throw new UserError('You cannot make multiple connections to the same input');

    emitter.connections.push({ from, to, receiverId });
    this.circuit.simulate();

    this.circuit.update(emitter);
    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  /**
   * Removes connection between two elements.
   */
  disconnect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);
    const receiver = this.circuit.find(receiverId);
    if (!emitter || !receiver) return;

    emitter.connections = emitter.connections.filter(
      (connection) => connection.receiverId != receiverId && connection.from == from && connection.to == to
    );

    if (receiver instanceof Gate) receiver.inputs[to] = false;
    else receiver.states[to] = false;

    this.circuit.update(receiver);
    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  removeGate(id: string): void {
    const element = this.circuit.find(id);
    if (!element) return;

    // remove all connections to the element.
    this.circuit.elements.forEach((element) => {
      element.connections = element.connections.filter((connection) => connection.receiverId !== id);
    });

    // remove all element's connections
    element.connections.forEach(({ receiverId, to }) => {
      const receiver = this.circuit.find(receiverId);
      if (!receiver) return;

      if (receiver instanceof Gate) receiver.inputs[to] = false;
      else receiver.states[to] = false;

      this.circuit.update(receiver);
    });

    // remove gate from the circuit.
    [this.circuit.inputs, this.circuit.gates, this.circuit.outputs].forEach((set) => set.delete(id));

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  /**
   * Serializes simulator into json object.
   */
  serialize(): SerializedSimulator {
    return {
      circuit: this.meta.mode === 'PROJECT_EDIT' ? this.circuit.serialize() : this.meta.prev,
      createdGates: [...this.createdGates.entries()]
    };
  }

  private notify(): void {
    this.subscribers.forEach((it) => it());
  }
}
