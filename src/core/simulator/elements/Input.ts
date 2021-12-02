import { Connection } from "./interfaces/Connection";

export class Input {
  state: boolean[] = [false];
  connections: Connection[] = [];

  constructor(readonly id: string) {}
}
