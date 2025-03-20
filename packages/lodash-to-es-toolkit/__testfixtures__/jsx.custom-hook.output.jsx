// @ts-nocheck
import React, { useState } from 'react';

// 나는 주석
import { orderBy } from 'es-toolkit';

import { filter, map } from 'es-toolkit/compat';
import moment from 'moment'

function useSortedData(items, sortKey) {
  const [data, setData] = useState([]);

  React.useEffect(() => {
    const sorted = orderBy(items, [sortKey], ['asc']);
    setData(sorted);
  }, [items, sortKey]);

  return {
    data,
    setFilter: (filterFn) => {
      const filtered = filter(data, filterFn);
      setData(filtered);
    }
  };
}
export default function SortableList({ items }) {
  const { data, setFilter } = useSortedData(items, 'name');

  return (
    <>
      <button onClick={() => setFilter(item => item.active)}>
        활성 항목만 표시
      </button>
      <ul>
        {map(data, item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
}
