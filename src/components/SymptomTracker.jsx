import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Info,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Flame,
  Droplets
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const SymptomTracker = ({
  symptomLogs = [],
  onAddSymptomLog,
  onDeleteSymptomLog,
  onQuickAddWater
}) => {
  const [painLevel, setPainLevel] = useState(2);
  const [location, setLocation] = useState('Fosa lumbar derecha');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Pesadez o molestia sorda']);
  const [notes, setNotes] = useState('');
  const [showRedFlags, setShowRedFlags] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const SYMPTOM_OPTIONS = [
    'Pesadez o molestia sorda',
    'Ardor al orinar (Disuria)',
    'Náuseas o malestar estomacal',
    'Deseo constante de orinar',
    'Espasmo cólico punzante',
    'Orina turbia o con olor fuerte',
    'Dolor irradiado hacia ingle',
    'Escalofríos o temblor'
  ];

  const LOCATION_OPTIONS = [
    'Fosa lumbar derecha',
    'Fosa lumbar izquierda',
    'Bilateral (Ambos lados)',
    'Bajo vientre / Suprapúbico',
    'Irradiado a ingle / pelvis'
  ];

  const handleToggleSymptom = (symptom) => {
    triggerHaptic([10]);
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerHaptic([20, 40]);

    onAddSymptomLog({
      painLevel: Number(painLevel),
      location,
      symptoms: selectedSymptoms,
      notes: notes.trim(),
    });

    setNotes('');
    setSuccessMsg('Registro de síntoma guardado exitosamente.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Helper for pain severity color & description
  const getPainMeta = (level) => {
    if (level === 0) return { label: 'Sin dolor ni molestia', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' };
    if (level <= 3) return { label: 'Molestia leve / Presión sorda', color: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-950/40', border: 'border-teal-200 dark:border-teal-800' };
    if (level <= 6) return { label: 'Dolor moderado / Cólico intermitente', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' };
    if (level <= 8) return { label: 'Dolor severo / Cólico agudo intenso', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-orange-200 dark:border-orange-800' };
    return { label: 'Dolor crítico incapacitante', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-300 dark:border-rose-800' };
  };

  const painMeta = getPainMeta(painLevel);

  return (
    <div className="space-y-6">
      
      {/* Header Clinical Card */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sky-100 dark:border-slate-800 shadow-xl shadow-sky-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                Bitácora de Dolor y Síntomas Renales
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Monitorea la intensidad de los cólicos y molestias para prevenir complicaciones litiásicas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRedFlags(!showRedFlags)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>¿Cuándo ir a Urgencias?</span>
            {showRedFlags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Clinical Red Flags Accordion / Banner */}
        {showRedFlags && (
          <div className="mt-5 p-5 bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-red-950/40 border-2 border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-3.5 animate-fadeIn">
            <div className="flex items-center space-x-2 text-rose-900 dark:text-rose-200 font-extrabold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Protocolo de Banderas Rojas Renales (Urgencias Médicas)</span>
            </div>
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
              Si Brey presenta cualquiera de estos signos, no esperes a que pase; se debe acudir de inmediato al servicio de urgencias médicas hospitalarias:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center">
                  <Flame className="w-3.5 h-3.5 mr-1 text-rose-500" /> Fiebre mayor a 38°C con dolor
                </span>
                <p className="text-slate-600 dark:text-slate-400">Sospecha de infección urinaria ascendente (pielonefritis) por obstrucción del cálculo.</p>
              </div>

              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-500" /> Dolor agudo incontrolable
                </span>
                <p className="text-slate-600 dark:text-slate-400">Cólico nefrítico que no cede tras analgesia y no permite encontrar ninguna posición de descanso.</p>
              </div>

              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center">
                  <Droplets className="w-3.5 h-3.5 mr-1 text-rose-500" /> Anuria (Imposibilidad de orinar)
                </span>
                <p className="text-slate-600 dark:text-slate-400">Ganas intensas pero incapacidad total para expulsar orina durante varias horas continuas.</p>
              </div>

              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center">
                  <HeartPulse className="w-3.5 h-3.5 mr-1 text-rose-500" /> Sangre franca o vómitos incoercibles
                </span>
                <p className="text-slate-600 dark:text-slate-400">Orina color vino tinto con coágulos o náuseas repetidas que impiden ingerir agua.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Symptom Log Form */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sky-100 dark:border-slate-800 shadow-xl shadow-sky-500/5 space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Plus className="w-4 h-4 text-sky-500" />
            <span>Nuevo Registro de Sensación o Molestia</span>
          </h3>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Escala EVA y localización
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pain Slider (Escala EVA 0 a 10) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Nivel de Dolor / Molestia (Escala 0 al 10)
              </label>
              <div className={`px-3 py-1 rounded-xl text-xs font-black border ${painMeta.bg} ${painMeta.color} ${painMeta.border}`}>
                Nivel {painLevel}: {painMeta.label}
              </div>
            </div>

            <input 
              type="range"
              min="0"
              max="10"
              step="1"
              value={painLevel}
              onChange={(e) => {
                triggerHaptic([10]);
                setPainLevel(Number(e.target.value));
              }}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none"
            />

            <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 px-1">
              <span>0 (Sin dolor)</span>
              <span>3 (Leve)</span>
              <span>5 (Moderado)</span>
              <span>7 (Intenso)</span>
              <span>10 (Extremo)</span>
            </div>
          </div>

          {/* Location Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>Zona Anatómica Principal</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LOCATION_OPTIONS.map((loc) => {
                const isSelected = location === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      triggerHaptic([10]);
                      setLocation(loc);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                        : 'bg-white dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-sky-100 dark:border-slate-700/80'
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Associated Symptoms Tags */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Síntomas Asociados (Selecciona los que apliquen)
            </label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map((sym) => {
                const active = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleToggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                      active
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes field */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Observaciones o Detalle (Opcional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Apareció después de 4 horas sentado; tomé agua y mejoró..."
              className="w-full px-4 py-2.5 rounded-2xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Recommendation prompt based on pain level */}
          {painLevel >= 4 && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Recomendación Renal Inmediata:</span>
                <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                  {painLevel >= 7 
                    ? 'Nivel de dolor alto. Si no cede con la medicación recetada por tu urólogo o se asocia a fiebre, contacta de inmediato a tu médico.' 
                    : 'Bebe un vaso de agua tibia con limón fresca (250 ml) y descansa en posición fetal del lado contrario al dolor para relajar la musculatura ureteral.'}
                </p>
                {onQuickAddWater && (
                  <button
                    type="button"
                    onClick={() => onQuickAddWater(250)}
                    className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Registrar 250 ml de agua de alivio</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {successMsg && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMsg}</span>
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-indigo-700 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>Guardar Registro</span>
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* History of logs */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sky-100 dark:border-slate-800 shadow-xl shadow-sky-500/5 space-y-4">
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Historial Clínico de Molestias ({symptomLogs.length})</span>
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Cronológico</span>
        </div>

        {symptomLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            No hay molestias registradas recientemente. ¡Excelente señal de recuperación renal!
          </div>
        ) : (
          <div className="space-y-3">
            {symptomLogs.map((log) => {
              const meta = getPainMeta(log.painLevel);
              return (
                <div 
                  key={log.id}
                  className="p-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-sky-200 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${meta.bg} ${meta.color} ${meta.border}`}>
                        Dolor {log.painLevel}/10
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400 inline" />
                        <span>{log.location}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                        • {log.date} a las {log.time}
                      </span>
                    </div>

                    {log.symptoms && log.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {log.symptoms.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {log.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-sky-50/50 dark:bg-slate-900/60 p-2 rounded-xl mt-1 border border-sky-100/50 dark:border-slate-750">
                        "{log.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic([10]);
                      onDeleteSymptomLog(log.id);
                    }}
                    title="Eliminar registro"
                    className="p-2 text-slate-300 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all self-end sm:self-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
