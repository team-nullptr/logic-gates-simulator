import { Gate } from '../../core/simulator/elements/Gate';
import { Vector } from '../../common/Vector';
import { Block } from '../canvas/types/Block';
import { snapToGrid } from '../canvas/utils';
import { label } from './utils/label';
import { Port } from '../../core/simulator/elements/Port';
import { Button } from '../canvas/types/Button';
import { Connection } from '../canvas/types/Connection';
import { ConnectRequest } from '../../core/simulator/Simulator';

export class Builder {
  static buildBlock(gate: Gate, at: Vector): Block {
    const snapped = snapToGrid(at);
    const labels = label(gate);
    const { id, name, color, inputs, states } = gate;
    return new Block(id, name, color, snapped, inputs, states, ...labels);
  }

  static buildButton(port: Port): Button {
    const { id, type, states, name } = port;
    return new Button(id, [0, 0], type, states, name);
  }

  static buildConnectRequest(connection: Connection): ConnectRequest {
    const { from, to } = connection;
    return { emitterId: from.group.parent.id, receiverId: to.group.parent.id, from: from.at, to: to.at };
  }
}
