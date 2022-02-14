export interface Connection {
  from: number;
  to: number;
  receiverId: string;
}

export class Element {
  states: boolean[] = [];
  inputs: boolean[] = [];
  connections: Connection[] = [];

  constructor(readonly id: string, readonly type: string) {}
}
