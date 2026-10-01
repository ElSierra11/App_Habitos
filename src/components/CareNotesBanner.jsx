import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Heart, 
  Clock, 
  MessageSquare, 
  X, 
  Droplets, 
  Smile, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/haptics';

export const CareNotesBanner = ({ 
  careNotes = [], 
  onReactToNote,
  currentUser 
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [reactedAnim, setReactedAnim] = useState(false);

  if (!careNotes || careNotes.length === 0) return null;

  const latestNote = careNotes[0];
  const isPatient = currentUser?.role !== 'admin';

  const getCategoryInfo = (cat) => {
    switch (cat) {
      case 'love':
        return { label: 'Amor y Cariño', color: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' };
      case 'water':
        return { label: 'Recordatorio de Agua', color: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' };
      case 'cheer':
        return { label: '¡Orgulloso de ti!', color: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' };
      case 'food':
        return { label: 'Cuidado con la Comida', color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' };
      default:
        return { label: 'Mensaje Motivacional', color: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' };
    }
  };

  const catInfo = getCategoryInfo(latestNote.category);

  const handleReact = (emoji, label) => {
    triggerHaptic([20, 40]);
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ['#F43F5E', '#FB7185', '#38BDF8'],
      origin: { y: 0.3 }
    });

    setReactedAnim(true);
    setTimeout(() => setReactedAnim(false), 2000);

    if (onReactToNote) {
      onReactToNote(latestNote.id, emoji, label);
    }
  };

  const formattedDate = latestNote.date 
    ? new Date(latestNote.date).toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) 
    : '';

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-white to-rose-50/50 dark:from-slate-900/90 dark:via-slate-900 dark:to-rose-950/20 border border-sky-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md shadow-sky-500/5 care-shimmer-border transition-all">
        
        {/* Decorative warm aura */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-200/20 to-sky-200/20 dark:from-rose-500/10 dark:to-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start space-x-3 sm:space-x-4 relative z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20 ring-2 sm:ring-4 ring-rose-100/80 dark:ring-rose-950/40">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center space-x-1">
                  <span>Mensaje de {latestNote.author || 'Alejandro'}</span>
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${catInfo.color}`}>
                  <Sparkles className="w-2.5 h-2.5 mr-1 inline" />
                  {catInfo.label}
                </span>
              </div>

              {formattedDate && (
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
              "{latestNote.message}"
            </p>

            {/* Reactions and past notes button */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sky-100/80 dark:border-slate-800/80">
              
              {/* Patient quick reaction buttons */}
              {isPatient ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleReact('❤️', 'Leído con amor')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>❤️</span>
                    <span className="hidden sm:inline">¡Leído con amor!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReact('💧', 'Tomando agüita')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-900/60 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>💧</span>
                    <span className="hidden sm:inline">¡Tomando agua!</span>
                  </button>

                  {reactedAnim && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1 animate-fade-in-up">
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Alejandro lo sabrá!</span>
                    </span>
                  )}
                </div>
              ) : (
                /* Admin view of reactions */
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {latestNote.reactions && latestNote.reactions.length > 0 ? (
                    <div className="flex items-center space-x-1 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-[11px]">
                      <span>{latestNote.reactions[latestNote.reactions.length - 1].emoji}</span>
                      <span>Brey: {latestNote.reactions[latestNote.reactions.length - 1].label}</span>
                    </div>
                  ) : (
                    <span className="text-[11px]">Mensaje activo en la pantalla de Brey</span>
                  )}
                </div>
              )}

              {/* View all notes */}
              {careNotes.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic([10]);
                    setShowHistoryModal(true);
                  }}
                  className="text-xs text-sky-700 dark:text-sky-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ver notas anteriores ({careNotes.length})</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setShowHistoryModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Mensajes de Ánimo de Alejandro
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {careNotes.map((note) => {
                const info = getCategoryInfo(note.category);
                return (
                  <div 
                    key={note.id}
                    className="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${info.color}`}>
                        {info.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {note.date ? new Date(note.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold">
                      "{note.message}"
                    </p>

                    {note.reactions && note.reactions.length > 0 && (
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-1 pt-1">
                        <span>{note.reactions[note.reactions.length - 1].emoji}</span>
                        <span>Reacción de Brey: {note.reactions[note.reactions.length - 1].label}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
