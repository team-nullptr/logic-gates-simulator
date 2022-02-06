import { Tool } from "./Tool";
import { PanTool } from "./Pan";

export type ToolType = "pan" | "move" | "connect";

export class ToolFactory {
  private static readonly tools: { [k: string]: Tool } = {
    pan: new PanTool(),
    move: new (class extends Tool {})(),
    connect: new (class extends Tool {})(),
  };

  static get(tool: ToolType): Tool {
    return ToolFactory.tools[tool];
  }
}
