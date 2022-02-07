import { gatesOptions } from '../elements/base-gate';
import { loadFromLocalStorage } from './serialization';

/**
 * Returns all available gates.
 */
export const fetchGates = () => {
  const serializedGates = loadFromLocalStorage();

  const base = [...gatesOptions.values()].map(
    ({ type, color, inputsCount }) => ({
      type,
      color,
      inputsCount,
      outputsCount: 1
    })
  );

  const custom = Object.entries(serializedGates).map(
    ([type, { color, inputs, outputs }]) => ({
      type,
      color,
      inputsCount: inputs.length,
      outputsCount: outputs.length
    })
  );

  return [...base, ...custom];
};
