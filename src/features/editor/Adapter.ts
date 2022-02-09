import { Block } from "../../common/Block";
import { FrameButton } from "./types/FrameButton";
import { Connection } from "../canvas/types/Connection";
import { Vector } from "../../common/Vector";
import { Connector } from "../canvas/types/Connector";

export class Adapter {
  offset: Vector = [0, 0];

  connecting: [Connector, Vector] | undefined;

  readonly gates = new Map<string, Block>();

  readonly connections: Connection[] = [];

  get inputs(): Map<string, FrameButton> {
    return new Map();
  }

  get outputs(): Map<string, FrameButton> {
    return new Map();
  }

  connect(connection: Connection) {
    this.connections.push(connection);
  }
}
