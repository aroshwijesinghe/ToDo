import React from 'react';
import { CheckCircle2, Clock, Flame, ListOrdered, Activity, Sparkles } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { calculateWeightedProgress } from '../utils/helpers';

interface StatsBannerProps {
  tasks: TodoTask[];
  isDark?: boolean;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ tasks, isDark = true }) => {
  const stats = calculateWeightedProgress(tasks);
  const critical = tasks.filter(t => t.pri >= 80).length;

  return (
    <div className="space-y-4 mb-6">
      {/* Featured Apple-style "toDo" Activity Card */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 border transition-all duration-300 ${
          isDark
            ? 'bg-[#18181b]/90 border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
            : 'bg-white/90 border-black/[0.06] shadow-[0_10px_35px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* Subtle Ambient Apple Light Cone */}
        <div
          className={`absolute -right-10 -top-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity ${
            isDark ? 'bg-emerald-500/10 opacity-70' : 'bg-emerald-400/15 opacity-60'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left Info: Apple Typography & Details */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                toDo Progress
              </span>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                  isDark ? 'bg-white/10 text-white/70' : 'bg-black/5 text-slate-600'
                }`}
              >
                Priority × Duration Weighted
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-500 flex items-center">
                <span>{stats.weightedPercent}%</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium">
                <span
                  className={`px-3 py-1 rounded-full ${
                    isDark ? 'bg-white/[0.08] text-white/80' : 'bg-black/[0.05] text-slate-700'
                  }`}
                >
                  {stats.completedCount} of {stats.totalCount} completed
                </span>

                {stats.inProgressCount > 0 && (
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                      isDark
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    {stats.inProgressCount} active
                  </span>
                )}
              </div>
            </div>

            <p
              className={`text-xs ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}
            >
              Earned <strong className={isDark ? 'text-white/90' : 'text-slate-900'}>{stats.completedWeight + stats.inProgressWeight}</strong> of <strong className={isDark ? 'text-white/90' : 'text-slate-900'}>{stats.totalWeight}</strong> total priority-hour points ({stats.completedHours}h completed / ~{stats.totalHours}h estimated)
            </p>
          </div>

          {/* Right: Apple Activity Icon */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center border transition-all ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_4px_25px_rgba(16,185,129,0.25)]'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
              }`}
            >
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2] animate-apple-pulse" />
            </div>
          </div>
        </div>

        {/* Apple Capsule Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div
            className={`w-full h-3.5 sm:h-4 rounded-full overflow-hidden p-0.5 border ${
              isDark ? 'bg-black/40 border-white/[0.08]' : 'bg-black/[0.04] border-black/[0.06]'
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 relative overflow-hidden transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              style={{ width: `${Math.max(stats.weightedPercent > 0 ? 4 : 0, stats.weightedPercent)}%` }}
            >
              {/* Shimmer light bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-shimmer" />
            </div>
          </div>

          <div
            className={`flex justify-between text-[11px] font-medium px-1 ${
              isDark ? 'text-white/40' : 'text-slate-400'
            }`}
          >
            <span>0%</span>
            <span>50%</span>
            <span className="text-emerald-500 font-semibold">100% Complete</span>
          </div>
        </div>
      </div>

      {/* Metric Capsules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Tasks Capsule */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${
            isDark
              ? 'bg-[#18181b]/80 border-white/[0.08] hover:border-white/[0.15]'
              : 'bg-white/80 border-black/[0.06] hover:border-black/[0.12] shadow-sm'
          }`}
        >
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
              Total Objectives
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {stats.totalCount}
            </p>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              {stats.inProgressCount} in active progress
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-white/[0.08] text-emerald-400' : 'bg-black/[0.04] text-emerald-600'
            }`}
          >
            <ListOrdered className="w-5 h-5" />
          </div>
        </div>

        {/* Critical Focus Capsule */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${
            isDark
              ? 'bg-[#18181b]/80 border-white/[0.08] hover:border-rose-500/30'
              : 'bg-white/80 border-black/[0.06] hover:border-rose-200 shadow-sm'
          }`}
        >
          <div>
            <p className="text-xs font-medium text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Critical (80+)
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
              {critical}
            </p>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Highest priority focus
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-50 text-rose-600'
            }`}
          >
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Remaining Effort Capsule */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${
            isDark
              ? 'bg-[#18181b]/80 border-white/[0.08] hover:border-amber-500/30'
              : 'bg-white/80 border-black/[0.06] hover:border-amber-200 shadow-sm'
          }`}
        >
          <div>
            <p className="text-xs font-medium text-amber-500 uppercase tracking-wider">
              Remaining Backlog
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              ~{stats.remainingHours}h
            </p>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              From ~{stats.totalHours}h estimated
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
