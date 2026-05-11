import React, { useState } from 'react';
import { MdEdit, MdDelete, MdChevronLeft, MdChevronRight, MdSearch, MdInbox } from 'react-icons/md';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const Table = ({ columns, data = [], onEdit, onDelete, loading = false }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const filtered = data.filter(row =>
    columns.some(col => {
      const val = row[col.accessor];
      return String(val || '').toLowerCase().includes(search.toLowerCase());
    })
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="w-full space-y-3">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>entries</span>
        </div>
        <div className="relative w-full sm:w-60">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search table..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-5 py-3.5 font-semibold whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="text-slate-400 text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-5 py-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {col.render ? col.render(row) : (row[col.accessor] ?? '—')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            title="Edit"
                          >
                            <MdEdit className="text-lg" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <MdInbox className="text-5xl opacity-40" />
                    <p className="text-sm">No records found</p>
                    {search && <p className="text-xs">Try clearing the search filter</p>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-700 dark:text-white">{Math.min((page - 1) * pageSize + 1, filtered.length)}</strong>–<strong className="text-slate-700 dark:text-white">{Math.min(page * pageSize, filtered.length)}</strong> of <strong className="text-slate-700 dark:text-white">{filtered.length}</strong> entries
          {search && ` (filtered from ${data.length} total)`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdChevronLeft className="text-lg" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-primary-600 text-white'
                    : 'border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
