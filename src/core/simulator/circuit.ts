import { v4 as uuid } from 'uuid';
import { BaseGate, gatesOptions, isBaseGate } from './elements/base-gate';
import { CutomGate } from './elements/cutom-gate';
import { CircuitElement } from './elements/element';
import { Gate } from './types/gate';
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
  readonly inputs = new Map<string, CircuitElement>();
  readonly gates = new Map<string, Gate>();
  readonly outputs = new Map<string, CircuitElement>();

  /**
   * All elements in the circuit.
   */
  get allElements(): CircuitElement[] {
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
  update(element: CircuitElement): void {
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

    if (element === 'input') this.addInput(id);
    else if (element === 'output') this.addOutput(id);
    else this.addGate(id, element);

    return id;
  }

  /**
   * Toggles element state to true.
   * @param id Id of an element.
   */
  toggle(id: string): void {
    const element = this.find(id);

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
  find(id: string): CircuitElement | undefined {
    return this.allElements.find((element) => element.id === id);
  }

  /**
   * Adds input to the simulator's circuit.
   * @param id Id of the inserted input.
   */
  private addInput(id: string): void {
    const input = new CircuitElement(id, 'input');
    input.states[0] = false;
    this.inputs.set(id, input);
  }

  /**
   * Adds output to the simulator's circuit.
   * @param id Id of the inserted element.
   */
  private addOutput(id: string): void {
    this.outputs.set(id, new CircuitElement(id, 'output'));
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
      const serialized = loadFromLocalStorage(element);
      const deserialized = deserialize(serialized);
      this.gates.set(id, new CutomGate(id, element, deserialized));
    }
  }
}
