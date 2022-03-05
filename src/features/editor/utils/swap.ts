export const swap = <T>(arr: T[], a: number, b: number): void => {
  const [removed] = arr.splice(a, 1);
  arr.splice(b, 0, removed);
};
