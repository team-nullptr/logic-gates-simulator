import { Interaction } from "../types/Interaction";

export abstract class Tool {
  handleMouseDown(interaction: Interaction): void {}

  handleMouseUp(interaction: Interaction): void {}

  handleMouseMove(interaction: Interaction): void {}
}
