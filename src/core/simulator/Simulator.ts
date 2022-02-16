import { Circuit, SerializedCircuit } from './Circuit';
import { isBaseGate } from './elements/BaseGate';
import { v4 as uuid } from 'uuid';
import { ElementFactory } from './elements/ElementFactory';
import { SerializedCustomGate } from './elements/CustomGate';

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

  createGate(type: string, color: string) {
    const serialized = this.circuit.serialize();

    if (serialized.inputs.length === 0) throw new Error('Gate must have at least one input');
    if (serialized.outputs.length === 0) throw new Error('Gate must have at least one output');

    this.createdGates.set(type, { type, color, circuit: serialized });
    this.circuit = new Circuit();
  }

  add(type: string) {
    const id = uuid();

    switch (type) {
      case 'input':
      case 'input-group':
        this.circuit.inputs.set(id, ElementFactory.createInput(id, type));
        break;
      case 'output':
        this.circuit.outputs.set(id, ElementFactory.createOutput(id));
        break;
      default:
        if (isBaseGate(type)) this.circuit.gates.set(id, ElementFactory.createBaseGate(id, type));
        else this.circuit.gates.set(id, ElementFactory.createCustomGate(id, type, this.createdGates));
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

    receiver.inputs[to] = false;
    if (receiver.type === 'output') receiver.states[to] = receiver.inputs[to];

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

      receiver.inputs[to] = false;
      if (receiver.type === 'output') receiver.states[to] = receiver.inputs[to];

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

  /**
   * Deserializes serialized simulator from json object.
   */
  static deserialize({ circuit, createdGates }: SerializedSimulator): Simulator {
    const simulator = new Simulator();
    createdGates.forEach(([id, gate]) => simulator.createdGates.set(id, gate));
    simulator.circuit = Circuit.deserialize(circuit, simulator.createdGates);
    return simulator;
  }
}
