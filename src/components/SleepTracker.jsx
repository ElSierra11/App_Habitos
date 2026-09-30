import React, { useState } from 'react';
import { 
  Moon, 
  Bed, 
  Clock, 
  Droplets, 
  CheckCircle2, 
  Sparkles, 
  Activity,
  Info,
  Calendar
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const SleepTracker = ({ 
  sleepSchedule, 
  sleepLogs = [], 
  onSaveSleepLog 
}) => {
  const [hours, setHours] = useState('8');
  const [quality, setQuality] = useState('Bueno');
  const [notes, setNotes] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const lastLog = sleepLogs[0];

  const handleSave = (e) => {
    e.preventDefault();
    triggerHaptic([20, 30]);
    onSaveSleepLog({
      date: today,
      hours: Number(hours),
      quality,
      notes,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowLogForm(false);
    }, 1200);
  };

  return (
    <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-sky-500/5 relative overflow-hidden transition-all">
      
      {/* Decorative ambient glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-indigo-100/40 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-sky-500/25 ring-4 ring-sky-100/80 dark:ring-slate-800">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Higiene de Sueño y Recuperación
            </h2>
            <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">El descanso nocturno repara el tejido renal y equilibra hormonas</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic([10]);
            setShowLogForm(!showLogForm);
          }}
          className="px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 active:scale-95 border border-sky-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          {showLogForm ? 'Cerrar registro' : 'Registrar descanso'}
        </button>
      </div>

      {/* Recommended Schedule Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 relative z-10">
        <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 text-center shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold block mb-1">
            Hora de Desconexión
          </span>
          <span className="text-xl font-mono font-extrabold text-slate-800 dark:text-white">
            {sleepSchedule?.windDownTime || '22:00'}
          </span>
          <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium block mt-1">Apagar pantallas</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-center shadow-sm">
          <span className="text-[10px] text-indigo-700 dark:text-indigo-300 uppercase tracking-wider font-bold block mb-1">
            Hora de Acostarse
          </span>
          <span className="text-xl font-mono font-extrabold text-indigo-900 dark:text-indigo-200">
            {sleepSchedule?.bedTime || '22:30'}
          </span>
          <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium block mt-1">Meta: 8 horas</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 text-center shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold block mb-1">
            Hora de Despertar
          </span>
          <span className="text-xl font-mono font-extrabold text-slate-800 dark:text-white">
            {sleepSchedule?.wakeTime || '06:30'}
          </span>
          <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium block mt-1">Ritmo circadiano</span>
        </div>
      </div>

      {/* Critical Nocturnal Hydration Tip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/70 dark:from-slate-850 dark:to-indigo-950/40 border border-sky-200/80 dark:border-slate-700 mb-6 flex items-start space-x-3 relative z-10 shadow-sm">
        <Droplets className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-sky-900 dark:text-sky-300 font-bold">Regla de oro para litiasis nocturna:</strong> Durante las 7 u 8 horas de sueño la orina se concentra al máximo por la falta de ingesta hídrica. Beber <span className="text-sky-950 dark:text-sky-200 font-bold bg-white/80 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-sky-200 dark:border-slate-700">1 vaso de agua (200-250 ml)</span> 30 minutos antes de dormir previene que los cristales se agrupen en la madrugada.
        </div>
      </div>

      {/* Sleep Log Form (Expandable) */}
      {showLogForm && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-sky-50/70 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 mb-6 space-y-4 relative z-10 animate-fade-in-up">
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Registrar cómo descansaste anoche
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Horas dormidas</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="14"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Calidad del sueño</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
              >
                <option value="Excelente">Excelente (Profundo y sin dolor)</option>
                <option value="Bueno">Bueno (Descanso normal)</option>
                <option value="Regular">Regular (Interrupciones leves)</option>
                <option value="Malo">Malo (Insomnio o molestias)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notas o síntomas (Opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Me levanté a tomar agua sin ningún dolor"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer"
            >
              {savedSuccess ? '¡Guardado con éxito!' : 'Guardar descanso'}
            </button>
          </div>
        </form>
      )}

      {/* Last Log Summary */}
      {lastLog && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 text-xs shadow-sm relative z-10">
          <div className="flex items-center space-x-2.5">
            <Activity className="w-4 h-4 text-sky-500" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Último reporte registrado: </span>
              <strong className="text-slate-900 dark:text-white font-mono font-extrabold">{lastLog.hours} horas</strong> ({lastLog.quality})
              {lastLog.notes && <span className="text-slate-600 dark:text-slate-300 block text-[11px] mt-0.5">{lastLog.notes}</span>}
            </div>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">{lastLog.date}</span>
        </div>
      )}

    </div>
  );
};
