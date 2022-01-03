import { BaseGate, gatesOptions, isBaseGate } from '../elements/base-gate';
import { CutomGate } from '../elements/cutom-gate';
import { CircuitElement } from '../elements/element';
import { Connection } from '../types/connection';
import { Gate } from '../types/gate';

export interface SerializedCustomGate {
  inputs: {
    id: string;
    connections: Connection[];
  }[];
  gates: {
    id: string;
    element: string;
    connections: Connection[];
  }[];
  outputs: {
    id: string;
  }[];
}

export interface DeserializedCustomGate {
  inputs: CircuitElement[];
  gates: Gate[];
  outputs: CircuitElement[];
}

export const loadFromLocalStorage = (element: string): SerializedCustomGate => {
  const raw = localStorage.getItem(element);
  if (!raw) throw new Error('failed to load custom gate');
  return JSON.parse(raw);
};

export const deserialize = (
  serialized: SerializedCustomGate
): DeserializedCustomGate => {
  const deserialized: DeserializedCustomGate = {
    inputs: [],
    gates: [],
    outputs: []
  };

  serialized.inputs.forEach(({ id, connections }) => {
    const input = new CircuitElement(id, 'input');
    input.connections.push(...connections);
    deserialized.inputs.push(input);
  });

  serialized.gates.forEach(({ id, element, connections }) => {
    let gate: Gate;

    if (isBaseGate(element)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const options = gatesOptions.get(element)!;
      gate = new BaseGate(id, options);
    } else {
      const serializedChild = loadFromLocalStorage(element);
      const deserializedChild = deserialize(serializedChild);
      gate = new CutomGate(id, element, deserializedChild);
    }

    gate.connections.push(...connections);
    deserialized.gates.push(gate);
  });

  serialized.outputs.forEach(({ id }) => {
    const output = new CircuitElement(id, 'output');
    deserialized.outputs.push(output);
  });

  return deserialized;
};
