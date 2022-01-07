import { CircuitElement } from './elements/element';
import { Gate } from './types/gate';

export class Circuit {
  readonly inputs = new Map<string, CircuitElement>();
  readonly gates = new Map<string, Gate>();
  readonly outputs = new Map<string, CircuitElement>();

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
   * Finds an element in the circuit.
   * @param id Id of the searched element.
   * @returns Circuit element or undefined if element wasn't found.
   */
  find(id: string): CircuitElement | undefined {
    return [
      ...this.inputs.values(),
      ...this.gates.values(),
      ...this.outputs.values()
    ].find((element) => element.id === id);
  }
}
