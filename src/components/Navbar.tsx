import React from 'react';
import { Plus, Terminal, LayoutList, Download, CheckCircle2 } from 'lucide-react';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { ThemeSelector } from './ThemeSelector';

interface NavbarProps {
  viewMode: 'table' | 'terminal';
  setViewMode: (mode: 'table' | 'terminal') => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  taskCount: number;
  theme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  onOpenAddModal,
  onOpenExportModal,
  taskCount,
  theme,
  onSelectTheme,
}) => {
  const themeConfig = THEME_CONFIGS[theme];
  const isWhite = theme === 'white';

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 border-b ${themeConfig.classes.navBg} ${themeConfig.classes.navBorder}`}>
      {/* Top dynamic story accent line */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${themeConfig.classes.topBannerGradient}`} />

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 shadow-lg text-white shrink-0"
            style={{ backgroundColor: themeConfig.accentHex }}
          >
            <CheckCircle2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`text-sm sm:text-base font-bold tracking-tight ${themeConfig.classes.textPrimary}`}>
                Priority<span style={{ color: themeConfig.accentHex }}>ToDo</span>
              </span>
              <span className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full ${themeConfig.classes.badgeBg} ${themeConfig.classes.badgeText}`}>
                {themeConfig.emoji} <span className="hidden sm:inline">{themeConfig.name}</span>
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-medium hidden md:block ${themeConfig.classes.textMuted}`}>
              {taskCount} goals • {themeConfig.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Switcher on Desktop */}
          <div className={`hidden md:flex items-center p-0.5 rounded-xl border ${isWhite ? 'bg-black/[0.04] border-black/[0.05]' : 'bg-white/[0.06] border-white/[0.08]'}`}>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                viewMode === 'table'
                  ? isWhite
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'bg-white/20 text-white shadow-sm font-semibold'
                  : isWhite
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                viewMode === 'terminal'
                  ? isWhite
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'bg-white/20 text-white shadow-sm font-semibold'
                  : isWhite
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </button>
          </div>

          {/* Theme Selector Popover */}
          <ThemeSelector currentTheme={theme} onSelectTheme={onSelectTheme} />

          {/* Export / Backup on Desktop */}
          <button
            onClick={onOpenExportModal}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              isWhite
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-black/[0.06]'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/[0.08]'
            }`}
          >
            <Download className="w-3.5 h-3.5 opacity-70" />
            <span>Share</span>
          </button>

          {/* New Task Button */}
          <button
            onClick={onOpenAddModal}
            className={`flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${themeConfig.classes.accentBtn}`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
