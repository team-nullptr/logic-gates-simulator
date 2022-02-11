import { Block } from '../../common/Block';
import { FrameButton } from './types/FrameButton';
import { Connection } from '../canvas/types/Connection';
import { Vector } from '../../common/Vector';
import { Connector } from '../canvas/types/Connector';

export class Adapter {
  offset: Vector = [0, 0];

  connecting: [Connector, Vector] | undefined;

  readonly gates = new Map<string, Block>([
    ['test-and', new Block('test-and', 'AND', 'hsl(266,99%,64%)', [4, 4], [true, false], [false])],
    ['test-not', new Block('test-not', 'NOT', 'hsl(355,99%,64%)', [1, 6], [false], [false])],
    [
      'test-custom',
      new Block(
        'test-custom',
        'CUSTOM',
        'hsl(43,99%,64%)',
        [1, 1],
        [false, false, true, false],
        [true, false]
      )
    ]
  ]);

  readonly connections: Connection[] = [
    [
      { block: this.gates.get('test-custom')!, type: 'output', index: 1 },
      { block: this.gates.get('test-and')!, type: 'input', index: 0 }
    ],
    [
      { block: this.gates.get('test-not')!, type: 'output', index: 0 },
      { block: this.gates.get('test-and')!, type: 'input', index: 1 }
    ]
  ];

  get inputs(): Map<string, FrameButton> {
    return new Map([
      ['11ec', { id: '11ec', type: 'single', value: true, letter: 'A' }],
      ['90d6', { id: '90d6', type: 'single', value: false, letter: 'B' }]
    ]);
  }

  get outputs(): Map<string, FrameButton> {
    return new Map([['91ec', { id: '91ec', type: 'single', value: true, letter: 'O' }]]);
  }

  connect(connection: Connection) {
    this.connections.push(connection);
  }
}
