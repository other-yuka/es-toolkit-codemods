// @ts-nocheck
import { map as lodashMap, filter, debounce } from 'lodash';

const result = lodashMap([1, 2, 3], n => n * 2);
const filtered = filter([1, 2, 3], n => n > 1);
const debouncedFn = debounce(() => {}, 300);
