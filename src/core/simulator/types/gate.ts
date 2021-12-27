import { Connection } from "./connection";

/** Represents a valid gate object. */
export interface Gate {
  id: string;
  inputs: boolean[];
  states: boolean[];
  connections: Connection[];

  /** Executes the gate. */
  run(): boolean;
}
