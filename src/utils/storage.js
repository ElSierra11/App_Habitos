// LocalStorage Persistence Layer for Renal Health App
// Strictly 0 emojis, clinical precision & care

const STORAGE_KEYS = {
  USERS: 'breyhabitos_users_v1',
  CURRENT_USER: 'breyhabitos_current_user_v1',
  SETTINGS: 'breyhabitos_settings_v1',
  WATER_LOGS: 'breyhabitos_water_logs_v1',
  MEAL_LOGS: 'breyhabitos_meal_logs_v1',
  SLEEP_LOGS: 'breyhabitos_sleep_logs_v1',
  FOOD_GUIDE: 'breyhabitos_food_guide_v1',
  CARE_NOTES: 'breyhabitos_care_notes_v1',
  URINE_LOGS: 'breyhabitos_urine_logs_v1',
  SYMPTOM_LOGS: 'breyhabitos_symptom_logs_v1',
  CLOUD_CONFIG: 'breyhabitos_cloud_config_v1',
  THEME: 'breyhabitos_theme_v1',
};

// Universal Safe Storage Provider (Browser localStorage with in-memory fallback for SSR/Workers/Tests)
const memoryStorage = new Map();
export const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage.get(key) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, String(val));
      }
      memoryStorage.set(key, String(val));
    } catch {
      memoryStorage.set(key, String(val));
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      memoryStorage.delete(key);
    } catch {
      memoryStorage.delete(key);
    }
  },
  clear: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      memoryStorage.clear();
    } catch {
      memoryStorage.clear();
    }
  }
};


// Exclusive admin account email
export const ADMIN_EMAIL = 'alejosierra656@gmail.com';

// Seed initial users
const INITIAL_USERS = [
  {
    id: 'user_admin_1',
    email: ADMIN_EMAIL,
    password: 'admin123',
    name: 'Alejandro Sierra (Cuidador)',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_patient_1',
    email: 'paciente@salud.com',
    password: 'paciente123',
    name: 'Brey',
    role: 'patient',
    targetWaterMl: 3000,
    createdAt: new Date().toISOString(),
  },
];

// Seed initial renal configuration
const INITIAL_SETTINGS = {
  targetWaterMl: 3000, // 3 Liters daily clinical target for kidney stone recovery
  reminderIntervalMins: 60, // Alarm every 60 mins
  soundAlertsEnabled: true,
  notificationsEnabled: true,
  mealSchedule: [
    { id: 'desayuno', name: 'Desayuno', time: '08:00', icon: 'Sun', description: 'Comida energética baja en sal' },
    { id: 'media_manana', name: 'Media Mañana', time: '10:30', icon: 'Clock', description: 'Fruta hidratante o infusión' },
    { id: 'almuerzo', name: 'Almuerzo', time: '13:00', icon: 'Utensils', description: 'Proteína moderada, vegetales permitidos y agua' },
    { id: 'merienda', name: 'Merienda', time: '16:30', icon: 'Coffee', description: 'Vaso de agua con limón y snack saludable' },
    { id: 'cena', name: 'Cena Liviana', time: '19:30', icon: 'Moon', description: 'Cena digestiva al menos 2h antes de acostarse' },
  ],
  sleepSchedule: {
    windDownTime: '22:00',
    bedTime: '22:30',
    wakeTime: '06:30',
    targetHours: 8,
    preBedWaterAdvice: 'Tomar 1 vaso de agua (200 ml) antes de dormir para evitar la orina concentrada en la noche.',
  },
};

