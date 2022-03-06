import { Vector } from '../../../common/Vector';

export interface Block {
  readonly height: number;
  position: Vector;
  connections: string[];
}

export const cleanup = (blocks: Map<string, Block>, beginnings: string[]) => {
  const recursive = (id: string, [x, y]: Vector, path = new Set<string>()): number => {
    if (path.has(id)) return y;
    path.add(id);

    const block = blocks.get(id);
    if (!block) return y;

    block.position = fit(block.position, [x, y]);
    const { height, connections } = block;
    const [bx, by] = block.position;

    let current = by;
    for (const branch of connections) {
      const next = recursive(branch, [bx + 1, current], new Set(path));
      current = Math.max(current, next);
    }

    return Math.max(y, current, by + height + 1);
  };

  let row = 0;
  for (const id of beginnings) {
    row = recursive(id, [0, row]);
  }
};

const fit = (current: Vector, next: Vector): Vector => {
  const [cx, cy] = current;
  const [nx, ny] = next;

  return [Math.max(cx, nx), Math.min(cy, ny)];
};
