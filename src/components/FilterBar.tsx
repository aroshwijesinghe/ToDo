import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { FilterState, SortField, SortOrder, TaskStatus } from '../types/todo';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  categories: string[];
  isDark?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  categories,
  isDark = true,
}) => {
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default high to low when switching
    }
  };

  const clearFilters = () => {
    setFilter({
      search: '',
      status: 'all',
      priorityTier: 'all',
      category: 'all',
    });
  };

  const hasActiveFilters =
    filter.search !== '' ||
    filter.status !== 'all' ||
    filter.priorityTier !== 'all' ||
    filter.category !== 'all';

  return (
    <div
      className={`border rounded-xl p-3.5 mb-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors ${
        isDark ? 'bg-[#181b20] border-gray-800/80' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Search by task name, description, or keyword..."
          className={`w-full pl-9 pr-8 py-2 border rounded-lg text-xs font-mono placeholder-gray-400 focus:outline-none transition-all ${
            isDark
              ? 'bg-[#121417] border-gray-800 focus:border-emerald-500/50 text-gray-200'
              : 'bg-gray-50 border-gray-300 focus:border-emerald-500 text-gray-900'
          }`}
        />
        {filter.search && (
          <button
            onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters & Sorting Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <div
          className={`flex items-center border rounded-lg p-0.5 text-xs font-mono ${
            isDark ? 'bg-[#121417] border-gray-800' : 'bg-gray-100 border-gray-200'
          }`}
        >
          {(['all', 'todo', 'in-progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(prev => ({ ...prev, status: st as 'all' | TaskStatus }))}
              className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                filter.status === st
                  ? 'bg-emerald-500 text-gray-950 font-bold shadow-sm'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {st === 'in-progress' ? 'Active' : st}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <select
          value={filter.priorityTier}
          onChange={(e) => setFilter(prev => ({ ...prev, priorityTier: e.target.value as FilterState['priorityTier'] }))}
          className={`border text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none ${
            isDark
              ? 'bg-[#121417] border-gray-800 text-gray-300 focus:border-emerald-500/50'
              : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-emerald-500'
          }`}
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical (85-100)</option>
          <option value="high">High (70-84)</option>
          <option value="medium">Medium (50-69)</option>
          <option value="low">Low (&lt;50)</option>
        </select>

        {/* Category Filter */}
        {categories.length > 0 && (
          <select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className={`border text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none ${
              isDark
                ? 'bg-[#121417] border-gray-800 text-gray-300 focus:border-emerald-500/50'
                : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-emerald-500'
            }`}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Sort Controls */}
        <button
          onClick={() => toggleSort('pri')}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-all ${
            sortField === 'pri'
              ? isDark
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-semibold'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
              : isDark
              ? 'bg-[#121417] border-gray-800 text-gray-400 hover:text-gray-200'
              : 'bg-gray-50 border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Sort by Priority Score"
        >
          <span>PRI</span>
          <ArrowUpDown className="w-3 h-3" />
          {sortField === 'pri' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>

        <button
          onClick={() => toggleSort('rank')}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-all ${
            sortField === 'rank'
              ? isDark
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-semibold'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
              : isDark
              ? 'bg-[#121417] border-gray-800 text-gray-400 hover:text-gray-200'
              : 'bg-gray-50 border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Sort by Rank"
        >
          <span>RANK</span>
          <ArrowUpDown className="w-3 h-3" />
          {sortField === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded-lg transition-all"
          >
            <Filter className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
