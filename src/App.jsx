import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplets, 
  Moon, 
  Apple, 
  SlidersHorizontal, 
  Bell, 
  Eye, 
  ChefHat,
  Activity,
  BarChart3,
  Utensils,
  Heart,
  ShieldAlert,
  MessageSquareHeart,
  Flame
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { WaterTracker } from './components/WaterTracker';
import { MealSchedule } from './components/MealSchedule';
import { RenalFoodGuide } from './components/RenalFoodGuide';
import { SleepTracker } from './components/SleepTracker';
import { CareNotesBanner } from './components/CareNotesBanner';
import { AdminPanel } from './components/AdminPanel';
import { ReminderAlertModal } from './components/ReminderAlertModal';
import { InstallPrompt } from './components/InstallPrompt';
import { UrineColorChecker } from './components/UrineColorChecker';
import { MealChecker } from './components/MealChecker';
import { StreakTracker } from './components/StreakTracker';
import { SymptomTracker } from './components/SymptomTracker';
import { ProgressStats } from './components/ProgressStats';
import { CloudSyncModal } from './components/CloudSyncModal';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { Toast } from './components/Toast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TodayRenalGlance } from './components/TodayRenalGlance';
import { SosEmergencyModal } from './components/SosEmergencyModal';
import { WhatsAppCheckInModal } from './components/WhatsAppCheckInModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { IosNotificationGuideModal } from './components/IosNotificationGuideModal';

import {
  getCurrentUser,
  setCurrentUser,
  getSettings,
  saveSettings,
  getWaterLogs,
  addWaterLog,
  deleteWaterLog,
  getMealLogs,
  toggleMealLog,
  addDetailedMealLog,
  getSleepLogs,
  saveSleepLog,
  getFoodGuide,
  addFoodItem,
  deleteFoodItem,
  getCareNotes,
  addCareNote,
  reactToCareNote,
  deleteCareNote,
  getUrineLogs,
  addUrineLog,
  deleteUrineLog,
  getSymptomLogs,
  addSymptomLog,
  deleteSymptomLog,
  getCloudConfig,
  saveCloudConfig,
  getAllAppData,
  importAllAppData,
  calculateStreak,
  getStoredTheme,
  saveStoredTheme
} from './utils/storage';

import { 
  pushToCloud, 
  pullFromCloud, 
  mergeAppData, 
  performTwoWaySync, 
  initAutoSync, 
  subscribeSyncStatus, 
  getSyncStatus,
  applyDevicePairingToken
} from './utils/cloudSync';
import { playAlertSound } from './utils/sound';
import { 
  requestNotificationPermission, 
  triggerSystemNotification, 
  scheduleBackgroundAlarm, 
  setupServiceWorkerListener,
  syncConfigToServiceWorker
} from './utils/notifications';
import { triggerHaptic } from './utils/haptics';

