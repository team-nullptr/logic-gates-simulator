import { Block } from "../../common/Block";
import { FrameButton } from "./types/FrameButton";
import { Connection } from "../canvas/types/Connection";

export class Adapter {
  public readonly gates = new Map<string, Block>();
  public readonly connections: Connection[] = [];

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
