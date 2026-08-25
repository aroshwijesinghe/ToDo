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
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { getPriorityColor } from '../utils/helpers';

interface TaskRowProps {
  task: TodoTask;
  onToggleStatus: (id: string) => void;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  theme?: ThemeMode;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  theme = 'dark',
}) => {
  const isWhite = theme === 'white';
  const themeConfig = THEME_CONFIGS[theme];
  const priColor = getPriorityColor(task.pri, !isWhite);
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in-progress';

  return (
    <tr
      className={`group border-b text-xs transition-all duration-200 ${themeConfig.classes.tableBorder} ${themeConfig.classes.tableRowHover} ${
        isCompleted ? 'opacity-40' : ''
      }`}
    >
      {/* RANK */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                className={`p-0.5 transition-colors ${themeConfig.classes.textMuted} hover:opacity-100`}
                title="Move Up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                className={`p-0.5 transition-colors ${themeConfig.classes.textMuted} hover:opacity-100`}
                title="Move Down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className={`font-mono font-semibold w-6 transition-colors ${themeConfig.classes.textMuted} group-hover:${themeConfig.classes.accentText}`}>
            {task.rank.toString().padStart(2, '0')}
          </span>
        </div>
      </td>

      {/* OBJECTIVE NAME & CATEGORY */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleStatus(task.id)}
            className="transition-transform active:scale-75 shrink-0"
            title={`Status: ${task.status}. Click to cycle.`}
          >
            {isCompleted ? (
              <CheckCircle2
                className="w-4.5 h-4.5"
                style={{ color: themeConfig.accentHex }}
              />
            ) : isInProgress ? (
              <div
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: themeConfig.accentHex, borderTopColor: 'transparent' }}
              />
            ) : (
              <Circle className={`w-4.5 h-4.5 transition-colors ${themeConfig.classes.textMuted} group-hover:opacity-100 stroke-[1.8]`} />
            )}
          </button>
          <div>
            <span
              className={`font-semibold tracking-tight text-[13px] transition-colors ${
                isCompleted
                  ? `line-through ${themeConfig.classes.textMuted}`
                  : themeConfig.classes.textPrimary
              }`}
            >
              {task.task}
            </span>
            {task.category && (
              <span className={`ml-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${themeConfig.classes.badgeBg} ${themeConfig.classes.tableBorder} ${themeConfig.classes.textSecondary}`}>
                {task.category}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* PRIORITY SCORE (PRI) */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${priColor.badge}`}>
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
        </div>
      </td>

      {/* TIME ESTIMATE */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${themeConfig.classes.badgeBg} ${themeConfig.classes.textSecondary}`}>
          <Clock className="w-3 h-3 opacity-60" />
          {task.time}
        </span>
      </td>

      {/* DESCRIPTION */}
      <td className="py-3.5 px-4">
        <span className={`line-clamp-1 ${isCompleted ? themeConfig.classes.textMuted : themeConfig.classes.textSecondary}`}>
          {task.description}
        </span>
      </td>

      {/* STATUS BADGE */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-3 py-0.5 rounded-full text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : isInProgress
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : `${themeConfig.classes.badgeBg} ${themeConfig.classes.textMuted}`
          }`}
        >
          {task.status === 'in-progress' ? 'Active' : task.status === 'completed' ? 'Done' : 'To Do'}
        </button>
      </td>

      {/* ACTIONS */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(task)}
            className={`p-1.5 rounded-lg transition-all ${themeConfig.classes.textMuted} hover:opacity-100 hover:bg-white/10 dark:hover:bg-black/10`}
            title="Edit Objective"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
            title="Delete Objective"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
