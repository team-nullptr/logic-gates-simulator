export const toBinaryArray = (number: number, length: number) => {
  const bits: boolean[] = new Array(length).fill(false);
  const binary = number
    .toString(2)
    .split("")
    .map((it) => it === "1")
    .reverse();

  binary.forEach((bit, i) => {
    if (i >= length) return;
    bits[i] = bit;
  });

  return bits;
};
