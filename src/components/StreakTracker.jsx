import React, { useState } from 'react';
import { 
  Flame, 
  Award, 
  Sparkles, 
  Heart, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/haptics';

export const StreakTracker = ({ streakData = { streak: 3 }, latestCareNote }) => {
  const [showSpecialNote, setShowSpecialNote] = useState(false);
  const streak = streakData.streak || 1;

  const milestones = [
    { days: 1, title: 'Primer Paso', desc: 'Comenzaste a cuidar tus riñones' },
    { days: 3, title: 'Hábito en Marcha', desc: '3 días diluyendo sales' },
    { days: 7, title: 'Semana de Oro', desc: '7 días de hidratación óptima' },
    { days: 14, title: 'Protección Renal', desc: '2 semanas libres de dolor' },
    { days: 30, title: 'Triunfo Total', desc: '1 mes entero de hábitos fuertes' }
  ];

  const handleRevealReward = () => {
    triggerHaptic([20, 50, 20]);
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#0284C7', '#38BDF8', '#F43F5E', '#FBBF24'],
      origin: { y: 0.7 }
    });
    setShowSpecialNote(!showSpecialNote);
  };

  return (
    <div className="bg-gradient-to-r from-sky-50 via-white to-cyan-50 dark:from-slate-900/90 dark:via-slate-900 dark:to-amber-950/20 border border-sky-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md shadow-sky-500/5 relative overflow-hidden transition-all">
      
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-200/20 to-sky-200/20 dark:from-amber-500/10 dark:to-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
        
        {/* Streak headline */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20 ring-4 ring-amber-100 dark:ring-amber-950/60">
            <Flame className="w-6 h-6 fill-white/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Racha: {streak} {streak === 1 ? 'Día' : 'Días'} Cuidando de Ti
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Constancia
              </span>
            </div>
            <p className="text-xs text-sky-700 dark:text-sky-300 font-medium">Cada día cumpliendo tu meta aleja para siempre los cálculos</p>
          </div>
        </div>

        {/* Milestone Badge Pill */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-xs font-bold text-sky-800 dark:text-sky-300 shadow-sm self-start sm:self-auto">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Nivel: {streak >= 7 ? 'Semana Renal de Oro' : streak >= 3 ? 'Hábito en Marcha' : 'Primer Paso'}</span>
        </div>

      </div>

      {/* Milestones timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5 relative z-10">
        {milestones.map((m, idx) => {
          const reached = streak >= m.days;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                reached
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 shadow-sm'
                  : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-70'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="font-extrabold font-mono text-xs">{m.days}D</span>
                {reached ? <CheckCircle2 className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Lock className="w-3 h-3" />}
              </div>
              <span className="text-[10px] font-bold block leading-tight">{m.title}</span>
            </div>
          );
        })}
      </div>

      {/* Unlockable Love & Motivation Surprise Card */}
      <div className="relative z-10 pt-2 border-t border-sky-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleRevealReward}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-sky-50/80 dark:hover:bg-slate-700/80 border border-sky-200 dark:border-slate-700 text-left transition-all active:scale-[0.99] cursor-pointer shadow-sm group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                {showSpecialNote ? 'Ocultar dedicatoria' : 'Tienes un mensaje especial desbloqueado de Alejandro'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Toca aquí para ver tus palabras de ánimo por tu constancia
              </span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
        </button>

        {showSpecialNote && (
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-sky-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-sky-950/40 border border-rose-200 dark:border-rose-900/50 text-xs animate-fade-in-up shadow-sm">
            <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-extrabold mb-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Palabras de Alejandro para Brey:</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-semibold italic">
              "{latestCareNote?.message || 'Mi amor, ver cómo te cuidas todos los días me hace sentir muy feliz. Eres fuerte y estamos juntos en esto, paso a paso y vaso a vaso.'}"
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
