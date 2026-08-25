import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles
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
      className={`group border-b font-mono text-xs transition-colors ${
        isDark
          ? `border-gray-800/60 hover:bg-[#181c22]/90 ${isCompleted ? 'opacity-40 bg-[#14161a]/40' : ''}`
          : `border-gray-200 hover:bg-emerald-50/40 ${isCompleted ? 'opacity-50 bg-gray-50' : 'bg-white'}`
      }`}
    >
      {/* RANK */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                className="text-gray-400 hover:text-emerald-500 p-0.5"
                title="Move Up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                className="text-gray-400 hover:text-emerald-500 p-0.5"
                title="Move Down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
          <span
            className={`font-bold transition-colors w-6 ${
              isDark
                ? 'text-gray-400 group-hover:text-emerald-400'
                : 'text-gray-500 group-hover:text-emerald-600'
            }`}
          >
            {task.rank.toString().padStart(2, '0')}
          </span>
        </div>
      </td>

      {/* TASK NAME & CATEGORY */}
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleStatus(task.id)}
            className="text-gray-400 hover:text-emerald-500 transition-colors shrink-0"
            title={`Status: ${task.status}. Click to advance.`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : isInProgress ? (
              <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            )}
          </button>
          <div>
            <span
              className={`font-semibold tracking-wide transition-colors ${
                isCompleted
                  ? 'line-through text-gray-400'
                  : isDark
                  ? 'text-gray-100 group-hover:text-emerald-300'
                  : 'text-gray-900 group-hover:text-emerald-700'
              }`}
            >
              {task.task}
            </span>
            {task.category && (
              <span
                className={`ml-2 text-[10px] px-1.5 py-0.5 rounded border ${
                  isDark
                    ? 'bg-gray-800 text-gray-400 border-gray-700/50'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {task.category}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* PRIORITY SCORE (PRI) */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold border ${priColor.badge}`}
          >
            {task.pri >= 85 && <Sparkles className="w-2.5 h-2.5 text-rose-500" />}
            {task.pri}
          </span>
          {/* Priority Heat Bar */}
          <div
            className={`w-12 rounded-full h-1.5 overflow-hidden hidden sm:block ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
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
                  : 'bg-gray-400'
              }`}
              style={{ width: `${task.pri}%` }}
            />
          </div>
        </div>
      </td>

      {/* TIME ESTIMATE */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono ${
            isDark
              ? 'bg-[#121417] text-gray-300 border-gray-800'
              : 'bg-gray-50 text-gray-700 border-gray-200'
          }`}
        >
          <Clock className="w-3 h-3 text-gray-400" />
          {task.time}
        </span>
      </td>

      {/* DESCRIPTION */}
      <td className="py-3 px-3.5">
        <span
          className={
            isCompleted
              ? 'text-gray-400'
              : isDark
              ? 'text-gray-300'
              : 'text-gray-700'
          }
        >
          {task.description}
        </span>
      </td>

      {/* STATUS BADGE */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border uppercase tracking-wider transition-all ${
            isCompleted
              ? isDark
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : isInProgress
              ? isDark
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-amber-50 text-amber-700 border-amber-200'
              : isDark
              ? 'bg-gray-800/60 text-gray-400 border-gray-700/50'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {task.status}
        </button>
      </td>

      {/* ACTIONS */}
      <td className="py-3 px-3.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(task)}
            className={`p-1 rounded transition-all ${
              isDark
                ? 'text-gray-400 hover:text-emerald-400 hover:bg-gray-800'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-100'
            }`}
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className={`p-1 rounded transition-all ${
              isDark
                ? 'text-gray-400 hover:text-rose-400 hover:bg-gray-800'
                : 'text-gray-500 hover:text-rose-600 hover:bg-gray-100'
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
