import React from 'react';
import { Plus, Terminal, LayoutList, Download, Sun, Moon, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  viewMode: 'table' | 'terminal';
  setViewMode: (mode: 'table' | 'terminal') => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  taskCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  onOpenAddModal,
  onOpenExportModal,
  taskCount,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 border-b ${
        isDark
          ? 'bg-[#121214]/80 backdrop-blur-2xl border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white/80 backdrop-blur-2xl border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              isDark
                ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-[0_2px_12px_rgba(52,211,153,0.3)]'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.25)]'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-base font-semibold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Priority<span className="text-emerald-500">ToDo</span>
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  isDark
                    ? 'bg-white/10 text-white/70'
                    : 'bg-black/5 text-slate-600'
                }`}
              >
                {taskCount} goals
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* iOS / macOS Segmented View Switcher */}
          <div
            className={`flex items-center p-0.5 rounded-xl border ${
              isDark
                ? 'bg-white/[0.06] border-white/[0.08]'
                : 'bg-black/[0.04] border-black/[0.05]'
            }`}
          >
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                viewMode === 'table'
                  ? isDark
                    ? 'bg-white/20 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-900 shadow-sm font-semibold'
                  : isDark
                  ? 'text-white/60 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                viewMode === 'terminal'
                  ? isDark
                    ? 'bg-white/20 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-900 shadow-sm font-semibold'
                  : isDark
                  ? 'text-white/60 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Terminal</span>
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border transition-all ${
              isDark
                ? 'bg-white/[0.06] border-white/[0.08] text-amber-300 hover:bg-white/[0.12]'
                : 'bg-black/[0.04] border-black/[0.05] text-slate-700 hover:bg-black/[0.08]'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Export / Import Button */}
          <button
            onClick={onOpenExportModal}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              isDark
                ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/[0.08]'
                : 'bg-black/[0.04] hover:bg-black/[0.08] text-slate-700 border-black/[0.05]'
            }`}
          >
            <Download className="w-3.5 h-3.5 opacity-70" />
            <span>Share / Backup</span>
          </button>

          {/* Apple-style "+ New Task" Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 rounded-xl shadow-[0_2px_12px_rgba(16,185,129,0.35)] transition-all duration-200"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
