// Mobile PWA & Desktop System Notification Engine

export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermissionState = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.warn('Error solicitando permisos de notificación:', err);
    return false;
  }
};

export const triggerSystemNotification = async (title, body, tag = 'breyhabitos_alert', extraData = {}) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  let actions = [
    { action: 'open_app', title: 'Abrir BreyHabitos' }
  ];
  let vibrate = [500, 150, 500, 150, 500, 150, 800];

  if (tag.startsWith('care_note') || tag.startsWith('love')) {
    vibrate = [400, 150, 400, 150, 600, 200, 800];
    actions = [
      { action: 'open_love', title: 'Leer Mensaje con Amor' }
    ];
  } else if (tag.startsWith('duolingo') || tag.startsWith('urgent')) {
    vibrate = [800, 120, 800, 120, 1000, 150, 1200];
    actions = [
      { action: 'drink_250', title: '¡Tomé agua ya!' },
      { action: 'snooze_10', title: 'Dame 10 min' }
    ];
  } else if (tag.startsWith('renal_meal')) {
    vibrate = [350, 120, 350, 120, 500];
    actions = [
      { action: 'open_meal', title: 'Ver Comida' },
      { action: 'snooze_15', title: 'Posponer 15 min' }
    ];
  } else if (tag.startsWith('renal_water') || tag.startsWith('water')) {
    vibrate = [500, 150, 500, 150, 500, 150, 800];
    actions = [
      { action: 'drink_250', title: 'Tomé 250 ml' },
      { action: 'snooze_15', title: 'Posponer 15 min' }
    ];
  }

  const notificationOptions = {
    body,
    icon: '/pwa-192x192.png',
    badge: '/favicon.png',
    tag,
    renotify: true,
    requireInteraction: true, // Keep notification visible on lock screen until user interacts
    vibrate,
    data: { url: extraData.url || '/', ...extraData },
    actions
  };

  // 1. Mobile & PWA standard: Try via ServiceWorkerRegistration (Crucial for Android & iOS PWA background)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && typeof registration.showNotification === 'function') {
        await registration.showNotification(title, notificationOptions);
        return true;
      }
    } catch (swErr) {
      console.warn('ServiceWorker showNotification falló, intentando constructor nativo:', swErr);
    }
  }

  // 2. Desktop Browser fallback (Chrome/Firefox/Edge on PC/Mac)
  try {
    new Notification(title, notificationOptions);
    return true;
  } catch (err) {
    console.warn('Notification constructor error:', err);
    return false;
  }
};

/**
 * Schedules a background alarm inside the Service Worker
 * Ensures notification will fire even if the browser tab is closed/backgrounded
 */
export const scheduleBackgroundAlarm = async ({ id, delayMs, title, body, tag, tab }) => {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const target = navigator.serviceWorker.controller || registration.active;
    if (target) {
      target.postMessage({
        type: 'SCHEDULE_ALARM',
        id: id || 'alarm_' + Date.now(),
        delayMs: Math.max(1000, delayMs),
        title,
        body,
        tag: tag || 'renal_alarm',
        tab: tab || 'dashboard'
      });
      return true;
    }
  } catch (err) {
    console.warn('Error programando alarma en Service Worker:', err);
  }
  return false;
};

/**
 * Listens for actions coming from Service Worker lock screen buttons
 */
export const setupServiceWorkerListener = (onQuickAddWater) => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return () => {};

  const handleMessage = (event) => {
    if (event.data && event.data.type === 'QUICK_ADD_WATER') {
      if (typeof onQuickAddWater === 'function') {
        onQuickAddWater(event.data.amount || 250);
      }
    }
  };

  navigator.serviceWorker.addEventListener('message', handleMessage);
  return () => {
    navigator.serviceWorker.removeEventListener('message', handleMessage);
  };
};

/**
 * Sends cloud sync configuration to Service Worker so it can poll in the background
 */
export const syncConfigToServiceWorker = async (config, lastSeenNoteId) => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const target = navigator.serviceWorker.controller || registration.active;
    if (target) {
      target.postMessage({
        type: 'SET_SYNC_CONFIG',
        config,
        lastSeenNoteId
      });
      return true;
    }
  } catch (err) {
    console.warn('Error sincronizando config con Service Worker:', err);
  }
  return false;
};


