import { Circuit, SerializedCircuit } from './Circuit';
import { isBaseGate } from './elements/BaseGate';
import { v4 as uuid } from 'uuid';
import { ElementFactory, PortType } from './elements/ElementFactory';
import { SerializedCustomGate } from './elements/CustomGate';
import { Gate } from './elements/Gate';

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
  circuit: Circuit = new Circuit();
  readonly createdGates = new Map<string, SerializedCustomGate>();

  /**
   * Deserializes serialized simulator from json object.
   */
  static deserialize({ circuit, createdGates }: SerializedSimulator): Simulator {
    const simulator = new Simulator();
    createdGates.forEach(([id, gate]) => simulator.createdGates.set(id, gate));
    simulator.circuit = Circuit.deserialize(circuit, simulator.createdGates);
    return simulator;
  }

  createGate(type: string, color: string) {
    const serialized = this.circuit.serialize();

    if (serialized.inputs.length === 0) throw new Error('Gate must have at least one input');
    if (serialized.outputs.length === 0) throw new Error('Gate must have at least one output');

    this.createdGates.set(type, { type, color, circuit: serialized });
    this.circuit = new Circuit();
  }

  addGate(type: string) {
    const id = uuid();

    if (isBaseGate(type)) this.circuit.gates.set(id, ElementFactory.createBaseGate(id, type));
    else this.circuit.gates.set(id, ElementFactory.createCustomGate(id, type, this.createdGates));

    return id;
  }

  // TODO: Maybe it would be better to compute type based on connectors value.
  addPort(type: PortType, connectors = 1) {
    const id = uuid();

    switch (type) {
      case 'input':
      case 'input-group':
        this.circuit.inputs.set(id, ElementFactory.createPort(id, type, connectors));
        break;
      case 'output':
      case 'output-group':
        this.circuit.outputs.set(id, ElementFactory.createPort(id, type, connectors));
        break;
    }

    return id;
  }

  toggleInput(id: string, index = 0) {
    const input = this.circuit.inputs.get(id);
    if (!input) throw new Error(`Element not found: ${id}`);

    input.states[index] = !input.states[index];
    this.circuit.simulate();
  }

  renamePort(id: string, name: string) {
    const port = this.circuit.inputs.get(id) || this.circuit.outputs.get(id);
    if (!port) throw new Error('Port not found');
    port.name = name;
  }

  connect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);

    if (!emitter || !this.circuit.find(receiverId))
      throw new Error(`Element not found: ${emitter ? emitterId : receiverId}`);

    emitter.connections.push({ from, to, receiverId });
    this.circuit.simulate();
  }

  /**
   * Removes connection between two elements.
   */
  disconnect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);
    const receiver = this.circuit.find(receiverId);

    if (!emitter) throw new Error(`Element not found: ${emitterId}`);
    if (!receiver) throw new Error(`Element not found: ${receiverId}`);

    emitter.connections = emitter.connections.filter(
      (connection) => connection.receiverId != receiverId && connection.from == from && connection.to == to
    );

    if (receiver instanceof Gate) receiver.inputs[to] = false;
    else receiver.states[to] = false;

    this.circuit.update(receiver);
  }

  remove(id: string): void {
    const element = this.circuit.find(id);
    if (!element) throw new Error(`Element not found: ${id}`);

    // remove all connections to the element.
    this.circuit.elements.forEach((element) => {
      element.connections = element.connections.filter((connection) => connection.receiverId !== id);
    });

    // remove all element's connections
    element.connections.forEach(({ receiverId, to }) => {
      const receiver = this.circuit.find(receiverId);
      if (!receiver) throw new Error(`Element not found: ${receiver}`);

      if (receiver instanceof Gate) receiver.inputs[to] = false;
      else receiver.states[to] = false;

      this.circuit.update(receiver);
    });

    // remove gate from the circuit.
    [this.circuit.inputs, this.circuit.gates, this.circuit.outputs].forEach((set) => set.delete(id));
  }

  /**
   * Serializes simulator into json object.
   */
  serialize(): SerializedSimulator {
    return { circuit: this.circuit.serialize(), createdGates: [...this.createdGates.entries()] };
  }
}
