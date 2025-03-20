// @ts-nocheck
import { debounce } from 'es-toolkit';

import { filter, map as lodashMap } from 'es-toolkit/compat';

const result = lodashMap([1, 2, 3], n => n * 2);
const filtered = filter([1, 2, 3], n => n > 1);
const debouncedFn = debounce(() => {}, 300);
