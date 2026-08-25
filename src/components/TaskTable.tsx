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
    <div className="bg-[#181b20] border border-gray-800/80 rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-[#121417] text-gray-400 font-mono text-[11px] uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-400 transition-colors w-16"
              >
                <div className="flex items-center gap-1">
                  <span>RANK</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('task')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>TASK</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pri')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-400 transition-colors w-28"
              >
                <div className="flex items-center gap-1">
                  <span>PRI</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('time')}
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-400 transition-colors w-28"
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
                className="py-3 px-3.5 cursor-pointer hover:text-emerald-400 transition-colors w-24"
              >
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-right w-20">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
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
