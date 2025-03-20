// @ts-nocheck
import { map, filter, reduce, debounce } from 'lodash';

function processData(items) {
  const filtered = filter(items, item => item > 0);

  const mapped = map(filtered, item => {
    return item * 2;
  });

  return reduce(mapped, (acc, val) => acc + val, 0);
}
const handleEvent = debounce(() => {
  console.log('꽁꽁 얼어붙은 한강 위로 고양이가 걸어다닙니다');
}, 300);
