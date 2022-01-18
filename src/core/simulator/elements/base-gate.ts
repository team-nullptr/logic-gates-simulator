import { Gate } from '../types/gate';

export type BaseGateType = 'not' | 'or' | 'and' | 'nand';

/* checks if gate is base gate */
export const isBaseGate = (gate: string): gate is BaseGateType => {
  return gate === 'not' || gate === 'or' || gate === 'and' || gate === 'nand';
};

export interface BaseGateOptions {
  type: string;
  inputsCount: number;
  handler: (input: boolean[]) => boolean;
}

/* options for base gates */
export const gatesOptions = new Map<BaseGateType, BaseGateOptions>([
  ['not', { type: 'not', inputsCount: 1, handler: ([a]: boolean[]) => !a }],
  [
    'or',
    { type: 'not', inputsCount: 2, handler: ([a, b]: boolean[]) => a || b }
  ],
  [
    'and',
    { type: 'and', inputsCount: 2, handler: ([a, b]: boolean[]) => a && b }
  ],
  [
    'nand',
    { type: 'nand', inputsCount: 2, handler: ([a, b]: boolean[]) => !(a && b) }
  ]
]);

export class BaseGate extends Gate {
  readonly handler: (inputs: boolean[]) => boolean;

  constructor(id: string, { type, inputsCount, handler }: BaseGateOptions) {
    super(id, type);
    for (let i = 0; i < inputsCount; i++) this.inputs.push(false);
    this.handler = handler;
  }

  run() {
    const previous = this.states[0];
    this.states[0] = this.handler(this.inputs);
    return this.states[0] !== previous;
  }
}
