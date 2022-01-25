import { Circuit } from '../circuit';
import { BaseGate, gatesOptions, isBaseGate } from '../elements/base-gate';
import { CustomGate } from '../elements/custom-gate';
import { Element } from '../elements/element';
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
  inputs: Element[];
  gates: Gate[];
  outputs: Element[];
}

export type SavedGates = {
  [key: string]: SerializedCustomGate;
};

/**
 * Loads serialized gate from local storage.
 * @param element element (gate)
 * @returns serialized gate
 */
export const loadFromLocalStorage = (element: string): SerializedCustomGate => {
  const raw = localStorage.getItem('saved-gates');
  if (!raw) throw new Error(`failed to load saved gates`);

  const gate = (JSON.parse(raw) as SavedGates)[element];
  if (!gate) throw new Error('gate not found');

  return gate;
};

/**
 * serializes circuit.
 * @param name gate name
 * @param circuit circuit
 */
export const serialize = (name: string, circuit: Circuit) => {
  const serialized: SerializedCustomGate = {
    inputs: [],
    gates: [],
    outputs: []
  };

  circuit.inputs.forEach(({ id, connections }) =>
    serialized.inputs.push({ id, connections })
  );

  circuit.gates.forEach(({ id, type, connections }) =>
    serialized.gates.push({ id, element: type, connections })
  );

  circuit.outputs.forEach(({ id }) => serialized.outputs.push({ id }));

  const savedGates = localStorage.getItem('saved-gates');
  if (!savedGates) throw new Error('failed to load stored gates.');

  localStorage.setItem(
    'saved-gates',
    JSON.stringify({
      ...JSON.parse(savedGates),
      [name]: serialized
    })
  );
};

/**
 * deserializes serialized gate.
 * @param serialized serialized gate
 * @returns deserialized gate
 */
export const deserialize = (
  serialized: SerializedCustomGate
): DeserializedCustomGate => {
  const deserialized: DeserializedCustomGate = {
    inputs: [],
    gates: [],
    outputs: []
  };

  serialized.inputs.forEach(({ id, connections }) => {
    const input = new Element(id, 'input');
    input.connections.push(...connections);
    deserialized.inputs.push(input);
  });

  serialized.gates.forEach(({ id, element, connections }) => {
    let gate: Gate;

    if (isBaseGate(element)) {
      // TODO: probably should handle the error when options are missing.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const options = gatesOptions.get(element)!;
      gate = new BaseGate(id, options);
    } else {
      const serializedChild = loadFromLocalStorage(element);
      const deserializedChild = deserialize(serializedChild);
      gate = new CustomGate(id, element, deserializedChild);
    }

    gate.connections.push(...connections);
    deserialized.gates.push(gate);
  });

  serialized.outputs.forEach(({ id }) => {
    const output = new Element(id, 'output');
    deserialized.outputs.push(output);
  });

  return deserialized;
};
