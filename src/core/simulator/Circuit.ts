import { Connection, Element } from './elements/Element';
import { Gate } from './elements/Gate';
import { ElementFactory, InputType } from './elements/ElementFactory';
import { isBaseGate } from './elements/BaseGate';
import { SerializedCustomGate } from './elements/CustomGate';

export interface SerializedCircuit {
  inputs: {
    id: string;
    type: InputType;
    connections: Connection[];
  }[];
  gates: {
    id: string;
    type: string;
    connections: Connection[];
  }[];
  outputs: {
    id: string;
  }[];
}

export class Circuit {
  readonly inputs = new Map<string, Element>();
  readonly gates = new Map<string, Gate>();
  readonly outputs = new Map<string, Element>();
  private readonly callStack = new Set<string>();

  /**
   * All elements in the circuit.
   */
  get elements(): Element[] {
    return [...this.inputs.values(), ...this.gates.values(), ...this.outputs.values()];
  }

  /**
   * Simulates the whole circuit starting from inputs.
   */
  simulate(): void {
    this.inputs.forEach((input) => {
      this.callStack.clear();
      this.update(input);
    });
  }

  /**
   * Updates the circuit starting from the element.
   */
  update(element: Element): void {
    if (element instanceof Gate) element.run();

    element.connections.forEach(({ receiverId, from, to }) => {
      const receiver = this.find(receiverId);
      if (!receiver) throw new Error(`Element not found ${receiverId}`);

      if (this.callStack.has(receiverId)) return;
      this.callStack.add(receiverId);

      receiver.inputs[to] = element.states[from];
      // If receiver is an output we can just set the state to the receiver input
      if (receiver.type === 'output') receiver.states = receiver.inputs;

      this.update(receiver);
    });
  }

  /**
   * Finds an element in the circuit.
   * @param id Id of the searched element.
   * @returns Circuit element or undefined if element wasn't found.
   */
  find(id: string): Element | undefined {
    return this.elements.find((element) => element.id === id);
  }

  /**
   * Serializes the circuit to an object, so it can be saved in local storage.
   */
  serialize(): SerializedCircuit {
    return {
      inputs: [...this.inputs.values()].map(({ id, type, connections }) => ({
        id,
        type: type as InputType,
        connections
      })),
      gates: [...this.gates.values()].map(({ id, type, connections }) => ({ id, type, connections })),
      outputs: [...this.outputs.values()].map(({ id }) => ({ id }))
    };
  }

  /**
   * Deserializes the object into circuit.
   */
  deserialize({ inputs, gates, outputs }: SerializedCircuit, createdGates: Map<string, SerializedCustomGate>) {
    inputs.forEach(({ id, type, connections }) => {
      const input = ElementFactory.createInput(id, type as InputType);
      input.connections = connections;
      this.inputs.set(id, input);
    });

    gates.forEach(({ id, type, connections }) => {
      if (isBaseGate(type)) {
        const gate = ElementFactory.createBaseGate(id, type);
        gate.connections = connections;
        this.gates.set(id, gate);
      } else {
        const gate = ElementFactory.createCustomGate(id, type, createdGates);
        gate.connections = connections;
        this.gates.set(id, gate);
      }
    });

    outputs.forEach(({ id }) => {
      this.outputs.set(id, ElementFactory.createOutput(id));
    });
  }
}
