import { v4 as uuid } from 'uuid';
import { BaseGate, gatesOptions, isBaseGate } from './elements/base-gate';
import { CustomGate } from './elements/custom-gate';
import { Element } from './elements/element';
import { Gate } from './types/gate';
import { inputType } from './types/elements';
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

export class Circuit {
  readonly inputs = new Map<string, Element>();
  readonly gates = new Map<string, Gate>();
  readonly outputs = new Map<string, Element>();

  /**
   * All elements in the circuit.
   */
  get allElements(): Element[] {
    return [
      ...this.inputs.values(),
      ...this.gates.values(),
      ...this.outputs.values()
    ];
  }

  /**
   * Simulates the whole circuit starting from inputs.
   */
  simulate(): void {
    this.inputs.forEach((input) => this.update(input));
  }

  /**
   * Updates the circuit starting from the element.
   */
  update(element: Element): void {
    if (element instanceof Gate) element.run();

    element.connections.forEach(({ receiverId, from, to }) => {
      const receiver = this.find(receiverId);

      if (!receiver) throw new Error(`Element not found ${receiverId}`);

      receiver.inputs[to] = element.states[from];
      setTimeout(() => this.update(receiver), 100);
    });
  }

  /**
   * Adds the element to the circuit.
   * @param element added element
   */
  add(element: string) {
    const id = uuid();

    if (element === 'input' || element === 'input-group')
      this.addInput(id, element as inputType);
    else if (element === 'output') this.addOutput(id);
    else this.addGate(id, element);

    return id;
  }

  /**
   * Connects two gates together.
   * @param request Information required to connect two gates together.
   */
  connect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.find(emitterId);

    if (!emitter || !this.find(receiverId))
      throw new Error(`Element not found: ${emitter ? emitterId : receiverId}`);

    emitter.connections.push({ from, to, receiverId });
    this.simulate();
  }

  /**
   * Disconnects two gates from each other.
   * @param request Information required to disconnect the gates.
   */
  disconnect({ elementId, targetId, from, to }: DisconnectRequest): void {
    const element = this.find(elementId);
    const target = this.find(targetId);

    if (!target || !element)
      throw new Error(`Element not found: ${element ? targetId : elementId}`);

    element.connections = element.connections.filter(
      (connection) =>
        connection.receiverId != targetId &&
        connection.from == from &&
        connection.to == to
    );

    target.inputs[to] = false;
    this.update(target);
  }

  /**
   * Removes element from the circuit.
   * @param id Id of removed element.
   */
  remove(id: string): void {
    const element = this.find(id);
    if (!element) throw new Error(`Element not found: ${id}`);

    // remove all element's connections
    element.connections.forEach(({ receiverId, to }) => {
      const receiver = this.find(receiverId);
      if (!receiver) throw new Error(`Element not found: ${receiver}`);

      receiver.inputs[to] = false;
      this.update(receiver);
    });

    // remove all connections to the element.
    this.allElements.forEach((element) => {
      element.connections = element.connections.filter(
        (connection) => connection.receiverId !== id
      );
    });

    // remove gate from the circuit.
    [this.inputs, this.gates, this.outputs].forEach((set) => set.delete(id));
  }

  /**
   * Finds an element in the circuit.
   * @param id Id of the searched element.
   * @returns Circuit element or undefined if element wasn't found.
   */
  find(id: string): Element | undefined {
    return this.allElements.find((element) => element.id === id);
  }

  /**
   * Adds input to the simulator's circuit.
   * @param id Id of the inserted input.
   */
  private addInput(id: string, type: inputType): void {
    const input = new Element(id, type);
    input.states[0] = false;
    this.inputs.set(id, input);
  }

  /**
   * Adds output to the simulator's circuit.
   * @param id Id of the inserted element.
   */
  private addOutput(id: string): void {
    this.outputs.set(id, new Element(id, 'output'));
  }

  /**
   * Adds gate to the simulator's circuit.
   * @param id Id of the inserted element.
   * @param element Type of the inserted element.
   */
  private addGate(id: string, element: string): void {
    if (isBaseGate(element)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const options = gatesOptions.get(element)!;
      this.gates.set(id, new BaseGate(id, options));
    } else {
      const serializedGates = loadFromLocalStorage();

      const serializedGate = serializedGates[element];
      if (!serializedGate) throw new Error('gate not found');

      const deserialized = deserialize(serializedGate, serializedGates);
      this.gates.set(id, new CustomGate(id, element, deserialized));
    }
  }
}
