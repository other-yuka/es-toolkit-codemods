// @ts-nocheck
import { filter, map, multiply } from 'es-toolkit/compat';

const result = map(
  filter([1, 2, 3, 4, 5], n => n % 2 === 0),
  n => multiply(n, 2)
);
