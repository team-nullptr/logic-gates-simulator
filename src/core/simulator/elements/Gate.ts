import { Connection, Element } from './Element';

export interface GateOptions {
  type: string;
  name: string;
  color: string;
}

export abstract class Gate implements Element {
  inputs: boolean[] = [];
  states: boolean[] = [];
  connections: Connection[] = [];

  protected constructor(readonly id: string, readonly type: string, public name: string, readonly color: string) {}

  /** Executes the gate. If state has changed returns true otherwise false. */
  abstract run(): boolean;
}
