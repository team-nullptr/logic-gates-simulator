import { Connector, isConnector } from './Connector';

export interface Connection {
  from: Connector;
  to: Connector;
}

export const isConnection = (object: any): object is Connection => {
  if (!object) return false;
  const { from, to } = object;
  return isConnector(from) && isConnector(to);
};
