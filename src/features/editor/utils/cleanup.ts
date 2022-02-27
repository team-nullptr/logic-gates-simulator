import { Vector } from '../../../common/Vector';
import { exclude } from '../../../common/utils';

type Connection = [from: string, to: string];

export const cleanup = (
  blocks: Map<string, number>,
  connections: Connection[],
  order: string[] = []
): Map<string, Vector> => {
  const grouped = group(connections);

  const positions = new Map<string, Vector>();
  for (const key of blocks.keys()) {
    positions.set(key, [0, Infinity]);
  }

  const recursive = (id: string, column: number, row: number, path = new Set<string>()): number => {
    if (path.has(id)) return row;

    const gate = positions.get(id);
    if (!gate) return row;

    gate[0] = Math.max(gate[0], column);
    gate[1] = Math.min(gate[1], row);

    const height = blocks.get(id);
    if (!height) return row;

    const branches = grouped.get(id);
    if (!branches) return gate[1] + height + 1;

    let offset = 0;
    for (const branch of branches) {
      const height = blocks.get(branch);
      if (!height) continue;

      recursive(branch, gate[0] + 1, gate[1] + offset, new Set([...path, id]));
      offset += height + 1;
    }

    return Math.max(gate[1] + height + 1, gate[1] + offset);
  };

  let row = 0;
  for (const gate of order) {
    row = recursive(gate, 0, row);
  }

  const floating = exclude(new Set(blocks.keys()), new Set(connections.map((it) => it[1])));
  order.forEach((it) => floating.delete(it));

  for (const gate of floating) {
    row = recursive(gate, 0, row);
  }

  const untouched = [...positions.entries()].filter((entry) => entry[1][1] === Infinity).map((it) => it[0]);

  for (const id of untouched) {
    const gate = positions.get(id);
    if (!gate || gate[1] !== Infinity) continue;

    row = recursive(id, 0, row);
  }

  return positions;
};

const group = (connections: Connection[]) => {
  const grouped = new Map<string, Set<string>>();

  for (const [from, to] of connections) {
    if (grouped.has(from)) {
      grouped.get(from)?.add(to);
    } else {
      grouped.set(from, new Set([to]));
    }
  }

  return grouped;
};
