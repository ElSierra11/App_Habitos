import React, { useState } from 'react';
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
  QrCode,
  Settings,
  X,
  MessageSquareHeart,
  Flame
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
  onToggleTheme,
  onOpenWhatsAppCheckIn,
  onOpenNotificationCenter,
  unreadNotificationsCount = 0,
  onOpenIosGuide
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [notifState, setNotifState] = useState(getNotificationPermissionState);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  const handleSoundClick = () => {
    triggerHaptic([12]);
    onToggleSound();
  };

  const handleNotificationClick = async () => {
    triggerHaptic([15, 30]);
    if (notifState !== 'granted') {
      const granted = await requestNotificationPermission();
      setNotifState(granted ? 'granted' : 'denied');
      if (granted) {
        triggerSystemNotification('Notificaciones Activas en BreyHabitos', 'Recibirás recordatorios a tiempo para tomar agua y comer.');
      }
    }
    if (onOpenNotificationCenter) {
      onOpenNotificationCenter();
    }
  };

  const handleLogoutClick = () => {
    triggerHaptic([15]);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-rosePastel-200/80 dark:border-rosePastel-900/50 shadow-xs transition-colors">
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
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl shadow-sm shadow-rosePastel-500/20 ring-2 ring-rosePastel-200/80 dark:ring-rosePastel-500/30 transition-transform group-hover:scale-105 active:scale-95 object-contain shrink-0"
          />
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-rosePastel-600 dark:group-hover:text-rosePastel-400 transition-colors whitespace-nowrap">
                BreyHabitos
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rosePastel-50 dark:bg-rosePastel-950 text-rosePastel-600 dark:text-rosePastel-300 border border-rosePastel-200/80 dark:border-rosePastel-800 whitespace-nowrap">
                Salud Renal
              </span>
            </div>
            <p className="text-xs text-rosePastel-600/80 dark:text-rosePastel-300/80 font-medium hidden md:block">
              Hidratación y Cuidado Clínico
            </p>
          </div>
        </div>

        {/* Desktop Buttons / Mobile Compact Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          
          {/* Quick Check-in Button on mobile & desktop */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic([12]);
              if (onOpenWhatsAppCheckIn) onOpenWhatsAppCheckIn();
            }}
            title="Enviar mensaje rápido de cuidado a Alejandro por WhatsApp"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-rosePastel-50 dark:bg-rosePastel-950/60 hover:bg-rosePastel-100 dark:hover:bg-rosePastel-900/60 text-rosePastel-600 dark:text-rosePastel-300 border border-rosePastel-200/80 dark:border-rosePastel-900 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center space-x-1.5"
          >
            <MessageSquareHeart className="w-4 h-4 stroke-[2.2]" />
            <span className="text-xs font-bold hidden lg:inline">Check-in</span>
          </button>

          {/* Desktop Only Actions */}
          <div className="hidden sm:flex items-center space-x-1.5">
            {/* Theme toggle button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([12]);
                if (onToggleTheme) onToggleTheme();
              }}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rosePastel-50 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-amber-400 border border-rosePastel-100 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-rosePastel-600" />
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
              title="Sincronización en la nube"
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 flex items-center relative ${
                syncStatus?.state === 'syncing'
                  ? 'bg-rosePastel-50 dark:bg-rosePastel-950/60 text-rosePastel-600 border-rosePastel-300'
                  : syncStatus?.state === 'synced' || cloudConfig?.enabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border-rosePastel-100 dark:border-slate-700'
              }`}
            >
              {syncStatus?.state === 'syncing' ? (
                <Loader2 className="w-4 h-4 text-rosePastel-600 animate-spin" />
              ) : cloudConfig?.enabled ? (
                <>
                  <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-1"></span>
                </>
              ) : (
                <CloudOff className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* QR Sync button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                if (onOpenDeviceSync) onOpenDeviceSync();
              }}
              title="Vincular con Código QR"
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rosePastel-50 dark:hover:bg-slate-700 active:scale-95 text-slate-600 dark:text-slate-300 border border-rosePastel-100 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Sound toggle button */}
            <button
              type="button"
              onClick={handleSoundClick}
              title={soundEnabled ? 'Sonido de alertas activado' : 'Sonido desactivado'}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rosePastel-50 dark:hover:bg-slate-700 active:scale-95 text-slate-600 dark:text-slate-300 border border-rosePastel-100 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-rosePastel-600 dark:text-rosePastel-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Notification button */}
            <button
              type="button"
              onClick={handleNotificationClick}
              title={notifState === 'granted' ? 'Centro de Notificaciones & Alertas' : 'Activar recordatorios'}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 relative ${
                notifState === 'granted'
                  ? 'bg-rosePastel-50 dark:bg-slate-800 text-rosePastel-600 dark:text-rosePastel-400 border-rosePastel-200 dark:border-slate-700'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 border-amber-300'
              }`}
            >
              {notifState === 'granted' ? (
                <BellRing className="w-4 h-4 text-rosePastel-600 dark:text-rosePastel-400" />
              ) : (
                <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rosePastel-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Bell Button (< sm) */}
          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label="Centro de Notificaciones"
            className="sm:hidden p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-rosePastel-200 dark:border-slate-700 text-rosePastel-600 dark:text-rosePastel-400 active:scale-95 cursor-pointer shadow-xs relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rosePastel-500 text-white text-[8px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Mobile Settings Toggle (Gear button for < sm) */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setIsMobileSettingsOpen(!isMobileSettingsOpen);
              }}
              aria-label="Ajustes y sincronización"
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-rosePastel-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 active:scale-95 cursor-pointer shadow-xs"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Settings Dropdown Popover */}
            {isMobileSettingsOpen && (
              <div 
                className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-rosePastel-200 dark:border-rosePastel-900 rounded-2xl shadow-xl p-3 z-50 animate-scale-in space-y-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-rosePastel-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Ajustes de la App
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileSettingsOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Theme toggle row */}
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleTheme) onToggleTheme();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rosePastel-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center space-x-2">
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-rosePastel-600" />}
                    <span>Modo {theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Cambiar</span>
                </button>

                {/* Cloud sync row */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSettingsOpen(false);
                    if (onOpenCloudSync) onOpenCloudSync();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rosePastel-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-emerald-600" />
                    <span>Nube y Respaldo</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Ver</span>
                </button>

                {/* QR Sync row */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSettingsOpen(false);
                    if (onOpenDeviceSync) onOpenDeviceSync();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rosePastel-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-sky-600" />
                    <span>Vincular por QR</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Abrir</span>
                </button>

                {/* Sound row */}
                <button
                  type="button"
                  onClick={handleSoundClick}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rosePastel-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center space-x-2">
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-rosePastel-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    <span>Sonido</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{soundEnabled ? 'Sí' : 'No'}</span>
                </button>

                {/* Alertas & Modo Duolingo */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSettingsOpen(false);
                    if (onOpenNotificationCenter) onOpenNotificationCenter();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rosePastel-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-rose-500 stroke-[2.2]" />
                    <span>Alertas & Duolingo</span>
                  </span>
                  <span className="text-[10px] font-bold text-rosePastel-600 dark:text-rosePastel-400">Abrir</span>
                </button>

                {/* Notifications row */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSettingsOpen(false);
                    handleNotificationClick();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rosePastel-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center space-x-2">
                    <BellRing className="w-4 h-4 text-rosePastel-600" />
                    <span>Permiso Alertas</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {notifState === 'granted' ? 'Activas' : 'Permitir'}
                  </span>
                </button>

                {/* iPhone / iOS Guide */}
                {onOpenIosGuide && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileSettingsOpen(false);
                      onOpenIosGuide();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rosePastel-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-sky-600" />
                      <span>Guía iPhone / iOS</span>
                    </span>
                    <span className="text-[10px] font-bold text-sky-600">Ver</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User Role / Auth */}
          {currentUser ? (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div 
                className="flex items-center space-x-1.5 bg-rosePastel-50/80 dark:bg-slate-800 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-rosePastel-200/80 dark:border-slate-700 shadow-xs"
                title={`${currentUser.name} (${isAdmin ? 'Cuidador / Admin' : 'Paciente'})`}
              >
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-rosePastel-600 dark:text-rosePastel-400" />
                ) : (
                  <HeartHandshake className="w-4 h-4 text-rosePastel-500 dark:text-rosePastel-400" />
                )}
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-rosePastel-600 dark:text-rosePastel-400 uppercase tracking-wider font-semibold">
                    {isAdmin ? 'Cuidador' : 'Paciente'}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic([12]);
                    setActiveTab(activeTab === 'admin' ? 'dashboard' : 'admin');
                  }}
                  title={activeTab === 'admin' ? 'Ver vista paciente' : 'Abrir panel del cuidador'}
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-xs ${
                    activeTab === 'admin'
                      ? 'bg-rosePastel-500 text-white shadow-rosePastel-500/25'
                      : 'bg-rosePastel-50 dark:bg-rosePastel-950/40 text-rosePastel-700 dark:text-rosePastel-300 hover:bg-rosePastel-100 border border-rosePastel-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {activeTab === 'admin' ? 'Vista Paciente' : 'Panel Cuidador'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleLogoutClick}
                title="Cerrar sesión"
                className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 text-slate-500 dark:text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
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
              className="flex items-center space-x-1.5 bg-gradient-to-r from-rosePastel-500 to-blush-500 hover:from-rosePastel-600 hover:to-blush-600 text-white font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs transition-all shadow-md shadow-rosePastel-500/20 active:scale-95 cursor-pointer"
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
