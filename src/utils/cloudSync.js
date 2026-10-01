// Cloud Synchronization Engine for BreyHabitos
// Supports direct Supabase REST API (zero extra dependencies, lightweight & instant)
import { safeStorage } from './storage';

/**
 * Validates connection with Supabase
 */
export async function testCloudConnection(config) {
  if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
    return { success: false, error: 'Falta la URL de Supabase o la Anon Key' };
  }

  const cleanUrl = config.supabaseUrl.replace(/\/+$/, '');
  const tableName = config.tableName || 'breyhabitos_sync';

  try {
    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}?select=room_id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': config.supabaseAnonKey,
        'Authorization': `Bearer ${config.supabaseAnonKey}`,
      },
    });

    if (res.ok) {
      return { success: true };
    }

    if (res.status === 404 || res.status === 400) {
      return {
        success: false,
        error: `La tabla "${tableName}" no existe aún en Supabase. Crea la tabla ejecutando el script SQL provisto.`,
      };
    }

    return {
      success: false,
      error: `Error HTTP ${res.status}: Verifica tu Anon Key y permisos de tabla (RLS).`,
    };
  } catch (err) {
    return {
      success: false,
      error: `Error de red al conectar: ${err.message || 'Verifica tu conexión a internet.'}`,
    };
  }
}

/**
 * Pushes local data to the cloud
 */
export async function pushToCloud(config, localData) {
  if (!config?.enabled || !config?.supabaseUrl || !config?.supabaseAnonKey) {
    return { success: false, skipped: true };
  }

  const cleanUrl = config.supabaseUrl.replace(/\/+$/, '');
  const tableName = config.tableName || 'breyhabitos_sync';
  const roomId = config.roomId || 'brey_alejandro_salud';

  try {
    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'apikey': config.supabaseAnonKey,
        'Authorization': `Bearer ${config.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        room_id: roomId,
        payload: localData,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Error ${res.status}: ${errText}` };
    }

    return { success: true, timestamp: new Date().toISOString() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Pulls latest data from the cloud
 */
export async function pullFromCloud(config) {
  if (!config?.enabled || !config?.supabaseUrl || !config?.supabaseAnonKey) {
    return { success: false, skipped: true };
  }

  const cleanUrl = config.supabaseUrl.replace(/\/+$/, '');
  const tableName = config.tableName || 'breyhabitos_sync';
  const roomId = config.roomId || 'brey_alejandro_salud';

  try {
    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}?room_id=eq.${encodeURIComponent(roomId)}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': config.supabaseAnonKey,
        'Authorization': `Bearer ${config.supabaseAnonKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Error ${res.status}: ${errText}` };
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      return { success: true, empty: true, cloudData: null };
    }

    return {
      success: true,
      cloudData: data[0].payload,
      updatedAt: data[0].updated_at,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Intelligently merges cloud data with local data by id/date
 */
export function mergeAppData(local, cloud) {
  if (!cloud) return local;
  if (!local) return cloud;

  const mergeById = (localArr = [], cloudArr = []) => {
    const map = new Map();
    // Insert local items
    (localArr || []).forEach(item => {
      if (item && item.id) map.set(item.id, item);
    });
    // Merge cloud items (cloud items take precedence if updated)
    (cloudArr || []).forEach(item => {
      if (item && item.id) {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        } else {
          // If both have it, keep the most complete or cloud one
          map.set(item.id, { ...map.get(item.id), ...item });
        }
      }
    });
    return Array.from(map.values());
  };

  const mergeUsers = (localUsers = [], cloudUsers = []) => {
    const map = new Map();
    (localUsers || []).forEach(u => {
      if (u && u.email) map.set(u.email.toLowerCase(), u);
    });
    (cloudUsers || []).forEach(u => {
      if (u && u.email) {
        const key = u.email.toLowerCase();
        if (!map.has(key)) {
          map.set(key, u);
        } else {
          map.set(key, { ...map.get(key), ...u });
        }
      }
    });
    return Array.from(map.values());
  };

  const mergeMealLogs = (localMeals = [], cloudMeals = []) => {
    const key = (m) => m.id ? m.id : `${m.date}_${m.mealId}`;
    const map = new Map();
    (localMeals || []).forEach(m => map.set(key(m), m));
    (cloudMeals || []).forEach(m => {
      const k = key(m);
      if (!map.has(k)) {
        map.set(k, m);
      } else {
        // Keep photoUrl and evaluation if present
        const existing = map.get(k);
        map.set(k, {
          ...existing,
          ...m,
          photoUrl: m.photoUrl || existing.photoUrl,
          evaluation: m.evaluation || existing.evaluation,
          dishName: m.dishName || existing.dishName,
        });
      }
    });
    return Array.from(map.values());
  };

  return {
    users: mergeUsers(local.users, cloud.users),
    settings: { ...(local.settings || {}), ...(cloud.settings || {}) },
    waterLogs: mergeById(local.waterLogs, cloud.waterLogs),
    mealLogs: mergeMealLogs(local.mealLogs, cloud.mealLogs),
    sleepLogs: mergeById(local.sleepLogs, cloud.sleepLogs),
    foodGuide: mergeById(local.foodGuide, cloud.foodGuide),
    careNotes: mergeById(local.careNotes, cloud.careNotes),
    urineLogs: mergeById(local.urineLogs, cloud.urineLogs),
    symptomLogs: mergeById(local.symptomLogs, cloud.symptomLogs),
    syncedAt: new Date().toISOString(),
  };
}

