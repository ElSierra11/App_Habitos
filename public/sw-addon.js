// BreyHabitos Background Service Worker Addon
// Handles Web Push, Background Alarm Scheduling, Vibration, and Lock Screen Actions

const scheduledTimers = new Map();

let cloudConfig = null;
let lastSeenNoteId = null;
let bgSyncInterval = null;

// Background polling for care notes directly from Service Worker
async function checkBackgroundCareNotes() {
  if (!cloudConfig || !cloudConfig.enabled || !cloudConfig.supabaseUrl || !cloudConfig.supabaseAnonKey) {
    return;
  }
  try {
    const cleanUrl = cloudConfig.supabaseUrl.replace(/\/+$/, '');
    const tableName = cloudConfig.tableName || 'breyhabitos_sync';
    const roomId = cloudConfig.roomId || 'brey_alejandro_salud';

    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}?room_id=eq.${encodeURIComponent(roomId)}&select=payload,updated_at`, {
      method: 'GET',
      headers: {
        'apikey': cloudConfig.supabaseAnonKey,
        'Authorization': `Bearer ${cloudConfig.supabaseAnonKey}`,
      },
    });

    if (!res.ok) return;
    const data = await res.json();
    if (!data || data.length === 0 || !data[0].payload) return;

    const notes = data[0].payload.careNotes || [];
    if (notes.length > 0) {
      const latest = notes[0];
      if (lastSeenNoteId && latest.id !== lastSeenNoteId) {
        lastSeenNoteId = latest.id;
        showAlarmNotification(
          'Alejandro te ha enviado un mensaje de amor y ánimo',
          `"${latest.message}"`,
          `care_note_${latest.id}`,
          'dashboard'
        );
      } else if (!lastSeenNoteId) {
        lastSeenNoteId = latest.id;
      }
    }
  } catch {
    // Network errors in background ignored
  }
}

// Listen to messages from the web application
self.addEventListener('message', (event) => {
  if (!event.data) return;

  // 0. Update Cloud Config for Background Checking
  if (event.data.type === 'SET_SYNC_CONFIG') {
    cloudConfig = event.data.config || null;
    if (event.data.lastSeenNoteId) {
      lastSeenNoteId = event.data.lastSeenNoteId;
    }
    if (!bgSyncInterval && cloudConfig?.enabled) {
      bgSyncInterval = setInterval(checkBackgroundCareNotes, 20000);
      checkBackgroundCareNotes();
    }
  }

  // 1. Schedule a background alarm
  if (event.data.type === 'SCHEDULE_ALARM') {
    const { id, delayMs, title, body, tag, tab } = event.data;

    if (scheduledTimers.has(id)) {
      clearTimeout(scheduledTimers.get(id));
    }

    const timer = setTimeout(() => {
      scheduledTimers.delete(id);
      showAlarmNotification(title, body, tag, tab);
    }, Math.max(1000, delayMs));

    scheduledTimers.set(id, timer);
  }

  // 2. Cancel a scheduled alarm
  if (event.data.type === 'CANCEL_ALARM') {
    const { id } = event.data;
    if (scheduledTimers.has(id)) {
      clearTimeout(scheduledTimers.get(id));
      scheduledTimers.delete(id);
    }
  }

  // 3. Trigger immediate notification with loud vibration
  if (event.data.type === 'TRIGGER_IMMEDIATE_ALARM') {
    const { title, body, tag, tab } = event.data;
    showAlarmNotification(title, body, tag, tab);
  }
});

// Display high-priority, sticky notification with sound and vibration
function showAlarmNotification(title, body, tag = 'renal_water_alarm', tab = 'dashboard') {
  let actions = [
    { action: 'open_app', title: 'Abrir BreyHabitos' }
  ];
  let vibrate = [500, 150, 500, 150, 500, 150, 800];

  if (tag.startsWith('duolingo') || tag.startsWith('urgent')) {
    // Insistent Duolingo-style vibration pattern
    vibrate = [800, 120, 800, 120, 1000, 150, 1200];
    actions = [
      { action: 'drink_250', title: 'Tomé 250 ml' },
      { action: 'snooze_10', title: 'Posponer 10 min' }
    ];
  } else if (tag.startsWith('care_note') || tag.startsWith('love')) {
    vibrate = [400, 150, 400, 150, 600, 200, 800];
    actions = [
      { action: 'open_love', title: 'Leer con Amor' }
    ];
  } else if (tag.startsWith('renal_meal')) {
    vibrate = [350, 120, 350, 120, 500];
    actions = [
      { action: 'open_meal', title: 'Ver Horario de Comida' },
      { action: 'snooze_15', title: 'Posponer 15 min' }
    ];
  } else if (tag.startsWith('renal_water') || tag.startsWith('water')) {
    vibrate = [500, 150, 500, 150, 500, 150, 800];
    actions = [
      { action: 'drink_250', title: 'Tomé 250 ml' },
      { action: 'snooze_15', title: 'Posponer 15 min' }
    ];
  }

  const options = {
    body: body || 'Es momento de hidratar tus riñones para diluir sales y prevenir cólicos.',
    icon: '/pwa-192x192.png',
    badge: '/favicon.png',
    tag: tag,
    renotify: true,
    requireInteraction: true, // Remains on mobile lock screen until dismissed or acted upon
    vibrate,
    data: {
      url: `/?tab=${tab}`,
      timestamp: Date.now(),
    },
    actions
  };

  return self.registration.showNotification(title, options);
}

// Handle Web Push event (if backend push is configured)
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Recordatorio Renal', body: event.data ? event.data.text() : 'Tus riñones necesitan agua.' };
  }

  const title = data.title || 'Alarma de Hidratación Renal';
  const body = data.body || 'Hora de beber agua fresca para proteger tus riñones.';
  const tag = data.tag || 'renal_push_alarm';

  event.waitUntil(showAlarmNotification(title, body, tag, data.tab || 'dashboard'));
});

// Handle notification interaction (Lock Screen / Notification Shade clicks)
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  notification.close();

  // If user tapped "Tomé 250 ml" directly on the lock screen
  if (action === 'drink_250') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if ('postMessage' in client) {
            client.postMessage({ type: 'QUICK_ADD_WATER', amount: 250 });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/?action=add_water_250');
        }
      })
    );
    return;
  }

  // If user tapped "Posponer 10 min"
  if (action === 'snooze_10') {
    setTimeout(() => {
      showAlarmNotification(
        'Alerta Renal Insistente',
        'Ya pasaron 10 minutos. No ignores a tus riñones, un vaso de 250 ml ahora mismo.',
        'duolingo_insistent_alarm'
      );
    }, 10 * 60 * 1000);
    return;
  }

  // If user tapped "Posponer 15m"
  if (action === 'snooze_15') {
    setTimeout(() => {
      showAlarmNotification(
        'Recordatorio Pospuesto de Agua',
        'Han pasado 15 minutos. Recuerda tomar tu vaso de agua fresca.',
        'renal_snooze_alarm'
      );
    }, 15 * 60 * 1000);
    return;
  }

  // Default: Open / focus the app window
  const targetUrl = (notification.data && notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
