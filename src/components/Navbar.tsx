import React from 'react';
import { Plus, Terminal, LayoutList, Download, RotateCcw, Sparkles, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  viewMode: 'table' | 'terminal';
  setViewMode: (mode: 'table' | 'terminal') => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onResetData: () => void;
  taskCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  onOpenAddModal,
  onOpenExportModal,
  onResetData,
  taskCount,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-200 shadow-md ${
        isDark
          ? 'bg-[#121417]/95 border-gray-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-white/95 border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Top accent bar matching user screenshot banner */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-lg font-bold tracking-tight flex items-center gap-1.5 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Priority<span className="text-emerald-500">ToDo</span>
                </h1>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  v1.1
                </span>
              </div>
              <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {taskCount} prioritized goals loaded
              </p>
            </div>
          </div>

          {/* Controls for mobile view */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-[#181b20] border-gray-800 text-amber-400 hover:text-amber-300'
                  : 'bg-gray-100 border-gray-200 text-slate-700 hover:text-slate-900'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div
              className={`flex items-center p-0.5 rounded-lg border ${
                isDark ? 'bg-[#181b20] border-gray-800' : 'bg-gray-100 border-gray-200'
              }`}
            >
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-emerald-500 text-gray-950 font-bold shadow'
                    : isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('terminal')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'terminal'
                    ? 'bg-emerald-500 text-gray-950 font-bold shadow'
                    : isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          {/* Desktop View Switcher */}
          <div
            className={`hidden sm:flex items-center p-1 rounded-lg border ${
              isDark ? 'bg-[#181b20] border-gray-800' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-gray-950 font-semibold shadow'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'terminal'
                  ? 'bg-emerald-500 text-gray-950 font-semibold shadow'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Terminal View
            </button>
          </div>

          {/* Theme Toggle Button (Desktop) */}
          <button
            onClick={onToggleTheme}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
              isDark
                ? 'bg-[#1a1e24] hover:bg-[#232830] text-amber-300 border-gray-700/60'
                : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border-gray-300'
            }`}
            title={isDark ? 'Switch to Light (White) Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={onResetData}
            title="Reset to default screenshot tasks"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isDark
                ? 'bg-[#1a1e24] hover:bg-[#232830] text-gray-300 hover:text-white border-gray-700/60'
                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Export / Import */}
          <button
            onClick={onOpenExportModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isDark
                ? 'bg-[#1a1e24] hover:bg-[#232830] text-gray-300 hover:text-white border-gray-700/60'
                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>Export/Import</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
