import { Circuit } from './Circuit';
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

export interface DisconnectRequest {
  elementId: string;
  targetId: string;
  from: number;
  to: number;
}

export class Simulator {
  circuit: Circuit = new Circuit();
  private readonly createdGates = new Map<string, SerializedCustomGate>();

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

  connect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);

    if (!emitter || !this.circuit.find(receiverId))
      throw new Error(`Element not found: ${emitter ? emitterId : receiverId}`);

    emitter.connections.push({ from, to, receiverId });
    this.circuit.simulate();
  }

  disconnect({ elementId, targetId, from, to }: DisconnectRequest): void {
    const element = this.circuit.find(elementId);
    const target = this.circuit.find(targetId);

    if (!target || !element) throw new Error(`Element not found: ${element ? targetId : elementId}`);

    element.connections = element.connections.filter(
      (connection) => connection.receiverId != targetId && connection.from == from && connection.to == to
    );

    target.inputs[to] = false;
    this.circuit.update(target);
  }

  remove(id: string): void {
    const element = this.circuit.find(id);
    if (!element) throw new Error(`Element not found: ${id}`);

    // remove all element's connections
    element.connections.forEach(({ receiverId, to }) => {
      const receiver = this.circuit.find(receiverId);
      if (!receiver) throw new Error(`Element not found: ${receiver}`);

      receiver.inputs[to] = false;
      this.circuit.update(receiver);
    });

    // remove all connections to the element.
    this.circuit.elements.forEach((element) => {
      element.connections = element.connections.filter((connection) => connection.receiverId !== id);
    });

    // remove gate from the circuit.
    [this.circuit.inputs, this.circuit.gates, this.circuit.outputs].forEach((set) => set.delete(id));
  }
}
