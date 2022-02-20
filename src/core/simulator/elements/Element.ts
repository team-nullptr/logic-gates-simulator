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
