import { useState } from 'react';

export default function DataTable({ columns, data, onRowDoubleClick }) {
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredData = data.filter(item =>
    Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return String(item[key] || '').toLowerCase().includes(filters[key].toLowerCase());
    })
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = String(a[sortField] || '').toLowerCase();
    const bValue = String(b[sortField] || '').toLowerCase();
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="p-4 text-left cursor-pointer select-none"
                onClick={() => handleSort(col.accessor)}
              >
                {col.label}
                {sortField === col.accessor ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
          </tr>
          <tr className="bg-blue-100">
            {columns.map((col) => (
              <th key={col.accessor} className="p-2">
                <input
                  type="text"
                  placeholder={`Filtra ${col.label}`}
                  value={filters[col.accessor] || ''}
                  onChange={(e) => handleFilterChange(col.accessor, e.target.value)}
                  className="border p-1 w-full text-sm text-gray-800" // Font corretto
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-blue-50 cursor-pointer"
              onDoubleClick={() => onRowDoubleClick(row)}
            >
              {columns.map((col) => (
                <td key={col.accessor} className="p-4">
                  {String(row[col.accessor] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
