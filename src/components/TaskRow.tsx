import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { TodoTask } from '../types/todo';
import { getPriorityColor } from '../utils/helpers';

interface TaskRowProps {
  task: TodoTask;
  onToggleStatus: (id: string) => void;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isDark?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isDark = true,
}) => {
  const priColor = getPriorityColor(task.pri, isDark);
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in-progress';

  return (
    <tr
      className={`group border-b text-xs transition-colors duration-150 ${
        isDark
          ? `border-white/[0.05] hover:bg-white/[0.04] ${isCompleted ? 'opacity-40 bg-white/[0.01]' : ''}`
          : `border-black/[0.04] hover:bg-black/[0.02] ${isCompleted ? 'opacity-50 bg-black/[0.01]' : 'bg-white'}`
      }`}
    >
      {/* RANK */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                className="text-slate-400 hover:text-emerald-500 p-0.5"
                title="Move Up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                className="text-slate-400 hover:text-emerald-500 p-0.5"
                title="Move Down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
          <span
            className={`font-mono font-semibold transition-colors w-6 ${
              isDark
                ? 'text-white/40 group-hover:text-emerald-400'
                : 'text-slate-400 group-hover:text-emerald-600'
            }`}
          >
            {task.rank.toString().padStart(2, '0')}
          </span>
        </div>
      </td>

      {/* TASK NAME & CATEGORY */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleStatus(task.id)}
            className="transition-transform active:scale-90 shrink-0"
            title={`Status: ${task.status}. Click to cycle.`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-500/20" />
            ) : isInProgress ? (
              <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            ) : (
              <Circle className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white/70 stroke-[1.8]" />
            )}
          </button>
          <div>
            <span
              className={`font-medium tracking-tight text-[13px] transition-colors ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-white/40'
                  : isDark
                  ? 'text-white group-hover:text-emerald-300'
                  : 'text-slate-900 group-hover:text-emerald-700'
              }`}
            >
              {task.task}
            </span>
            {task.category && (
              <span
                className={`ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  isDark
                    ? 'bg-white/[0.08] text-white/70'
                    : 'bg-black/[0.04] text-slate-600'
                }`}
              >
                {task.category}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* PRIORITY SCORE (PRI) */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priColor.badge}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                task.pri >= 85
                  ? 'bg-rose-500'
                  : task.pri >= 70
                  ? 'bg-amber-500'
                  : task.pri >= 50
                  ? 'bg-blue-500'
                  : 'bg-slate-400'
              }`}
            />
            {task.pri}
          </span>
          {/* Priority Micro Bar */}
          <div
            className={`w-10 rounded-full h-1 overflow-hidden hidden sm:block ${
              isDark ? 'bg-white/10' : 'bg-black/10'
            }`}
          >
            <div
              className={`h-full rounded-full transition-all ${
                task.pri >= 85
                  ? 'bg-rose-500'
                  : task.pri >= 70
                  ? 'bg-amber-500'
                  : task.pri >= 50
                  ? 'bg-blue-500'
                  : 'bg-slate-400'
              }`}
              style={{ width: `${task.pri}%` }}
            />
          </div>
        </div>
      </td>

      {/* TIME ESTIMATE */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isDark
              ? 'bg-white/[0.06] text-white/80'
              : 'bg-black/[0.04] text-slate-700'
          }`}
        >
          <Clock className="w-3 h-3 opacity-60" />
          {task.time}
        </span>
      </td>

      {/* DESCRIPTION */}
      <td className="py-3 px-4">
        <span
          className={`line-clamp-1 ${
            isCompleted
              ? 'text-slate-400 dark:text-white/40'
              : isDark
              ? 'text-white/70'
              : 'text-slate-600'
          }`}
        >
          {task.description}
        </span>
      </td>

      {/* STATUS BADGE */}
      <td className="py-3 px-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
            isCompleted
              ? isDark
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-50 text-emerald-700'
              : isInProgress
              ? isDark
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-amber-50 text-amber-700'
              : isDark
              ? 'bg-white/[0.08] text-white/60'
              : 'bg-black/[0.05] text-slate-600'
          }`}
        >
          {task.status === 'in-progress' ? 'Active' : task.status === 'completed' ? 'Done' : 'To Do'}
        </button>
      </td>

      {/* ACTIONS */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(task)}
            className={`p-1.5 rounded-lg transition-all ${
              isDark
                ? 'text-white/40 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-900 hover:bg-black/5'
            }`}
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className={`p-1.5 rounded-lg transition-all ${
              isDark
                ? 'text-white/40 hover:text-rose-400 hover:bg-rose-500/15'
                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
