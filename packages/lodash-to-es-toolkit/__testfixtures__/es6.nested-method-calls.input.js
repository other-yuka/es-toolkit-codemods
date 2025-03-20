// @ts-nocheck
import _ from 'lodash';

const result = _.map(
  _.filter([1, 2, 3, 4, 5], n => n % 2 === 0),
  n => _.multiply(n, 2)
);