/**
 * Encodes key pairing information into a portable base64 token
 * so users can link PC and mobile devices instantly without manually typing keys
 */
export function generateDevicePairingToken(data) {
  try {
    const payload = {
      users: data.users || [],
      cloudConfig: data.cloudConfig || null,
      currentUser: data.currentUser ? {
        id: data.currentUser.id,
        email: data.currentUser.email,
        name: data.currentUser.name,
        role: data.currentUser.role,
        password: data.currentUser.password,
      } : null,
      timestamp: Date.now(),
    };
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  } catch (err) {
    console.error('Error creating pairing token:', err);
    return null;
  }
}

/**
 * Decodes and applies pairing token into local storage
 */
export function applyDevicePairingToken(token) {
  if (!token) return { success: false, error: 'Token vacío' };
  try {
    const raw = decodeURIComponent(atob(token.trim()));
    const payload = JSON.parse(raw);
    if (!payload || typeof payload !== 'object') {
      return { success: false, error: 'Token inválido' };
    }
    return { success: true, payload };
  } catch (err) {
    return { success: false, error: 'Error al descifrar el token: ' + err.message };
  }
}

// --- Realtime Sync Status & Offline Queue Management ---

const OFFLINE_QUEUE_KEY = 'breyhabitos_offline_sync_queue_v1';
const SYNC_META_KEY = 'breyhabitos_last_sync_meta_v1';

let currentSyncStatus = {
  state: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'idle', // 'idle' | 'syncing' | 'synced' | 'offline' | 'error'
  lastSyncTime: null,
  error: null,
  pendingCount: 0,
};

const listeners = new Set();

export function getSyncStatus() {
  return { ...currentSyncStatus };
}

export function setSyncStatus(newStatus) {
  currentSyncStatus = { ...currentSyncStatus, ...newStatus };
  listeners.forEach(fn => {
    try {
      fn(currentSyncStatus);
    } catch (err) {
      console.warn('Sync listener error:', err);
    }
  });
}

export function subscribeSyncStatus(fn) {
  listeners.add(fn);
  fn(currentSyncStatus);
  return () => listeners.delete(fn);
}

/**
 * Saves pending local data to offline queue
 */
export function queueOfflineSync(localData) {
  try {
    safeStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify({
      data: localData,
      queuedAt: new Date().toISOString(),
    }));
    setSyncStatus({ pendingCount: 1 });
  } catch (err) {
    console.warn('Error saving offline queue:', err);
  }
}

/**
 * Retrieves offline queue if any
 */
