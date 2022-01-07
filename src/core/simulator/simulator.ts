import { Circuit } from './circuit';
import { v4 as uuid } from 'uuid';
import { CircuitElement } from './elements/element';
import { BaseGate, gatesOptions, isBaseGate } from './elements/base-gate';
import { CutomGate } from './elements/cutom-gate';
import { deserialize, loadFromLocalStorage } from './util/serialization';

interface ConnectRequest {
  emitterId: string;
  receiverId: string;
  from: number;
  to: number;
}

interface DisconnectRequest {
  elementId: string;
  targetId: string;
  from: number;
  to: number;
}

export class Simulator {
  circuit = new Circuit();

  /**
   * Adds the element to the circuit.
   * @param element added element
   */
  add(element: string) {
    const id = uuid();

    switch (element) {
      case 'input':
        this.addInput(id, element);
        break;
      case 'output':
        this.addOutput(id, element);
        break;
      default:
        this.addGate(id, element);
    }

    return id;
  }

  /**
   * Toggles element state to true.
   * @param id Id of an element.
   */
  toggle(id: string): void {
    const element = this.circuit.find(id);

    if (!element) throw new Error(`Element not found: ${id}`);
    if (element.type !== 'input')
      throw new Error("Only input's state can be toggled");

    element.states[0] = true;
  }

  /**
   * Connects two gates together.
   * @param request Information required to connect two gates together.
   */
  connect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);

    if (!emitter || !this.circuit.find(receiverId))
      throw new Error(`Element not found: ${emitter ? emitterId : receiverId}`);

    emitter.connections.push({ from, to, receiverId });
    this.circuit.simulate();
  }

  /**
   * Disconnects two gates from each other.
   * @param request Information required to disconnect the gates.
   */
  disconnect({ elementId, targetId, from, to }: DisconnectRequest): void {
    const element = this.circuit.find(elementId);
    const target = this.circuit.find(targetId);

    if (!target || !element)
      throw new Error(`Element not found: ${element ? targetId : elementId}`);

    element.connections = element.connections.filter(
      (connection) =>
        connection.receiverId != targetId &&
        connection.from == from &&
        connection.to == to
    );

    target.inputs[to] = false;
    this.circuit.update(target);
  }

  remove(id: string): void {
    // TODO: remove gate from the circuit
  }

  private addInput(id: string, element: string): void {
    const input = new CircuitElement(id, element);
    input.states[0] = false;
    this.circuit.inputs.set(id, input);
  }

  private addOutput(id: string, element: string): void {
    this.circuit.outputs.set(id, new CircuitElement(id, element));
  }

  private addGate(id: string, element: string): void {
    if (isBaseGate(element)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const options = gatesOptions.get(element)!;
      this.circuit.gates.set(id, new BaseGate(id, options));
    } else {
      const serialized = loadFromLocalStorage(element);
      const deserialized = deserialize(serialized);
      this.circuit.gates.set(id, new CutomGate(id, element, deserialized));
    }
  }
}
