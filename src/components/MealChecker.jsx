import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Droplets, 
  Utensils, 
  Camera, 
  Upload, 
  X, 
  Save, 
  Check, 
  Info,
  Clock,
  Heart,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateMeal } from '../utils/renalFoodEvaluator';
import { triggerHaptic } from '../utils/haptics';
import { playAlertSound } from '../utils/sound';

export const MealChecker = ({ 
  onSaveMeal, 
  mealLogs = [], 
  mealSchedule = [],
  soundEnabled = true 
}) => {
  const [dishTitle, setDishTitle] = useState('');
  const [mealText, setMealText] = useState('');
  const [selectedMealSlot, setSelectedMealSlot] = useState('almuerzo');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [previewPhotoModal, setPreviewPhotoModal] = useState(null);

  const fileInputRef = useRef(null);

  const sampleMeals = [
    'Pechuga a la plancha con pepino y limón',
    'Huevos revueltos con arepa sin sal y agua',
    'Hamburguesa con papas fritas y gaseosa negra',
    'Sopa de verduras casera con orégano y laurel',
    'Ensalada fresca de sandía, melón y pepino',
    'Espinacas salteadas con queso madurado salado'
  ];

  const defaultSlots = [
    { id: 'desayuno', name: 'Desayuno' },
    { id: 'media_manana', name: 'Media Mañana' },
    { id: 'almuerzo', name: 'Almuerzo' },
    { id: 'merienda', name: 'Merienda' },
    { id: 'cena', name: 'Cena' },
    { id: 'snack', name: 'Snack Saludable' },
  ];

  const slots = mealSchedule.length > 0 ? mealSchedule : defaultSlots;

  // Handle Photo selection and client-side canvas compression
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    triggerHaptic([15]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize canvas to max 640px to ensure fast storage & cloud sync
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 640;
        const MAX_HEIGHT = 640;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.72 quality (~35KB - 60KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        setPhotoUrl(compressedDataUrl);
        setIsCompressing(false);
        triggerHaptic([20, 30]);

        // Auto evaluate if we have text
        const query = (dishTitle + ' ' + mealText).trim();
        if (query) {
          handleEvaluate(query);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    triggerHaptic([10]);
    setPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEvaluate = (textToAnalyze) => {
    const text = textToAnalyze || (dishTitle + ' ' + mealText).trim();
    if (!text) return;
    triggerHaptic([15, 30]);
    const result = evaluateMeal(text);
    setEvaluation(result);
  };

  const handleSampleClick = (sample) => {
    triggerHaptic([10]);
    setDishTitle(sample);
    setMealText('');
    handleEvaluate(sample);
  };

  const handleSaveMealToLog = () => {
    if (!dishTitle.trim() && !mealText.trim() && !photoUrl) return;
    triggerHaptic([20, 40, 20]);
    if (soundEnabled) playAlertSound('meal');

    // Confetti celebration
    confetti({
      particleCount: 45,
      spread: 60,
      colors: ['#0284C7', '#10B981', '#F59E0B'],
      origin: { y: 0.6 }
    });

    const chosenSlot = slots.find(s => s.id === selectedMealSlot) || { name: 'Comida' };
    const query = (dishTitle || 'Plato registrado') + (mealText ? ` (${mealText})` : '');
    const currentEval = evaluation || evaluateMeal(query);

    if (onSaveMeal) {
      onSaveMeal({
        mealId: selectedMealSlot,
        mealName: chosenSlot.name,
        dishName: dishTitle.trim() || 'Comida registrada',
        photoUrl,
        evaluation: currentEval,
        notes: mealText.trim() || dishTitle.trim(),
      });
    }

    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setDishTitle('');
      setMealText('');
      setPhotoUrl(null);
      setEvaluation(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 2200);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayMealsWithPhotos = (mealLogs || []).filter(l => l.date === today && (l.photoUrl || l.dishName));

  return (
    <div className="space-y-6">
      
      {/* Main Evaluator Card */}
      <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-sky-500/5 relative overflow-hidden transition-all">
        
        {/* Glow */}
        <div className="absolute -right-24 -top-24 w-72 h-72 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center space-x-3.5 mb-5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 ring-4 ring-sky-100/80 dark:ring-slate-800">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Registrar y Evaluar Comida
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Semáforo Renal
              </span>
            </div>
            <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">
              Toma una foto de tu plato o escribe lo que vas a comer para analizar si protege tus riñones
            </p>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="mb-5 relative z-10">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Platos de prueba sugeridos:
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

        {/* Meal Form (Photo + Inputs) */}
        <div className="space-y-4 mb-6 relative z-10">
          
          {/* Meal Slot Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Horario de la Comida
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {slots.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic([10]);
                    setSelectedMealSlot(s.id);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedMealSlot === s.id
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-sky-100 dark:border-slate-700 hover:border-sky-300'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload & Camera Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Foto del Plato (Cámara o Galería)</span>
              </span>
              {photoUrl && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Foto adjunta</span>
                </span>
              )}
            </label>

            <input 
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {!photoUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-sky-50/40 dark:bg-slate-850/50 group"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    {isCompressing ? <Sparkles className="w-6 h-6 animate-spin text-sky-500" /> : <Camera className="w-6 h-6" />}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isCompressing ? 'Optimizando foto...' : 'Tocar para tomar foto con la cámara o subir imagen'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    JPG, PNG o foto directa desde tu teléfono celular
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-sky-200 dark:border-slate-700 shadow-md bg-slate-900 group">
                <img 
                  src={photoUrl} 
                  alt="Foto del plato" 
                  className="w-full h-48 sm:h-56 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3.5">
                  <span className="text-white text-xs font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Foto de la comida lista</span>
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setPreviewPhotoModal(photoUrl)}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-sm cursor-pointer"
                      title="Ver en grande"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white text-xs backdrop-blur-sm cursor-pointer"
                      title="Eliminar foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dish Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nombre del Plato o Alimentos
            </label>
            <input
              type="text"
              value={dishTitle}
              onChange={(e) => {
                setDishTitle(e.target.value);
                if (evaluation) setEvaluation(null);
              }}
              placeholder="Ej. Pechuga a la plancha con arepa sin sal y limón"
              className="w-full px-3.5 py-2.5 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 shadow-inner"
            />
          </div>

          {/* Ingredients / Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Ingredientes y Preparación (Opcional pero recomendado)
            </label>
            <textarea
              rows="2"
              value={mealText}
              onChange={(e) => {
                setMealText(e.target.value);
                if (evaluation) setEvaluation(null);
              }}
              placeholder="Ej. Preparado con poco aceite, sazonado con ajo y limón, sin sal de mesa ni caldos concentrados..."
              className="w-full px-3.5 py-2.5 bg-sky-50/60 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 shadow-inner"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={!dishTitle.trim() && !mealText.trim()}
              onClick={() => handleEvaluate()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Evaluar qué tan saludable es</span>
            </button>

            <button
              type="button"
              disabled={!dishTitle.trim() && !photoUrl}
              onClick={handleSaveMealToLog}
              className={`px-5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                justSaved 
                  ? 'bg-emerald-600 shadow-emerald-600/30' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 disabled:opacity-50'
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Comida Guardada con Éxito!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Registrar en mis Comidas de Hoy</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Evaluation Results Card */}
        {evaluation && (
          <div className={`p-5 rounded-2xl border transition-all animate-fade-in-up relative z-10 shadow-md ${
            evaluation.status === 'safe'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              : evaluation.status === 'moderate'
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
          }`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  evaluation.status === 'safe'
                    ? 'bg-emerald-600 text-white'
                    : evaluation.status === 'moderate'
                    ? 'bg-amber-500 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  {evaluation.status === 'safe' && <CheckCircle2 className="w-6 h-6" />}
                  {evaluation.status === 'moderate' && <AlertTriangle className="w-6 h-6" />}
                  {evaluation.status === 'avoid' && <Ban className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {evaluation.headline}
                  </h3>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    evaluation.status === 'safe'
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : evaluation.status === 'moderate'
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-rose-800 dark:text-rose-300'
                  }`}>
                    {evaluation.badge || (evaluation.status === 'safe' ? 'Permitido y Saludable' : evaluation.status === 'moderate' ? 'Moderar Porción' : 'Peligro de Cristales')}
                  </span>
                </div>
              </div>

              {/* Health Score Meter */}
              {evaluation.score !== undefined && (
                <div className="bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 rounded-xl border border-sky-100 dark:border-slate-800 shrink-0 text-right">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                    Puntaje Salud Renal
                  </span>
                  <span className={`text-xl font-extrabold font-mono ${evaluation.scoreColor || 'text-emerald-600'}`}>
                    {evaluation.score} / 100
                  </span>
                </div>
              )}
            </div>

            {/* Analysis bullet points */}
            <div className="space-y-2 mb-4 bg-white/80 dark:bg-slate-850/80 p-3.5 rounded-xl border border-sky-100 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <strong className="block text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                Evaluación clínica de ingredientes:
              </strong>
              {evaluation.analysis.map((point, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    evaluation.status === 'safe' ? 'bg-emerald-500' : evaluation.status === 'moderate' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-850/90 border border-sky-100 dark:border-slate-700">
                <span className="font-bold text-sky-900 dark:text-sky-300 block mb-1">Consejo Dietético:</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{evaluation.recommendation}</p>
              </div>

              <div className="p-3 rounded-xl bg-sky-100/70 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60">
                <span className="font-bold text-sky-900 dark:text-sky-300 flex items-center space-x-1 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Consejo de Hidratación Post-Comida:</span>
                </span>
                <p className="text-sky-800 dark:text-sky-200 font-semibold">{evaluation.hydrationAdvice}</p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* History of Meals Logged Today with Photos */}
      {todayMealsWithPhotos.length > 0 && (
        <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <Utensils className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Comidas Registradas Hoy ({todayMealsWithPhotos.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {todayMealsWithPhotos.map((m) => (
              <div 
                key={m.id} 
                className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 flex space-x-3 items-center"
              >
                {m.photoUrl ? (
                  <img 
                    src={m.photoUrl} 
                    alt={m.dishName || 'Comida'}
                    onClick={() => setPreviewPhotoModal(m.photoUrl)} 
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-sky-200 dark:border-slate-700 cursor-pointer shadow-sm hover:opacity-90"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-sky-100 dark:bg-slate-700 text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0">
                    <Utensils className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {m.dishName || m.mealName || 'Comida'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {m.timeRecorded}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                    {m.notes || 'Completada a tiempo'}
                  </p>

                  {m.evaluation && (
                    <span className={`inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                      m.evaluation.status === 'safe'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : m.evaluation.status === 'moderate'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {m.evaluation.status === 'safe' ? 'Seguro' : m.evaluation.status === 'moderate' ? 'Moderado' : 'Cálculos'} • {m.evaluation.score || 85} pts
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Zooming Full Photo */}
      {previewPhotoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setPreviewPhotoModal(null)}
        >
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <button
              type="button"
              onClick={() => setPreviewPhotoModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={previewPhotoModal} 
              alt="Foto ampliada del plato" 
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
};
