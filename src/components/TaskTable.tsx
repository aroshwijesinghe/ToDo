import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { TodoTask, SortField, SortOrder } from '../types/todo';
import { TaskRow } from './TaskRow';

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
  isDark?: boolean;
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
  isDark = true,
}) => {
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div
      className={`border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
        isDark
          ? 'bg-[#18181b]/80 border-white/[0.08]'
          : 'bg-white/90 border-black/[0.06] shadow-sm'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`border-b text-[11px] font-semibold uppercase tracking-wider select-none ${
                isDark
                  ? 'bg-white/[0.02] border-white/[0.08] text-white/50'
                  : 'bg-black/[0.02] border-black/[0.05] text-slate-500'
              }`}
            >
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-4 cursor-pointer hover:text-emerald-500 transition-colors w-16"
              >
                <div className="flex items-center gap-1">
                  <span>RANK</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('task')}
                className="py-3 px-4 cursor-pointer hover:text-emerald-500 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>OBJECTIVE</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pri')}
                className="py-3 px-4 cursor-pointer hover:text-emerald-500 transition-colors w-28"
              >
                <div className="flex items-center gap-1">
                  <span>PRIORITY</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('time')}
                className="py-3 px-4 cursor-pointer hover:text-emerald-500 transition-colors w-28"
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
                className="py-3 px-4 cursor-pointer hover:text-emerald-500 transition-colors w-24"
              >
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 text-right w-20">ACTIONS</th>
            </tr>
          </thead>
          <tbody className={isDark ? 'divide-y divide-white/[0.04]' : 'divide-y divide-black/[0.04]'}>
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
                  isDark={isDark}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                  No objectives found matching your active filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
