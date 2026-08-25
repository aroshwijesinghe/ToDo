import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, ChevronRight, X } from 'lucide-react';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<ThemeMode | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeConfig = THEME_CONFIGS[currentTheme];
  const previewConfig = hoveredTheme ? THEME_CONFIGS[hoveredTheme] : activeConfig;

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const themeList: ThemeMode[] = ['dark', 'white', 'purple', 'green', 'warm'];

  return (
    <div className="relative" ref={menuRef}>
      {/* Theme Trigger Button with Hover Glow */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
          currentTheme === 'white'
            ? 'bg-white border-black/10 text-slate-800 shadow-sm hover:border-sky-400'
            : currentTheme === 'purple'
            ? 'bg-[#180e2b] border-purple-500/30 text-purple-200 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
            : currentTheme === 'green'
            ? 'bg-[#0a2314] border-emerald-500/30 text-emerald-200 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'
            : currentTheme === 'warm'
            ? 'bg-[#24140a] border-orange-500/30 text-orange-200 hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]'
            : 'bg-white/[0.06] border-white/[0.1] text-white/90 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]'
        }`}
        title="Switch Environment & Story Theme"
      >
        <span className="text-sm">{activeConfig.emoji}</span>
        <span className="hidden sm:inline font-medium">{activeConfig.name}</span>
        <Palette className="w-3.5 h-3.5 opacity-70" />
      </button>

      {/* Theme Picker Modal / Popover */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl border shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl ${
            currentTheme === 'white'
              ? 'bg-white/95 border-black/10 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'
              : 'bg-[#18181b]/95 border-white/10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-black/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Select Environment World
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Option Cards */}
          <div className="space-y-2 py-3">
            {themeList.map((mode) => {
              const config = THEME_CONFIGS[mode];
              const isSelected = currentTheme === mode;

              return (
                <div
                  key={mode}
                  onMouseEnter={() => setHoveredTheme(mode)}
                  onMouseLeave={() => setHoveredTheme(null)}
                  onClick={() => {
                    onSelectTheme(mode);
                    setIsOpen(false);
                  }}
                  className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'border-transparent hover:border-white/20 hover:bg-white/[0.06] dark:hover:bg-black/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Emoji badge with ring */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border border-white/10 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: config.cardHex }}
                    >
                      {config.emoji}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-tight">
                          {config.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-semibold shadow-sm">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] opacity-60 line-clamp-1">
                        {config.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center gap-1.5 pl-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: config.bgHex }}
                      title="Background Color"
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: config.accentHex }}
                      title="Accent Color"
                    />
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Story Narrative Preview Box */}
          <div
            className="p-3 rounded-2xl border text-xs transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: previewConfig.cardHex,
              borderColor: `${previewConfig.accentHex}40`,
            }}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color: previewConfig.accentHex }}>
              <span>{previewConfig.emoji}</span>
              <span>{previewConfig.name}</span>
              <span className="text-[10px] font-normal opacity-80">— {previewConfig.tagline}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-85 text-white/90">
              "{previewConfig.story}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
