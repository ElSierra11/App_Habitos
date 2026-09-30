import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  Utensils, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Activity, 
  Eye, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const ProgressStats = ({
  waterLogs = [],
  mealLogs = [],
  urineLogs = [],
  symptomLogs = [],
  targetWaterMl = 3000,
  streakData = { streak: 1 }
}) => {
  const [rangeDays, setRangeDays] = useState(7); // 7 | 14 | 30
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate list of dates for the selected range (oldest to newest)
  const daysList = [];
  const now = new Date();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const formattedShort = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    daysList.push({ date: dateStr, dayLabel, formattedShort });
  }

  // Calculate daily totals for water
  const dailyWaterMap = {};
  waterLogs.forEach(log => {
    if (!dailyWaterMap[log.date]) dailyWaterMap[log.date] = 0;
    dailyWaterMap[log.date] += Number(log.amountMl) || 0;
  });

  // Calculate daily totals for meals
  const dailyMealsMap = {};
  mealLogs.forEach(log => {
    if (log.completed) {
      if (!dailyMealsMap[log.date]) dailyMealsMap[log.date] = 0;
      dailyMealsMap[log.date] += 1;
    }
  });

  // Calculate stats for the period
  let totalWaterInPeriod = 0;
  let daysMetGoal = 0;
  let daysWithLogs = 0;

  const chartData = daysList.map(item => {
    const totalMl = dailyWaterMap[item.date] || 0;
    const completedMeals = dailyMealsMap[item.date] || 0;
    const symptomsThatDay = symptomLogs.filter(s => s.date === item.date);
    const urineThatDay = urineLogs.filter(u => u.date === item.date);

    if (totalMl > 0) {
      totalWaterInPeriod += totalMl;
      daysWithLogs++;
      if (totalMl >= targetWaterMl) daysMetGoal++;
    }

    const percent = Math.min(130, Math.round((totalMl / targetWaterMl) * 100));

    return {
      ...item,
      totalMl,
      percent,
      completedMeals,
      symptomsCount: symptomsThatDay.length,
      hasPain: symptomsThatDay.some(s => s.painLevel >= 4),
      urineLogsCount: urineThatDay.length
    };
  });

  const avgWaterDaily = daysWithLogs > 0 ? Math.round(totalWaterInPeriod / daysWithLogs) : 0;
  const complianceRate = Math.round((daysMetGoal / rangeDays) * 100);

  // Urine distribution
  const periodUrineLogs = urineLogs.filter(u => {
    const d = new Date(u.date);
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= rangeDays;
  });

  const optimalUrine = periodUrineLogs.filter(u => u.level <= 3).length;
  const warningUrine = periodUrineLogs.filter(u => u.level >= 4 && u.level <= 6).length;
  const dangerUrine = periodUrineLogs.filter(u => u.level >= 7).length;
  const totalUrineLogs = periodUrineLogs.length || 1;

  // Maximum value for bar scaling
  const maxBarValue = Math.max(3500, ...chartData.map(d => d.totalMl));

  return (
    <div className="space-y-6">
      
      {/* Header with period switcher */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sky-100 dark:border-slate-800 shadow-xl shadow-sky-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                Evolución y Estadísticas Renales
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Tendencia de consumo hídrico, apego a horarios y prevención clínica.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-sky-50/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-sky-200/60 dark:border-slate-700 self-start sm:self-auto">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                type="button"
                onClick={() => {
                  triggerHaptic([10]);
                  setRangeDays(days);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rangeDays === days
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {days} días
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Promedio diario */}
        <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl p-5 border border-sky-100 dark:border-slate-800 shadow-md shadow-sky-500/5 space-y-1">
          <div className="flex items-center justify-between text-sky-500">
            <Droplets className="w-5 h-5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Promedio</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white pt-1">
            {avgWaterDaily.toLocaleString()} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">ml/día</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Meta clínica: {targetWaterMl.toLocaleString()} ml
          </p>
        </div>

        {/* Días con meta alcanzada */}
        <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl p-5 border border-sky-100 dark:border-slate-800 shadow-md shadow-sky-500/5 space-y-1">
          <div className="flex items-center justify-between text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Apego</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white pt-1">
            {daysMetGoal} de {rangeDays} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">días</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            {complianceRate}% de cumplimiento
          </p>
        </div>

        {/* Racha activa */}
        <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl p-5 border border-sky-100 dark:border-slate-800 shadow-md shadow-sky-500/5 space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Racha</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white pt-1">
            {streakData.streak} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">días</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Constancia consecutiva
          </p>
        </div>

        {/* Días sin dolor */}
        <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl p-5 border border-sky-100 dark:border-slate-800 shadow-md shadow-sky-500/5 space-y-1">
          <div className="flex items-center justify-between text-indigo-500">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Bienestar</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white pt-1">
            {rangeDays - chartData.filter(d => d.hasPain).length} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">días</span>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Sin cólicos agudos
          </p>
        </div>

      </div>

      {/* Main Hydration Bar Chart */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sky-100 dark:border-slate-800 shadow-xl shadow-sky-500/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              <span>Consumo Diario de Agua vs Meta de 3.000 ml</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Barras verdes indican meta cumplida para dilución óptima de sales de calcio y oxalato.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold">
            <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>≥ 3.000 ml</span>
            </span>
            <span className="flex items-center space-x-1 text-sky-600 dark:text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>2.000-2.999 ml</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-500 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>&lt; 2.000 ml</span>
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="relative pt-6 pb-2">
          
          {/* Target line (3000 ml) */}
          <div 
            className="absolute left-0 right-0 border-b-2 border-dashed border-sky-400/70 dark:border-sky-500/50 z-10 pointer-events-none flex items-center justify-end pr-2"
            style={{
              bottom: `${(targetWaterMl / maxBarValue) * 180 + 36}px`
            }}
          >
            <span className="bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[10px] font-black px-2 py-0.5 rounded-md -translate-y-2 shadow-sm">
              Meta 3.000 ml
            </span>
          </div>

          {/* Chart Bars Container */}
          <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 px-1 border-b border-slate-200 dark:border-slate-800">
            {chartData.map((item, index) => {
              const heightPx = Math.max(10, Math.round((item.totalMl / maxBarValue) * 180));
              const isMet = item.totalMl >= targetWaterMl;
              const isModerate = item.totalMl >= 2000 && item.totalMl < targetWaterMl;

              let barColor = 'bg-amber-400 hover:bg-amber-500';
              if (isMet) barColor = 'bg-gradient-to-t from-emerald-600 to-teal-400 hover:brightness-110';
              else if (isModerate) barColor = 'bg-gradient-to-t from-sky-600 to-cyan-400 hover:brightness-110';

              return (
                <div 
                  key={item.date} 
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  onMouseEnter={() => setHoveredDay(item)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-900 text-white text-[11px] rounded-xl py-1.5 px-2.5 pointer-events-none shadow-xl z-30 whitespace-nowrap text-center">
                    <p className="font-extrabold">{item.formattedShort}</p>
                    <p className="text-sky-300 font-bold">{item.totalMl.toLocaleString()} ml ({item.percent}%)</p>
                    {item.completedMeals > 0 && (
                      <p className="text-slate-300 text-[10px]">{item.completedMeals} comidas registradas</p>
                    )}
                    {item.hasPain && (
                      <p className="text-rose-400 text-[10px] font-bold">Molestia registrada</p>
                    )}
                  </div>

                  {/* Top indicator if goal reached */}
                  {isMet && (
                    <div className="mb-1 text-emerald-500">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                    </div>
                  )}

                  {/* The Bar */}
                  <div 
                    className={`w-full max-w-[28px] rounded-t-xl transition-all duration-500 cursor-pointer shadow-sm ${barColor}`}
                    style={{ height: `${heightPx}px` }}
                  />

                  {/* Date label */}
                  <div className="text-center mt-2.5">
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 capitalize">
                      {item.dayLabel}
                    </span>
                    <span className="hidden sm:block text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                      {item.formattedShort.split(' ')[0]}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Urine and Digestive Regularity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Urine quality distribution */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sky-100 dark:border-slate-800 shadow-xl shadow-sky-500/5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-sky-100 dark:border-slate-800 pb-3">
            <Eye className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Calidad de la Orina en el Periodo
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Basado en la escala clínica Armstrong registrada en los últimos {rangeDays} días:
          </p>

          <div className="space-y-3 pt-1">
            {/* Optima */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Excelente Dilución (Nivel 1-3)</span>
                </span>
                <span>{Math.round((optimalUrine / totalUrineLogs) * 100)}% ({optimalUrine})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(optimalUrine / totalUrineLogs) * 100}%` }}
                />
              </div>
            </div>

            {/* Warning */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>Concentrada / Alerta Hidratación (Nivel 4-6)</span>
                </span>
                <span>{Math.round((warningUrine / totalUrineLogs) * 100)}% ({warningUrine})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                  style={{ width: `${(warningUrine / totalUrineLogs) * 100}%` }}
                />
              </div>
            </div>

            {/* Danger */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Deshidratación Severa (Nivel 7-8)</span>
                </span>
                <span>{Math.round((dangerUrine / totalUrineLogs) * 100)}% ({dangerUrine})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(dangerUrine / totalUrineLogs) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Insight & Conclusion */}
        <div className="bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-850 dark:to-teal-950/30 rounded-3xl p-6 sm:p-7 border border-sky-200/80 dark:border-slate-800 shadow-xl shadow-sky-500/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-800 dark:text-sky-300 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Conclusión de Recuperación Renal</span>
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
              {complianceRate >= 70
                ? '¡Evolución renal muy favorable!'
                : 'La clave sigue siendo la constancia con el agua.'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
              Mantener el volumen urinario alto diluye de manera continua la concentración de calcio y oxalato. En los días donde Brey alcanzó los 3 litros, el riesgo de que las sales precipiten formando nuevos cálculos desciende más de un 80%.
            </p>
          </div>

          <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-sky-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-sky-900 dark:text-sky-200">
            <span>Objetivo diario activo</span>
            <span className="px-2.5 py-1 bg-sky-100 dark:bg-sky-950/80 rounded-xl text-sky-700 dark:text-sky-300 font-black border border-sky-200 dark:border-sky-800">
              3.000 ml de agua pura
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
