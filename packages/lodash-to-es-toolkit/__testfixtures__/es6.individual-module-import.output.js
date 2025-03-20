// @ts-nocheck
import { throttle as throttleFn } from 'es-toolkit';

import { filter as filterFn, map as mapFn } from 'es-toolkit/compat';

const result = mapFn([1, 2, 3], n => n * 2);
const filtered = filterFn([1, 2, 3], n => n > 1);
const throttled = throttleFn(() => {}, 300);
