// @ts-nocheck
import React from 'react';
import _ from 'lodash';
import { map, debounce } from 'lodash';

function MyComponent({ items }) {
  const handleChange = debounce((e) => {
    console.log(e.target.value);
  }, 300);
  return (
    <div>
      {_.filter(items, item => item.active).map(item => (
        <div key={item.id} onClick={handleChange}>
          {map(item.tags, tag => <span key={tag}>{tag}</span>)}
        </div>
      ))}
    </div>
  );
}
