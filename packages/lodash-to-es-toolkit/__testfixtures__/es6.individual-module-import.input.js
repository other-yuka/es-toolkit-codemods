// @ts-nocheck
import mapFn from 'lodash/map';
import filterFn from 'lodash/filter';
import throttleFn from 'lodash/throttle';

const result = mapFn([1, 2, 3], n => n * 2);
const filtered = filterFn([1, 2, 3], n => n > 1);
const throttled = throttleFn(() => {}, 300);
