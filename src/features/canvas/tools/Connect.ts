import { Tool } from "./Tool";
import { Interaction } from "../types/Interaction";
import { Connector, isConnector } from "../types/Connector";
import { Connection } from "../types/Connection";

export class ConnectTool extends Tool {
  handleMouseDown(interaction: Interaction) {
    if (!this.source) return;

    const { position, target } = interaction;
    this.source.connecting = [target as Connector, position];
  }

  handleMouseMove(interaction: Interaction) {
    if (!this.source?.connecting) return;
    this.source.connecting[1] = interaction.position;
  }

  handleMouseUp(interaction: Interaction) {
    if (!this.source?.connecting) return;

    const { target } = interaction;
    if (isConnector(target)) {
      const source = this.source.connecting[0];

      const connection: Connection = [source, target];
      if (source.type === "input") connection.reverse();
      this.source.connect(connection);
    }

    this.source.connecting = undefined;
  }
}
