// BreyHabitos Background Service Worker Addon
// Handles Web Push, Background Alarm Scheduling, Vibration, and Lock Screen Actions

const scheduledTimers = new Map();

// Listen to messages from the web application
self.addEventListener('message', (event) => {
  if (!event.data) return;

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
  const options = {
    body: body || 'Es momento de hidratar tus riñones para diluir sales y prevenir cólicos.',
    icon: '/pwa-192x192.png',
    badge: '/favicon.png',
    tag: tag,
    renotify: true,
    requireInteraction: true, // Remains on mobile lock screen until dismissed or acted upon
    vibrate: [500, 150, 500, 150, 500, 150, 800], // High-intensity medical alert pattern
    data: {
      url: `/?tab=${tab}`,
      timestamp: Date.now(),
    },
    actions: [
      { action: 'drink_250', title: ' Tomé 250 ml' },
      { action: 'snooze_15', title: '⏱ Posponer 15m' },
    ],
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
        // If an open window exists, tell it to add 250ml
        for (const client of clientList) {
          if ('postMessage' in client) {
            client.postMessage({ type: 'QUICK_ADD_WATER', amount: 250 });
            return client.focus();
          }
        }
        // Otherwise, open the app with action query param
        if (clients.openWindow) {
          return clients.openWindow('/?action=add_water_250');
        }
      })
    );
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
