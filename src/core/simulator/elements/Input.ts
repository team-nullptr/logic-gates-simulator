import { Connection } from "./interfaces/Connection";

/**
 * Circuit input.
 */
export class Input {
  state: boolean[] = [false];
  outputs: Connection[] = [];

  constructor(readonly id: string) {}
}
