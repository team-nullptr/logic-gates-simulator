import { Connection } from "./Connection";

/**
 * Represents a valid gate object.
 */
export interface Gate {
  id: string;
  inputs: boolean[];
  states: boolean[];
  outputs: Connection[];

  /**
   * Executes the gate.
   */
  run(): void;
}
