import React from 'react';
import { Share, PlusSquare, Bell, X, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const IosNotificationGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-900 border border-rosePastel-200 dark:border-rosePastel-900/60 rounded-3xl p-5 sm:p-6 shadow-2xl animate-scale-in text-slate-800 dark:text-slate-100 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-rosePastel-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-rosePastel-100 dark:bg-rosePastel-950 text-rosePastel-600 dark:text-rosePastel-400 flex items-center justify-center">
              <Bell className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Alertas en Pantalla Bloqueada
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Configuración para iPhone / iPad
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Apple requiere agregar BreyHabitos a la pantalla de inicio para que las alarmas suenen con el celular bloqueado:
        </p>

        <div className="space-y-3 bg-rosePastel-50/60 dark:bg-slate-850 p-4 rounded-2xl border border-rosePastel-100 dark:border-slate-800 text-xs">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-rosePastel-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                <span>Toca el botón Compartir</span>
                <Share className="w-3.5 h-3.5 text-sky-600 inline ml-1" />
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ubicado en la barra inferior de Safari en tu iPhone.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-rosePastel-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                <span>Selecciona "Agregar a Inicio"</span>
                <PlusSquare className="w-3.5 h-3.5 text-rosePastel-600 inline ml-1" />
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Desliza hacia abajo en el menú de Safari y presiona Agregar.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                ¡Listo! Abre desde el icono
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ábrela desde tu pantalla de inicio y presiona "Permitir Notificaciones".
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic([10]);
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rosePastel-500 to-blush-500 hover:from-rosePastel-600 hover:to-blush-600 text-white text-xs font-bold shadow-md shadow-rosePastel-500/20 active:scale-95 transition-all cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
