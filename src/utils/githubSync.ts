import { TodoTask } from '../types/todo';

const OWNER = 'aroshwijesinghe';
const REPO = 'ToDo';
const BRANCH = 'main';
const PATH = 'data/tasks.json';

// Track whether we have ever successfully committed — if not, don't let remote overwrite local
const COMMIT_STATUS_KEY = 'priority_todo_commit_status';

/**
 * Fetch latest tasks from GitHub via serverless API or raw URL
 */
export async function loadTasksFromGitHub(): Promise<TodoTask[] | null> {
  // 1. Try serverless backend /api/tasks
  try {
    const res = await fetch(`/api/tasks?_t=${Date.now()}`, {
      cache: 'no-cache',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.tasks) && data.tasks.length > 0) {
        return data.tasks;
      }
    }
  } catch (e) {
    console.warn('[GitHubSync] API fetch failed:', e);
  }

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
    console.warn('[GitHubSync] Raw fetch failed:', err);
  }

  return null;
}

/**
 * Commit tasks to GitHub via serverless API.
 * Returns true ONLY if the commit actually succeeded on GitHub.
 */
export async function autoCommitTasksToGitHub(tasks: TodoTask[]): Promise<boolean> {
  if (!Array.isArray(tasks) || tasks.length === 0) return false;

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Mark that we have successfully committed at least once
        try {
          localStorage.setItem(COMMIT_STATUS_KEY, JSON.stringify({
            lastCommitTime: Date.now(),
            success: true,
          }));
        } catch (e) {}
        console.log('[GitHubSync] ✅ Committed to GitHub successfully');
        return true;
      } else {
        console.warn('[GitHubSync] ⚠️ Commit response not successful:', data.message || data.error);
      }
    } else {
      console.warn('[GitHubSync] ⚠️ Commit HTTP error:', res.status);
    }
  } catch (err) {
    console.warn('[GitHubSync] ⚠️ Commit network error:', err);
  }

  return false;
}

/**
 * Check if we have ever successfully committed to GitHub from this browser.
 */
export function hasEverCommitted(): boolean {
  try {
    const status = localStorage.getItem(COMMIT_STATUS_KEY);
    if (status) {
      const parsed = JSON.parse(status);
      return parsed.success === true;
    }
  } catch (e) {}
  return false;
}
