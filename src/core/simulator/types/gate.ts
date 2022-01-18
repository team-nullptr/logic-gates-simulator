import { Element } from '../elements/element';

export abstract class Gate extends Element {
  constructor(id: string, type: string) {
    super(id, type);
  }

  /** Executes the gate. If state has changed returns true otherwise false. */
  abstract run(): boolean;
}
