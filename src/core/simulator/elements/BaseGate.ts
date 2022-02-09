import { Gate } from './Gate';

export type BaseGateType = 'not' | 'or' | 'and' | 'nand';

/* checks if gate is base gate */
export const isBaseGate = (type: string): type is BaseGateType => {
  return !![...gatesOptions.keys()].find((key) => key == type);
};

export interface BaseGateOptions {
  type: string;
  color: string;
  inputsCount: number;
  handler: (input: boolean[]) => boolean;
}

/* options for base gates */
export const gatesOptions = new Map<BaseGateType, BaseGateOptions>([
  [
    'not',
    {
      type: 'not',
      color: '#f7e813',
      inputsCount: 1,
      handler: ([a]: boolean[]) => !a
    }
  ],
  [
    'or',
    {
      type: 'or',
      color: '#13f750',
      inputsCount: 2,
      handler: ([a, b]: boolean[]) => a || b
    }
  ],
  [
    'and',
    {
      type: 'and',
      color: '#1398f7',
      inputsCount: 2,
      handler: ([a, b]: boolean[]) => a && b
    }
  ],
  [
    'nand',
    {
      type: 'nand',
      color: '#ba13f7',
      inputsCount: 2,
      handler: ([a, b]: boolean[]) => !(a && b)
    }
  ]
]);

export class BaseGate extends Gate {
  readonly handler: (inputs: boolean[]) => boolean;

  constructor(
    id: string,
    { type, color, inputsCount, handler }: BaseGateOptions
  ) {
    super(id, type, color);
    for (let i = 0; i < inputsCount; i++) this.inputs.push(false);
    this.handler = handler;
  }

  run() {
    const previous = this.states[0];
    this.states[0] = this.handler(this.inputs);
    return this.states[0] !== previous;
  }
}
