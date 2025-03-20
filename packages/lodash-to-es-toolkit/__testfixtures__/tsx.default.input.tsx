// @ts-nocheck
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { debounce } from 'lodash';

interface Item {
  id: number;
  name: string;
  value: number;
  active: boolean;
}

const DataGrid: React.FC<{ data: Item[] }> = ({ data }) => {
  const [filteredData, setFilteredData] = useState<Item[]>([]);

  useEffect(() => {
    const filtered = _.filter(data, item => item.active);
    const sorted = _.sortBy(filtered, ['name']);
    setFilteredData(sorted);
  }, [data]);

  const handleSearch = debounce((term: string) => {
    const results = _.filter(data, item =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(results);
  }, 300);

  return (
    <div className="data-grid">
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="검색어 입력..."
      />
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>이름</th>
          <th>값</th>
        </tr>
        </thead>
        <tbody>
        {_.map(filteredData, item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.value}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};
