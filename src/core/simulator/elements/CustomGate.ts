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

    circuit.inputs.forEach((it) => this.inputs.push(...new Array(it.connectors).fill(false)));
    circuit.outputs.forEach((it) => this.states.push(...new Array(it.connectors).fill(false)));

    this.inputsNames = [...circuit.inputs.values()].map((input) => input.name);
    this.outputsNames = [...circuit.outputs.values()].map((output) => output.name);
  }

  run() {
    [...this.circuit.inputs.values()].forEach((input) => {
      input.states = this.inputs.slice(0, input.states.length);
    });

    this.circuit.simulate();

    let changed = false;
    let currentIndex = 0;
    [...this.circuit.outputs.values()].forEach(({ states }) => {
      for (let i = currentIndex; i < states.length; i++) {
        const previous = this.states[i];
        this.states[i] = states[i - currentIndex];
        changed = changed || previous !== this.states[i];
      }
      currentIndex = states.length;
    });

    return changed;
  }
}
