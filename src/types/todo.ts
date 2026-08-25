export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface TodoTask {
  id: string;
  rank: number;
  task: string;
  pri: number; // Priority score (0-100)
  time: string; // e.g. "6-8h", "30-60m", "3-5h"
  description: string;
  status: TaskStatus;
  category?: string;
  createdAt: string;
  completedAt?: string;
}

export type SortField = 'rank' | 'pri' | 'task' | 'time' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  status: 'all' | TaskStatus;
  priorityTier: 'all' | 'critical' | 'high' | 'medium' | 'low';
  category: string;
}