export function getOfflineQueue() {
  try {
    const raw = safeStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clears offline queue after successful sync
 */
export function clearOfflineQueue() {
  try {
    safeStorage.removeItem(OFFLINE_QUEUE_KEY);
    setSyncStatus({ pendingCount: 0 });
  } catch (err) {
    console.warn('Error clearing offline queue:', err);
  }
}

/**
 * Complete Two-Way Sync Cycle:
 * 1. Checks online status. If offline, queues and returns.
 * 2. Pulls latest cloud data.
 * 3. Merges cloud data with current local data.
 * 4. Pushes merged payload back to cloud.
 * 5. Notifies callers with the new merged dataset.
 */
export async function performTwoWaySync(config, localData, onDataMerged) {
  if (!config?.enabled || !config?.supabaseUrl || !config?.supabaseAnonKey) {
    setSyncStatus({ state: 'idle', error: null });
    return { success: false, reason: 'unconfigured' };
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    queueOfflineSync(localData);
    setSyncStatus({ state: 'offline', error: 'Sin conexión a internet' });
    return { success: false, reason: 'offline' };
  }

  setSyncStatus({ state: 'syncing', error: null });

  try {
    // 1. Pull latest from cloud
    const pullRes = await pullFromCloud(config);
    if (!pullRes.success) {
      setSyncStatus({ state: 'error', error: pullRes.error });
      return { success: false, error: pullRes.error };
    }

    // 2. Check if we had pending changes in offline queue
    const queued = getOfflineQueue();
    const effectiveLocal = queued?.data ? mergeAppData(localData, queued.data) : localData;

    // 3. Intelligently merge
    const mergedData = mergeAppData(effectiveLocal, pullRes.cloudData);

    // 4. Push merged data back to ensure both sides have consistent state
    const pushRes = await pushToCloud(config, mergedData);
    if (!pushRes.success) {
      setSyncStatus({ state: 'error', error: pushRes.error });
      return { success: false, error: pushRes.error };
    }

    // 5. Clean queue and persist sync meta
    clearOfflineQueue();
    const nowIso = new Date().toISOString();
    try {
      safeStorage.setItem(SYNC_META_KEY, JSON.stringify({ lastSyncTime: nowIso }));
    } catch {}

    setSyncStatus({
      state: 'synced',
      lastSyncTime: nowIso,
      error: null,
      pendingCount: 0,
    });

    if (typeof onDataMerged === 'function') {
      onDataMerged(mergedData);
    }

    return { success: true, mergedData, timestamp: nowIso };
  } catch (err) {
    setSyncStatus({ state: 'error', error: err.message || 'Error inesperado al sincronizar' });
    return { success: false, error: err.message };
  }
}

/**
 * Initializes automatic sync listeners for network reconnection & window focus
 */
export function initAutoSync(config, getLocalData, onDataMerged) {
  if (typeof window === 'undefined') return () => {};

  let syncTimeout = null;

  const triggerSync = (delay = 400) => {
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      if (config?.enabled && navigator.onLine) {
        performTwoWaySync(config, getLocalData(), onDataMerged);
      }
    }, delay);
  };

  const handleOnline = () => {
    setSyncStatus({ state: 'idle', error: null });
    triggerSync(500);
  };

  const handleOffline = () => {
    setSyncStatus({ state: 'offline', error: 'Sin conexión a internet' });
  };

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      triggerSync(1000);
    }
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    if (syncTimeout) clearTimeout(syncTimeout);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}

/**
 * SQL script helper for easy setup in Supabase dashboard
 */
export const SUPABASE_SQL_SETUP = `-- Script SQL para BreyHabitos en Supabase (Copiar y pegar en SQL Editor de supabase.com)
CREATE TABLE IF NOT EXISTS public.breyhabitos_sync (
  room_id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar seguridad por fila (RLS)
ALTER TABLE public.breyhabitos_sync ENABLE ROW LEVEL SECURITY;

-- Permitir lectura y escritura con la clave Anon pública
CREATE POLICY "Acceso Publico BreyHabitos" 
ON public.breyhabitos_sync 
FOR ALL 
USING (true) 
WITH CHECK (true);
`;
