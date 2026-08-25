import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  MoreVertical,
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
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const priColor = getPriorityColor(task.pri);
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in-progress';

  return (
    <tr
      className={`group border-b border-gray-800/60 hover:bg-[#181c22]/90 transition-all font-mono text-xs ${
        isCompleted ? 'opacity-50 bg-[#14161a]/40' : ''
      }`}
    >
      {/* RANK */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                className="text-gray-500 hover:text-emerald-400 p-0.5"
                title="Move Up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                className="text-gray-500 hover:text-emerald-400 p-0.5"
                title="Move Down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="font-bold text-gray-400 group-hover:text-emerald-400 transition-colors w-6">
            {task.rank.toString().padStart(2, '0')}
          </span>
        </div>
      </td>

      {/* TASK NAME & CATEGORY */}
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleStatus(task.id)}
            className="text-gray-500 hover:text-emerald-400 transition-colors shrink-0"
            title={`Status: ${task.status}. Click to advance.`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : isInProgress ? (
              <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
            )}
          </button>
          <div>
            <span
              className={`font-semibold tracking-wide ${
                isCompleted
                  ? 'line-through text-gray-400'
                  : 'text-gray-100 group-hover:text-emerald-300'
              } transition-colors`}
            >
              {task.task}
            </span>
            {task.category && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700/50">
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
            {task.pri >= 85 && <Sparkles className="w-2.5 h-2.5 text-rose-400" />}
            {task.pri}
          </span>
          {/* Priority Heat Bar */}
          <div className="w-12 bg-gray-800/80 rounded-full h-1.5 overflow-hidden hidden sm:block">
            <div
              className={`h-full rounded-full transition-all ${
                task.pri >= 85
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : task.pri >= 70
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : task.pri >= 50
                  ? 'bg-blue-400'
                  : 'bg-gray-500'
              }`}
              style={{ width: `${task.pri}%` }}
            />
          </div>
        </div>
      </td>

      {/* TIME ESTIMATE */}
      <td className="py-3 px-3.5 whitespace-nowrap text-gray-300">
        <span className="inline-flex items-center gap-1 text-gray-300 bg-[#121417] px-2 py-0.5 rounded border border-gray-800 font-mono">
          <Clock className="w-3 h-3 text-gray-400" />
          {task.time}
        </span>
      </td>

      {/* DESCRIPTION */}
      <td className="py-3 px-3.5 text-gray-300">
        <span className={`${isCompleted ? 'text-gray-400' : 'text-gray-300'}`}>
          {task.description}
        </span>
      </td>

      {/* STATUS BADGE */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border uppercase tracking-wider transition-all ${
            isCompleted
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : isInProgress
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-gray-800/60 text-gray-400 border-gray-700/50'
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
            className="p-1 text-gray-400 hover:text-emerald-400 hover:bg-gray-800 rounded transition-all"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded transition-all"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
