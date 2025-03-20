// @ts-nocheck
import { debounce } from 'es-toolkit';

import { filter, map } from 'es-toolkit/compat';

const result1 = filter([1, 2, 3], n => n > 1);
const result2 = map([1, 2, 3], n => n * 2);
const debouncedFn = debounce(() => {}, 300);
