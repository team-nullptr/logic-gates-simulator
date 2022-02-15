import { Interaction } from "../types/Interaction";
import { Adapter } from "../../editor/Adapter";

export abstract class Tool {
  source?: Adapter;

  handleMouseDown(interaction: Interaction): void {}

  handleMouseUp(interaction: Interaction): void {}

  handleMouseMove(interaction: Interaction): void {}
}
