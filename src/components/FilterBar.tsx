import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { FilterState, SortField, SortOrder, TaskStatus } from '../types/todo';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  categories: string[];
  theme?: ThemeMode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  categories,
  theme = 'dark',
}) => {
  const themeConfig = THEME_CONFIGS[theme];
  const isWhite = theme === 'white';

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
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
      className={`border rounded-2xl p-3 sm:p-3.5 mb-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-all duration-300 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} shadow-sm`}
    >
      {/* Search Input with Dynamic Theme Focus */}
      <div className="relative flex-1">
        <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${themeConfig.classes.textMuted}`} />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Search goals, topics, or descriptions..."
          className={`w-full pl-10 pr-9 py-2 border rounded-xl text-xs placeholder:opacity-50 focus:outline-none transition-all ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
        />
        {filter.search && (
          <button
            onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
            className={`absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-100 ${themeConfig.classes.textMuted}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Segmented Filters & Sorting Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Segmented Status Control */}
        <div className={`flex items-center p-1 rounded-xl border ${isWhite ? 'bg-black/[0.04] border-black/[0.05]' : 'bg-white/[0.05] border-white/[0.08]'}`}>
          {(['all', 'todo', 'in-progress', 'completed'] as const).map((st) => {
            const isActive = filter.status === st;
            return (
              <button
                key={st}
                onClick={() => setFilter(prev => ({ ...prev, status: st as 'all' | TaskStatus }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-150 ${
                  isActive
                    ? isWhite
                      ? 'bg-white text-slate-900 font-semibold shadow-sm'
                      : 'bg-white/20 text-white font-semibold shadow-sm'
                    : isWhite
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {st === 'in-progress' ? 'Active' : st === 'all' ? 'All' : st === 'todo' ? 'To Do' : 'Done'}
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <select
          value={filter.priorityTier}
          onChange={(e) => setFilter(prev => ({ ...prev, priorityTier: e.target.value as FilterState['priorityTier'] }))}
          className={`border text-xs rounded-xl px-3 py-1.5 focus:outline-none transition-all ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
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
            className={`border text-xs rounded-xl px-3 py-1.5 focus:outline-none transition-all ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Sort PRI Button with Hover */}
        <button
          onClick={() => toggleSort('pri')}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
            sortField === 'pri'
              ? 'border-transparent text-white shadow-sm'
              : `${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textSecondary} hover:opacity-100`
          }`}
          style={sortField === 'pri' ? { backgroundColor: themeConfig.accentHex } : {}}
          title="Sort by Priority Score"
        >
          <span>PRI</span>
          <ArrowUpDown className="w-3 h-3" />
          {sortField === 'pri' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>

        {/* Sort RANK Button with Hover */}
        <button
          onClick={() => toggleSort('rank')}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
            sortField === 'rank'
              ? 'border-transparent text-white shadow-sm'
              : `${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textSecondary} hover:opacity-100`
          }`}
          style={sortField === 'rank' ? { backgroundColor: themeConfig.accentHex } : {}}
          title="Sort by Rank"
        >
          <span>RANK</span>
          <ArrowUpDown className="w-3 h-3" />
          {sortField === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <Filter className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