// Comprehensive renal food guide for lithiasis / kidney stones recovery
const INITIAL_FOOD_GUIDE = [
  // SAFE / RECOMMENDED (Citrato alto, diuréticos suaves, hidratación)
  {
    id: 'f1',
    name: 'Agua pura filtrada',
    status: 'safe',
    category: 'Bebidas',
    benefit: 'Diluye la orina e impide que los cristales de calcio o ácido úrico se agrupen.',
    tip: 'El pilar fundamental. Beber distribuido a lo largo del día y antes de dormir.',
  },
  {
    id: 'f2',
    name: 'Limonada natural (sin azúcar refinada)',
    status: 'safe',
    category: 'Bebidas',
    benefit: 'Aporta citrato natural, el inhibidor biológico más potente contra la formación de cálculos.',
    tip: 'Exprime 1 a 2 limones frescos en un litro de agua.',
  },
  {
    id: 'f3',
    name: 'Sandía y Melón',
    status: 'safe',
    category: 'Frutas',
    benefit: 'Contienen más de un 90% de agua pura, muy bajo contenido de sodio y efecto diurético suave.',
    tip: 'Excelente opción para merienda de media mañana.',
  },
  {
    id: 'f4',
    name: 'Manzanas y Peras',
    status: 'safe',
    category: 'Frutas',
    benefit: 'Bajas en oxalato y ricas en fibra soluble.',
    tip: 'Consumir frescas con cáscara bien lavada.',
  },
  {
    id: 'f5',
    name: 'Pescado blanco (Merluza, Tilapia)',
    status: 'safe',
    category: 'Proteínas',
    benefit: 'Proteína magra de fácil digestión que genera menor sobrecarga de purinas y ácido úrico.',
    tip: 'Preparar a la plancha o al vapor con limón y especias sin sal.',
  },
  {
    id: 'f6',
    name: 'Pepino y Calabacín',
    status: 'safe',
    category: 'Verduras',
    benefit: 'Altísimo contenido de agua y electrolitos sin oxalatos elevados.',
    tip: 'Ideal en ensaladas con vinagreta de aceite de oliva y limón.',
  },
  {
    id: 'f7',
    name: 'Avena integral en hojuelas',
    status: 'safe',
    category: 'Cereales',
    benefit: 'Aporta fibra sin irritar el tracto urinario ni alterar la acidez.',
    tip: 'Cocinar con agua o leche descremada.',
  },

  // MODERATE (Consumir con control de porciones)
  {
    id: 'm1',
    name: 'Carne de res magra',
    status: 'moderate',
    category: 'Proteínas',
    benefit: 'Provee hierro y aminoácidos, pero en exceso eleva el ácido úrico y acidifica la orina.',
    tip: 'Limitar a un máximo de 2 veces por semana y porciones de 120-150g.',
  },
  {
    id: 'm2',
    name: 'Lácteos bajos en grasa (Queso fresco sin sal)',
    status: 'moderate',
    category: 'Lácteos',
    benefit: 'El calcio dietético atrapa el oxalato en el intestino impidiendo que pase al riñón.',
    tip: 'Elegir siempre opciones sin sal añadida. No tomar suplementos sin indicación médica.',
  },
  {
    id: 'm3',
    name: 'Café suave filtrado',
    status: 'moderate',
    category: 'Bebidas',
    benefit: 'Efecto diurético moderado.',
    tip: 'Máximo 1 taza al día. Siempre acompañar con un vaso de agua adicional.',
  },
  {
    id: 'm4',
    name: 'Frutos secos (Almendras, Nueces)',
    status: 'moderate',
    category: 'Snacks',
    benefit: 'Grasas saludables pero contienen niveles moderados de oxalatos.',
    tip: 'Limitar a 1 puñado pequeño esporádicamente.',
  },

  // FORBIDDEN / AVOID (Riesgo alto de generar nuevos cálculos)
  {
    id: 'd1',
    name: 'Gaseosas oscuras y refrescos de cola',
    status: 'avoid',
    category: 'Bebidas',
    benefit: 'Contienen ácido fosfórico que altera el pH urinario y propicia la cristalización acelerada.',
    tip: 'Evitar totalmente. Sustituir por agua con rodajas de limón o pepino.',
  },
  {
    id: 'd2',
    name: 'Embutidos y carnes curadas (Salchichas, Jamón, Tocineta)',
    status: 'avoid',
    category: 'Carnes Procesadas',
    benefit: 'Cargas extremas de sodio que fuerzan al riñón a expulsar calcio a la orina (hipercalciuria).',
    tip: 'Principal factor dietético de recurrencia de cálculos de oxalato de calcio.',
  },
  {
    id: 'd3',
    name: 'Sopas instantáneas y cubos de caldo concentrado',
    status: 'avoid',
    category: 'Ultraprocesados',
    benefit: 'Concentración masiva de sodio y glutamato que deshidrata a nivel celular.',
    tip: 'Cocinar caldos caseros usando hierbas naturales como orégano y laurel.',
  },
  {
    id: 'd4',
    name: 'Espinacas y Acelgas crudas en exceso',
    status: 'avoid',
    category: 'Verduras',
    benefit: 'Muy alto contenido de oxalato puro, componente clave de los cálculos renales.',
    tip: 'Si se consumen, hervir primero y descartar el agua de cocción.',
  },
  {
    id: 'd5',
    name: 'Snacks fritos salados (Papas fritas, Platanitos de bolsa)',
    status: 'avoid',
    category: 'Snacks',
    benefit: 'Exceso de sal y grasas trans que deterioran la función renal y la presión arterial.',
    tip: 'Cambiar por rodajas de manzana fresca o palitos de pepino.',
  },
  {
    id: 'd6',
    name: 'Sal de mesa en exceso',
    status: 'avoid',
    category: 'Condimentos',
    benefit: 'A mayor sodio consumido, mayor cantidad de calcio se filtra a la orina formando piedras.',
    tip: 'Retirar el salero de la mesa. Sazonar con limón, ajo y romero.',
  },
];

