import { TodoTask } from '../types/todo';

const OWNER = 'aroshwijesinghe';
const REPO = 'ToDo';
const BRANCH = 'main';
const PATH = 'data/tasks.json';

/**
 * Fetch latest tasks directly from GitHub repository or backend API
 */
export async function loadTasksFromGitHub(): Promise<TodoTask[] | null> {
  // 1. Try serverless backend route
  try {
    const res = await fetch('/api/tasks', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.tasks) && data.tasks.length > 0) {
        return data.tasks;
      }
    }
  } catch (e) {}

  // 2. Direct raw GitHub fetch fallback
  try {
    const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}?_t=${Date.now()}`;
    const response = await fetch(rawUrl, { cache: 'no-cache' });
    if (response.ok) {
      const tasks = await response.json();
      if (Array.isArray(tasks) && tasks.length > 0) {
        return tasks;
      }
    }
  } catch (err) {
    console.warn('Failed to load from raw GitHub URL:', err);
  }

  return null;
}

/**
 * Background commit tasks to GitHub repository via serverless backend API
 */
export async function autoCommitTasksToGitHub(tasks: TodoTask[]): Promise<boolean> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.success;
    }
  } catch (err) {
    console.warn('Auto-commit to GitHub warning:', err);
  }
  return false;
}
