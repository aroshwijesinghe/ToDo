import React from 'react';
import { Plus, Terminal, LayoutList, Download, RotateCcw, Sparkles } from 'lucide-react';

interface NavbarProps {
  viewMode: 'table' | 'terminal';
  setViewMode: (mode: 'table' | 'terminal') => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onResetData: () => void;
  taskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  onOpenAddModal,
  onOpenExportModal,
  onResetData,
  taskCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#121417]/95 backdrop-blur-md border-b border-gray-800/80 shadow-lg">
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
                <h1 className="text-lg font-bold text-gray-100 tracking-tight flex items-center gap-1.5">
                  Priority<span className="text-emerald-400">ToDo</span>
                </h1>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {taskCount} prioritized goals loaded
              </p>
            </div>
          </div>

          {/* View Toggle on mobile */}
          <div className="flex items-center bg-[#181b20] p-0.5 rounded-lg border border-gray-800 sm:hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-gray-950 font-bold shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'terminal'
                  ? 'bg-emerald-500 text-gray-950 font-bold shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Desktop View Switcher */}
          <div className="hidden sm:flex items-center bg-[#181b20] p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-gray-950 font-semibold shadow'
                  : 'text-gray-400 hover:text-gray-200'
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
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Terminal View
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={onResetData}
            title="Reset to default screenshot tasks"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#1a1e24] hover:bg-[#232830] border border-gray-700/60 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden md:inline">Reset Data</span>
          </button>

          {/* Export / Import */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#1a1e24] hover:bg-[#232830] border border-gray-700/60 rounded-lg transition-all"
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