// Seed Care Notes from boyfriend
const INITIAL_CARE_NOTES = [
  {
    id: 'note_1',
    date: new Date().toISOString(),
    author: 'Alejandro',
    message: 'Hola mi amor, cada vaso de agua que tomas hoy limpia tus riñones y te aleja del dolor. Estoy muy orgulloso de lo juiciosa que estás.',
    important: true,
  },
  {
    id: 'note_2',
    date: new Date(Date.now() - 86400000).toISOString(),
    author: 'Alejandro',
    message: 'Recuerda no saltarte el almuerzo y evitar comidas saladas. Hoy vamos por los 3 litros de agua.',
    important: false,
  },
];

// Initial water logs for today
const getInitialWaterLogs = () => {
  const today = new Date().toISOString().split('T')[0];
  return [
    { id: 'w1', date: today, time: '08:15', amountMl: 350 },
    { id: 'w2', date: today, time: '10:00', amountMl: 500 },
    { id: 'w3', date: today, time: '11:45', amountMl: 250 },
  ];
};

// Initial meal logs for today
const getInitialMealLogs = () => {
  const today = new Date().toISOString().split('T')[0];
  return [
    { id: 'm1', date: today, mealId: 'desayuno', completed: true, timeRecorded: '08:30', notes: 'Huevos revueltos con arepa sin sal y agua con limón' },
    { id: 'm2', date: today, mealId: 'media_manana', completed: true, timeRecorded: '10:45', notes: 'Porción de melón' },
  ];
};

// Storage helper functions
export const getStoredUsers = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.USERS);
  let users = [];
  if (!data) {
    users = [...INITIAL_USERS];
    safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } else {
    try {
      users = JSON.parse(data);
    } catch {
      users = [...INITIAL_USERS];
    }
  }

  // Sanitize: ensure ONLY ADMIN_EMAIL has 'admin', all others 'patient'
  let modified = false;
  users = users.map((u) => {
    const isTargetAdmin = u.email && u.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const correctRole = isTargetAdmin ? 'admin' : 'patient';
    if (u.role !== correctRole) {
      modified = true;
      return { ...u, role: correctRole };
    }
    return u;
  });

  if (modified) {
    safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  return users;
};

