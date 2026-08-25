import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { TodoTask } from '../types/todo';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { getPriorityColor } from '../utils/helpers';

interface MobileTaskCardProps {
  task: TodoTask;
  onToggleStatus: (id: string) => void;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  theme?: ThemeMode;
}

export const MobileTaskCard: React.FC<MobileTaskCardProps> = ({
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
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${
        isCompleted ? 'opacity-50' : ''
      } shadow-sm space-y-2.5`}
    >
      {/* Card Header: Rank, Priority Score, Time Badge & Move Arrows */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Rank Badge */}
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${themeConfig.classes.badgeBg} ${themeConfig.classes.textPrimary}`}>
            #{task.rank.toString().padStart(2, '0')}
          </span>

          {/* Priority Badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${priColor.badge}`}>
            {task.pri >= 85 && <Sparkles className="w-2.5 h-2.5 text-rose-500" />}
            PRI {task.pri}
          </span>

          {/* Time Badge */}
          <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md ${themeConfig.classes.badgeBg} ${themeConfig.classes.textMuted}`}>
            <Clock className="w-3 h-3" />
            {task.time}
          </span>
        </div>

        {/* Move up / down controls */}
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className={`p-1.5 rounded-lg ${themeConfig.classes.badgeBg} ${themeConfig.classes.textMuted} active:scale-90`}
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className={`p-1.5 rounded-lg ${themeConfig.classes.badgeBg} ${themeConfig.classes.textMuted} active:scale-90`}
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Checkbox Area */}
      <div className="flex items-start gap-3 pt-0.5">
        <button
          onClick={() => onToggleStatus(task.id)}
          className="mt-0.5 shrink-0 transition-transform active:scale-75 p-1 -m-1"
          title={`Status: ${task.status}. Tap to advance.`}
        >
          {isCompleted ? (
            <CheckCircle2
              className="w-5 h-5"
              style={{ color: themeConfig.accentHex }}
            />
          ) : isInProgress ? (
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: themeConfig.accentHex, borderTopColor: 'transparent' }}
            />
          ) : (
            <Circle className={`w-5 h-5 ${themeConfig.classes.textMuted} stroke-[1.8]`} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4
              className={`font-semibold text-sm leading-snug tracking-tight ${
                isCompleted
                  ? `line-through ${themeConfig.classes.textMuted}`
                  : themeConfig.classes.textPrimary
              }`}
            >
              {task.task}
            </h4>
            {task.category && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${themeConfig.classes.badgeBg} ${themeConfig.classes.tableBorder} ${themeConfig.classes.textSecondary}`}>
                {task.category}
              </span>
            )}
          </div>

          <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? themeConfig.classes.textMuted : themeConfig.classes.textSecondary}`}>
            {task.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Status Badge & Actions */}
      <div className={`flex items-center justify-between pt-2 border-t ${themeConfig.classes.tableBorder}`}>
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : isInProgress
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : `${themeConfig.classes.badgeBg} ${themeConfig.classes.textMuted}`
          }`}
        >
          {task.status === 'in-progress' ? '● Active' : task.status === 'completed' ? '✓ Done' : '○ To Do'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className={`p-2 rounded-xl transition-all ${themeConfig.classes.badgeBg} ${themeConfig.classes.textSecondary} active:scale-90`}
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-xl text-rose-400/80 bg-rose-500/10 hover:bg-rose-500/20 active:scale-90 transition-all"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
