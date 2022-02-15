import { Connectors } from "./Connectors";

export interface Connector {
  group: Connectors;
  at: number;
}

export const isConnector = (object: any): object is Connector => {
  if (!object) return false;
  const { group, at } = object;
  return typeof at === "number" && group instanceof Connectors;
};
