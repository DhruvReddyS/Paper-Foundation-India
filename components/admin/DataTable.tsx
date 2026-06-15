'use client';

import React, { useState, useMemo } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onRowSelect?: (ids: string[]) => void;
  className?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowSelect,
  className = '',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search) {
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = String(a[sortKey]);
        const bVal = String(b[sortKey]);
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    return result;
  }, [data, search, sortKey, sortDir]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onRowSelect?.(Array.from(next));
  };

  const toggleAll = () => {
    if (selected.size === filteredData.length) {
      setSelected(new Set());
      onRowSelect?.([]);
    } else {
      const all = new Set(filteredData.map((r) => r.id));
      setSelected(all);
      onRowSelect?.(Array.from(all));
    }
  };

  return (
    <div className={`rounded-xl border border-stone-200 bg-white overflow-hidden ${className}`}>
      {/* Search */}
      <div className="px-4 py-3 border-b border-stone-100">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full max-w-sm rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filteredData.length && filteredData.length > 0}
                  onChange={toggleAll}
                  className="rounded border-stone-300"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 ${
                    col.sortable ? 'cursor-pointer hover:text-stone-800 select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredData.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-stone-50 transition-colors ${
                  selected.has(row.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => toggleSelect(row.id)}
                    className="rounded border-stone-300"
                  />
                </td>
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-stone-700">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-stone-100 text-xs text-stone-400">
        {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
        {selected.size > 0 && ` · ${selected.size} selected`}
      </div>
    </div>
  );
}
