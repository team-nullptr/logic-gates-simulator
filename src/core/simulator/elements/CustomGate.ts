import { Gate, GateOptions } from './Gate';
import { Circuit } from '../Circuit';

import { SerializedCircuit } from '../Circuit';

export interface SerializedCustomGate {
  type: string;
  name: string;
  color: string;
  circuit: SerializedCircuit;
}

export class CustomGate extends Gate {
  readonly inputsNames: string[];
  readonly outputsNames: string[];

  constructor(id: string, readonly circuit: Circuit, { type, name, color }: GateOptions) {
    super(id, type, name, color);

    this.inputs = new Array(circuit.inputs.size).fill(false);
    this.states = new Array(circuit.outputs.size).fill(false);

    this.inputsNames = [...circuit.inputs.values()].map((input) => input.name);
    this.outputsNames = [...circuit.outputs.values()].map((output) => output.name);
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
