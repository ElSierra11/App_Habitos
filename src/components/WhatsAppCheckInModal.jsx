import React, { useState } from 'react';
import { 
  Heart, 
  Droplets, 
  Activity, 
  Send, 
  X, 
  MessageSquareHeart,
  Phone
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const WhatsAppCheckInModal = ({
  isOpen,
  onClose,
  targetWaterMl = 3000,
  waterLogs = [],
  symptomLogs = [],
  defaultPhone = ''
}) => {
  const [selectedType, setSelectedType] = useState('positive');
  const [customNote, setCustomNote] = useState('');
  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem('breyhabitos_caretaker_phone') || defaultPhone || '';
    } catch {
      return defaultPhone || '';
    }
  });

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterLogs
    .filter(l => l.date === today)
    .reduce((sum, item) => sum + (Number(item.amountMl) || 0), 0);
  
  const todaySymptoms = symptomLogs.filter(l => l.date === today);
  const latestSymptom = todaySymptoms.length > 0 ? todaySymptoms[0] : null;

  const generateMessage = () => {
    const waterText = `${todayWater.toLocaleString()} ml de ${targetWaterMl.toLocaleString()} ml`;
    
    if (selectedType === 'positive') {
      return `Hola amor, te comparto mi reporte de cuidado de hoy: Voy en ${waterText} de agua. Me siento bien, con energía y sin dolor en mis riñones.${customNote ? ` Nota: ${customNote}` : ''} Te quiero mucho.`;
    }
    
    if (selectedType === 'discomfort') {
      const painText = latestSymptom && latestSymptom.painLevel > 0 
        ? `Nivel de dolor ${latestSymptom.painLevel}/10 (${latestSymptom.location || 'espalda baja'})` 
        : 'Molestia leve en la zona lumbar';
      return `Hola amor, te aviso que tengo algo de molestia en este momento: ${painText}. Llevo ${waterText} de agua y estoy descansando con paño tibio.${customNote ? ` Nota: ${customNote}` : ''} Te voy avisando cualquier cambio.`;
    }

    // Midday check-in
    return `Hola amor, paso a dejarte mi check-in diario: Llevo acumulados ${waterText} de hidratación hoy y sigo juiciosa cuidando mis riñones.${customNote ? ` Nota: ${customNote}` : ''} Te amo mucho.`;
  };

  const handleSendWhatsApp = () => {
    triggerHaptic([20, 40]);
    try {
      if (phone) {
        localStorage.setItem('breyhabitos_caretaker_phone', phone);
      }
    } catch {}

    const text = encodeURIComponent(generateMessage());
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-modal-title"
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-rosePastel-200 dark:border-rosePastel-900/60 rounded-3xl shadow-2xl shadow-rosePastel-500/15 overflow-hidden animate-scale-in max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rosePastel-500 to-blush-500 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <MessageSquareHeart className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <h3 id="checkin-modal-title" className="text-base font-extrabold tracking-tight">
                Check-in de Cuidado y Amor
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Envía tu estado diario a Alejandro con 1 toque
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
            }}
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto no-scrollbar text-slate-800 dark:text-slate-100">
          
          {/* Phone input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-rosePastel-500" />
              <span>Número de WhatsApp de Alejandro (opcional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: +57 300 123 4567"
              className="w-full px-3 py-2 text-xs rounded-xl border border-rosePastel-200 dark:border-slate-700 bg-rosePastel-50/40 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rosePastel-400"
            />
          </div>

          {/* Quick Option Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Selecciona el estado que deseas enviar:
            </label>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic([10]);
                  setSelectedType('positive');
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                  selectedType === 'positive'
                    ? 'border-rosePastel-400 bg-rosePastel-50/70 dark:bg-rosePastel-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${selectedType === 'positive' ? 'bg-rosePastel-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Heart className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Día positivo / Hidratación al día
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    "Voy muy bien con mi meta de agua y me siento sin dolor."
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic([10]);
                  setSelectedType('discomfort');
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                  selectedType === 'discomfort'
                    ? 'border-rosePastel-400 bg-rosePastel-50/70 dark:bg-rosePastel-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${selectedType === 'discomfort' ? 'bg-rosePastel-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Activity className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Aviso de molestia o dolor
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    "Tengo una molestia en la espalda baja, ya tomé agua y estoy descansando."
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic([10]);
                  setSelectedType('midday');
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                  selectedType === 'midday'
                    ? 'border-rosePastel-400 bg-rosePastel-50/70 dark:bg-rosePastel-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${selectedType === 'midday' ? 'bg-rosePastel-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Droplets className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Avance de jornada
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    "Llevo acumulados mis vasos de agua y sigo cuidándome."
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Mensaje adicional personalizado (opcional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Ej: Ya almorcé una sopita baja en sal..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-rosePastel-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rosePastel-400"
            />
          </div>

          {/* Preview Box */}
          <div className="p-3 rounded-2xl bg-rosePastel-50/60 dark:bg-slate-850 border border-rosePastel-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-rosePastel-700 dark:text-rosePastel-300 mb-1">
              Vista previa del mensaje a enviar:
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "{generateMessage()}"
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.4]" />
            <span>Enviar por WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
