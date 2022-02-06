import { gatesOptions } from '../elements/base-gate';

/**
 * Returns all available gates.
 */
export const fetchGates = () => {
  const raw = localStorage.getItem('saved-gates');
  if (!raw) throw new Error('failed to load saved gates');
  return [...Object.keys(JSON.parse(raw)), ...gatesOptions.keys()];
};
