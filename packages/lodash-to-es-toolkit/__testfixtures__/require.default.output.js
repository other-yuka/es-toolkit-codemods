// @ts-nocheck
const {
  debounce
} = require('es-toolkit');

const {
  filter,
  map
} = require('es-toolkit/compat');

const result = map([1, 2, 3], n => n * 2);
const filtered = filter([1, 2, 3], n => n > 1);
const debouncedFn = debounce(() => {}, 300);
