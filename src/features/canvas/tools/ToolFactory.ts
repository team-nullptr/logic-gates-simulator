import { Tool } from "./Tool";
import { PanTool } from "./Pan";
import { MoveTool } from "./Move";
import { ConnectTool } from "./Connect";

export type ToolType = "pan" | "move" | "connect";

export class ToolFactory {
  private static readonly tools: { [k: string]: Tool } = {
    pan: new PanTool(),
    move: new MoveTool(),
    connect: new ConnectTool(),
  };

  static get(tool: ToolType): Tool {
    return ToolFactory.tools[tool];
  }
}
