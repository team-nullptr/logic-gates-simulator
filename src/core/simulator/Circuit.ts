import { Connection } from './elements/Element';
import { Gate } from './elements/Gate';
import { Port } from './elements/Port';
import { ElementFactory } from './elements/ElementFactory';
import { isBaseGate } from './elements/BaseGate';
import { SerializedCustomGate } from './elements/CustomGate';

export interface SerializedCircuit {
  inputs: {
    id: string;
    name: string;
    connections: Connection[];
    connectors: number;
  }[];
  gates: {
    id: string;
    type: string;
    connections: Connection[];
  }[];
  outputs: {
    id: string;
    name: string;
    connectors: number;
  }[];
}

export class Circuit {
  readonly inputs = new Map<string, Port>();
  readonly gates = new Map<string, Gate>();
  readonly outputs = new Map<string, Port>();

  get elements(): (Port | Gate)[] {
    return [...this.inputs.values(), ...this.gates.values(), ...this.outputs.values()];
  }

  /**
   * Deserializes the object into circuit.
   */
  static deserialize({ inputs, gates, outputs }: SerializedCircuit, createdGates: Map<string, SerializedCustomGate>) {
    const circuit = new Circuit();

    inputs.forEach(({ id, name, connections, connectors }) => {
      const input = ElementFactory.createPort(id, 'input', connectors, name);
      input.connections = connections;
      circuit.inputs.set(id, input);
    });

    gates.forEach(({ id, type, connections }) => {
      if (isBaseGate(type)) {
        const gate = ElementFactory.createBaseGate(id, type);
        gate.connections = connections;
        circuit.gates.set(id, gate);
      } else {
        const gate = ElementFactory.createCustomGate(id, type, createdGates);
        gate.connections = connections;
        circuit.gates.set(id, gate);
      }
    });

    outputs.forEach(({ id, name, connectors }) => {
      circuit.outputs.set(id, ElementFactory.createPort(id, 'input', connectors, name));
    });

    return circuit;
  }

  /**
   * Simulates the whole circuit starting from inputs.
   */
  simulate(): void {
    this.inputs.forEach((input) => {
      this.update(input);
    });
  }

  find(id: string): Port | Gate {
    const element = [...this.inputs.values(), ...this.gates.values(), ...this.outputs.values()].find(
      (element) => element.id === id
    );
    if (!element) throw new Error(`Element not found ${id}`);
    return element;
  }

  /**
   * Updates the circuit starting from the element.
   */
  update(element: Port | Gate, callStack = new Set<string>()): void {
    if (element instanceof Gate) element.run();

    if (callStack.has(element.id)) return;
    callStack.add(element.id);

    element.connections.forEach(({ receiverId, from, to }) => {
      const receiver = this.find(receiverId);
      if (!receiver) throw new Error(`Element not found ${receiverId}`);

      if (receiver instanceof Gate) {
        receiver.inputs[to] = element.states[from];
      } else receiver.states[to] = element.states[from];

      this.update(receiver, new Set<string>(callStack));
    });
  }

  /**
   * Serializes the circuit to an object, so it can be saved in local storage.
   */
  serialize(): SerializedCircuit {
    return {
      inputs: [...this.inputs.values()].map(({ id, type, name, connections, states }) => ({
        id,
        name,
        type: type as 'input',
        connections,
        connectors: states.length
      })),
      gates: [...this.gates.values()].map(({ id, type, connections }) => ({ id, type, connections })),
      outputs: [...this.outputs.values()].map(({ id, type, name, states }) => ({
        id,
        name,
        type: type as 'output',
        connectors: states.length
      }))
    };
  }
}
