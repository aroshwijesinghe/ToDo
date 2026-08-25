import { TodoTask } from '../types/todo';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

const GITHUB_CONFIG_STORAGE = 'priority_todo_github_config_v1';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  token: '',
  owner: 'aroshwijesinghe',
  repo: 'ToDo',
  branch: 'main',
  path: 'data/tasks.json',
};

export function getStoredGitHubConfig(): GitHubConfig | null {
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_STORAGE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GITHUB_CONFIG, ...parsed };
    }
  } catch (e) {}
  return null;
}

export function saveStoredGitHubConfig(config: GitHubConfig | null): void {
  try {
    if (config && config.token) {
      localStorage.setItem(GITHUB_CONFIG_STORAGE, JSON.stringify(config));
    } else {
      localStorage.removeItem(GITHUB_CONFIG_STORAGE);
    }
  } catch (e) {
    console.error('Failed to save GitHub config', e);
  }
}

/**
 * Fetch tasks directly from raw GitHub or Contents API
 */
export async function fetchTasksFromGitHub(config: GitHubConfig): Promise<TodoTask[] | null> {
  const { owner, repo, branch, path } = config;
  try {
    // Cache buster to ensure always freshest JSON
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}?_cb=${Date.now()}`;
    const response = await fetch(rawUrl, {
      cache: 'no-cache',
      headers: config.token ? { Authorization: `token ${config.token}` } : {},
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to load from raw GitHub URL, trying API:', err);
  }

  // Fallback to GitHub Contents API
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const res = await fetch(apiUrl, {
      headers: config.token ? { Authorization: `token ${config.token}`, Accept: 'application/vnd.github.v3+json' } : {},
    });
    if (res.ok) {
      const json = await res.json();
      if (json.content) {
        const decoded = decodeURIComponent(escape(atob(json.content.replace(/\s/g, ''))));
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (e) {
    console.warn('GitHub API fetch error:', e);
  }

  return null;
}

/**
 * Commit & save tasks.json directly to GitHub repository
 */
export async function commitTasksToGitHub(config: GitHubConfig, tasks: TodoTask[]): Promise<{ success: boolean; error?: string }> {
  if (!config.token) {
    return { success: false, error: 'GitHub Personal Access Token required' };
  }

  const { owner, repo, branch, path, token } = config;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 1. Get current file SHA
    let currentSha: string | undefined;
    try {
      const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        currentSha = fileInfo.sha;
      }
    } catch (e) {}

    // 2. Base64 encode the new JSON
    const jsonString = JSON.stringify(tasks, null, 2);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64Content = btoa(binary);

    // 3. Commit to GitHub with [skip ci] so Vercel does not build indefinitely
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Auto-save tasks.json database [skip ci]`,
        content: base64Content,
        sha: currentSha,
        branch,
      }),
    });

    if (putRes.ok) {
      return { success: true };
    } else {
      const errJson = await putRes.json();
      return { success: false, error: errJson.message || 'Failed to commit to GitHub' };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error connecting to GitHub' };
  }
}
