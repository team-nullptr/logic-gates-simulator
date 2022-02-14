import { Gate, GateOptions } from './Gate';
import { Circuit } from '../Circuit';

import { SerializedCircuit } from '../Circuit';

export interface SerializedCustomGate {
  type: string;
  color: string;
  circuit: SerializedCircuit;
}

export class CustomGate extends Gate {
  constructor(id: string, readonly circuit: Circuit, options: GateOptions) {
    super(id, options);

    this.inputs = new Array(circuit.inputs.size).fill(false);
    this.states = new Array(circuit.outputs.size).fill(false);
  }

  run() {
    [...this.circuit.inputs.values()].forEach((input, index) => {
      input.states[0] = this.inputs[index];
    });

    this.circuit.simulate();

    let changed = false;
    [...this.circuit.outputs.values()].forEach(({ states }, index) => {
      const previous = this.states[index];
      this.states[index] = states[0];
      changed = previous !== this.states[index];
    });

    return changed;
  }
}
