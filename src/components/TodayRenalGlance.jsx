import React from 'react';
import { 
  Droplets, 
  Activity, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  ShieldAlert, 
  MessageSquareHeart
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const TodayRenalGlance = ({
  targetWaterMl = 3000,
  waterLogs = [],
  urineLogs = [],
  symptomLogs = [],
  onOpenSos,
  onOpenWhatsAppCheckIn,
  onNavigateTab
}) => {
  const today = new Date().toISOString().split('T')[0];

  // Water calculations
  const todayWaterLogs = waterLogs.filter(log => log.date === today);
  const totalWaterMl = todayWaterLogs.reduce((acc, curr) => acc + (Number(curr.amountMl) || 0), 0);
  const waterPercent = Math.min(100, Math.round((totalWaterMl / targetWaterMl) * 100));
  const waterRemaining = Math.max(0, targetWaterMl - totalWaterMl);

  // Latest urine log today
  const todayUrineLogs = urineLogs.filter(log => log.date === today);
  const latestUrine = todayUrineLogs.length > 0 ? todayUrineLogs[0] : null;

  // Latest symptom/pain log today
  const todaySymptomLogs = symptomLogs.filter(log => log.date === today);
  const latestSymptom = todaySymptomLogs.length > 0 ? todaySymptomLogs[0] : null;

  return (
    <section 
      aria-label="Resumen Clínico Diario"
      className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-rosePastel-200/80 dark:border-rosePastel-900/50 rounded-3xl p-4 sm:p-6 shadow-xl shadow-rosePastel-500/5 relative overflow-hidden transition-all"
    >
      {/* Decorative ambient blush glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-rosePastel-200/40 dark:bg-rosePastel-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-blush-200/30 dark:bg-blush-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10 flex-wrap sm:flex-nowrap">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rosePastel-400 to-blush-400 text-white flex items-center justify-center shadow-md shadow-rosePastel-500/25 ring-2 ring-rosePastel-100 dark:ring-rosePastel-900/60 shrink-0">
            <Heart className="w-5 h-5 fill-white/25 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>Estado Clínico de Hoy</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rosePastel-50 dark:bg-rosePastel-950/80 text-rosePastel-600 dark:text-rosePastel-300 border border-rosePastel-200/80 dark:border-rosePastel-800">
                En Vivo
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Seguimiento renal y bienestar general
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([15]);
              if (onOpenWhatsAppCheckIn) onOpenWhatsAppCheckIn();
            }}
            title="Enviar reporte rápido de estado a Alejandro por WhatsApp"
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rosePastel-500 to-blush-500 hover:from-rosePastel-600 hover:to-blush-600 text-white text-xs font-bold transition-all shadow-sm shadow-rosePastel-500/20 active:scale-95 cursor-pointer"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 stroke-[2.4]" />
            <span>Check-in Amor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic([20, 40]);
              if (onOpenSos) onOpenSos();
            }}
            title="Abrir ficha médica de auxilio ante cólico o emergencia renal"
            className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rosePastel-600 dark:text-rosePastel-300 border border-rosePastel-200 dark:border-rosePastel-900 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden xs:inline">SOS Cólico</span>
          </button>
        </div>
      </div>

      {/* Three Diagnostic Glance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        
        {/* Card 1: Hidratación */}
        <div 
          onClick={() => {
            triggerHaptic([10]);
            if (onNavigateTab) onNavigateTab('dashboard');
          }}
          className="bg-white/80 dark:bg-slate-850/80 p-3.5 rounded-2xl border border-sky-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-sky-600 dark:text-sky-400">
              <Droplets className="w-4 h-4 stroke-[2.2]" />
              <span className="text-xs font-bold">Hidratación</span>
            </div>
            <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 font-mono">
              {waterPercent}%
            </span>
          </div>

          <div className="w-full bg-sky-100/70 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-sky-400 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {totalWaterMl.toLocaleString()} ml
            </span>
            <span>
              {waterRemaining > 0 ? `Faltan ${waterRemaining.toLocaleString()} ml` : 'Meta lograda'}
            </span>
          </div>
        </div>

        {/* Card 2: Semáforo de Orina */}
        <div 
          onClick={() => {
            triggerHaptic([10]);
            if (onNavigateTab) onNavigateTab('urine');
          }}
          className="bg-white/80 dark:bg-slate-850/80 p-3.5 rounded-2xl border border-rosePastel-100 dark:border-slate-800 hover:border-rosePastel-300 dark:hover:border-rosePastel-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-rosePastel-600 dark:text-rosePastel-400">
              <Eye className="w-4 h-4 stroke-[2.2]" />
              <span className="text-xs font-bold">Color de Orina</span>
            </div>
            {latestUrine ? (
              <span 
                className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-xs" 
                style={{ backgroundColor: latestUrine.colorHex || '#FDE047' }}
                title={`Color: ${latestUrine.scaleLevel || 'Registrado'}`}
              />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>

          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            {latestUrine ? (latestUrine.notes || 'Color registrado hoy') : 'Sin registro de orina hoy'}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{latestUrine ? latestUrine.time : 'Toca para registrar'}</span>
            <span className="text-rosePastel-600 dark:text-rosePastel-400 font-bold group-hover:translate-x-0.5 transition-transform">
              Ver semáforo →
            </span>
          </p>
        </div>

        {/* Card 3: Bienestar y Dolor */}
        <div 
          onClick={() => {
            triggerHaptic([10]);
            if (onNavigateTab) onNavigateTab('symptoms');
          }}
          className="bg-white/80 dark:bg-slate-850/80 p-3.5 rounded-2xl border border-rosePastel-100 dark:border-slate-800 hover:border-rosePastel-300 dark:hover:border-rosePastel-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-rosePastel-600 dark:text-rosePastel-400">
              <Activity className="w-4 h-4 stroke-[2.2]" />
              <span className="text-xs font-bold">Molestias / Dolor</span>
            </div>
            {latestSymptom && latestSymptom.painLevel > 0 ? (
              <span className="text-xs font-extrabold text-rose-500 font-mono">
                {latestSymptom.painLevel}/10
              </span>
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </div>

          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            {latestSymptom 
              ? (latestSymptom.painLevel > 0 
                  ? `Nivel ${latestSymptom.painLevel}/10 - ${latestSymptom.location || 'Espalda baja'}`
                  : 'Sin dolor reportado hoy')
              : 'Día tranquilo / Sin reporte'}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{latestSymptom ? latestSymptom.time : 'Tranquilo'}</span>
            <span className="text-rosePastel-600 dark:text-rosePastel-400 font-bold group-hover:translate-x-0.5 transition-transform">
              Registrar →
            </span>
          </p>
        </div>

      </div>
    </section>
  );
};
