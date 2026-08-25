import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { TaskTable } from './components/TaskTable';
import { TerminalView } from './components/TerminalView';
import { TaskModal } from './components/TaskModal';
import { ExportImportModal } from './components/ExportImportModal';
import { INITIAL_TASKS } from './data/initialTasks';
import { TodoTask, FilterState, SortField, SortOrder } from './types/todo';

const STORAGE_KEY = 'priority_todo_tasks_v1';

export function App() {
  const [tasks, setTasks] = useState<TodoTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load tasks from local storage', e);
    }
    return INITIAL_TASKS;
  });

  const [viewMode, setViewMode] = useState<'table' | 'terminal'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);

  const [filter, setFilter] = useState<FilterState>({
    search: '',
    status: 'all',
    priorityTier: 'all',
    category: 'all',
  });

  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  // Filter and Sort Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        t =>
          t.task.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filter.status !== 'all') {
      result = result.filter(t => t.status === filter.status);
    }

    // Priority Tier filter
    if (filter.priorityTier !== 'all') {
      if (filter.priorityTier === 'critical') result = result.filter(t => t.pri >= 85);
      else if (filter.priorityTier === 'high') result = result.filter(t => t.pri >= 70 && t.pri < 85);
      else if (filter.priorityTier === 'medium') result = result.filter(t => t.pri >= 50 && t.pri < 70);
      else if (filter.priorityTier === 'low') result = result.filter(t => t.pri < 50);
    }

    // Category filter
    if (filter.category !== 'all') {
      result = result.filter(t => t.category === filter.category);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'rank') {
        comparison = a.rank - b.rank;
      } else if (sortField === 'pri') {
        comparison = a.pri - b.pri;
      } else if (sortField === 'task') {
        comparison = a.task.localeCompare(b.task);
      } else if (sortField === 'time') {
        comparison = a.time.localeCompare(b.time);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filter, sortField, sortOrder]);

  // Actions
  const handleToggleStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          let nextStatus: TodoTask['status'] = 'todo';
          if (t.status === 'todo') nextStatus = 'in-progress';
          else if (t.status === 'in-progress') {
            nextStatus = 'completed';
            // Trigger celebratory confetti!
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#34d399', '#10b981', '#059669', '#6ee7b7']
            });
          } else {
            nextStatus = 'todo';
          }
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (taskData: Omit<TodoTask, 'id' | 'createdAt'> & { id?: string }) => {
    if (taskData.id) {
      // Edit
      setTasks(prev =>
        prev.map(t =>
          t.id === taskData.id
            ? { ...t, ...taskData }
            : t
        )
      );
    } else {
      // Add
      const newTask: TodoTask = {
        id: `task-${Date.now()}`,
        rank: taskData.rank || tasks.length + 1,
        task: taskData.task,
        pri: taskData.pri,
        time: taskData.time || '1-2h',
        description: taskData.description,
        status: taskData.status,
        category: taskData.category || 'General',
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setTasks(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      // Re-assign ranks
      return updated.map((t, idx) => ({ ...t, rank: idx + 1 }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= tasks.length - 1) return;
    setTasks(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      // Re-assign ranks
      return updated.map((t, idx) => ({ ...t, rank: idx + 1 }));
    });
  };

  const handleResetData = () => {
    if (confirm('Reset tasks back to the original 35 tasks from screenshot?')) {
      setTasks(INITIAL_TASKS);
    }
  };

  const handleImportTasks = (newTasks: TodoTask[]) => {
    setTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-[#121417] text-gray-100 flex flex-col font-sans">
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => {
          setEditingTask(null);
          setIsAddModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetData={handleResetData}
        taskCount={tasks.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top metrics banner */}
        <StatsBanner tasks={tasks} />

        {/* Search, Filter & Sort Controls */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categories={categories}
        />

        {/* View content: Table or Terminal */}
        {viewMode === 'table' ? (
          <TaskTable
            tasks={filteredTasks}
            onToggleStatus={handleToggleStatus}
            onEdit={(task) => {
              setEditingTask(task);
              setIsAddModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        ) : (
          <TerminalView tasks={filteredTasks} />
        )}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
        defaultRank={tasks.length + 1}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tasks={tasks}
        onImportTasks={handleImportTasks}
      />

      <footer className="py-4 border-t border-gray-800/60 text-center text-xs font-mono text-gray-500">
        Priority ToDo Dashboard • Built with React &amp; Tailwind CSS
      </footer>
    </div>
  );
}

export default App;
