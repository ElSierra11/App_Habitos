import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  HelpCircle, 
  Droplets, 
  Utensils, 
  ArrowRight,
  Info
} from 'lucide-react';
import { evaluateMeal } from '../utils/renalFoodEvaluator';
import { triggerHaptic } from '../utils/haptics';

export const MealChecker = ({ onLogEvaluatedMeal }) => {
  const [mealText, setMealText] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const sampleMeals = [
    'Pechuga a la plancha con pepino y limón',
    'Hamburguesa con papas fritas y gaseosa',
    'Huevos revueltos con arepa sin sal',
    'Espinacas salteadas con queso salado',
    'Sopa de verduras casera con orégano'
  ];

  const handleEvaluate = (textToAnalyze) => {
    const text = textToAnalyze || mealText;
    if (!text.trim()) return;
    triggerHaptic([15, 30]);
    const result = evaluateMeal(text);
    setEvaluation(result);
  };

  const handleSampleClick = (sample) => {
    triggerHaptic([10]);
    setMealText(sample);
    handleEvaluate(sample);
  };

  return (
    <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-sky-500/5 relative overflow-hidden transition-all">
      
      {/* Decorative ambient water glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3.5 mb-5 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 ring-4 ring-sky-100/80 dark:ring-slate-800">
          <Utensils className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span>Evaluador de Comidas: ¿Puedo comer esto?</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Clínico
            </span>
          </h2>
          <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">Escribe tu plato o ingredientes y te indicamos si es seguro para tus riñones</p>
        </div>
      </div>

      {/* Quick sample chips */}
      <div className="mb-4 relative z-10">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
          Ejemplos rápidos para probar:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sampleMeals.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample)}
              className="px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-800 dark:text-sky-300 border border-sky-200/70 dark:border-slate-700 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Text Area & Action */}
      <div className="space-y-3 mb-6 relative z-10">
        <div className="relative">
          <textarea
            rows="3"
            value={mealText}
            onChange={(e) => {
              setMealText(e.target.value);
              if (evaluation) setEvaluation(null);
            }}
            placeholder="Describe lo que vas a almorzar o cenar (ej. Carne asada con arroz, ensalada de tomate y agua con limón)..."
            className="w-full px-4 py-3 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 shadow-inner"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!mealText.trim()}
            onClick={() => handleEvaluate(mealText)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analizar mi comida</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className={`p-5 rounded-2xl border transition-all animate-fade-in-up relative z-10 shadow-sm ${
          evaluation.status === 'safe'
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
            : evaluation.status === 'moderate'
            ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
            : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
        }`}>
          
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                evaluation.status === 'safe'
                  ? 'bg-emerald-600 text-white'
                  : evaluation.status === 'moderate'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                {evaluation.status === 'safe' && <CheckCircle2 className="w-5 h-5" />}
                {evaluation.status === 'moderate' && <AlertTriangle className="w-5 h-5" />}
                {evaluation.status === 'avoid' && <Ban className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {evaluation.headline}
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  evaluation.status === 'safe'
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : evaluation.status === 'moderate'
                    ? 'text-amber-800 dark:text-amber-300'
                    : 'text-rose-800 dark:text-rose-300'
                }`}>
                  {evaluation.status === 'safe' ? 'Permitido y Saludable' : evaluation.status === 'moderate' ? 'Moderar Porción' : 'Peligro de Cristales'}
                </span>
              </div>
            </div>
          </div>

          {/* Analysis bullet points */}
          <div className="space-y-2 mb-4 bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-sky-100 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium">
            <strong className="block text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
              Hallazgos clínicos:
            </strong>
            {evaluation.analysis.map((point, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-sky-100 dark:border-slate-700">
              <span className="font-bold text-sky-900 dark:text-sky-300 block mb-1">Consejo de Preparación:</span>
              <p className="text-slate-700 dark:text-slate-300">{evaluation.recommendation}</p>
            </div>

            <div className="p-3 rounded-xl bg-sky-100/60 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60">
              <span className="font-bold text-sky-900 dark:text-sky-300 flex items-center space-x-1 mb-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Consejo de Hidratación:</span>
              </span>
              <p className="text-sky-800 dark:text-sky-200 font-semibold">{evaluation.hydrationAdvice}</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
