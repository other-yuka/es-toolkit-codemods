// @ts-nocheck
import React from 'react';
import { debounce } from 'es-toolkit';
import { filter, map } from 'es-toolkit/compat';

function MyComponent({ items }) {
  const handleChange = debounce((e) => {
    console.log(e.target.value);
  }, 300);
  return (
    <div>
      {filter(items, item => item.active).map(item => (
        <div key={item.id} onClick={handleChange}>
          {map(item.tags, tag => <span key={tag}>{tag}</span>)}
        </div>
      ))}
    </div>
  );
}
