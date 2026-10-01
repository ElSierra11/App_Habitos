import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  AlertTriangle, 
  HeartPulse, 
  Thermometer, 
  X, 
  DropletOff, 
  Stethoscope, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const SosEmergencyModal = ({ isOpen, onClose, caretakerPhone = '' }) => {
  if (!isOpen) return null;

  const handleCallCaretaker = () => {
    triggerHaptic([30, 60]);
    if (caretakerPhone) {
      window.location.href = `tel:${caretakerPhone}`;
    } else {
      window.location.href = 'tel:123'; // Default emergency
    }
  };

  const handleCallEmergency123 = () => {
    triggerHaptic([40, 80]);
    window.location.href = 'tel:123';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl shadow-2xl shadow-rose-500/20 overflow-hidden animate-scale-in max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-rosePastel-500 to-blush-500 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 id="sos-modal-title" className="text-base sm:text-lg font-extrabold tracking-tight">
                Auxilio Clínico: Cólico Nefrítico
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Pautas de emergencia y contacto inmediato
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
            }}
            aria-label="Cerrar ventana de emergencia"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar text-slate-800 dark:text-slate-100">
          
          {/* Quick Call Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCallCaretaker}
              className="flex items-center justify-center space-x-2.5 p-3.5 rounded-2xl bg-rosePastel-500 hover:bg-rosePastel-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-rosePastel-500/25 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 stroke-[2.2]" />
              <span>Llamar a Alejandro</span>
            </button>

            <button
              type="button"
              onClick={handleCallEmergency123}
              className="flex items-center justify-center space-x-2.5 p-3.5 rounded-2xl bg-slate-900 dark:bg-rose-950/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 dark:border-rose-900 active:scale-95 transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-rose-400 stroke-[2.2]" />
              <span>Línea Médica 123</span>
            </button>
          </div>

          {/* Criterios de Urgencia Inmediata */}
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 p-4 space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-extrabold text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 stroke-[2.4]" />
              <span>Señales de Alarma para Acudir a Urgencias</span>
            </div>

            <ul className="space-y-2 text-xs text-rose-950 dark:text-rose-200">
              <li className="flex items-start space-x-2">
                <Thermometer className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Fiebre mayor a 38 °C o escalofríos:</strong> Indica posible infección urinaria alta o cálculo obstructivo sobreinfectado.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <HeartPulse className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dolor insoportable (escala 8 a 10 de 10):</strong> Que no alivia con reposo ni cambio de postura.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <DropletOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Imposibilidad total de orinar (anuria):</strong> Sensación de vejiga llena con bloqueo en el flujo.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Vómitos continuos o deshidratación:</strong> Imposibilidad de tolerar líquidos por vía oral.
                </span>
              </li>
            </ul>
          </div>

          {/* Primeros Auxilios en Casa */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/60 p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 stroke-[2.2]" />
              <span>Recomendaciones mientras buscas asistencia</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              • <strong>Calor local:</strong> Aplica una compresa tibia o bolsa de agua caliente en la zona lumbar baja para relajar el espasmo ureteral.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              • <strong>Líquidos controlados:</strong> Durante la fase de dolor agudo, no bebas grandes volúmenes de golpe (más de 500 ml seguidos), ya que puede elevar la presión renal. Bebe a pequeños sorbos.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              • <strong>Posición de alivio:</strong> Recostarte de lado con las rodillas recogidas (posición fetal) ayuda a descompresionar la espalda.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Entendido, cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
