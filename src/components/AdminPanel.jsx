import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  Droplets, 
  Utensils, 
  Clock, 
  MessageSquare, 
  Plus, 
  Save, 
  CheckCircle2, 
  Apple, 
  Volume2, 
  Activity,
  Cloud,
  CloudOff,
  AlertTriangle,
  Radio,
  Heart,
  QrCode,
  Trash2,
  Sparkles
} from 'lucide-react';
import { playAlertSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const AdminPanel = ({
  settings,
  onSaveSettings,
  waterLogs = [],
  mealLogs = [],
  sleepLogs = [],
  careNotes = [],
  onAddCareNote,
  onDeleteCareNote,
  foodGuide = [],
  onAddFoodItem,
  onDeleteFoodItem,
  currentUser,
  symptomLogs = [],
  cloudConfig,
  onOpenCloudSync,
  onOpenDeviceSync
}) => {
  const [targetWater, setTargetWater] = useState(settings?.targetWaterMl || 3000);
  const [reminderInterval, setReminderInterval] = useState(settings?.reminderIntervalMins || 60);
  const [mealSchedule, setMealSchedule] = useState(settings?.mealSchedule || []);
  const [newNoteMessage, setNewNoteMessage] = useState('');
  const [noteCategory, setNoteCategory] = useState('love');
  const [noteImportant, setNoteImportant] = useState(true);
  const [noteSentSuccess, setNoteSentSuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Motivational message presets
  const motivationalPresets = [
    { text: '¡Vamos mi amor! Cada vaso de agua que tomas hoy limpia tus riñones y te aleja del dolor. Estoy muy orgulloso de ti.', category: 'love' },
    { text: '¡Buenos días mi princesa! Hoy alcanzamos los 3 litros de agua juntos, tú puedes con todo.', category: 'water' },
    { text: 'Recuerda no saltarte las comidas y evitar comidas saladas. Te cuido desde aquí con todo mi corazón.', category: 'food' },
    { text: '¡Qué juicio tan lindo tienes hoy! Vi tus registros y me llenas de tranquilidad y orgullo.', category: 'cheer' },
    { text: 'Tómate una pausa, respira profundo y bébete un vaso de agua fresca con limón. Te amo.', category: 'love' },
    { text: 'Tu salud y tu recuperación son lo más importante para mí. ¡Ánimo con la meta de hoy!', category: 'motivation' }
  ];

  // New food form state
  const [foodName, setFoodName] = useState('');
  const [foodStatus, setFoodStatus] = useState('safe');
  const [foodCategory, setFoodCategory] = useState('Verduras');
  const [foodBenefit, setFoodBenefit] = useState('');
  const [foodTip, setFoodTip] = useState('');
  const [foodSaveSuccess, setFoodSaveSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterLogs
    .filter(l => l.date === today)
    .reduce((sum, l) => sum + (Number(l.amountMl) || 0), 0);
  const waterPercent = Math.min(100, Math.round((todayWater / targetWater) * 100));

  const completedMealsToday = mealSchedule.filter(meal => 
    mealLogs.some(log => log.date === today && log.mealId === meal.id && log.completed)
  ).length;

  const lastSleep = sleepLogs[0];

  const handleSaveConfig = (e) => {
    e.preventDefault();
    triggerHaptic([20, 40]);
    const updated = {
      ...settings,
      targetWaterMl: Number(targetWater),
      reminderIntervalMins: Number(reminderInterval),
      mealSchedule,
    };
    onSaveSettings(updated);
    setSaveStatus('Configuraciones guardadas y sincronizadas.');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const handleMealTimeChange = (id, newTime) => {
    setMealSchedule(prev => prev.map(m => m.id === id ? { ...m, time: newTime } : m));
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteMessage.trim()) return;
    triggerHaptic([20, 40]);
    if (onAddCareNote) {
      onAddCareNote(newNoteMessage.trim(), currentUser?.name || 'Alejandro', noteCategory, noteImportant);
    }
    setNewNoteMessage('');
    setNoteSentSuccess(true);
    setTimeout(() => setNoteSentSuccess(false), 2500);
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodName.trim() || !foodBenefit.trim()) return;
    triggerHaptic([20]);

    onAddFoodItem({
      name: foodName.trim(),
      status: foodStatus,
      category: foodCategory,
      benefit: foodBenefit.trim(),
      tip: foodTip.trim(),
    });

    setFoodName('');
    setFoodBenefit('');
    setFoodTip('');
    setFoodSaveSuccess(true);
    setTimeout(() => setFoodSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Title Card */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-850 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-6 sm:p-7 shadow-lg shadow-amber-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 ring-4 ring-amber-100 dark:ring-amber-900/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Panel del Cuidador (Alejandro)</h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Gestión Total
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                Supervisa el estado en tiempo real de Brey y ajusta sus metas, horarios y mensajes de apoyo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic([15]);
              playAlertSound('water');
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-slate-600 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Probar Sonido de Alerta</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Banner in Admin */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
        cloudConfig?.enabled
          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
          : 'bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-slate-850 border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
            cloudConfig?.enabled ? 'bg-emerald-600' : 'bg-sky-600'
          }`}>
            {cloudConfig?.enabled ? <Radio className="w-5 h-5 animate-pulse" /> : <Cloud className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              {cloudConfig?.enabled ? 'Sincronización en la Nube Activa (Supabase)' : 'Sincronización en la Nube (Dispositivos Separados)'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {cloudConfig?.enabled 
                ? `Conectado a sala "${cloudConfig.roomId}". Los registros de Brey se actualizan en tu pantalla.` 
                : 'Conecta la app para que lo que Brey anote en su celular se vea en tu pantalla en tiempo real.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
          {onOpenDeviceSync && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                onOpenDeviceSync();
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-750 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Vincular Celular</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              if (onOpenCloudSync) onOpenCloudSync();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${
              cloudConfig?.enabled
                ? 'bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
            }`}
          >
            {cloudConfig?.enabled ? 'Gestionar Conexión' : 'Configurar Sincronización'}
          </button>
        </div>
      </div>

      {/* Patient Live Status Overview (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Water metric */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Hidratación de Brey</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{todayWater} ml</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">de {targetWater} ml</span>
          </div>
          <div className="mt-3 h-2.5 w-full bg-sky-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-sky-700 dark:text-sky-400 font-bold font-mono mt-2 block">
            {waterPercent}% del objetivo cumplido
          </span>
        </div>

        {/* Meal metric */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Comidas de Hoy</span>
            <Utensils className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {completedMealsToday} / {mealSchedule.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">comidas</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-3">
            {completedMealsToday === mealSchedule.length
              ? 'Todas las comidas completadas a tiempo'
              : `Faltan ${mealSchedule.length - completedMealsToday} comidas hoy`}
          </p>
        </div>

        {/* Sleep metric */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Último Descanso</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {lastSleep ? `${lastSleep.hours}h` : 'Sin datos'}
            </span>
            {lastSleep && <span className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">({lastSleep.quality})</span>}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-3 truncate">
            {lastSleep?.notes ? lastSleep.notes : 'Sin molestias nocturnas'}
          </p>
        </div>

        {/* Symptoms / Pain metric */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Molestias / Dolor</span>
            <AlertTriangle className={`w-4 h-4 ${
              symptomLogs.some(s => s.date === today && s.painLevel >= 4) ? 'text-rose-500' : 'text-emerald-500'
            }`} />
          </div>
          {(() => {
            const todaySyms = symptomLogs.filter(s => s.date === today);
            if (todaySyms.length === 0) {
              return (
                <div>
                  <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 pt-1">
                    Sin dolor hoy
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-500 font-medium mt-3">
                    0 molestias registradas hoy
                  </p>
                </div>
              );
            }
            const latest = todaySyms[0];
            return (
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className={`text-xl font-extrabold font-mono ${latest.painLevel >= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    Nivel {latest.painLevel}/10
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{latest.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-2 truncate">
                  {latest.location}
                </p>
              </div>
            );
          })()}
        </div>

      </div>

      {/* Settings & Configuration Form */}
      <form onSubmit={handleSaveConfig} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-500/5 space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Sliders className="w-5 h-5 text-sky-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Ajustes Clínicos y Recordatorios</h2>
          </div>
          {saveStatus && (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{saveStatus}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Target Water */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Meta Diaria de Hidratación (ml)
            </label>
            <input
              type="number"
              step="100"
              min="1500"
              max="5000"
              value={targetWater}
              onChange={(e) => setTargetWater(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Recomendación médica post-cálculos: 2500 a 3500 ml.
            </span>
          </div>

          {/* Reminder Interval */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Frecuencia de Alerta de Agua (minutos)
            </label>
            <select
              value={reminderInterval}
              onChange={(e) => setReminderInterval(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value={30}>Cada 30 minutos (Frecuente)</option>
              <option value={45}>Cada 45 minutos</option>
              <option value={60}>Cada 60 minutos (Recomendado)</option>
              <option value={90}>Cada 90 minutos</option>
              <option value={120}>Cada 120 minutos</option>
            </select>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Intervalo para recordarle beber un vaso.
            </span>
          </div>
        </div>

        {/* Meal Schedules Configuration */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Programación de Horarios de Comida
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mealSchedule.map((meal) => (
              <div key={meal.id} className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">{meal.name}</span>
                <input
                  type="time"
                  value={meal.time}
                  onChange={(e) => handleMealTimeChange(meal.id, e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-sky-100 dark:border-slate-800">
          <button
            type="submit"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar y Aplicar Cambios</span>
          </button>
        </div>
      </form>

      {/* Dedicated Motivational & Care Message Center */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-500/5 space-y-5">
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Enviar Mensajes Motivacionales y de Cariño a Brey
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Aparecerán de inmediato fijados en la parte superior de la pantalla de Brey
              </p>
            </div>
          </div>

          {noteSentSuccess && (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 animate-fade-in-up">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Mensaje publicado a Brey!</span>
            </span>
          )}
        </div>

        {/* Quick Motivational Presets */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Plantillas rápidas para enviar con 1 clic:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {motivationalPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  triggerHaptic([10]);
                  setNewNoteMessage(preset.text);
                  setNoteCategory(preset.category);
                }}
                className="text-left p-2.5 rounded-xl bg-sky-50/70 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-slate-700 border border-sky-200/60 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Plantilla {idx + 1}</span>
                </div>
                <p className="line-clamp-2 font-medium">{preset.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Message Composer Form */}
        <form onSubmit={handleCreateNote} className="space-y-4">
          
          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tipo de Mensaje
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'love', label: 'Amor y Cariño' },
                { id: 'motivation', label: 'Motivación y Fuerza' },
                { id: 'water', label: 'Recordatorio de Agua' },
                { id: 'cheer', label: 'Orgulloso de ti' },
                { id: 'food', label: 'Cuidado con la Comida' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic([10]);
                    setNoteCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    noteCategory === cat.id
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-sky-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Escribe tu Mensaje de Apoyo
            </label>
            <textarea
              rows="3"
              required
              value={newNoteMessage}
              onChange={(e) => setNewNoteMessage(e.target.value)}
              placeholder="Escribe palabras con amor y ánimo para motivar a Brey en su recuperación..."
              className="w-full px-4 py-3 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-rose-400 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={noteImportant}
                onChange={(e) => setNoteImportant(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300"
              />
              <span>Fijar como Mensaje Especial (Destacado con brillo)</span>
            </label>

            <button
              type="submit"
              disabled={!newNoteMessage.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-rose-500/20 active:scale-95 cursor-pointer self-end sm:self-auto"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Publicar Mensaje en la Pantalla de Brey</span>
            </button>
          </div>
        </form>

        {/* List of Sent Messages & Patient Reactions */}
        {careNotes.length > 0 && (
          <div className="pt-4 border-t border-sky-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Historial de Mensajes Enviados ({careNotes.length})
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                El primero es el que Brey ve actualmente arriba en su pantalla
              </span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {careNotes.map((note, index) => (
                <div 
                  key={note.id}
                  className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                    index === 0
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                      : 'bg-sky-50/40 dark:bg-slate-850 border-sky-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider">
                          Activo ahora
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-500">
                        {note.date ? new Date(note.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      "{note.message}"
                    </p>

                    {/* Patient Reaction Badge */}
                    {note.reactions && note.reactions.length > 0 && (
                      <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-[11px] font-bold text-rose-700 dark:text-rose-300 shadow-sm">
                        <span>{note.reactions[note.reactions.length - 1].emoji}</span>
                        <span>Brey reaccionó: {note.reactions[note.reactions.length - 1].label}</span>
                      </div>
                    )}
                  </div>

                  {onDeleteCareNote && careNotes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic([10]);
                        onDeleteCareNote(note.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Eliminar mensaje"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Custom Food to Renal Guide */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-500/5 space-y-4">
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <Apple className="w-5 h-5 text-sky-500" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Agregar Alimento al Semáforo Renal</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Personaliza la guía de comidas según lo que indique su médico</p>
            </div>
          </div>
          {foodSaveSuccess && (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Alimento agregado</span>
            </span>
          )}
        </div>

        <form onSubmit={handleAddFood} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del alimento</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Ej. Té verde"
                className="w-full px-3 py-2 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Clasificación</label>
              <select
                value={foodStatus}
                onChange={(e) => setFoodStatus(e.target.value)}
                className="w-full px-3 py-2 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="safe">Permitido / Recomendado (Verde)</option>
                <option value="moderate">Con Moderación (Amarillo)</option>
                <option value="avoid">Evitar Rigurosamente (Rojo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
              <input
                type="text"
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
                placeholder="Ej. Bebidas, Frutas, etc."
                className="w-full px-3 py-2 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Efecto clínico / Motivo</label>
              <input
                type="text"
                required
                value={foodBenefit}
                onChange={(e) => setFoodBenefit(e.target.value)}
                placeholder="Ej. Contiene citrato / Exceso de oxalato"
                className="w-full px-3 py-2 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Recomendación o tip</label>
              <input
                type="text"
                value={foodTip}
                onChange={(e) => setFoodTip(e.target.value)}
                placeholder="Ej. Tomar con abundante agua"
                className="w-full px-3 py-2 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Incorporar al Catálogo</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
