import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Search, 
  Info,
  Apple
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const RenalFoodGuide = ({ foodGuide = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'safe' | 'moderate' | 'avoid'

  const filteredFoods = foodGuide.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'safe':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Permitido (Sí)</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Con moderación</span>
          </span>
        );
      case 'avoid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-sm">
            <Ban className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Evitar rigurosamente</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCardClasses = (status) => {
    switch (status) {
      case 'safe': return 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-700';
      case 'moderate': return 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/60 hover:border-amber-300 dark:hover:border-amber-700';
      case 'avoid': return 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-900/60 hover:border-rose-300 dark:hover:border-rose-800';
      default: return 'bg-white dark:bg-slate-800 border-sky-100 dark:border-slate-700';
    }
  };

  const handleFilterClick = (filter) => {
    triggerHaptic([10]);
    setStatusFilter(filter);
  };

  return (
    <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-sky-500/5 relative overflow-hidden transition-all">
      
      {/* Decorative ambient water glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-sky-200/25 dark:bg-sky-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 ring-4 ring-sky-100/80 dark:ring-slate-800">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Semáforo Nutricional Renal
            </h2>
            <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">Guía clínica: ¿Qué alimentos consumir y cuáles evitar?</p>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
            {foodGuide.filter(f => f.status === 'safe').length} Recomendados
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
            {foodGuide.filter(f => f.status === 'moderate').length} Moderados
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
            {foodGuide.filter(f => f.status === 'avoid').length} Evitar
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3.5 mb-6 relative z-10">
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar alimento (ej. limón, café, gaseosa, espinaca...)"
            className="w-full pl-10 pr-4 py-2.5 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 shadow-sm transition-all"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleFilterClick('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
              statusFilter === 'all'
                ? 'bg-sky-600 text-white shadow-sky-600/20'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-sky-100 dark:border-slate-700'
            }`}
          >
            Todos ({foodGuide.length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('safe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
              statusFilter === 'safe'
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            Permitidos (Sí)
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('moderate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
              statusFilter === 'moderate'
                ? 'bg-amber-500 text-white shadow-amber-500/20'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800'
            }`}
          >
            Con Moderación
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('avoid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
              statusFilter === 'avoid'
                ? 'bg-rose-600 text-white shadow-rose-600/20'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800'
            }`}
          >
            Evitar (No)
          </button>
        </div>

      </div>

      {/* Food Cards Grid */}
      {filteredFoods.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-sky-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 text-xs bg-sky-50/30 dark:bg-slate-800/30">
          No se encontraron alimentos con el criterio seleccionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto pr-1 relative z-10">
          {filteredFoods.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-2xl border transition-all shadow-sm ${getCardClasses(item.status)}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">{item.name}</h3>
                  <span className="text-[10px] text-sky-800 dark:text-sky-300 uppercase tracking-wider font-bold">
                    {item.category}
                  </span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="space-y-2 mt-3 pt-2.5 border-t border-sky-100 dark:border-slate-700/80 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Efecto clínico: </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{item.benefit}</span>
                </div>
                {item.tip && (
                  <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-850/90 border border-sky-100 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-start space-x-1.5 shadow-sm">
                    <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong>Consejo:</strong> {item.tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