export const saveUser = (user) => {
  const users = getStoredUsers();
  const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) {
    throw new Error('El correo electrónico ya se encuentra registrado');
  }
  // Enforce role: only ADMIN_EMAIL can be admin
  const isTargetAdmin = user.email && user.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const sanitizedUser = {
    ...user,
    role: isTargetAdmin ? 'admin' : 'patient',
  };
  users.push(sanitizedUser);
  safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return sanitizedUser;
};

export const getCurrentUser = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!data) {
    return INITIAL_USERS[1];
  }
  try {
    const parsed = JSON.parse(data);
    const isTargetAdmin = parsed.email && parsed.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    return {
      ...parsed,
      role: isTargetAdmin ? 'admin' : 'patient',
    };
  } catch {
    return INITIAL_USERS[1];
  }
};

export const setCurrentUser = (user) => {
  if (!user) {
    safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
};

export const getSettings = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!data) {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  return JSON.parse(data);
};

export const saveSettings = (newSettings) => {
  safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  return newSettings;
};

export const getWaterLogs = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.WATER_LOGS);
  if (!data) {
    const initial = getInitialWaterLogs();
    safeStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const addWaterLog = (amountMl) => {
  const logs = getWaterLogs();
  const now = new Date();
  const entry = {
    id: 'w_' + Date.now(),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amountMl: Number(amountMl),
  };
  const updated = [entry, ...logs];
  safeStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(updated));
  return { entry, updated };
};

export const deleteWaterLog = (id) => {
  const logs = getWaterLogs();
  const updated = logs.filter(l => l.id !== id);
  safeStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(updated));
  return updated;
};

export const getMealLogs = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.MEAL_LOGS);
  if (!data) {
    const initial = getInitialMealLogs();
    safeStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const toggleMealLog = (mealId, notes = '') => {
  const logs = getMealLogs();
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const existingIdx = logs.findIndex(l => l.date === today && l.mealId === mealId);

  let updated;
  if (existingIdx >= 0) {
    // Toggle off
    updated = logs.filter((_, idx) => idx !== existingIdx);
  } else {
    // Add completed
    const entry = {
      id: 'm_' + Date.now(),
      date: today,
      mealId,
      completed: true,
      timeRecorded: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || 'Comida registrada',
    };
    updated = [entry, ...logs];
  }
  safeStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(updated));
  return updated;
};

export const getSleepLogs = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
  if (!data) {
    const initial = [
      { id: 's1', date: new Date().toISOString().split('T')[0], hours: 7.5, quality: 'Bueno', notes: 'Descansó sin dolor nocturno' }
    ];
    safeStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveSleepLog = (logData) => {
  const logs = getSleepLogs();
  const entry = {
    id: 's_' + Date.now(),
    date: logData.date || new Date().toISOString().split('T')[0],
    hours: Number(logData.hours),
    quality: logData.quality || 'Bueno',
    notes: logData.notes || '',
  };
  const filtered = logs.filter(l => l.date !== entry.date);
  const updated = [entry, ...filtered];
  safeStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(updated));
  return updated;
};

export const getFoodGuide = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.FOOD_GUIDE);
  if (!data) {
    safeStorage.setItem(STORAGE_KEYS.FOOD_GUIDE, JSON.stringify(INITIAL_FOOD_GUIDE));
    return INITIAL_FOOD_GUIDE;
  }
  return JSON.parse(data);
};

export const addFoodItem = (item) => {
  const guide = getFoodGuide();
  const newItem = {
    id: 'f_' + Date.now(),
    ...item
  };
  const updated = [newItem, ...guide];
  safeStorage.setItem(STORAGE_KEYS.FOOD_GUIDE, JSON.stringify(updated));
  return updated;
};

export const deleteFoodItem = (id) => {
  const guide = getFoodGuide();
  const updated = guide.filter(f => f.id !== id);
  safeStorage.setItem(STORAGE_KEYS.FOOD_GUIDE, JSON.stringify(updated));
  return updated;
};

