// @ts-nocheck
import _ from 'lodash';
import { map } from 'es-toolkit/compat';
const mapped = map([1, 2, 3], n => n * 2);
const sortedLastIndex = _.sortedLastIndex([4, 5, 5, 5, 6], 5);
