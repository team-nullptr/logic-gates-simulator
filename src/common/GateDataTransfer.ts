import { Vector } from './Vector';

export interface GateDataTransfer {
  readonly type: string;
  readonly offset: Vector;
}

export const isGateDataTransfer = (data: any): data is GateDataTransfer => {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.type !== 'string') return false;
  if (!Array.isArray(data.offset) || data.offset.length !== 2) return false;
  return data.offset.every((it: any) => typeof it === 'number');
};
