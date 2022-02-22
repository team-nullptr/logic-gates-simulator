export const getRandomLetter = (): string => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
};
