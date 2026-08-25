import React from 'react';
import { CheckCircle2, Clock, Flame, ListOrdered, TrendingUp, Sparkles, Activity } from 'lucide-react';
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
    <div className="space-y-3.5 mb-6">
      {/* FEATURED: Enhanced, Larger Animated "toDo" Progress Card */}
      <div
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 border transition-all duration-300 shadow-xl ${
          isDark
            ? 'bg-[#181c22] border-emerald-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
            : 'bg-white border-emerald-200 shadow-[0_4px_25px_rgba(16,185,129,0.08)]'
        }`}
      >
        {/* Background glow ambiance */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 bg-gradient-to-bl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left info: "toDo" header, large percentage, breakdown */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                toDo
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                Weighted by Priority &amp; Duration
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-extrabold tracking-tight text-emerald-400 flex items-center gap-2">
                <span>{stats.weightedPercent}%</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md ${
                    isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {stats.completedCount} / {stats.totalCount} tasks completed
                </span>

                {stats.inProgressCount > 0 && (
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
                      isDark
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    {stats.inProgressCount} active
                  </span>
                )}
              </div>
            </div>

            <p
              className={`text-xs font-mono mt-1.5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Earned <strong className={isDark ? 'text-gray-200' : 'text-gray-800'}>{stats.completedWeight + stats.inProgressWeight}</strong> of <strong className={isDark ? 'text-gray-200' : 'text-gray-800'}>{stats.totalWeight}</strong> total priority-hour points ({stats.completedHours}h completed / ~{stats.totalHours}h total)
            </p>
          </div>

          {/* Right Icon Widget (matching user screenshot green badge with check icon) */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border transition-all transform hover:scale-105 shadow-lg ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              }`}
            >
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] animate-progress-glow" />
            </div>
          </div>
        </div>

        {/* Larger Animated Progress Bar with Shimmer Effect */}
        <div className="mt-4 relative">
          <div
            className={`w-full h-4 sm:h-4.5 rounded-full overflow-hidden p-0.5 border ${
              isDark ? 'bg-[#121417] border-gray-800' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 relative overflow-hidden transition-all duration-700 ease-out shadow-[0_0_12px_rgba(52,211,153,0.6)]"
              style={{ width: `${Math.max(stats.weightedPercent > 0 ? 3 : 0, stats.weightedPercent)}%` }}
            >
              {/* Animated light shimmer traveling along the bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-shimmer" />
            </div>
          </div>

          {/* Progress bar milestones */}
          <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1 px-1">
            <span>0% Start</span>
            <span>25%</span>
            <span>50% Midpoint</span>
            <span>75%</span>
            <span className="text-emerald-500 font-bold">100% Complete</span>
          </div>
        </div>
      </div>

      {/* Auxiliary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Tasks Card */}
        <div
          className={`border rounded-xl p-3.5 flex items-center justify-between transition-all ${
            isDark
              ? 'bg-[#181b20] border-gray-800/80 hover:border-gray-700'
              : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
          }`}
        >
          <div>
            <p className={`text-xs font-mono font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Tasks
            </p>
            <p className={`text-xl font-mono font-bold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {stats.totalCount}
            </p>
            <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {stats.inProgressCount} currently active
            </p>
          </div>
          <div
            className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
              isDark ? 'bg-gray-800/80 border-gray-700/50 text-emerald-400' : 'bg-gray-100 border-gray-200 text-emerald-600'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </div>
        </div>

        {/* Critical Priority Card */}
        <div
          className={`border rounded-xl p-3.5 flex items-center justify-between transition-all ${
            isDark
              ? 'bg-[#181b20] border-gray-800/80 hover:border-rose-900/40'
              : 'bg-white border-rose-100 hover:border-rose-200 shadow-sm'
          }`}
        >
          <div>
            <p className="text-xs font-mono font-medium text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3" /> Critical Focus (80+)
            </p>
            <p className={`text-xl font-mono font-bold mt-0.5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
              {critical}
            </p>
            <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Top priority objectives
            </p>
          </div>
          <div
            className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
              isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        {/* Estimated Backlog Hours */}
        <div
          className={`border rounded-xl p-3.5 flex items-center justify-between transition-all ${
            isDark
              ? 'bg-[#181b20] border-gray-800/80 hover:border-amber-900/40'
              : 'bg-white border-amber-100 hover:border-amber-200 shadow-sm'
          }`}
        >
          <div>
            <p className="text-xs font-mono font-medium text-amber-500 uppercase tracking-wider">
              Est. Backlog Remaining
            </p>
            <p className={`text-xl font-mono font-bold mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              ~{stats.remainingHours}h
            </p>
            <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              From ~{stats.totalHours}h estimated total
            </p>
          </div>
          <div
            className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
              isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
