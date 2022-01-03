import { Circuit } from './circuit';
import { v4 as uuid } from 'uuid';
import { CircuitElement } from './elements/element';
import { BaseGate, gatesOptions, isBaseGate } from './elements/base-gate';
import { CutomGate } from './elements/cutom-gate';
import { deserialize, loadFromLocalStorage } from './util/serialization';

/** Represents a connection request. */
interface ConnectRequest {
  emitterId: string;
  receiverId: string;
  from: number;
  to: number;
}

export class Simulator {
  circuit = new Circuit();

  add(element: string) {
    const id = uuid();

    switch (element) {
      case 'input': {
        const input = new CircuitElement(id, element);
        input.states[0] = false;
        this.circuit.inputs.set(id, input);
        break;
      }
      case 'output':
        this.circuit.outputs.set(id, new CircuitElement(id, element));
        break;
      default: {
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

    return id;
  }

  toggle(id: string) {
    const input = this.circuit.inputs.get(id);
    if (!input) throw new Error('input not found');
    input.states[0] = true;
  }

  connect({ emitterId, receiverId, from, to }: ConnectRequest) {
    const emitter =
      this.circuit.gates.get(emitterId) ?? this.circuit.inputs.get(emitterId);

    const receiver =
      this.circuit.gates.get(receiverId) ??
      this.circuit.outputs.get(receiverId);

    if (!emitter || !receiver) {
      throw new Error('unable to get gates');
    }

    emitter.connections.push({ from, to, receiverId });
    this.circuit.simulate();
  }

  disconnect() {
    // TODO: disconnect gates from eachother
  }

  remove() {
    // TODO: remove gate from the circuit
  }
}
