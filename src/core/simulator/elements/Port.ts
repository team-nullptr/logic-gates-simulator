import { Connection, Element } from './Element';

export class Port implements Element {
  states: boolean[] = [];
  connections: Connection[] = [];

  constructor(readonly id: string, readonly type: string, public name: string) {}
}
