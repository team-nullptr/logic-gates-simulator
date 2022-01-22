import { Block } from "../../common/Block";
import { FrameButton } from "./types/FrameButton";

export class Adapter {
  get gates(): Block[] {
    return [];
  }

  get inputs(): FrameButton[] {
    return [];
  }

  get outputs(): FrameButton[] {
    return [];
  }
}
