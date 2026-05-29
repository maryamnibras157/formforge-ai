'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Columns,
  ListFilter
} from 'lucide-react';
import { getMockDatasetForLabel } from '../../lib/runtime/mockData';

interface DynamicTableProps {
  label: string;
  customColumns?: { key: string; label: string; type: 'text' | 'number' | 'badge' | 'date' }[];
  customRows?: Record<string, any>[];
  readOnly?: boolean;
}

export default function DynamicTable({ label, customColumns, customRows, readOnly = false }: DynamicTableProps) {
  // Use custom passed data, or fallback to relevant pre-populated mock dataset
  const dataset = useMemo(() => {
    if (customColumns && customRows) {
      return { columns: customColumns, rows: customRows };
    }
    return getMockDatasetForLabel(label);
  }, [label, customColumns, customRows]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(dataset.columns.map((c) => c.key))
  );
  const [showColMenu, setShowColMenu] = useState(false);

  // 1. Search filter
  const filteredRows = useMemo(() => {
    return dataset.rows.filter((row) => {
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [dataset.rows, searchQuery]);

  // 2. Sort processor
  const sortedRows = useMemo(() => {
    const sortableItems = [...filteredRows];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredRows, sortConfig]);

  // 3. Pagination computation
  const totalPages = Math.ceil(sortedRows.length / itemsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRows.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedRows, currentPage, itemsPerPage]);

  // Handle Sort Toggle
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Row Selection Toggle
  const toggleSelectRow = (id: string | number) => {
    if (readOnly) return;
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (readOnly) return;
    if (selectedRows.size === paginatedRows.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = paginatedRows.map((r, i) => r.id || r.name || i);
      setSelectedRows(new Set(allIds));
    }
  };

  // Export Table Data to CSV
  const exportToCSV = () => {
    const headers = dataset.columns
      .filter((col) => visibleColumns.has(col.key))
      .map((col) => col.label)
      .join(',');

    const csvRows = sortedRows.map((row) => {
      return dataset.columns
        .filter((col) => visibleColumns.has(col.key))
        .map((col) => {
          const val = row[col.key];
          // Escape quotes in strings
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        })
        .join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${label.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Column Visibility toggle helper
  const toggleColumn = (key: string) => {
    const newCols = new Set(visibleColumns);
    if (newCols.has(key)) {
      if (newCols.size > 1) { // Retain at least one visible column
        newCols.delete(key);
      }
    } else {
      newCols.add(key);
    }
    setVisibleColumns(newCols);
  };

  // Row removal simulation (Bulk Action)
  const handleDeleteSelected = () => {
    if (readOnly) return;
    alert(`Bulk Delete: Removed ${selectedRows.size} selected item(s) successfully (Simulated).`);
    setSelectedRows(new Set());
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Table Actions Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Real-time Local search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Search ${label}...`}
            className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
          />
        </div>

        {/* Toolbar controls */}
        <div className="flex gap-2 w-full sm:w-auto justify-end relative">
          {/* Column Toggle Trigger */}
          <button
            onClick={() => setShowColMenu(!showColMenu)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <Columns className="w-3.5 h-3.5" />
            Columns
          </button>

          {/* Column Toggles Dropdown Modal */}
          {showColMenu && (
            <div className="absolute right-36 top-11 z-20 w-48 rounded-xl glass-panel p-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-1">
                Toggle Columns
              </span>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {dataset.columns.map((col) => (
                  <label key={col.key} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 px-1 py-0.5 hover:bg-zinc-800/40 rounded">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded bg-zinc-950 border-zinc-700 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Export button */}
          <button
            onClick={exportToCSV}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Action Panel */}
      {selectedRows.size > 0 && (
        <div className="w-full p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center justify-between text-xs text-blue-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Selected <strong>{selectedRows.size}</strong> records</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteSelected}
              disabled={readOnly}
              className="py-1 px-3 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 hover:bg-red-900/40 flex items-center gap-1 cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Table View */}
      <div className="w-full overflow-x-auto rounded-2xl glass-panel glow-blue/5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-950/60 text-zinc-400 font-medium select-none">
              {!readOnly && (
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.size > 0 && selectedRows.size === paginatedRows.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-blue-500 bg-zinc-900 border-zinc-700/50 cursor-pointer focus:ring-0"
                  />
                </th>
              )}
              {dataset.columns
                .filter((col) => visibleColumns.has(col.key))
                .map((col) => (
                  <th
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    className="p-4 font-semibold hover:text-zinc-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/60">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rIdx) => {
                const rId = row.id || row.name || rIdx;
                const isSelected = selectedRows.has(rId);
                return (
                  <tr
                    key={rId}
                    className={`hover:bg-zinc-900/35 transition-colors ${
                      isSelected ? 'bg-blue-950/10' : ''
                    }`}
                  >
                    {!readOnly && (
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(rId)}
                          className="w-4 h-4 rounded text-blue-500 bg-zinc-900 border-zinc-700/50 cursor-pointer focus:ring-0"
                        />
                      </td>
                    )}
                    {dataset.columns
                      .filter((col) => visibleColumns.has(col.key))
                      .map((col) => {
                        const val = row[col.key];

                        // Badge Formatter
                        if (col.type === 'badge') {
                          const isSuccess = ['In Stock', 'Active', 'Very Satisfied', 'Proposal', 'Qualified'].includes(val);
                          const isWarn = ['Low Stock', 'On Leave', 'Satisfied', 'Negotiation'].includes(val);
                          const isDanger = ['Out of Stock', 'Unsatisfied'].includes(val);

                          return (
                            <td key={col.key} className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  isSuccess
                                    ? 'bg-green-950/30 border-green-500/20 text-green-400'
                                    : isWarn
                                    ? 'bg-amber-950/30 border-amber-500/20 text-amber-400'
                                    : isDanger
                                    ? 'bg-red-950/30 border-red-500/20 text-red-400'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                }`}
                              >
                                {val}
                              </span>
                            </td>
                          );
                        }

                        // Number/Currency Formatter
                        if (col.type === 'number') {
                          const isMoney = col.key.toLowerCase().includes('price') || col.key.toLowerCase().includes('value');
                          return (
                            <td key={col.key} className="p-4 font-mono font-medium text-zinc-300">
                              {isMoney ? `$${Number(val).toLocaleString()}` : val}
                            </td>
                          );
                        }

                        return (
                          <td key={col.key} className="p-4 text-zinc-300">
                            {val}
                          </td>
                        );
                      })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={dataset.columns.length + 1}
                  className="p-8 text-center text-zinc-500 font-medium"
                >
                  No matching records discovered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1 py-2">
        <span>
          Showing <strong>{Math.min(filteredRows.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
          <strong>{Math.min(filteredRows.length, currentPage * itemsPerPage)}</strong> of{' '}
          <strong>{filteredRows.length}</strong> entries
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-zinc-300 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
