import { TodoTask } from '../types/todo';

export function getPriorityColor(pri: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  label: string;
} {
  if (pri >= 85) {
    return {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      label: 'Critical'
    };
  }
  if (pri >= 70) {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      label: 'High'
    };
  }
  if (pri >= 50) {
    return {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      label: 'Medium'
    };
  }
  return {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    badge: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
    label: 'Low'
  };
}

export function parseEstimatedHours(timeStr: string): { min: number; max: number; avg: number } {
  const clean = timeStr.toLowerCase().trim();
  if (clean.includes('min') || clean.includes('m') && !clean.includes('h')) {
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
