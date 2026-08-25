import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { TodoTask, SortField, SortOrder } from '../types/todo';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { TaskRow } from './TaskRow';
import { MobileTaskCard } from './MobileTaskCard';

interface TaskTableProps {
  tasks: TodoTask[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  theme?: ThemeMode;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  theme = 'dark',
}) => {
  const themeConfig = THEME_CONFIGS[theme];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div>
      {/* Mobile Card List View (Visible on phones & small screens) */}
      <div className="block md:hidden space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <MobileTaskCard
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveUp={index > 0 ? () => onMoveUp(index) : undefined}
              onMoveDown={index < tasks.length - 1 ? () => onMoveDown(index) : undefined}
              theme={theme}
            />
          ))
        ) : (
          <div className={`p-8 text-center rounded-2xl border ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textMuted} text-xs font-medium`}>
            No objectives found matching your active filter.
          </div>
        )}
      </div>

      {/* Desktop / Tablet Full Table View (Visible on screens >= 768px) */}
      <div
        className={`hidden md:block border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold uppercase tracking-wider select-none ${themeConfig.classes.tableHeaderBg}`}
              >
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-4 cursor-pointer hover:opacity-100 transition-opacity w-16"
                >
                  <div className="flex items-center gap-1">
                    <span>RANK</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('task')}
                  className="py-3 px-4 cursor-pointer hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-1">
                    <span>OBJECTIVE</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pri')}
                  className="py-3 px-4 cursor-pointer hover:opacity-100 transition-opacity w-28"
                >
                  <div className="flex items-center gap-1">
                    <span>PRIORITY</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('time')}
                  className="py-3 px-4 cursor-pointer hover:opacity-100 transition-opacity w-28"
                >
                  <div className="flex items-center gap-1">
                    <span>ESTIMATE</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  <span>DESCRIPTION</span>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:opacity-100 transition-opacity w-24"
                >
                  <div className="flex items-center gap-1">
                    <span>STATUS</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right w-20">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMoveUp={index > 0 ? () => onMoveUp(index) : undefined}
                    onMoveDown={index < tasks.length - 1 ? () => onMoveDown(index) : undefined}
                    theme={theme}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={`py-12 text-center text-xs font-medium ${themeConfig.classes.textMuted}`}>
                    No objectives found matching your active filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
