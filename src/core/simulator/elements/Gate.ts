import { Element } from './Element';

export abstract class Gate extends Element {
  constructor(id: string, type: string, public readonly color: string) {
    super(id, type);
  }

  /** Executes the gate. If state has changed returns true otherwise false. */
  abstract run(): boolean;
}