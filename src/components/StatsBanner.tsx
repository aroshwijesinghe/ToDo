import React from 'react';
import { CheckCircle2, Clock, Flame, ListOrdered, TrendingUp } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { parseEstimatedHours } from '../utils/helpers';

interface StatsBannerProps {
  tasks: TodoTask[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const critical = tasks.filter(t => t.pri >= 80).length;

  const totalBacklogHours = tasks
    .filter(t => t.status !== 'completed')
    .reduce((acc, t) => acc + parseEstimatedHours(t.time).avg, 0);

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
      {/* Total Tasks Card */}
      <div className="bg-[#181b20] border border-gray-800/80 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-gray-700 transition-all">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
        <div>
          <p className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">Total Tasks</p>
          <p className="text-2xl font-mono font-bold text-gray-100 mt-1">{total}</p>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{inProgress} currently active</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-300">
          <ListOrdered className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Critical Priority Card */}
      <div className="bg-[#181b20] border border-gray-800/80 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-rose-900/40 transition-all">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-20 h-20 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all" />
        <div>
          <p className="text-xs font-mono font-medium text-rose-400/90 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> High / Critical (80+)
          </p>
          <p className="text-2xl font-mono font-bold text-rose-400 mt-1">{critical}</p>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">Top focus objectives</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Estimated Effort Card */}
      <div className="bg-[#181b20] border border-gray-800/80 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-amber-900/40 transition-all">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all" />
        <div>
          <p className="text-xs font-mono font-medium text-amber-400/90 uppercase tracking-wider">Est. Backlog</p>
          <p className="text-2xl font-mono font-bold text-amber-400 mt-1">~{Math.round(totalBacklogHours)}h</p>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">Total remaining work</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Completion Rate Card */}
      <div className="bg-[#181b20] border border-gray-800/80 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-emerald-900/40 transition-all">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
        <div>
          <p className="text-xs font-mono font-medium text-emerald-400/90 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">{completed} <span className="text-xs text-gray-400 font-normal">({completionRate}%)</span></p>
          <div className="w-24 bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
