// @ts-nocheck
import { map, filter, reduce, debounce } from 'lodash';

const result = map([1, 2, 3], n => n * 2);
const filtered = filter([1, 2, 3], n => n > 1);
const sum = reduce([1, 2, 3], (acc, n) => acc + n, 0);
const debouncedFn = debounce(() => {}, 300);
