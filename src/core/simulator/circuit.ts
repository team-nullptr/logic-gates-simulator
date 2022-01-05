import { CircuitElement } from './elements/element';
import { Gate } from './types/gate';

export class Circuit {
  readonly inputs = new Map<string, CircuitElement>();
  readonly gates = new Map<string, Gate>();
  readonly outputs = new Map<string, CircuitElement>();

  simulate() {
    this.inputs.forEach((input) => this.update(input));
  }

  find(id: string) {
    const element = [
      ...this.inputs.values(),
      ...this.gates.values(),
      ...this.outputs.values()
    ].find((element) => element.id === id);

    if (!element) throw new Error('element not found');
    return element;
  }

  update(element: CircuitElement) {
    if (element instanceof Gate) element.run();

    element.connections.forEach(({ receiverId, from, to }) => {
      const receiver = this.getReceiver(receiverId);
      receiver.inputs[to] = element.states[from];
      setTimeout(() => this.update(receiver), 100);
    });
  }

  getEmitter(id: string) {
    const emitter = this.gates.get(id) ?? this.inputs.get(id);
    if (!emitter) throw new Error('gate not found');
    return emitter;
  }

  getReceiver(id: string) {
    const receiver = this.gates.get(id) ?? this.outputs.get(id);
    if (!receiver) throw new Error('gate not found');
    return receiver;
  }
}
