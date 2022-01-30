import { Block } from "../../common/Block";
import { FrameButton } from "./types/FrameButton";
import { Connection } from "../canvas/types/Connection";

export class Adapter {
  public readonly gates: Block[] = [];
  public readonly connections: Connection[] = [];

  get inputs(): FrameButton[] {
    return [];
  }

  get outputs(): FrameButton[] {
    return [];
  }
}
