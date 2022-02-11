import { Connection } from '../types/Connection';

export class Element {
  states: boolean[] = [];
  inputs: boolean[] = [];
  connections: Connection[] = [];

  constructor(readonly id: string, readonly type: string) {}
}
