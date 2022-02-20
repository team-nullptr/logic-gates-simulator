export interface Connection {
  from: number;
  to: number;
  receiverId: string;
}

export interface Element {
  id: string;
  type: string;
  connections: Connection[];
  states: boolean[];
}

export class Port implements Element {
  states: boolean[] = [];
  connections: Connection[] = [];

  constructor(readonly id: string, readonly type: string, public name: string) {}
}
