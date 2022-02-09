import { Element } from './elements/Element';
import { Gate } from './elements/Gate';
import { ElementFactory } from './elements/ElementFactory';
import { v4 as uuid } from 'uuid';

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
  private simulate(): void {
    this.inputs.forEach((input) => this.update(input));
  }

  /**
   * Updates the circuit starting from the element.
   */
  private update(element: Element): void {
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
   * @param type added element type
   */
  add(type: string) {
    const id = uuid();

    switch (type) {
      case 'input':
      case 'input-group':
        this.inputs.set(id, ElementFactory.createInput(id, type));
        break;
      case 'output':
        this.outputs.set(id, ElementFactory.createOutput(id));
        break;
      default:
        this.gates.set(id, ElementFactory.createGate(id, type));
        break;
    }

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
}
