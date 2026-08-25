import { TodoTask } from '../types/todo';

export function getPriorityColor(pri: number, isDark: boolean = true): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  label: string;
} {
  if (pri >= 85) {
    return {
      bg: isDark ? 'bg-rose-500/10' : 'bg-rose-50',
      text: isDark ? 'text-rose-400' : 'text-rose-700',
      border: isDark ? 'border-rose-500/30' : 'border-rose-200',
      badge: isDark ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-rose-100 text-rose-800 border-rose-300',
      label: 'Critical'
    };
  }
  if (pri >= 70) {
    return {
      bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      text: isDark ? 'text-amber-400' : 'text-amber-700',
      border: isDark ? 'border-amber-500/30' : 'border-amber-200',
      badge: isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-800 border-amber-300',
      label: 'High'
    };
  }
  if (pri >= 50) {
    return {
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      text: isDark ? 'text-blue-400' : 'text-blue-700',
      border: isDark ? 'border-blue-500/30' : 'border-blue-200',
      badge: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-blue-100 text-blue-800 border-blue-300',
      label: 'Medium'
    };
  }
  return {
    bg: isDark ? 'bg-gray-500/10' : 'bg-gray-100',
    text: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-gray-500/30' : 'border-gray-200',
    badge: isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/40' : 'bg-gray-200 text-gray-700 border-gray-300',
    label: 'Low'
  };
}

export function parseEstimatedHours(timeStr: string): { min: number; max: number; avg: number } {
  const clean = (timeStr || '').toLowerCase().trim();
  if (clean.includes('min') || (clean.includes('m') && !clean.includes('h'))) {
    const numbers = clean.match(/\d+/g);
    if (!numbers) return { min: 0.5, max: 1, avg: 0.75 };
    const mins = numbers.map(Number);
    const minH = mins[0] / 60;
    const maxH = mins[1] ? mins[1] / 60 : minH;
    return { min: minH, max: maxH, avg: (minH + maxH) / 2 };
  }

  const numbers = clean.match(/\d+/g);
  if (!numbers) return { min: 1, max: 2, avg: 1.5 };
  const hours = numbers.map(Number);
  const min = hours[0];
  const max = hours[1] || min;
  return { min, max, avg: (min + max) / 2 };
}

export interface WeightedProgressResult {
  weightedPercent: number;
  rawPercent: number;
  totalWeight: number;
  completedWeight: number;
  inProgressWeight: number;
  totalHours: number;
  completedHours: number;
  remainingHours: number;
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
}

export function calculateWeightedProgress(tasks: TodoTask[]): WeightedProgressResult {
  const totalCount = tasks.length;
  if (totalCount === 0) {
    return {
      weightedPercent: 0,
      rawPercent: 0,
      totalWeight: 0,
      completedWeight: 0,
      inProgressWeight: 0,
      totalHours: 0,
      completedHours: 0,
      remainingHours: 0,
      completedCount: 0,
      inProgressCount: 0,
      totalCount: 0,
    };
  }

  let totalWeight = 0;
  let completedWeight = 0;
  let inProgressWeight = 0;
  let totalHours = 0;
  let completedHours = 0;
  let completedCount = 0;
  let inProgressCount = 0;

  tasks.forEach((t) => {
    const hours = parseEstimatedHours(t.time).avg;
    const priScore = Math.max(1, t.pri || 50);
    // Task weight is product of Priority Score and estimated Duration in hours
    const weight = priScore * hours;

    totalWeight += weight;
    totalHours += hours;

    if (t.status === 'completed') {
      completedWeight += weight;
      completedHours += hours;
      completedCount++;
    } else if (t.status === 'in-progress') {
      // In-progress gets 50% credit in weighted estimation
      inProgressWeight += weight * 0.5;
      completedHours += hours * 0.5;
      inProgressCount++;
    }
  });

  const earnedWeight = completedWeight + inProgressWeight;
  const weightedPercent = totalWeight > 0 ? Math.min(100, Math.round((earnedWeight / totalWeight) * 100)) : 0;
  const rawPercent = Math.round((completedCount / totalCount) * 100);
  const remainingHours = Math.max(0, totalHours - completedHours);

  return {
    weightedPercent,
    rawPercent,
    totalWeight: Math.round(totalWeight),
    completedWeight: Math.round(completedWeight),
    inProgressWeight: Math.round(inProgressWeight),
    totalHours: Math.round(totalHours * 10) / 10,
    completedHours: Math.round(completedHours * 10) / 10,
    remainingHours: Math.round(remainingHours * 10) / 10,
    completedCount,
    inProgressCount,
    totalCount,
  };
}

export function exportToCSV(tasks: TodoTask[]): void {
  const headers = ['RANK', 'TASK', 'PRI', 'TIME', 'DESCRIPTION', 'STATUS', 'CATEGORY'];
  const rows = tasks.map(t => [
    t.rank.toString().padStart(2, '0'),
    `"${t.task.replace(/"/g, '""')}"`,
    t.pri.toString(),
    `"${t.time}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    t.status,
    `"${t.category || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `todo_priority_list_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(tasks: TodoTask[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `todo_priority_list_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function generateAsciiTable(tasks: TodoTask[]): string {
  const header = `RANK | TASK                          | PRI | TIME    | DESCRIPTION`;
  const separator = `--------------------------------------------------------------------------------`;
  
  const rows = tasks.map(t => {
    const rankStr = t.rank.toString().padStart(2, '0');
    const taskStr = t.task.padEnd(29, ' ').slice(0, 29);
    const priStr = t.pri.toString().padStart(3, ' ');
    const timeStr = t.time.padEnd(7, ' ').slice(0, 7);
    const descStr = t.description;
    return `${rankStr}   | ${taskStr} | ${priStr} | ${timeStr} | ${descStr}`;
  });

  return [header, separator, ...rows].join('\n');
}
