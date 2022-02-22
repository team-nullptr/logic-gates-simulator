import { Connection, Element } from './Element';

export type PortType = 'input' | 'output';

export class Port implements Element {
  states: boolean[] = [];
  connections: Connection[] = [];

  constructor(readonly id: string, readonly type: PortType, public name: string, readonly connectors: number) {
    this.states = new Array(connectors).fill(false);
  }
}
