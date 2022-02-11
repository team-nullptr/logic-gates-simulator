import { Block } from "../canvas/types/Block";
import { FrameButton } from "./types/FrameButton";
import { Connection } from "../canvas/types/Connection";
import { Vector } from "../../common/Vector";
import { Connector } from "../canvas/types/Connector";
import { MutableRefObject } from "react";
import { Button } from "../canvas/types/Button";

export class Adapter {
  offset: Vector = [0, 0];
  size: Vector = [0, 600];

  connecting: [Connector, Vector] | undefined;

  readonly gates = new Map<string, Block>();

  readonly connections: Connection[] = [];

  private readonly __buttons_inputs = new Map<string, Button>();

  private readonly __buttons_outputs = new Map<string, Button>();

  constructor(readonly scrolls: Scrolls) {}

  get inputs(): Map<string, FrameButton> {
    return new Map();
  }

  get outputs(): Map<string, FrameButton> {
    return new Map();
  }

  get buttons(): Button[] {
    let top = 0;

    for (const input of this.__buttons_inputs.values()) {
      input.position = [
        -this.offset[0] + 12,
        top - this.offset[1] - this.scrolls.inputs.current,
      ];
      top += input.height;
    }

    top = 0;

    for (const output of this.__buttons_outputs.values()) {
      output.position = [
        -this.offset[0] + this.size[1],
        top - this.offset[1] - this.scrolls.outputs.current,
      ];
      top += output.height;
    }

    return [
      ...this.__buttons_inputs.values(),
      ...this.__buttons_outputs.values(),
    ];
  }

  connect(connection: Connection) {
    this.connections.push(connection);
  }
}

interface Scrolls {
  inputs: MutableRefObject<number>;
  outputs: MutableRefObject<number>;
}
