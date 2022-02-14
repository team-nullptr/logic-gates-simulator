import { Element } from './Element';

export interface GateOptions {
  type: string;
  color: string;
}

export abstract class Gate extends Element {
  public readonly color: string;

  protected constructor(id: string, { type, color }: GateOptions) {
    super(id, type);
    this.color = color;
  }

  /** Executes the gate. If state has changed returns true otherwise false. */
  abstract run(): boolean;
}
