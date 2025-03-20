// @ts-nocheck
import _ from 'lodash';
import { map } from 'lodash';
import debounce from 'lodash/debounce';

const result1 = _.filter([1, 2, 3], n => n > 1);
const result2 = map([1, 2, 3], n => n * 2);
const debouncedFn = debounce(() => {}, 300);
