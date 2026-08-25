import { TodoTask } from '../types/todo';

export interface CloudPayload {
  syncKey: string;
  updatedAt: string;
  tasks: TodoTask[];
  categories: string[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const CLOUD_SYNC_KEY_STORAGE = 'priority_todo_sync_key_v2';
const SUPABASE_CONFIG_STORAGE = 'priority_todo_supabase_config_v1';

export function getStoredSyncKey(): string | null {
  try {
    return localStorage.getItem(CLOUD_SYNC_KEY_STORAGE);
  } catch (e) {
    return null;
  }
}

export function saveStoredSyncKey(key: string): void {
  try {
    localStorage.setItem(CLOUD_SYNC_KEY_STORAGE, key.trim().toLowerCase());
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

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_STORAGE);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function saveStoredSupabaseConfig(config: SupabaseConfig | null): void {
  try {
    if (config) {
      localStorage.setItem(SUPABASE_CONFIG_STORAGE, JSON.stringify(config));
    } else {
      localStorage.removeItem(SUPABASE_CONFIG_STORAGE);
    }
  } catch (e) {
    console.error('Failed to save Supabase config', e);
  }
}

export function generateSyncKey(): string {
  const words = ['alpha', 'cosmic', 'zenith', 'matrix', 'stellar', 'pulse', 'prime', 'orbit', 'nexus', 'apex'];
  const num = Math.floor(1000 + Math.random() * 9000);
  const word = words[Math.floor(Math.random() * words.length)];
  return `${word}-${num}`;
}

/**
 * Push tasks to cloud database (Supports Free Public Cloud Bin + Supabase)
 */
export async function pushTasksToCloud(
  syncKey: string,
  tasks: TodoTask[],
  categories: string[],
  supabaseConfig?: SupabaseConfig | null
): Promise<boolean> {
  const cleanKey = syncKey.trim().toLowerCase();
  if (!cleanKey) return false;

  const payload: CloudPayload = {
    syncKey: cleanKey,
    updatedAt: new Date().toISOString(),
    tasks,
    categories,
  };

  // If user configured their private Supabase PostgreSQL
  if (supabaseConfig?.url && supabaseConfig?.anonKey) {
    try {
      const res = await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/user_todos`, {
        method: 'POST',
        headers: {
          'apikey': supabaseConfig.anonKey,
          'Authorization': `Bearer ${supabaseConfig.anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          sync_key: cleanKey,
          data: payload,
          updated_at: new Date().toISOString(),
        }),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Supabase push error, falling back to cloud bin:', e);
    }
  }

  // Primary Free Global Cloud Storage API
  const sanitizedKey = cleanKey.replace(/[^a-z0-9_-]/g, '');
  try {
    const response = await fetch(`https://kvdb.io/8j3f5p7K9xQ2Z1W/todo_room_${sanitizedKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (err) {
    console.warn('Cloud sync error (local storage preserved):', err);
    return false;
  }
}

/**
 * Pull tasks from cloud database
 */
export async function pullTasksFromCloud(
  syncKey: string,
  supabaseConfig?: SupabaseConfig | null
): Promise<CloudPayload | null> {
  const cleanKey = syncKey.trim().toLowerCase();
  if (!cleanKey) return null;

  // If user configured Supabase
  if (supabaseConfig?.url && supabaseConfig?.anonKey) {
    try {
      const res = await fetch(
        `${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/user_todos?sync_key=eq.${cleanKey}&select=*`,
        {
          method: 'GET',
          headers: {
            'apikey': supabaseConfig.anonKey,
            'Authorization': `Bearer ${supabaseConfig.anonKey}`,
            'Accept': 'application/json',
          },
        }
      );
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].data?.tasks) {
          return rows[0].data as CloudPayload;
        }
      }
    } catch (e) {
      console.warn('Supabase pull error, falling back to cloud bin:', e);
    }
  }

  // Primary Free Global Cloud Storage API
  const sanitizedKey = cleanKey.replace(/[^a-z0-9_-]/g, '');
  try {
    const response = await fetch(`https://kvdb.io/8j3f5p7K9xQ2Z1W/todo_room_${sanitizedKey}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data && Array.isArray(data.tasks)) {
      return data as CloudPayload;
    }
    return null;
  } catch (err) {
    console.warn('Cloud sync pull warning:', err);
    return null;
  }
}

export function getSyncShareUrl(syncKey: string): string {
  const cleanKey = syncKey.trim().toLowerCase();
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('sync', cleanKey);
  return url.toString();
}
