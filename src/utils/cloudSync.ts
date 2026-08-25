import { TodoTask } from '../types/todo';

export interface SyncStatus {
  isEnabled: boolean;
  syncKey: string;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  error?: string | null;
}

const CLOUD_SYNC_KEY_STORAGE = 'priority_todo_sync_key_v1';
const CLOUD_STORAGE_API = 'https://api.jsonstorage.net/v1/json'; // Public JSON bin service for serverless cross-device sync

export function generateSyncKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'SYNC-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getStoredSyncKey(): string | null {
  try {
    return localStorage.getItem(CLOUD_SYNC_KEY_STORAGE);
  } catch (e) {
    return null;
  }
}

export function saveStoredSyncKey(key: string): void {
  try {
    localStorage.setItem(CLOUD_SYNC_KEY_STORAGE, key);
  } catch (e) {
    console.error('Failed to save sync key', e);
  }
}

export function clearStoredSyncKey(): void {
  try {
    localStorage.removeItem(CLOUD_SYNC_KEY_STORAGE);
  } catch (e) {
    console.error('Failed to clear sync key', e);
  }
}

/**
 * Push local tasks to cloud sync key
 */
export async function pushTasksToCloud(syncKey: string, tasks: TodoTask[], categories: string[]): Promise<boolean> {
  if (!syncKey) return false;
  try {
    const payload = {
      syncKey,
      updatedAt: new Date().toISOString(),
      tasks,
      categories,
    };

    // Use KV storage or public bin via endpoint with syncKey
    const response = await fetch(`https://kvdb.io/8j3f5p7K9xQ2Z1W/priority_todo_${syncKey.toLowerCase().replace(/[^a-z0-9]/g, '')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (err) {
    console.warn('Cloud sync push warning (offline fallback active):', err);
    return false;
  }
}

/**
 * Pull tasks from cloud sync key
 */
export async function pullTasksFromCloud(syncKey: string): Promise<{ tasks: TodoTask[]; categories: string[]; updatedAt: string } | null> {
  if (!syncKey) return null;
  try {
    const response = await fetch(`https://kvdb.io/8j3f5p7K9xQ2Z1W/priority_todo_${syncKey.toLowerCase().replace(/[^a-z0-9]/g, '')}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data && Array.isArray(data.tasks)) {
      return {
        tasks: data.tasks,
        categories: data.categories || [],
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    }
    return null;
  } catch (err) {
    console.warn('Cloud sync pull warning (offline fallback active):', err);
    return null;
  }
}

/**
 * Generate quick sync URL for QR codes / share link
 */
export function getSyncShareUrl(syncKey: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set('sync', syncKey);
  return url.toString();
}