export const getCareNotes = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.CARE_NOTES);
  if (!data) {
    safeStorage.setItem(STORAGE_KEYS.CARE_NOTES, JSON.stringify(INITIAL_CARE_NOTES));
    return INITIAL_CARE_NOTES;
  }
  return JSON.parse(data);
};

export const addCareNote = (message, author = 'Alejandro') => {
  const notes = getCareNotes();
  const entry = {
    id: 'cn_' + Date.now(),
    date: new Date().toISOString(),
    author,
    message,
    important: true,
  };
  const updated = [entry, ...notes];
  safeStorage.setItem(STORAGE_KEYS.CARE_NOTES, JSON.stringify(updated));
  return updated;
};

// Urine Color Scale Logs (Armstrong Scale)
export const getUrineLogs = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.URINE_LOGS);
  if (!data) {
    const today = new Date().toISOString().split('T')[0];
    const initial = [
      { id: 'u1', date: today, time: '09:00', level: 1, colorHex: '#FEF9C3', label: 'Excelente Dilución', advice: 'Orina transparente. Riesgo nulo de cristales.' },
      { id: 'u2', date: today, time: '12:30', level: 2, colorHex: '#FDE047', label: 'Buena Hidratación', advice: 'Equilibrio hídrico adecuado.' }
    ];
    safeStorage.setItem(STORAGE_KEYS.URINE_LOGS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const addUrineLog = ({ level, colorHex, label, advice }) => {
  const logs = getUrineLogs();
  const now = new Date();
  const entry = {
    id: 'u_' + Date.now(),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    level,
    colorHex,
    label,
    advice,
  };
  const updated = [entry, ...logs];
  safeStorage.setItem(STORAGE_KEYS.URINE_LOGS, JSON.stringify(updated));
  return updated;
};

export const deleteUrineLog = (id) => {
  const logs = getUrineLogs();
  const updated = logs.filter(l => l.id !== id);
  safeStorage.setItem(STORAGE_KEYS.URINE_LOGS, JSON.stringify(updated));
  return updated;
};

// Calculate hydration & meal streak in days
export const calculateStreak = (waterLogs = [], targetWaterMl = 3000) => {
  const dayTotals = {};
  waterLogs.forEach(l => {
    if (!dayTotals[l.date]) dayTotals[l.date] = 0;
    dayTotals[l.date] += Number(l.amountMl) || 0;
  });

  const dates = Object.keys(dayTotals).sort().reverse();
  if (dates.length === 0) return { streak: 1, todayTotal: 0, targetWaterMl, percentToday: 0 };

  const today = new Date().toISOString().split('T')[0];
  const todayTotal = dayTotals[today] || 0;

  let streak = 0;
  let checkDate = new Date();

  // If today goal is reached or in progress, count today
  for (let i = 0; i < 30; i++) {
    const dStr = checkDate.toISOString().split('T')[0];
    const total = dayTotals[dStr] || 0;
    // Consider goal reached if >= 80% (2400 ml) or 2500 ml
    if (total >= (targetWaterMl * 0.75) || (dStr === today && total >= 500)) {
      streak++;
    } else if (dStr !== today) {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return {
    streak: Math.max(1, streak),
    todayTotal,
    targetWaterMl
  };
};

// Symptom & Pain Logs
export const getSymptomLogs = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS);
  if (!data) {
    const today = new Date().toISOString().split('T')[0];
    const initial = [
      {
        id: 's_initial_1',
        date: today,
        time: '11:00',
        painLevel: 2,
        location: 'Fosa lumbar derecha',
        symptoms: ['Pesadez o molestia sorda'],
        notes: 'Molestia leve al iniciar la mañana. Disminuyó notablemente tras beber 500 ml de agua.',
        timestamp: Date.now() - 14400000,
      }
    ];
    safeStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const addSymptomLog = ({ painLevel, location, symptoms = [], notes = '' }) => {
  const logs = getSymptomLogs();
  const now = new Date();
  const entry = {
    id: 's_' + Date.now(),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    painLevel: Number(painLevel),
    location,
    symptoms,
    notes,
    timestamp: Date.now(),
  };
  const updated = [entry, ...logs];
  safeStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(updated));
  return updated;
};

export const deleteSymptomLog = (id) => {
  const logs = getSymptomLogs();
  const updated = logs.filter(l => l.id !== id);
  safeStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(updated));
  return updated;
};

// Cloud Configuration & Sync Helpers
export const getCloudConfig = () => {
  const data = safeStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG);
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
  const envKey = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) || '';
  const envRoom = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ROOM_ID) || 'brey_alejandro_salud';

  if (!data) {
    return {
      enabled: Boolean(envUrl && envKey),
      supabaseUrl: envUrl,
      supabaseAnonKey: envKey,
      tableName: 'breyhabitos_sync',
      roomId: envRoom,
      lastSyncedAt: null,
      autoSync: true,
    };
  }
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    supabaseUrl: parsed.supabaseUrl || envUrl,
    supabaseAnonKey: parsed.supabaseAnonKey || envKey,
    roomId: parsed.roomId || envRoom,
    enabled: parsed.enabled ?? Boolean(envUrl && envKey),
  };
};

