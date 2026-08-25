import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Tag, AlignLeft, Check, Plus } from 'lucide-react';
import { TodoTask, TaskStatus } from '../types/todo';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<TodoTask, 'id' | 'createdAt'> & { id?: string }) => void;
  initialData?: TodoTask | null;
  defaultRank: number;
  theme?: ThemeMode;
  categories?: string[];
  onAddCategory?: (category: string) => void;
  onDeleteCategory?: (category: string) => void;
}

const TIME_PRESETS = ['30-60m', '1-2h', '2-3h', '3-4h', '3-5h', '4-6h', '5-7h', '6-8h', '8-15h', '15-25h'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultRank,
  theme = 'dark',
  categories = ['DevOps', 'Machine Learning', 'AI Tools', 'Data Science', 'Backend', 'Projects', 'Writing', 'Personal', 'Automation'],
  onAddCategory,
  onDeleteCategory,
}) => {
  const [task, setTask] = useState('');
  const [pri, setPri] = useState<number>(75);
  const [time, setTime] = useState('2-3h');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState('Projects');
  const [rank, setRank] = useState<number>(defaultRank);

  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCatInput, setShowAddCatInput] = useState(false);

  const themeConfig = THEME_CONFIGS[theme];
  const isWhite = theme === 'white';

  useEffect(() => {
    if (initialData) {
      setTask(initialData.task);
      setPri(initialData.pri);
      setTime(initialData.time);
      setDescription(initialData.description);
      setStatus(initialData.status);
      setCategory(initialData.category || 'Projects');
      setRank(initialData.rank);
    } else {
      setTask('');
      setPri(75);
      setTime('2-3h');
      setDescription('');
      setStatus('todo');
      setCategory(categories[0] || 'Projects');
      setRank(defaultRank);
    }
    setNewCatInput('');
    setShowAddCatInput(false);
  }, [initialData, defaultRank, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    onSave({
      id: initialData?.id,
      task: task.trim(),
      pri: Number(pri),
      time: time.trim(),
      description: description.trim(),
      status,
      category: category.trim() || 'General',
      rank: Number(rank) || defaultRank,
    });
    onClose();
  };

  const handleAddNewCategory = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;

    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    setCategory(trimmed);
    setNewCatInput('');
    setShowAddCatInput(false);
  };

  const handleDeleteCat = (catToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete category "${catToDelete}"?`)) {
      if (onDeleteCategory) {
        onDeleteCategory(catToDelete);
      }
      if (category === catToDelete) {
        const remaining = categories.filter(c => c !== catToDelete);
        setCategory(remaining[0] || 'General');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all max-h-[90vh] flex flex-col ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4.5 border-b shrink-0 ${themeConfig.classes.tableHeaderBg}`}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: themeConfig.accentHex }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold tracking-tight">
              {initialData ? 'Edit Objective' : 'New Objective'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 overflow-y-auto flex-1">
          {/* Task Name */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${themeConfig.classes.textMuted}`}>
              Objective Title *
            </label>
            <input
              type="text"
              required
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. CI/CD Pipeline, Docker Containerization..."
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-all ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
            />
          </div>

          {/* Priority Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <label className={`font-semibold uppercase tracking-wider flex items-center gap-2 ${themeConfig.classes.textMuted}`}>
                Priority Score:
                <span
                  className="px-2.5 py-0.5 rounded-full font-bold text-white shadow-sm"
                  style={{ backgroundColor: themeConfig.accentHex }}
                >
                  {pri} / 100
                </span>
              </label>
              <span className={`text-[11px] font-medium ${themeConfig.classes.textMuted}`}>
                {pri >= 85 ? 'Critical Focus' : pri >= 70 ? 'High' : pri >= 50 ? 'Medium' : 'Low'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={pri}
              onChange={(e) => setPri(Number(e.target.value))}
              className="w-full cursor-pointer h-2 rounded-full bg-black/10 dark:bg-white/10"
              style={{ accentColor: themeConfig.accentHex }}
            />
          </div>

          {/* Time Estimate & Rank */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${themeConfig.classes.textMuted}`}>
                <Clock className="w-3.5 h-3.5 opacity-60" />
                Time Estimate
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 3-4h, 30-60m"
                className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {TIME_PRESETS.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTime(p)}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textSecondary} hover:opacity-100`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${themeConfig.classes.textMuted}`}>
                Rank Position
              </label>
              <input
                type="number"
                min="1"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${themeConfig.classes.textMuted}`}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
            >
              <option value="todo">To Do (Pending)</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* CATEGORY SECTION */}
          <div className={`space-y-2 border-t pt-3 ${themeConfig.classes.cardBorder}`}>
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${themeConfig.classes.textMuted}`}>
                <Tag className="w-3.5 h-3.5 opacity-60" />
                Category: <span style={{ color: themeConfig.accentHex }} className="capitalize font-bold">({category || 'None'})</span>
              </label>

              {!showAddCatInput && (
                <button
                  type="button"
                  onClick={() => setShowAddCatInput(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-all hover:scale-105"
                  style={{ backgroundColor: `${themeConfig.accentHex}20`, color: themeConfig.accentHex }}
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Category</span>
                </button>
              )}
            </div>

            {/* Inline Add Category Input */}
            {showAddCatInput && (
              <div className={`flex items-center gap-2 p-2 rounded-xl border animate-in fade-in duration-150 ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder}`}>
                <input
                  type="text"
                  autoFocus
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewCategory();
                    }
                  }}
                  placeholder="New category..."
                  className={`flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${themeConfig.classes.accentBtn}`}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCatInput(false);
                    setNewCatInput('');
                  }}
                  className={`p-1.5 rounded-lg transition-all ${themeConfig.classes.textMuted} hover:opacity-100`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Category Chips with Delete Button */}
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-32 overflow-y-auto">
              {categories.map((c) => {
                const isSelected = category === c;
                return (
                  <div
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`group/chip cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'text-white font-semibold shadow-sm'
                        : `${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textSecondary} hover:opacity-100`
                    }`}
                    style={isSelected ? { backgroundColor: themeConfig.accentHex, borderColor: themeConfig.accentHex } : {}}
                  >
                    <span>{c}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}

                    <button
                      type="button"
                      onClick={(e) => handleDeleteCat(c, e)}
                      title={`Delete category "${c}"`}
                      className="p-0.5 text-slate-400 hover:text-rose-500 rounded-full transition-all opacity-40 group-hover/chip:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${themeConfig.classes.textMuted}`}>
              <AlignLeft className="w-3.5 h-3.5 opacity-60" />
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Test/build/deploy automation, Package apps + dependencies..."
              className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none resize-none ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
            />
          </div>

          {/* Modal Actions */}
          <div className={`flex items-center justify-end gap-3 pt-3 border-t shrink-0 ${themeConfig.classes.cardBorder}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-colors ${themeConfig.classes.badgeBg} ${themeConfig.classes.textSecondary} hover:opacity-100`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 ${themeConfig.classes.accentBtn}`}
            >
              <Check className="w-4 h-4" />
              {initialData ? 'Save Changes' : 'Create Objective'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
