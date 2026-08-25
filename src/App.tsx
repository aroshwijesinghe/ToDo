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
import { ThemeMode } from './types/theme';
import { THEME_CONFIGS } from './utils/themeConfig';

const STORAGE_KEY = 'priority_todo_tasks_v1';
const THEME_STORAGE_KEY = 'priority_todo_theme_mode_v2';
const CATEGORIES_STORAGE_KEY = 'priority_todo_categories_v1';

const DEFAULT_CATEGORIES = [
  'DevOps',
  'Machine Learning',
  'AI Tools',
  'Data Science',
  'Backend',
  'Projects',
  'Writing',
  'Personal',
  'Automation',
  'Cloud',
  'Computer Vision'
];

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (savedTheme && ['dark', 'white', 'purple', 'green', 'warm'].includes(savedTheme)) {
        return savedTheme;
      }
    } catch (e) {
      console.error('Failed to read theme', e);
    }
    return 'dark';
  });

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

  const [categoriesList, setCategoriesList] = useState<string[]>(() => {
    try {
      const savedCats = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    return DEFAULT_CATEGORIES;
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

  const themeConfig = THEME_CONFIGS[theme];

  // Apply theme to document element
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      if (theme === 'white') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  // Save categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesList));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categoriesList]);

  // Combine categories list with any unique task categories
  const categories = useMemo(() => {
    const set = new Set<string>(categoriesList);
    tasks.forEach(t => {
      if (t.category && t.category.trim()) set.add(t.category.trim());
    });
    return Array.from(set);
  }, [categoriesList, tasks]);

  const handleAddCategory = (newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    setCategoriesList(prev => {
      if (!prev.includes(trimmed)) {
        return [...prev, trimmed];
      }
      return prev;
    });
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setCategoriesList(prev => prev.filter(c => c !== catToDelete));
    if (filter.category === catToDelete) {
      setFilter(prev => ({ ...prev, category: 'all' }));
    }
  };

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

    // Sorting: completed tasks sink to bottom
    result.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;

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
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          let nextStatus: TodoTask['status'] = 'todo';
          if (t.status === 'todo') nextStatus = 'in-progress';
          else if (t.status === 'in-progress') {
            nextStatus = 'completed';
            // Theme-aware confetti celebration
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.75 },
              colors: [themeConfig.accentHex, '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7']
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
      });

      // Move completed tasks to the bottom
      const activeTasks = updated.filter(t => t.status !== 'completed');
      const completedTasks = updated.filter(t => t.status === 'completed');
      return [...activeTasks, ...completedTasks];
    });
  };

  const handleSaveTask = (taskData: Omit<TodoTask, 'id' | 'createdAt'> & { id?: string }) => {
    if (taskData.id) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskData.id
            ? { ...t, ...taskData }
            : t
        )
      );
    } else {
      const newTask: TodoTask = {
        id: `task-${Date.now()}`,
        rank: taskData.rank || tasks.length + 1,
        task: taskData.task,
        pri: taskData.pri,
        time: taskData.time || '1-2h',
        description: taskData.description,
        status: taskData.status,
        category: taskData.category || 'Projects',
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
      return updated.map((t, idx) => ({ ...t, rank: idx + 1 }));
    });
  };

  const handleImportTasks = (newTasks: TodoTask[]) => {
    setTasks(newTasks);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${themeConfig.classes.appBg} ${themeConfig.classes.textPrimary}`}>
      {/* Navigation Header */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => {
          setEditingTask(null);
          setIsAddModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        taskCount={tasks.length}
        theme={theme}
        onSelectTheme={setTheme}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-5">
        {/* Interactive Story Vignette Card */}
        <div
          className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs transition-all duration-300 transform hover:scale-[1.01] ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.cardHoverGlow}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl shrink-0 p-2 rounded-xl bg-white/5 shadow-inner">
              {themeConfig.emoji}
            </span>
            <div>
              <p className="font-bold flex items-center gap-2">
                <span>{themeConfig.name}</span>
                <span className="text-[10px] font-normal opacity-70">— {themeConfig.tagline}</span>
              </p>
              <p className={`text-[11px] mt-0.5 line-clamp-1 ${themeConfig.classes.textSecondary}`}>
                "{themeConfig.story}"
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const themeOrder: ThemeMode[] = ['dark', 'white', 'purple', 'green', 'warm'];
              const nextIdx = (themeOrder.indexOf(theme) + 1) % themeOrder.length;
              setTheme(themeOrder[nextIdx]);
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold shrink-0 border transition-all duration-200 hover:scale-105 active:scale-95 ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder}`}
            style={{ color: themeConfig.accentHex }}
          >
            Next World ➔
          </button>
        </div>

        {/* Story-Driven "toDo" progress card */}
        <StatsBanner tasks={tasks} theme={theme} />

        {/* Filter & Sort Controls */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categories={categories}
          theme={theme}
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
            theme={theme}
          />
        ) : (
          <TerminalView tasks={filteredTasks} theme={theme} />
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
        theme={theme}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tasks={tasks}
        onImportTasks={handleImportTasks}
        theme={theme}
      />

      <footer className={`py-6 border-t text-center text-xs transition-colors ${themeConfig.classes.tableBorder} ${themeConfig.classes.textMuted}`}>
        Priority ToDo • {themeConfig.emoji} {themeConfig.name} • Minimalist Productivity Experience
      </footer>
    </div>
  );
}

export default App;
