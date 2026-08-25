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
      className={`border rounded-xl overflow-hidden shadow-xl transition-colors ${
        isDark
          ? 'bg-[#181b20] border-gray-800/80'
          : 'bg-white border-gray-200 shadow-md'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`border-b font-mono text-[11px] uppercase tracking-wider select-none ${
                isDark
                  ? 'bg-[#121417] border-gray-800 text-gray-400'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-500 transition-colors w-16"
              >
                <div className="flex items-center gap-1">
                  <span>RANK</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('task')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-500 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>TASK</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pri')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-500 transition-colors w-28"
              >
                <div className="flex items-center gap-1">
                  <span>PRI</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('time')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-500 transition-colors w-28"
              >
                <div className="flex items-center gap-1">
                  <span>TIME</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5">
                <span>DESCRIPTION</span>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-500 transition-colors w-24"
              >
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-right w-20">ACTIONS</th>
            </tr>
          </thead>
          <tbody className={isDark ? 'divide-y divide-gray-800/40' : 'divide-y divide-gray-200'}>
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
                <td colSpan={7} className="py-12 text-center text-gray-500 font-mono text-xs">
                  No tasks found matching your active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
