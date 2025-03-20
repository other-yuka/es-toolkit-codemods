// @ts-nocheck
const mapFn = require('lodash/map');
const filterFn = require('lodash/filter');
const debounce = require('lodash/debounce');

const result = mapFn([1, 2, 3], n => n * 2);
const filtered = filterFn([1, 2, 3], n => n > 1);
const debouncedFn = debounce(() => {}, 300);
