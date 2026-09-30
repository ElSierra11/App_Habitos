import React, { useState, useEffect } from 'react';
import { Download, X, Share, Sparkles, Smartphone } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      return;
    }

    // Check if user dismissed it recently (snoozed for 24 hours)
    const dismissedUntil = localStorage.getItem('breyhabitos_install_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    setIsIOS(isAppleDevice);

    // Listen for beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a gentle 3-second delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS Safari and not standalone, show prompt after 4 seconds
    if (isAppleDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    triggerHaptic([20, 40]);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    triggerHaptic([10]);
    setShowPrompt(false);
    // Snooze for 24 hours
    localStorage.setItem('breyhabitos_install_dismissed_until', (Date.now() + 24 * 60 * 60 * 1000).toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-fade-in-up">
      <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-sky-200/90 p-4 shadow-xl shadow-sky-600/15">
        
        {/* Subtle decorative water gradient highlight */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start space-x-3.5">
          {/* App Icon */}
          <img 
            src="/pwa-192x192.png" 
            alt="BreyHabitos" 
            className="w-12 h-12 rounded-2xl shadow-md shadow-sky-500/20 shrink-0 ring-4 ring-sky-100 object-contain"
          />

          {/* Details */}
          <div className="flex-1 pr-6">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">Instala BreyHabitos</h4>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {showIOSGuide
                ? 'Toca el botón Compartir y luego "Agregar a la pantalla de inicio".'
                : 'Accede en 1 toque desde tu móvil, con alertas de agua y comidas sin gastar datos.'}
            </p>

            {/* Actions */}
            <div className="mt-3 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 active:scale-95 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
              >
                {isIOS ? <Share className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isIOS ? 'Ver cómo agregar' : 'Instalar en mi pantalla'}</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-600 text-xs font-medium transition-all cursor-pointer"
              >
                Luego
              </button>
            </div>
          </div>

          {/* Dismiss cross */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Cerrar aviso de instalación"
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Extra instruction bubble for iOS Safari users */}
        {showIOSGuide && (
          <div className="mt-3 pt-3 border-t border-sky-100 flex items-center space-x-2 text-[11px] text-slate-600 bg-sky-50/80 -mx-4 -mb-4 p-3 rounded-b-2xl">
            <Share className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Presiona el icono <strong>Compartir</strong> en la barra inferior de Safari y elige <strong>"Agregar a pantalla de inicio"</strong>.
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
