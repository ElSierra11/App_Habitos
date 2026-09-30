import React from 'react';
import { HeartHandshake, Pin, Sparkles } from 'lucide-react';

export const CareNotesBanner = ({ careNotes = [] }) => {
  if (!careNotes || careNotes.length === 0) return null;

  const latestNote = careNotes[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-white to-cyan-50 dark:from-slate-900/90 dark:via-slate-900 dark:to-cyan-950/40 border border-sky-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md shadow-sky-500/5 care-shimmer-border transition-all">
      
      {/* Decorative warm aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-200/20 to-sky-200/20 dark:from-rose-500/10 dark:to-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start space-x-3.5 relative z-10">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 ring-4 ring-sky-100/80 dark:ring-sky-900/40">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center space-x-1">
              <span>Nota con cariño de {latestNote.author}</span>
            </span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              <Sparkles className="w-3 h-3 mr-0.5 inline" />
              Especial
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
            "{latestNote.message}"
          </p>
        </div>
      </div>
    </div>
  );
};
