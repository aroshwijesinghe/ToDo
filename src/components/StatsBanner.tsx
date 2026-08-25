import React from 'react';
import { CheckCircle2, Clock, Flame, ListOrdered, Activity, Sparkles } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { calculateWeightedProgress } from '../utils/helpers';

interface StatsBannerProps {
  tasks: TodoTask[];
  theme?: ThemeMode;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ tasks, theme = 'dark' }) => {
  const stats = calculateWeightedProgress(tasks);
  const critical = tasks.filter(t => t.pri >= 80).length;
  const themeConfig = THEME_CONFIGS[theme];

  return (
    <div className="space-y-4 mb-6">
      {/* Featured Story-Driven "toDo" Activity Card with Hover Lift & Glow */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 border transition-all duration-300 transform hover:-translate-y-1 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.cardHoverGlow} ${themeConfig.classes.cardHoverBorder} shadow-2xl`}
      >
        {/* Subtle Ambient Accent Cone */}
        <div
          className="absolute -right-12 -top-12 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40 transition-all"
          style={{ backgroundColor: themeConfig.accentHex }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Stats & Story */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5"
                style={{ color: themeConfig.accentHex }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                toDo Progress
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${themeConfig.classes.badgeBg} ${themeConfig.classes.badgeText}`}>
                {themeConfig.emoji} {themeConfig.name}
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <div
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight flex items-center"
                style={{ color: themeConfig.accentHex }}
              >
                <span>{stats.weightedPercent}%</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium">
                <span className={`px-3 py-1 rounded-full ${themeConfig.classes.badgeBg} ${themeConfig.classes.textPrimary}`}>
                  {stats.completedCount} of {stats.totalCount} completed
                </span>

                {stats.inProgressCount > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    {stats.inProgressCount} active
                  </span>
                )}
              </div>
            </div>

            <p className={`text-xs ${themeConfig.classes.textSecondary}`}>
              Earned <strong className={themeConfig.classes.textPrimary}>{stats.completedWeight + stats.inProgressWeight}</strong> of <strong className={themeConfig.classes.textPrimary}>{stats.totalWeight}</strong> priority-hour points ({stats.completedHours}h completed / ~{stats.totalHours}h estimated)
            </p>
          </div>

          {/* Right: Theme Accent Badge */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center border transition-all duration-300 transform hover:scale-110 shadow-lg"
              style={{
                backgroundColor: `${themeConfig.accentHex}15`,
                borderColor: `${themeConfig.accentHex}40`,
                color: themeConfig.accentHex,
                boxShadow: `0 8px 30px ${themeConfig.accentHex}30`
              }}
            >
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2] animate-apple-pulse" />
            </div>
          </div>
        </div>

        {/* Progress Bar with Shimmer Animation */}
        <div className="mt-5 space-y-1.5">
          <div className={`w-full h-3.5 sm:h-4 rounded-full overflow-hidden p-0.5 border ${themeConfig.classes.inputBorder} ${themeConfig.classes.inputBg}`}>
            <div
              className={`h-full rounded-full bg-gradient-to-r ${themeConfig.classes.progressGradient} relative overflow-hidden transition-all duration-700 ease-out shadow-md`}
              style={{ width: `${Math.max(stats.weightedPercent > 0 ? 4 : 0, stats.weightedPercent)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-shimmer" />
            </div>
          </div>

          <div className={`flex justify-between text-[11px] font-medium px-1 ${themeConfig.classes.textMuted}`}>
            <span>0%</span>
            <span>50%</span>
            <span style={{ color: themeConfig.accentHex }} className="font-semibold">100% Target</span>
          </div>
        </div>
      </div>

      {/* Auxiliary Metric Cards with Interactive Hover Elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Tasks Card */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between transition-all duration-200 transform hover:-translate-y-0.5 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.cardHoverGlow} ${themeConfig.classes.cardHoverBorder} shadow-sm`}
        >
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.classes.textMuted}`}>
              Total Objectives
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${themeConfig.classes.textPrimary}`}>
              {stats.totalCount}
            </p>
            <p className={`text-[11px] mt-0.5 ${themeConfig.classes.textSecondary}`}>
              {stats.inProgressCount} in active progress
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${themeConfig.classes.badgeBg}`}
            style={{ color: themeConfig.accentHex }}
          >
            <ListOrdered className="w-5 h-5" />
          </div>
        </div>

        {/* Critical Focus Card */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between transition-all duration-200 transform hover:-translate-y-0.5 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} hover:border-rose-500/40 hover:shadow-[0_8px_30px_rgba(244,63,94,0.2)] shadow-sm`}
        >
          <div>
            <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Critical (80+)
            </p>
            <p className="text-2xl font-bold mt-0.5 text-rose-500">
              {critical}
            </p>
            <p className={`text-[11px] mt-0.5 ${themeConfig.classes.textSecondary}`}>
              Top priority objectives
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/15 text-rose-500">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Remaining Effort Card */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between transition-all duration-200 transform hover:-translate-y-0.5 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] shadow-sm`}
        >
          <div>
            <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
              Remaining Backlog
            </p>
            <p className="text-2xl font-bold mt-0.5 text-amber-500">
              ~{stats.remainingHours}h
            </p>
            <p className={`text-[11px] mt-0.5 ${themeConfig.classes.textSecondary}`}>
              From ~{stats.totalHours}h estimated total
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
