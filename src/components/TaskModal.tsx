import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Tag, AlignLeft, Check } from 'lucide-react';
import { TodoTask, TaskStatus } from '../types/todo';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<TodoTask, 'id' | 'createdAt'> & { id?: string }) => void;
  initialData?: TodoTask | null;
  defaultRank: number;
  isDark?: boolean;
}

const TIME_PRESETS = ['30-60m', '1-2h', '2-3h', '3-4h', '3-5h', '4-6h', '5-7h', '6-8h', '8-15h', '15-25h'];
const CATEGORY_PRESETS = ['DevOps', 'Machine Learning', 'AI Tools', 'Data Science', 'Backend', 'Projects', 'Writing', 'Personal', 'Automation'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultRank,
  isDark = true,
}) => {
  const [task, setTask] = useState('');
  const [pri, setPri] = useState<number>(75);
  const [time, setTime] = useState('2-3h');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState('Projects');
  const [rank, setRank] = useState<number>(defaultRank);

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
      setCategory('Projects');
      setRank(defaultRank);
    }
  }, [initialData, defaultRank, isOpen]);

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
      category: category.trim(),
      rank: Number(rank) || defaultRank,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-colors ${
          isDark ? 'bg-[#181b20] border-gray-700/80 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'bg-[#121417] border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-mono">
              {initialData ? 'Edit Goal' : 'Create New Goal'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Name */}
          <div>
            <label className={`block text-xs font-mono font-semibold mb-1.5 uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Task Name *
            </label>
            <input
              type="text"
              required
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. CI/CD, Dockerize project, BERT model..."
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#121417] border-gray-800 focus:border-emerald-500 text-gray-100'
                  : 'bg-gray-50 border-gray-300 focus:border-emerald-500 text-gray-900'
              }`}
            />
          </div>

          {/* Priority Slider (0 - 100) */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
              <label className={`font-semibold uppercase flex items-center gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Priority Score (PRI):
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    pri >= 85
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                      : pri >= 70
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                      : pri >= 50
                      ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40'
                      : isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {pri} / 100
                </span>
              </label>
              <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {pri >= 85 ? 'Critical Focus' : pri >= 70 ? 'High' : pri >= 50 ? 'Medium' : 'Low'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={pri}
              onChange={(e) => setPri(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>0 (Low)</span>
              <span>50 (Medium)</span>
              <span>75 (High)</span>
              <span>100 (Top)</span>
            </div>
          </div>

          {/* Time Estimate & Rank */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-mono font-semibold mb-1.5 uppercase flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Time Estimate
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 3-4h, 30-60m"
                className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-[#121417] border-gray-800 focus:border-emerald-500 text-gray-100'
                    : 'bg-gray-50 border-gray-300 focus:border-emerald-500 text-gray-900'
                }`}
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {TIME_PRESETS.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTime(p)}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 border-gray-700/50'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-mono font-semibold mb-1.5 uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Rank Position
              </label>
              <input
                type="number"
                min="1"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-[#121417] border-gray-800 focus:border-emerald-500 text-gray-100'
                    : 'bg-gray-50 border-gray-300 focus:border-emerald-500 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-mono font-semibold mb-1.5 uppercase flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="DevOps, ML, AI Tools..."
                className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-[#121417] border-gray-800 focus:border-emerald-500 text-gray-100'
                    : 'bg-gray-50 border-gray-300 focus:border-emerald-500 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-mono font-semibold mb-1.5 uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-[#121417] border-gray-800 focus:border-emerald-500 text-gray-100'
                    : 'bg-gray-50 border-gray-300 focus:border-emerald-500 text-gray-900'
                }`}
              >
                <option value="todo">To Do (Pending)</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-mono font-semibold mb-1.5 uppercase flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Test/build/deploy automation, Package apps + dependencies..."
              className={`w-full px-3.5 py-2 border rounded-lg text-xs font-mono focus:outline-none resize-none ${
                isDark
                  ? 'bg-[#121417] border-gray-800 focus:border-emerald-500 text-gray-100'
                  : 'bg-gray-50 border-gray-300 focus:border-emerald-500 text-gray-900'
              }`}
            />
          </div>

          {/* Modal Actions */}
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-colors ${
                isDark ? 'text-gray-400 hover:text-gray-200 bg-gray-800/60 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-gray-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all"
            >
              <Check className="w-4 h-4" />
              {initialData ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
