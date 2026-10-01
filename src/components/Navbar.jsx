import React from 'react';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal, 
  HeartHandshake, 
  Bell, 
  BellRing, 
  Cloud, 
  CloudOff, 
  Sun, 
  Moon, 
  Loader2,
  QrCode
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { requestNotificationPermission, triggerSystemNotification, getNotificationPermissionState } from '../utils/notifications';

export const Navbar = ({ 
  currentUser, 
  onLogout, 
  onOpenAuth, 
  soundEnabled, 
  onToggleSound,
  activeTab,
  setActiveTab,
  cloudConfig,
  onOpenCloudSync,
  onOpenDeviceSync,
  syncStatus,
  onTriggerManualSync,
  theme = 'light',
  onToggleTheme
}) => {
  const isAdmin = currentUser?.role === 'admin';

  const [notifState, setNotifState] = React.useState(getNotificationPermissionState);

  const handleSoundClick = () => {
    triggerHaptic([12]);
    onToggleSound();
  };

  const handleNotificationClick = async () => {
    triggerHaptic([15, 30]);
    const granted = await requestNotificationPermission();
    setNotifState(granted ? 'granted' : 'denied');
    if (granted) {
      triggerSystemNotification('¡Notificaciones Activas en BreyHabitos!', 'Recibirás recordatorios a tiempo para tomar agua y comer.');
    }
  };

  const handleLogoutClick = () => {
    triggerHaptic([15]);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/90 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 shadow-sm shadow-sky-500/5 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Brand */}
        <div 
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group select-none shrink-0" 
          onClick={() => {
            triggerHaptic([10]);
            setActiveTab('dashboard');
          }}
        >
          <img 
            src="/logo.png" 
            alt="BreyHabitos" 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl shadow-md shadow-sky-500/20 ring-2 ring-sky-200/80 dark:ring-sky-500/30 transition-transform group-hover:scale-105 active:scale-95 object-contain shrink-0"
          />
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors whitespace-nowrap">
                BreyHabitos
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 whitespace-nowrap">
                Salud Renal
              </span>
            </div>
            <p className="text-xs text-sky-700/80 dark:text-sky-300/80 font-medium hidden md:block">Hidratación y Cuidado Clínico</p>
          </div>
        </div>

        {/* Actions / Role status */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          
          {/* Theme toggle button (Light / Dark) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic([12]);
              if (onToggleTheme) onToggleTheme();
            }}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro / nocturno'}
            className="p-1.5 sm:p-2 rounded-xl bg-sky-50/80 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-amber-400 border border-sky-200/70 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Cloud Sync button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              if (cloudConfig?.enabled && onTriggerManualSync) {
                onTriggerManualSync();
              } else if (onOpenCloudSync) {
                onOpenCloudSync();
              }
            }}
            title={
              syncStatus?.state === 'syncing'
                ? 'Sincronizando con la nube...'
                : syncStatus?.state === 'synced'
                ? `Nube al día (${syncStatus?.lastSyncTime ? new Date(syncStatus.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'reciente'}) - Toca para ver detalles`
                : syncStatus?.state === 'offline'
                ? 'Sin conexión: tus datos están guardados de forma segura en este dispositivo'
                : cloudConfig?.enabled
                ? 'Nube activa - Toca para gestionar'
                : 'Sincronización en la nube (conecta tus dispositivos)'
            }
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 flex items-center relative ${
              syncStatus?.state === 'syncing'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                : syncStatus?.state === 'synced' || cloudConfig?.enabled
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : syncStatus?.state === 'offline'
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-sky-50/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-sky-200/70 dark:border-slate-700 hover:bg-sky-100 dark:hover:bg-slate-700'
            }`}
          >
            {syncStatus?.state === 'syncing' ? (
              <Loader2 className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-spin" />
            ) : cloudConfig?.enabled ? (
              <>
                <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-1 animate-ping"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-1"></span>
              </>
            ) : (
              <CloudOff className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* QR Device Sync button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              if (onOpenDeviceSync) onOpenDeviceSync();
            }}
            title="Vincular Celular con PC mediante Código QR o Enlace"
            className="p-1.5 sm:p-2 rounded-xl bg-sky-50/80 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 active:scale-95 text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </button>

          {/* Audio toggle button */}
          <button
            type="button"
            onClick={handleSoundClick}
            title={soundEnabled ? 'Sonido de alertas activado' : 'Sonido desactivado'}
            className="p-1.5 sm:p-2 rounded-xl bg-sky-50/80 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 active:scale-95 text-sky-700 dark:text-slate-300 border border-sky-200/70 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Notification permission button */}
          <button
            type="button"
            onClick={handleNotificationClick}
            title={notifState === 'granted' ? 'Notificaciones activadas en tu teléfono (toca para probar)' : 'Toca para activar recordatorios en tu celular'}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 ${
              notifState === 'granted'
                ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-slate-700 hover:bg-sky-100 dark:hover:bg-slate-700'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 animate-pulse'
            }`}
          >
            {notifState === 'granted' ? (
              <BellRing className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            ) : (
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Role pill */}
              <div 
                className="flex items-center space-x-1.5 bg-sky-50/80 dark:bg-slate-800 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-sky-200/70 dark:border-slate-700 shadow-sm"
                title={`${currentUser.name} (${isAdmin ? 'Cuidador / Admin' : 'Paciente'})`}
              >
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <HeartHandshake className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                )}
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-sky-700 dark:text-sky-400 uppercase tracking-wider font-semibold">
                    {isAdmin ? 'Cuidador' : 'Paciente'}
                  </p>
                </div>
              </div>

              {/* View switch button for Admin */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic([12]);
                    setActiveTab(activeTab === 'admin' ? 'dashboard' : 'admin');
                  }}
                  title={activeTab === 'admin' ? 'Ver vista paciente' : 'Abrir panel del cuidador'}
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-white shadow-amber-500/25'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {activeTab === 'admin' ? 'Vista Paciente' : 'Panel Cuidador'}
                  </span>
                </button>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogoutClick}
                title="Cerrar sesión"
                className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                onOpenAuth();
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Acceder</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
