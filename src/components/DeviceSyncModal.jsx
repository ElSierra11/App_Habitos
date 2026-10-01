import React, { useState } from 'react';
import { 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  Share2, 
  X, 
  CheckCircle2, 
  Info,
  Laptop
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { generateDevicePairingToken, applyDevicePairingToken } from '../utils/cloudSync';
import { getStoredUsers, getCurrentUser, getCloudConfig, importAllAppData } from '../utils/storage';

export const DeviceSyncModal = ({
  isOpen,
  onClose,
  onDeviceLinked
}) => {
  const [copied, setCopied] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [pasteStatus, setPasteStatus] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('qr'); // 'qr' | 'paste'

  if (!isOpen) return null;

  const currentUsers = getStoredUsers();
  const currentUser = getCurrentUser();
  const cloudConfig = getCloudConfig();

  // Generate pairing token
  const pairingToken = generateDevicePairingToken({
    users: currentUsers,
    cloudConfig,
    currentUser,
  });

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const pairingUrl = pairingToken ? `${baseUrl}?pair=${encodeURIComponent(pairingToken)}` : '';
  const qrImageUrl = pairingUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=0284C7&data=${encodeURIComponent(pairingUrl)}`
    : '';

  const handleCopyLink = () => {
    triggerHaptic([15]);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pairingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    triggerHaptic([15]);
    const text = `Hola amor, este es tu enlace para sincronizar BreyHabitos en tu celular con tu cuenta y configuraciones:\n\n${pairingUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleApplyPastedToken = (e) => {
    e.preventDefault();
    if (!pasteInput.trim()) return;
    triggerHaptic([20, 40]);

    // Extract token if user pasted the full URL or just the token
    let rawToken = pasteInput.trim();
    if (rawToken.includes('?pair=')) {
      try {
        const urlObj = new URL(rawToken);
        rawToken = urlObj.searchParams.get('pair') || rawToken;
      } catch {
        const match = rawToken.match(/pair=([^&]+)/);
        if (match) rawToken = decodeURIComponent(match[1]);
      }
    }

    const res = applyDevicePairingToken(rawToken);
    if (res.success && res.payload) {
      triggerHaptic([20, 60]);
      importAllAppData(res.payload);
      setPasteStatus({
        type: 'success',
        message: '¡Vinculación completada con éxito! Las cuentas y datos ya están en este celular.'
      });
      if (onDeviceLinked) {
        onDeviceLinked(res.payload);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setPasteStatus({
        type: 'error',
        message: res.error || 'Código de vinculación inválido o corrupto.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div 
        className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900 backdrop-blur-xl border border-sky-100 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic([10]);
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-500/20 ring-4 ring-sky-100 dark:ring-slate-800">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vincular Celular con Computador
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Pasa tus cuentas, registros y notas entre dispositivos en 1 segundo
          </p>
        </div>

        {/* Sub-tabs: Generar QR (PC) vs Pegar Código (Móvil) */}
        <div className="flex bg-sky-50/80 dark:bg-slate-800 p-1 rounded-2xl border border-sky-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              setActiveSubTab('qr');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'qr'
                ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-white shadow-sm border border-sky-200/60 dark:border-slate-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Código QR / Enlace (Desde PC)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              setActiveSubTab('paste');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'paste'
                ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-white shadow-sm border border-sky-200/60 dark:border-slate-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pegar Enlace (En el Celular)</span>
          </button>
        </div>

        {activeSubTab === 'qr' && (
          <div className="space-y-4">
            {/* QR Card */}
            <div className="bg-sky-50/50 dark:bg-slate-850 p-4 rounded-2xl border border-sky-100 dark:border-slate-800 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-1.5">
                <Laptop className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Abre la cámara de tu celular y apunta a este código:</span>
              </span>

              {/* QR Image */}
              <div className="p-3 bg-white rounded-2xl shadow-md border border-sky-200/70 dark:border-slate-700 my-2">
                <img 
                  src={qrImageUrl} 
                  alt="Código QR de Vinculación BreyHabitos" 
                  className="w-48 h-48 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                Al escanearlo, tu celular abrirá la aplicación con tu cuenta registrada y tus datos listos.
              </p>
            </div>

            {/* Quick Actions (Copy & WhatsApp) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-sky-200 dark:border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
                <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>

            {/* Info note */}
            <div className="flex items-start space-x-2 p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200/60 dark:border-sky-900/40 text-[11px] text-slate-700 dark:text-slate-300">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong>¿Por qué pasaba el error en el celular?</strong> El navegador de tu celular tiene un almacenamiento local independiente. Con este enlace se transfieren tus cuentas creadas en el computador para que inicies sesión sin errores.
              </span>
            </div>
          </div>
        )}

        {activeSubTab === 'paste' && (
          <form onSubmit={handleApplyPastedToken} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Si te compartieron el enlace de vinculación desde el computador o por WhatsApp, pégalo aquí para importar tus cuentas:
            </p>

            <textarea
              rows="3"
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              placeholder="Pega aquí el enlace de vinculación que copiaste..."
              className="w-full px-3.5 py-2.5 bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />

            {pasteStatus && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
                pasteStatus.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 text-rose-800 dark:text-rose-300'
              }`}>
                {pasteStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <X className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{pasteStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!pasteInput.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>Vincular y Cargar Mis Cuentas</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
