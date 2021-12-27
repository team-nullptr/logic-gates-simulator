import { Connection } from "./types/connection";

export class Input {
  states: boolean[] = [false];
  connections: Connection[] = [];

  constructor(readonly id: string) {}
}
