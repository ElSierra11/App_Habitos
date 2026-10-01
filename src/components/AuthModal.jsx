import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { getStoredUsers, saveUser } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient'); // 'patient' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerHaptic([15]);
    setError('');
    setSuccess('');

    const users = getStoredUsers();

    if (mode === 'login') {
      const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (!user) {
        setError('Credenciales incorrectas. Verifique su correo y contraseña.');
        return;
      }

      onLoginSuccess(user);
      onClose();
    } else {
      // Register
      if (!name.trim()) {
        setError('Por favor ingrese su nombre completo.');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe contener al menos 6 caracteres.');
        return;
      }

      const newUser = {
        id: 'user_' + Date.now(),
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        role,
        targetWaterMl: role === 'patient' ? 3000 : undefined,
        createdAt: new Date().toISOString(),
      };

      try {
        saveUser(newUser);
        setSuccess('Cuenta registrada exitosamente.');
        setTimeout(() => {
          onLoginSuccess(newUser);
          onClose();
        }, 600);
      } catch (err) {
        setError(err.message || 'Error al registrar usuario.');
      }
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic([10]);
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <img 
              src="/logo.png" 
              alt="BreyHabitos" 
              className="w-14 h-14 rounded-2xl shadow-md shadow-sky-500/20 ring-4 ring-sky-100 dark:ring-slate-800 object-contain mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-sky-100 dark:border-slate-700">
              {role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <HeartHandshake className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Acceso a BreyHabitos' : 'Registro de Cuenta'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            {mode === 'login'
              ? 'Ingrese sus credenciales para continuar con el seguimiento renal'
              : 'Cree una cuenta para personalizar sus metas y cuidados'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-sky-50/80 dark:bg-slate-800 p-1 rounded-2xl mb-5 border border-sky-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { 
              triggerHaptic([10]);
              setMode('login'); 
              setError(''); 
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-white shadow-sm border border-sky-200/60 dark:border-slate-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { 
              triggerHaptic([10]);
              setMode('register'); 
              setError(''); 
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-white shadow-sm border border-sky-200/60 dark:border-slate-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="flex items-center space-x-2 p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-sky-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Brey"
                  className="w-full pl-10 pr-4 py-2.5 bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-sky-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-sky-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full pl-10 pr-10 py-2.5 bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tipo de Cuenta</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                    role === 'patient'
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-200 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5 mb-1 text-sky-500" />
                  <span className="text-xs font-bold">Paciente</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Recuperación renal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                    role === 'admin'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mb-1 text-amber-500" />
                  <span className="text-xs font-bold">Cuidador / Admin</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Gestión y control</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>



      </div>
    </div>
  );
};
