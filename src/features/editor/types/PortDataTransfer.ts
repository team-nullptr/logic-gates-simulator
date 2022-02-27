export interface PortDataTransfer {
  readonly id: string;
  readonly side: 'inputs' | 'outputs';
}

export const isPortDataTransfer = (data: unknown): data is PortDataTransfer => {
  if (!data || typeof data !== 'object') return false;
  const assumed = data as PortDataTransfer;
  return typeof assumed.id === 'string' && (assumed.side === 'inputs' || assumed.side === 'outputs');
};
