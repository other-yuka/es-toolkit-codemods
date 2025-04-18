// @ts-nocheck
const {
  debounce
} = require('es-toolkit');

const {
  filter,
  map: mapFn
} = require('es-toolkit/compat');

const result = mapFn([1, 2, 3], n => n * 2);
const filtered = filter([1, 2, 3], n => n > 1);
const debouncedFn = debounce(() => {}, 300);