export default function App() {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser);
  const [settings, setSettingsState] = useState(getSettings);
  const [waterLogs, setWaterLogs] = useState(getWaterLogs);
  const [mealLogs, setMealLogs] = useState(getMealLogs);
  const [sleepLogs, setSleepLogs] = useState(getSleepLogs);
  const [foodGuide, setFoodGuide] = useState(getFoodGuide);
  const [careNotes, setCareNotes] = useState(getCareNotes);
  const [urineLogs, setUrineLogs] = useState(getUrineLogs);
  const [symptomLogs, setSymptomLogs] = useState(getSymptomLogs);
  const [cloudConfig, setCloudConfigState] = useState(getCloudConfig);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isDeviceSyncOpen, setIsDeviceSyncOpen] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isWhatsAppCheckInOpen, setIsWhatsAppCheckInOpen] = useState(false);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  const [isIosGuideOpen, setIsIosGuideOpen] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState(() => {
    try {
      const raw = localStorage.getItem('breyhabitos_notification_history_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addNotificationToHistory = ({ type, title, message }) => {
    const item = {
      id: 'notif_' + Date.now() + Math.random(),
      type: type || 'water',
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };
    setNotificationHistory(prev => {
      const updated = [item, ...prev].slice(0, 30);
      try {
        localStorage.setItem('breyhabitos_notification_history_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const [activeAlert, setActiveAlert] = useState(null);
  const [toast, setToast] = useState(null);
  const [syncStatus, setSyncStatusState] = useState(getSyncStatus);

  const lastWaterAlertTimeRef = useRef(Date.now());
  const lastSeenNoteIdRef = useRef((() => {
    try {
      return localStorage.getItem('breyhabitos_last_seen_note_id_v1') || null;
    } catch {
      return null;
    }
  })());

  const showToast = ({ type = 'info', title, message, duration = 3500 }) => {
    setToast({ id: Date.now() + Math.random(), type, title, message, duration });
  };

  const handleCloudDataSynced = (mergedData) => {
    if (!mergedData) return;
    if (mergedData.settings) setSettingsState(mergedData.settings);
    if (mergedData.waterLogs) setWaterLogs(mergedData.waterLogs);
    if (mergedData.mealLogs) setMealLogs(mergedData.mealLogs);
    if (mergedData.sleepLogs) setSleepLogs(mergedData.sleepLogs);
    if (mergedData.foodGuide) setFoodGuide(mergedData.foodGuide);
    if (mergedData.urineLogs) setUrineLogs(mergedData.urineLogs);
    if (mergedData.symptomLogs) setSymptomLogs(mergedData.symptomLogs);

    if (mergedData.careNotes) {
      setCareNotes(mergedData.careNotes);

      // Check for new incoming care note from Alejandro
      if (mergedData.careNotes.length > 0) {
        const latest = mergedData.careNotes[0];
        const prevId = lastSeenNoteIdRef.current;

        if (prevId && latest.id !== prevId) {
          lastSeenNoteIdRef.current = latest.id;
          try {
            localStorage.setItem('breyhabitos_last_seen_note_id_v1', latest.id);
          } catch {}

          if (cloudConfig) {
            syncConfigToServiceWorker(cloudConfig, latest.id);
          }

          // Trigger lock screen notification, vibration, and loud love chime if on recipient device
          if (currentUser?.role !== 'admin') {
            triggerHaptic([400, 150, 400, 150, 600, 200, 800]);
            if (soundEnabled) {
              playAlertSound('love');
            }
            triggerSystemNotification(
              'Alejandro te ha enviado un mensaje de amor y ánimo',
              `"${latest.message}"`,
              `care_note_${latest.id}`,
              { tab: 'dashboard', type: 'care_note', noteId: latest.id }
            );
            showToast({
              type: 'heart',
              title: 'Mensaje de amor de Alejandro',
              message: latest.message,
              duration: 9000,
            });
            setActiveAlert({
              type: 'love',
              title: 'Alejandro te ha enviado un mensaje de amor y ánimo',
              message: `"${latest.message}"`
            });
          }
        } else if (!prevId) {
          lastSeenNoteIdRef.current = latest.id;
          try {
            localStorage.setItem('breyhabitos_last_seen_note_id_v1', latest.id);
          } catch {}
        }
      }
    }
  };

  // Sync initial note ID and cloud config to Service Worker for background monitoring
  useEffect(() => {
    if (!lastSeenNoteIdRef.current && careNotes && careNotes.length > 0) {
      lastSeenNoteIdRef.current = careNotes[0].id;
      try {
        localStorage.setItem('breyhabitos_last_seen_note_id_v1', careNotes[0].id);
      } catch {}
    }
    if (cloudConfig) {
      syncConfigToServiceWorker(cloudConfig, lastSeenNoteIdRef.current);
    }
  }, [cloudConfig, careNotes]);

  // Sync status subscriber
  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((status) => {
      setSyncStatusState(status);
    });
    return unsubscribe;
  }, []);

  // Initialize auto-sync on network reconnection & tab focus
  useEffect(() => {
    if (!cloudConfig?.enabled) return;

    const cleanup = initAutoSync(
      cloudConfig,
      () => getAllAppData(),
      (merged) => {
        handleCloudDataSynced(merged);
        showToast({
          type: 'cloud',
          title: 'Sincronizado',
          message: 'Tus datos están al día con la nube',
          duration: 2500,
        });
      }
    );

    return cleanup;
  }, [cloudConfig]);

  // Handle mobile / browser back button navigation gracefully
  useEffect(() => {
    const handlePopState = () => {
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return;
      }
      if (isCloudSyncOpen) {
        setIsCloudSyncOpen(false);
        return;
      }
      if (isSosOpen) {
        setIsSosOpen(false);
        return;
      }
      if (isWhatsAppCheckInOpen) {
        setIsWhatsAppCheckInOpen(false);
        return;
      }
      if (activeAlert) {
        setActiveAlert(null);
        return;
      }
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthModalOpen, isCloudSyncOpen, isSosOpen, isWhatsAppCheckInOpen, activeAlert, activeTab]);

  // Handle initial PWA shortcut action query params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      if (action === 'quick_water') {
        handleAddWater(250);
      } else if (action === 'sos') {
        setIsSosOpen(true);
      }
    } catch {}
  }, []);

  // Push history state so back button closes modals or returns to dashboard
  useEffect(() => {
    if (isAuthModalOpen || isCloudSyncOpen || isSosOpen || isWhatsAppCheckInOpen || activeTab !== 'dashboard') {
      window.history.pushState({ appState: true }, '');
    }
  }, [isAuthModalOpen, isCloudSyncOpen, isSosOpen, isWhatsAppCheckInOpen, activeTab]);

  // Apply theme to document and update mobile status bar color
  useEffect(() => {
    saveStoredTheme(theme);
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#130A14' : '#FCE7F3');
  }, [theme]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveStoredTheme(next);
    showToast({
      type: 'info',
      title: next === 'dark' ? 'Modo Oscuro' : 'Modo Claro',
      message: next === 'dark' ? 'Ideal para la noche y menor fatiga visual' : 'Visualización diurna nítida',
      duration: 2000,
    });
  };

  // Calculate streak data
  const streakData = calculateStreak(waterLogs, settings?.targetWaterMl || 3000);

  // Background Cloud Push Helper
  const triggerCloudPush = (extra = {}) => {
    if (!cloudConfig?.enabled) return;
    const currentAll = getAllAppData();
    const payload = { ...currentAll, ...extra };
    pushToCloud(cloudConfig, payload).catch((err) => {
      console.warn('Fallo en sincronización en la nube:', err);
    });
  };

  // Manual sync trigger from navbar or button
  const handleTriggerManualSync = async () => {
    if (!cloudConfig?.enabled) {
      setIsCloudSyncOpen(true);
      return;
    }
    showToast({ type: 'info', message: 'Sincronizando con la nube...' });
    const res = await performTwoWaySync(cloudConfig, getAllAppData(), handleCloudDataSynced);
    if (res.success) {
      showToast({ type: 'success', title: '¡Nube al día!', message: 'Todos los registros sincronizados con éxito' });
    } else if (res.reason === 'offline') {
      showToast({ type: 'offline', title: 'Sin conexión', message: 'Guardado localmente. Se subirá al volver a tener internet.' });
    } else {
      showToast({ type: 'warning', title: 'Aviso de sincronización', message: res.error || 'No se pudo conectar a la nube' });
    }
  };

  // Sync current user
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setActiveTab('dashboard');
    setIsAuthModalOpen(true);
  };

  // Water handlers
  const handleAddWater = (amountMl) => {
    const res = addWaterLog(amountMl);
    setWaterLogs(res.updated);
    lastWaterAlertTimeRef.current = Date.now();
    triggerCloudPush({ waterLogs: res.updated });
    
    // Quick encouraging feedback toast & milestone checks
    const totalToday = (res.updated || [])
      .filter(l => l.date === new Date().toISOString().split('T')[0])
      .reduce((sum, l) => sum + (l.amountMl || 0), 0);
    const targetMl = settings?.targetWaterMl || 3000;
    const prevTotal = totalToday - amountMl;

    if (prevTotal < targetMl && totalToday >= targetMl) {
      // 100% Milestone achieved!
      showToast({
        type: 'heart',
        title: '¡Meta de Hidratación Renal Completada!',
        message: `¡Fantástico! Has alcanzado los ${totalToday} ml diarios. Tus riñones están óptimamente protegidos.`,
        duration: 5500,
      });
      triggerSystemNotification(
        '¡Meta de Hidratación Alcanzada!',
        `Completaste los ${totalToday} ml de tu meta renal. ¡Tus riñones te lo agradecen!`,
        'water_goal_reached'
      );
      addNotificationToHistory({
        type: 'love',
        title: '¡Meta Diaria Completada!',
        message: `Has consumido ${totalToday} ml de agua hoy. ¡Gran disciplina de autocuidado!`
      });
    } else if (prevTotal < (targetMl / 2) && totalToday >= (targetMl / 2)) {
      // 50% Milestone
      showToast({
        type: 'water',
        title: '¡50% de tu Meta Diaria!',
        message: `Llevas ${totalToday} ml de agua fresca. Excelente filtración y ritmo renal.`,
        duration: 4000,
      });
      addNotificationToHistory({
        type: 'water',
        title: '50% de Meta Alcanzado',
        message: `Vas por la mitad de tu meta renal con ${totalToday} ml.`
      });
    } else {
      showToast({
        type: 'success',
        title: `+${amountMl} ml de agua fresca`,
        message: `Total de hoy: ${totalToday} ml de tu meta (${targetMl} ml)`,
        duration: 3200,
      });
    }

    return res;
  };

  const handleDeleteWater = (id) => {
    const updated = deleteWaterLog(id);
    setWaterLogs(updated);
    triggerCloudPush({ waterLogs: updated });
  };

  // Meal handlers
  const handleToggleMeal = (mealId, notes) => {
    const updated = toggleMealLog(mealId, notes);
    setMealLogs(updated);
    triggerCloudPush({ mealLogs: updated });
  };

  // Sleep handlers
  const handleSaveSleep = (log) => {
    const updated = saveSleepLog(log);
    setSleepLogs(updated);
    triggerCloudPush({ sleepLogs: updated });
  };

  // Urine handlers
  const handleAddUrine = (entry) => {
    const updated = addUrineLog(entry);
    setUrineLogs(updated);
    triggerCloudPush({ urineLogs: updated });
  };

  const handleDeleteUrine = (id) => {
    const updated = deleteUrineLog(id);
    setUrineLogs(updated);
    triggerCloudPush({ urineLogs: updated });
  };

  // Symptom handlers
  const handleAddSymptom = (entry) => {
    const updated = addSymptomLog(entry);
    setSymptomLogs(updated);
    triggerCloudPush({ symptomLogs: updated });
  };

  const handleDeleteSymptom = (id) => {
    const updated = deleteSymptomLog(id);
    setSymptomLogs(updated);
    triggerCloudPush({ symptomLogs: updated });
  };

  // Cloud config handlers
  const handleSaveCloudConfig = (newConfig) => {
    const saved = saveCloudConfig(newConfig);
    setCloudConfigState(saved);
  };

  // Settings handlers
  const handleSaveSettings = (newSettings) => {
    const saved = saveSettings(newSettings);
    setSettingsState(saved);
    triggerCloudPush({ settings: saved });
  };

  // Care notes
  const handleAddCareNote = (message, author, category, important) => {
    const updated = addCareNote(message, author, category, important);
    setCareNotes(updated);
    if (updated && updated.length > 0) {
      lastSeenNoteIdRef.current = updated[0].id;
      try {
        localStorage.setItem('breyhabitos_last_seen_note_id_v1', updated[0].id);
      } catch {}
      if (cloudConfig) {
        syncConfigToServiceWorker(cloudConfig, updated[0].id);
      }
    }
    triggerCloudPush({ careNotes: updated });
    showToast({
      type: 'heart',
      title: 'Mensaje publicado',
      message: 'Tu nota motivacional ya está visible para Brey',
      duration: 3000,
    });
  };

  const handleReactToCareNote = (noteId, emoji, label) => {
    const updated = reactToCareNote(noteId, emoji, label);
    setCareNotes(updated);
    triggerCloudPush({ careNotes: updated });
    showToast({
      type: 'heart',
      title: 'Reacción enviada',
      message: `Le enviaste un ${emoji} a Alejandro`,
      duration: 2500,
    });
  };

  const handleDeleteCareNote = (noteId) => {
    const updated = deleteCareNote(noteId);
    setCareNotes(updated);
    triggerCloudPush({ careNotes: updated });
  };

  // Detailed Meal handler (Photo + Text + Evaluation)
  const handleSaveDetailedMeal = ({ mealId, mealName, dishName, photoUrl, evaluation, notes }) => {
    const { updated } = addDetailedMealLog({ mealId, mealName, dishName, photoUrl, evaluation, notes });
    setMealLogs(updated);
    triggerCloudPush({ mealLogs: updated });
    showToast({
      type: 'success',
      title: 'Comida registrada',
      message: `${dishName || 'Plato'} guardado y evaluado`,
      duration: 3000,
    });
  };

  // Device Linked via QR or pairing token
  const handleDeviceLinked = (payload) => {
    if (payload.currentUser) {
      setCurrentUserState(payload.currentUser);
      setCurrentUser(payload.currentUser);
    }
    if (payload.cloudConfig) {
      setCloudConfigState(payload.cloudConfig);
    }
    const full = getAllAppData();
    handleCloudDataSynced(full);
    showToast({
      type: 'success',
      title: '¡Dispositivo Vinculado!',
      message: 'Tus cuentas y datos se sincronizaron con éxito',
      duration: 3500,
    });
  };

  // Food guide
  const handleAddFood = (item) => {
    const updated = addFoodItem(item);
    setFoodGuide(updated);
    triggerCloudPush({ foodGuide: updated });
  };

  const handleDeleteFood = (id) => {
    const updated = deleteFoodItem(id);
    setFoodGuide(updated);
    triggerCloudPush({ foodGuide: updated });
  };

  // URL Query Parameters Handling (PWA Shortcuts & Device Pairing)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const actionParam = params.get('action');
      const pairParam = params.get('pair');

      if (pairParam) {
        const res = applyDevicePairingToken(pairParam);
        if (res.success && res.payload) {
          importAllAppData(res.payload);
          handleDeviceLinked(res.payload);
          triggerHaptic([20, 60]);
          if (soundEnabled) playAlertSound('meal');
        }
      }

      if (actionParam === 'add_water_250') {
        handleAddWater(250);
        triggerHaptic([20, 40]);
        if (soundEnabled) playAlertSound('water');
      }

      if (params.get('tab') || actionParam || pairParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {
      // ignore
    }
  }, []);

  // Periodic Cloud Pull (Auto-sync every 12s for rapid cross-device message arrival)
  useEffect(() => {
    if (!cloudConfig?.enabled || cloudConfig?.autoSync === false) return;

    const pullRemote = async () => {
      try {
        const res = await pullFromCloud(cloudConfig);
        if (res.success && res.cloudData) {
          const local = getAllAppData();
          const merged = mergeAppData(local, res.cloudData);
          importAllAppData(merged);
          handleCloudDataSynced(merged);
        }
      } catch (err) {
        console.warn('Auto-sync error:', err);
      }
    };

    pullRemote();
    const interval = setInterval(pullRemote, 12000);
    return () => clearInterval(interval);
  }, [cloudConfig]);

  // Request notification permission once mounted and listen to Service Worker actions
  useEffect(() => {
    requestNotificationPermission();

    // Listen to lock-screen action "Tomé 250 ml" from background Service Worker
    const unregister = setupServiceWorkerListener((amount) => {
      handleAddWater(amount);
      triggerHaptic([20, 50]);
      if (soundEnabled) playAlertSound('water');
    });

    return unregister;
  }, [soundEnabled]);

  // Schedule all daily meal alarms in the background Service Worker
  useEffect(() => {
    if (!settings?.mealSchedule || !Array.isArray(settings.mealSchedule)) return;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    settings.mealSchedule.forEach((meal) => {
      if (!meal.time) return;
      const [hours, minutes] = meal.time.split(':').map(Number);
      const mealDate = new Date();
      mealDate.setHours(hours, minutes, 0, 0);

      const delayMs = mealDate.getTime() - Date.now();
      const isCompleted = (mealLogs || []).some(
        l => l.date === todayStr && l.mealId === meal.id && l.completed
      );

      if (delayMs > 0 && !isCompleted) {
        scheduleBackgroundAlarm({
          id: `meal_${meal.id}_${todayStr}`,
          delayMs,
          title: `Hora de ${meal.name} (${meal.time})`,
          body: `Es momento de comer a tus horas exactas. Protege tus riñones con una comida baja en sodio y rica en agua.`,
          tag: `renal_meal_${meal.id}`,
          tab: 'dashboard'
        });
      }
    });
  }, [settings?.mealSchedule, mealLogs]);

  // Periodic reminder simulation / check (Meals + Hydration intervals + Duolingo Escalation)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();
      const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const today = now.toISOString().split('T')[0];

      // Check quiet hours (No Molestar)
      const quietEnabled = settings?.quietHoursEnabled !== false;
      const quietStart = settings?.quietStart || '23:00';
      const quietEnd = settings?.quietEnd || '07:00';
      
      const isQuietTime = () => {
        if (!quietEnabled) return false;
        try {
          const [sH, sM] = quietStart.split(':').map(Number);
          const [eH, eM] = quietEnd.split(':').map(Number);
          const nowVal = currentHours * 60 + currentMins;
          const startVal = sH * 60 + sM;
          const endVal = eH * 60 + eM;
          if (startVal > endVal) {
            // Crosses midnight, e.g. 23:00 to 07:00
            return nowVal >= startVal || nowVal < endVal;
          } else {
            return nowVal >= startVal && nowVal < endVal;
          }
        } catch {
          return false;
        }
      };

      if (isQuietTime()) {
        return; // Mute periodic alarms during quiet hours
      }

      // 1. Check exact meal schedule time
      if (settings?.mealSchedule) {
        const matchMeal = settings.mealSchedule.find(m => m.time === currentTimeStr);
        if (matchMeal) {
          const alreadyTaken = mealLogs.some(l => l.date === today && l.mealId === matchMeal.id && l.completed);
          if (!alreadyTaken && (!activeAlert || activeAlert.mealId !== matchMeal.id)) {
            triggerHaptic([350, 120, 350, 120, 500]);
            if (soundEnabled) playAlertSound('loud_meal');
            const title = `Hora de ${matchMeal.name} (${matchMeal.time})`;
            const message = `Es momento de comer a tus horas exactas. Recuerda evitar la sal y beber agua.`;
            triggerSystemNotification(title, message, `renal_meal_${matchMeal.id}`);
            addNotificationToHistory({ type: 'meal', title, message });
            setActiveAlert({
              type: 'meal',
              mealId: matchMeal.id,
              title,
              message: `Tu horario de comida (${matchMeal.time}) ha llegado. Mantén tu regularidad digestiva para proteger tus riñones.`
            });
          }
        }
      }

      // 2. Check hydration reminders with Progressive Duolingo Escalation
      const intervalMins = settings?.reminderIntervalMins || 60;
      const intervalMs = intervalMins * 60 * 1000;
      const timeSinceLastAlert = Date.now() - lastWaterAlertTimeRef.current;
      const minsElapsed = Math.floor(timeSinceLastAlert / (60 * 1000));
      const duolingoActive = settings?.duolingoMode !== false;

      // Duolingo Escalation Level 3: Over 90 mins without drinking (Severe, invasive reminder)
      if (duolingoActive && minsElapsed >= 90 && !activeAlert) {
        lastWaterAlertTimeRef.current = Date.now();
        triggerHaptic([800, 150, 800, 150, 1000, 200, 1200]);
        if (soundEnabled) playAlertSound('loud_alarm');

        const title = '¡Tus riñones no pueden esperar!';
        const message = 'Han pasado más de 90 minutos sin agua. Cada minuto sin hidratación sobrecarga tus riñones con sales concentradas. ¡Bebe un vaso de agua AHORA!';

        triggerSystemNotification(title, message, 'duolingo_urgent_water');
        addNotificationToHistory({ type: 'duolingo', title, message });
        showToast({
          type: 'duolingo',
          title: '¡Alerta Crítica Duolingo!',
          message: 'Más de 90 min sin agua. Tus riñones necesitan diluir sales de inmediato.',
          duration: 6500
        });

        setActiveAlert({
          type: 'water',
          title,
          message
        });
      }
      // Duolingo Escalation Level 2: Between 75 and 89 mins without drinking
      else if (duolingoActive && minsElapsed >= 75 && timeSinceLastAlert >= intervalMs && !activeAlert) {
        lastWaterAlertTimeRef.current = Date.now();
        triggerHaptic([600, 150, 600, 150, 800]);
        if (soundEnabled) playAlertSound('loud_alarm');

        const title = '¡Alerta Renal! Retraso en tu hidratación';
        const message = 'Llevas 75 minutos sin registrar agua. La regularidad es vital para prevenir cólicos y cálculos.';

        triggerSystemNotification(title, message, 'duolingo_warning_water');
        addNotificationToHistory({ type: 'urgent', title, message });
        showToast({
          type: 'warning',
          title,
          message,
          duration: 5000
        });

        setActiveAlert({
          type: 'water',
          title,
          message
        });
      }
      // Standard Water Reminder: At normal interval
      else if (timeSinceLastAlert >= intervalMs && !activeAlert) {
        lastWaterAlertTimeRef.current = Date.now();
        triggerHaptic([500, 150, 500, 150, 500, 150, 800]);
        if (soundEnabled) playAlertSound('loud_alarm');
        
        const title = 'Recordatorio de Hidratación Renal';
        const message = `Han transcurrido ${intervalMins} minutos. Bebe un vaso de agua fresca (250 ml) para prevenir cristales.`;

        triggerSystemNotification(title, message, 'renal_water_alarm');
        addNotificationToHistory({ type: 'water', title, message });

        scheduleBackgroundAlarm({
          id: 'next_water_alarm',
          delayMs: intervalMs,
          title,
          body: message,
          tag: 'renal_water_alarm',
          tab: 'dashboard'
        });

        setActiveAlert({
          type: 'water',
          title,
          message
        });
      }

    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, [settings, mealLogs, soundEnabled, activeAlert]);

  // Trigger manual simulated alert test with loud sound and lock-screen buttons
  const handleTriggerSimulatedWaterAlert = (type = 'water') => {
    if (type === 'duolingo') {
      triggerHaptic([800, 150, 800, 150, 1000, 200, 1200]);
      if (soundEnabled) playAlertSound('loud_alarm');
      const title = '¡Tus riñones no pueden esperar!';
      const message = 'Alerta Duolingo: Llevas demasiado tiempo sin agua. Tus riñones necesitan diluir sales con urgencia. ¡Toma 250 ml ya!';
      triggerSystemNotification(title, message, 'duolingo_urgent_water');
      addNotificationToHistory({ type: 'duolingo', title, message });
      setActiveAlert({
        type: 'water',
        title,
        message
      });
      showToast({
        type: 'duolingo',
        title: '¡Alerta Estilo Duolingo Ejecutada!',
        message: 'Insistencia crítica, vibración prolongada y notificación invasiva activadas',
        duration: 5500,
      });
      return;
    }

    if (type === 'love') {
      triggerHaptic([400, 150, 400, 150, 600, 200, 800]);
      if (soundEnabled) playAlertSound('love');
      const title = 'Alejandro te ha enviado un mensaje de amor y ánimo';
      const message = '¡Hola mi amor! Recuerda tomar agua hoy. Estoy muy orgulloso de ti';
      triggerSystemNotification(title, message, 'care_note_test');
      addNotificationToHistory({ type: 'love', title, message });
      setActiveAlert({
        type: 'love',
        title,
        message: '¡Hola mi amor! Recuerda tomar agüita fresca. Estoy muy orgulloso de ti y de cómo te cuidas cada día.'
      });
      showToast({
        type: 'heart',
        title: 'Mensaje con Amor Recibido',
        message: 'Sonido romántico y notificación en pantalla de bloqueo enviada',
      });
      return;
    }

    if (type === 'meal') {
      triggerHaptic([350, 120, 350, 120, 500]);
      if (soundEnabled) playAlertSound('loud_meal');
      const title = 'Hora de Almuerzo (13:00)';
      const message = 'Es momento de comer a tus horas exactas. Recuerda hidratarte y evitar la sal.';
      triggerSystemNotification(title, message, 'renal_meal_test');
      addNotificationToHistory({ type: 'meal', title, message });
      setActiveAlert({
        type: 'meal',
        title: 'Alarma de Comida del Día',
        message: 'Tu horario de comida ha llegado. Mantener horarios fijos mejora el metabolismo y previene acidez y cólicos.'
      });
      showToast({
        type: 'info',
        title: 'Alarma de Comida Probada',
        message: 'Campana sonora y alerta enviadas con éxito',
      });
      return;
    }

    // Default: Loud water alert
    triggerHaptic([500, 150, 500, 150, 500, 150, 800]);
    if (soundEnabled) playAlertSound('loud_alarm');
    const title = 'Alerta de Hidratación Renal';
    const message = '¡Hora de tomar agua! Tus riñones lo necesitan para diluir sales y prevenir cálculos.';
    triggerSystemNotification(title, message, 'renal_water_alarm');
    addNotificationToHistory({ type: 'water', title, message });
    setActiveAlert({
      type: 'water',
      title: 'Recordatorio de Hidratación Renal',
      message: 'Han pasado 60 minutos desde tu último registro. Beber un vaso de agua fresca (250 ml) previene la concentración de oxalato y calcio.'
    });
    showToast({
      type: 'water',
      title: 'Alarma Sonora de Agua',
      message: 'Sonido penetrante y vibración máxima ejecutados con éxito',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FDF2F8] to-[#FCE7F3] dark:from-[#130A14] dark:via-[#1A0E1C] dark:to-[#110712] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-rosePastel-400 selection:text-white transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cloudConfig={cloudConfig}
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        onOpenDeviceSync={() => setIsDeviceSyncOpen(true)}
        syncStatus={syncStatus}
        onTriggerManualSync={handleTriggerManualSync}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenWhatsAppCheckIn={() => setIsWhatsAppCheckInOpen(true)}
        onOpenNotificationCenter={() => setIsNotifCenterOpen(true)}
        unreadNotificationsCount={notificationHistory.length}
        onOpenIosGuide={() => setIsIosGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-28 md:pb-8">
        
        {/* Top Care Note from Boyfriend */}
        <CareNotesBanner 
          careNotes={careNotes} 
          onReactToNote={handleReactToCareNote}
          currentUser={currentUser}
        />

        {/* Navigation Tabs (Mobile & Desktop) */}
        <div className="flex items-center justify-between border-b border-rosePastel-200/80 dark:border-slate-800 pb-2 gap-2">
          <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-1 scroll-smooth shrink min-w-0">
            
            {/* Mi Día */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab('dashboard');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 border border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              <Droplets className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-white' : 'text-rosePastel-500'}`} />
              <span>Mi Día</span>
            </button>

            {/* Dolor y Síntomas */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab('symptoms');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                activeTab === 'symptoms'
                  ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 border border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${activeTab === 'symptoms' ? 'text-white' : 'text-rose-500'}`} />
              <span>Molestias / Dolor</span>
            </button>

            {/* Evolución y Gráficas */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab('stats');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                activeTab === 'stats'
                  ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 border border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'stats' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span>Evolución</span>
            </button>

            {/* Evaluador de Comidas */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab('evaluator');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                activeTab === 'evaluator'
                  ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 border border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              <ChefHat className={`w-3.5 h-3.5 ${activeTab === 'evaluator' ? 'text-white' : 'text-rosePastel-600 dark:text-rosePastel-400'}`} />
              <span>¿Puedo comer esto?</span>
            </button>

            {/* Semáforo de Orina */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab('urine');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                activeTab === 'urine'
                  ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 border border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              <Eye className={`w-3.5 h-3.5 ${activeTab === 'urine' ? 'text-white' : 'text-amber-500'}`} />
              <span>Color de Orina</span>
            </button>

            {/* Guía Nutricional */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab('food');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                activeTab === 'food'
                  ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 border border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              <Apple className={`w-3.5 h-3.5 ${activeTab === 'food' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span>Guía de Alimentos</span>
            </button>

            {/* Descanso */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab('sleep');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                activeTab === 'sleep'
                  ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 border border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              <Moon className={`w-3.5 h-3.5 ${activeTab === 'sleep' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span>Sueño</span>
            </button>

            {/* Cuidador */}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic([10]);
                  setActiveTab('admin');
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                  activeTab === 'admin'
                    ? 'bg-rosePastel-500 text-white shadow-md shadow-rosePastel-500/25'
                    : 'bg-rosePastel-50 dark:bg-rosePastel-950/40 text-rosePastel-700 dark:text-rosePastel-300 hover:bg-rosePastel-100 border border-rosePastel-200 dark:border-rosePastel-800'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rosePastel-600 dark:text-rosePastel-400" />
                <span>Panel Cuidador</span>
              </button>
            )}
          </div>

          {/* Quick Alarm & Push Test Buttons (Zero Emojis, Pure Lucide Icons) */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              type="button"
              onClick={() => handleTriggerSimulatedWaterAlert('water')}
              title="Probar alarma de agua y vibración"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rosePastel-50 dark:hover:bg-slate-700 text-rosePastel-600 dark:text-rosePastel-300 border border-rosePastel-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-rosePastel-500 animate-bounce" />
              <span className="hidden sm:inline">Alarma</span>
            </button>
            <button
              type="button"
              onClick={() => handleTriggerSimulatedWaterAlert('meal')}
              title="Probar alarma de comida del día"
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-900/50 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
            </button>
            <button
              type="button"
              onClick={() => handleTriggerSimulatedWaterAlert('love')}
              title="Probar mensaje de Alejandro"
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rosePastel-50 dark:hover:bg-rosePastel-950/40 text-rosePastel-500 border border-rosePastel-200 dark:border-rosePastel-900/50 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rosePastel-500 fill-rosePastel-500/25" />
            </button>
            <button
              type="button"
              onClick={() => handleTriggerSimulatedWaterAlert('duolingo')}
              title="Probar alerta invasiva estilo Duolingo"
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 stroke-[2.4]" />
            </button>
          </div>
        </div>

        {/* Tab Views with animated transition */}
        <div key={activeTab} className="animate-fade-in-up">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Daily Clinical Glance Widget */}
              <TodayRenalGlance
                targetWaterMl={settings.targetWaterMl}
                waterLogs={waterLogs}
                urineLogs={urineLogs}
                symptomLogs={symptomLogs}
                onOpenSos={() => setIsSosOpen(true)}
                onOpenWhatsAppCheckIn={() => setIsWhatsAppCheckInOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* Streak Tracker & Reward from Alejandro */}
              <StreakTracker 
                streakData={streakData} 
                latestCareNote={careNotes[0]} 
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left column: Hydration with Night Water button */}
                <div className="lg:col-span-6 space-y-6">
                  <WaterTracker
                    targetWaterMl={settings.targetWaterMl}
                    waterLogs={waterLogs}
                    onAddWater={handleAddWater}
                    onDeleteWater={handleDeleteWater}
                    soundEnabled={soundEnabled}
                  />
                </div>

                {/* Right column: Meal schedule */}
                <div className="lg:col-span-6 space-y-6">
                  <MealSchedule
                    schedule={settings.mealSchedule}
                    mealLogs={mealLogs}
                    onToggleMeal={handleToggleMeal}
                    onOpenEvaluator={() => setActiveTab('evaluator')}
                    soundEnabled={soundEnabled}
                  />
                </div>
              </div>

            </div>
          )}

          {/* Dolor y Molestias Renales */}
          {activeTab === 'symptoms' && (
            <SymptomTracker
              symptomLogs={symptomLogs}
              onAddSymptomLog={handleAddSymptom}
              onDeleteSymptomLog={handleDeleteSymptom}
              onQuickAddWater={handleAddWater}
            />
          )}

          {/* Evolución y Gráficas Clínicas */}
          {activeTab === 'stats' && (
            <ProgressStats
              waterLogs={waterLogs}
              mealLogs={mealLogs}
              urineLogs={urineLogs}
              symptomLogs={symptomLogs}
              targetWaterMl={settings.targetWaterMl}
              streakData={streakData}
            />
          )}

          {/* Evaluador de comidas: Brey ingresa lo que come, toma fotos y la app le responde */}
          {activeTab === 'evaluator' && (
            <MealChecker 
              onSaveMeal={handleSaveDetailedMeal}
              mealLogs={mealLogs}
              mealSchedule={settings.mealSchedule}
              soundEnabled={soundEnabled}
            />
          )}

          {/* Semáforo de color de orina (Armstrong Scale) */}
          {activeTab === 'urine' && (
            <UrineColorChecker
              urineLogs={urineLogs}
              onAddUrineLog={handleAddUrine}
              onDeleteUrineLog={handleDeleteUrine}
              onQuickAddWater={handleAddWater}
            />
          )}

          {/* Guía nutricional renal */}
          {activeTab === 'food' && (
            <RenalFoodGuide
              foodGuide={foodGuide}
            />
          )}

          {/* Descanso y sueño */}
          {activeTab === 'sleep' && (
            <SleepTracker
              sleepSchedule={settings.sleepSchedule}
              sleepLogs={sleepLogs}
              onSaveSleepLog={handleSaveSleep}
            />
          )}

          {/* Panel cuidador (Alejandro) */}
          {activeTab === 'admin' && (
            <AdminPanel
              settings={settings}
              onSaveSettings={handleSaveSettings}
              waterLogs={waterLogs}
              mealLogs={mealLogs}
              sleepLogs={sleepLogs}
              careNotes={careNotes}
              onAddCareNote={handleAddCareNote}
              onDeleteCareNote={handleDeleteCareNote}
              foodGuide={foodGuide}
              onAddFoodItem={handleAddFood}
              onDeleteFoodItem={handleDeleteFood}
              currentUser={currentUser}
              symptomLogs={symptomLogs}
              cloudConfig={cloudConfig}
              onOpenCloudSync={() => setIsCloudSyncOpen(true)}
              onOpenDeviceSync={() => setIsDeviceSyncOpen(true)}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-rosePastel-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rosePastel-500"></span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              BreyHabitos • Salud Renal & Cuidado con Amor
            </span>
          </div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">100% PWA • Sincronización en la Nube • Seguimiento Clínico</span>
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickAddWater={handleAddWater}
        isAdmin={currentUser?.role === 'admin'}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenWhatsAppCheckIn={() => setIsWhatsAppCheckInOpen(true)}
        onOpenNotificationCenter={() => setIsNotifCenterOpen(true)}
      />

      {/* Emergency SOS Modal */}
      <SosEmergencyModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        caretakerPhone={settings?.caretakerPhone || ''}
      />

      {/* WhatsApp Quick Check-in Modal */}
      <WhatsAppCheckInModal
        isOpen={isWhatsAppCheckInOpen}
        onClose={() => setIsWhatsAppCheckInOpen(false)}
        targetWaterMl={settings.targetWaterMl}
        waterLogs={waterLogs}
        symptomLogs={symptomLogs}
        defaultPhone={settings?.caretakerPhone || ''}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenDeviceSync={() => setIsDeviceSyncOpen(true)}
      />

      {/* Device QR & Link Sync Modal */}
      <DeviceSyncModal
        isOpen={isDeviceSyncOpen}
        onClose={() => setIsDeviceSyncOpen(false)}
        onDeviceLinked={handleDeviceLinked}
      />

      {/* Cloud Sync Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        cloudConfig={cloudConfig}
        onSaveCloudConfig={handleSaveCloudConfig}
        onDataSynced={handleCloudDataSynced}
      />

      {/* Active Alert Modal */}
      <ReminderAlertModal
        alert={activeAlert}
        onClose={() => setActiveAlert(null)}
        onAcknowledge={(amount) => {
          if (amount) handleAddWater(amount);
          setActiveAlert(null);
        }}
      />

      {/* In-App Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notificationHistory}
        onClearAll={() => {
          setNotificationHistory([]);
          try {
            localStorage.removeItem('breyhabitos_notification_history_v1');
          } catch {}
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenIosGuide={() => {
          setIsNotifCenterOpen(false);
          setIsIosGuideOpen(true);
        }}
      />

      {/* iOS Lock Screen Notification Guide */}
      <IosNotificationGuideModal
        isOpen={isIosGuideOpen}
        onClose={() => setIsIosGuideOpen(false)}
      />

      {/* Floating PWA Install Prompt Banner */}
      <InstallPrompt />

    </div>
  );
}