export const saveCloudConfig = (config) => {
  const current = getCloudConfig();
  const updated = { ...current, ...config };
  safeStorage.setItem(STORAGE_KEYS.CLOUD_CONFIG, JSON.stringify(updated));
  return updated;
};

// Export and Import all local state for cloud sync
export const getAllAppData = () => {
  return {
    settings: JSON.parse(safeStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}'),
    waterLogs: JSON.parse(safeStorage.getItem(STORAGE_KEYS.WATER_LOGS) || '[]'),
    mealLogs: JSON.parse(safeStorage.getItem(STORAGE_KEYS.MEAL_LOGS) || '[]'),
    sleepLogs: JSON.parse(safeStorage.getItem(STORAGE_KEYS.SLEEP_LOGS) || '[]'),
    foodGuide: JSON.parse(safeStorage.getItem(STORAGE_KEYS.FOOD_GUIDE) || '[]'),
    careNotes: JSON.parse(safeStorage.getItem(STORAGE_KEYS.CARE_NOTES) || '[]'),
    urineLogs: JSON.parse(safeStorage.getItem(STORAGE_KEYS.URINE_LOGS) || '[]'),
    symptomLogs: JSON.parse(safeStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS) || '[]'),
    exportedAt: new Date().toISOString(),
  };
};

export const importAllAppData = (data) => {
  if (!data) return;
  if (data.settings && Object.keys(data.settings).length > 0) {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
  }
  if (Array.isArray(data.waterLogs)) {
    safeStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(data.waterLogs));
  }
  if (Array.isArray(data.mealLogs)) {
    safeStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(data.mealLogs));
  }
  if (Array.isArray(data.sleepLogs)) {
    safeStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(data.sleepLogs));
  }
  if (Array.isArray(data.foodGuide) && data.foodGuide.length > 0) {
    safeStorage.setItem(STORAGE_KEYS.FOOD_GUIDE, JSON.stringify(data.foodGuide));
  }
  if (Array.isArray(data.careNotes) && data.careNotes.length > 0) {
    safeStorage.setItem(STORAGE_KEYS.CARE_NOTES, JSON.stringify(data.careNotes));
  }
  if (Array.isArray(data.urineLogs)) {
    safeStorage.setItem(STORAGE_KEYS.URINE_LOGS, JSON.stringify(data.urineLogs));
  }
  if (Array.isArray(data.symptomLogs)) {
    safeStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(data.symptomLogs));
  }
};

// Theme preference management
export const getStoredTheme = () => {
  const stored = safeStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === 'dark' || stored === 'light') return stored;
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const saveStoredTheme = (theme) => {
  safeStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (typeof document !== 'undefined' && document.documentElement) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  return theme;
};

