export const sort = <T>(input: Set<T>, like: T[]): T[] => {
  const remaining = new Set(input);
  const result: T[] = [];

  for (const item of like) {
    if (!remaining.has(item)) continue;
    result.push(item);
    remaining.delete(item);
  }

  return result.concat(...remaining);
};
