import { TodoTask } from '../types/todo';

export interface CloudPayload {
  syncKey: string;
  senderId: string;
  updatedAt: string;
  tasks: TodoTask[];
  categories: string[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const CLOUD_SYNC_KEY_STORAGE = 'priority_todo_sync_key_v3';
const SUPABASE_CONFIG_STORAGE = 'priority_todo_supabase_config_v1';
export const CLIENT_SESSION_ID = `client_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

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
 * Publish tasks to real-time cloud relay
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
    senderId: CLIENT_SESSION_ID,
    updatedAt: new Date().toISOString(),
    tasks,
    categories,
  };

  const sanitizedKey = cleanKey.replace(/[^a-z0-9_-]/g, '');

  // 1. Publish to Real-time PubSub Relay (Immediate delivery to Incognito, Phone & Laptop)
  try {
    await fetch(`https://ntfy.sh/priority_todo_room_${sanitizedKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Real-time pubsub warning:', err);
  }

  // 2. If user configured private Supabase
  if (supabaseConfig?.url && supabaseConfig?.anonKey) {
    try {
      await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/user_todos`, {
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
    } catch (e) {
      console.warn('Supabase push error:', e);
    }
  }

  return true;
}

/**
 * Pull latest tasks from real-time cloud relay
 */
export async function pullTasksFromCloud(
  syncKey: string,
  supabaseConfig?: SupabaseConfig | null
): Promise<CloudPayload | null> {
  const cleanKey = syncKey.trim().toLowerCase();
  if (!cleanKey) return null;

  const sanitizedKey = cleanKey.replace(/[^a-z0-9_-]/g, '');

  // 1. Try pulling latest cached message from real-time relay
  try {
    const response = await fetch(`https://ntfy.sh/priority_todo_room_${sanitizedKey}/json?poll=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const text = await response.text();
      // ntfy returns line-delimited JSON messages, take the last one
      const lines = text.trim().split('\n').filter(Boolean);
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          if (item.message) {
            const parsed = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
            if (parsed && Array.isArray(parsed.tasks)) {
              return parsed as CloudPayload;
            }
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Real-time poll warning:', err);
  }

  // 2. Try Supabase if configured
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
    } catch (e) {}
  }

  return null;
}

export function getSyncShareUrl(syncKey: string): string {
  const cleanKey = syncKey.trim().toLowerCase();
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('sync', cleanKey);
  return url.toString();
}
