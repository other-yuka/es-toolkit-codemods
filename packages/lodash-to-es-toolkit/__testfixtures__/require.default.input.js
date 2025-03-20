// @ts-nocheck

const _ = require('lodash');

const result = _.map([1, 2, 3], n => n * 2);
const filtered = _.filter([1, 2, 3], n => n > 1);
const debouncedFn = _.debounce(() => {}, 300);
