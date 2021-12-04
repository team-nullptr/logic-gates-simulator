import { Connection } from "./interfaces/Connection";

export class Input {
  states: boolean[] = [false];
  connections: Connection[] = [];

  constructor(readonly id: string) {}
}
