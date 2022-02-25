import { Vector } from './Vector';
import { MouseEvent as ReactMouseEvent } from 'react';

export const add = (a: Vector, b: Vector): Vector => {
  return calculate(a, b, (m, n) => m + n);
};

export const subtract = (a: Vector, b: Vector): Vector => {
  return calculate(a, b, (m, n) => m - n);
};

export const multiply = (a: Vector, b: Vector): Vector => {
  return calculate(a, b, (m, n) => m * n);
};

const calculate = (a: Vector, b: Vector, fn: (a: number, b: number) => number): Vector => {
  return [fn(a[0], b[0]), fn(a[1], b[1])];
};

export const isDeleteChord = ({ button, altKey }: MouseEvent | ReactMouseEvent) => {
  return button === 1 || (button === 0 && altKey);
};

export const exclude = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  const result = new Set(a);
  b.forEach((it) => result.delete(it));
  return result;
};
