import { Connection } from '../types/connection';

export class CircuitElement {
  states: boolean[] = [];
  inputs: boolean[] = [];
  connections: Connection[] = [];

  constructor(readonly id: string, readonly type: string) {}
}
