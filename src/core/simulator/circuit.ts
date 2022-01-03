import { CircuitElement } from './elements/element';
import { Gate } from './types/gate';
import { BaseGate } from './elements/base-gate';
import { CutomGate } from './elements/cutom-gate';

/** Update represents data required for gate update. */
interface Update {
  to: number;
  receiverId: string;
  state: boolean;
}

export class Circuit {
  readonly inputs = new Map<string, CircuitElement>();
  readonly gates = new Map<string, Gate>();
  readonly outputs = new Map<string, CircuitElement>();

  private callStack = new Set<string>();

  /** Simulates execution of a circuit. */
  simulate() {
    this.inputs.forEach(({ connections, states }) => {
      this.callStack.clear();
      connections.forEach(({ from, to, receiverId }) => {
        this.update({ to, receiverId, state: states[from] });
      });
    });
  }

  /** Simulates execution of a single step in simulation. */
  private update({ to, receiverId, state }: Update) {
    const receiver = this.gates.get(receiverId) ?? this.outputs.get(receiverId);
    if (!receiver) throw new Error(`element not found: ${receiverId}`);

    if (!(receiver instanceof BaseGate || receiver instanceof CutomGate)) {
      receiver.states[0] = state;
      return;
    }

    receiver.inputs[to] = state;
    if (!receiver.run()) return;

    if (this.callStack.has(receiverId))
      throw new Error('detected infinite loop');
    this.callStack.add(receiverId);

    receiver.connections.forEach(({ from, to, receiverId }) =>
      this.update({ to, receiverId, state: receiver.states[from] })
    );
  }
}
