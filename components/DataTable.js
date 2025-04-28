import { useState } from 'react';

export default function DataTable({ columns, data }) {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredData = data.filter(item =>
    Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return String(item[key] || '').toLowerCase().includes(filters[key].toLowerCase());
    })
  );

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="p-4 text-left">
                {col.label}
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
                  className="border p-1 w-full text-sm"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50">
              {columns.map((col) => (
                <td key={col.accessor} className="p-4">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
