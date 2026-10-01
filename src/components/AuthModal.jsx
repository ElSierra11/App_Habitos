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
  EyeOff,
  QrCode,
  Loader2,
  Smartphone
} from 'lucide-react';
import { getStoredUsers, saveUser, ADMIN_EMAIL, getCloudConfig, getAllAppData, importAllAppData } from '../utils/storage';
import { pullFromCloud, pushToCloud, mergeAppData } from '../utils/cloudSync';
import { triggerHaptic } from '../utils/haptics';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, onOpenDeviceSync }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCheckingCloud, setIsCheckingCloud] = useState(false);
  const [showCrossDeviceHelp, setShowCrossDeviceHelp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    triggerHaptic([15]);
    setError('');
    setSuccess('');
    setShowCrossDeviceHelp(false);

    let users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (mode === 'login') {
      let user = users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password
      );

      // If user not found locally, attempt to pull latest users from cloud if cloud is enabled
      if (!user) {
        const cloudConfig = getCloudConfig();
        if (cloudConfig?.enabled) {
          setIsCheckingCloud(true);
          try {
            const pullRes = await pullFromCloud(cloudConfig);
            if (pullRes.success && pullRes.cloudData) {
              const localData = getAllAppData();
              const merged = mergeAppData(localData, pullRes.cloudData);
              importAllAppData(merged);
              users = getStoredUsers();
              user = users.find(
                (u) => u.email.toLowerCase() === cleanEmail && u.password === password
              );
            }
          } catch {
            // cloud pull error handled silently
          } finally {
            setIsCheckingCloud(false);
          }
        }
      }

      if (!user) {
        setError('Credenciales incorrectas. Verifique su correo y contraseña.');
        setShowCrossDeviceHelp(true);
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

      const isTargetAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
      const assignedRole = isTargetAdmin ? 'admin' : 'patient';

      const newUser = {
        id: 'user_' + Date.now(),
        email: cleanEmail,
        password,
        name: name.trim(),
        role: assignedRole,
        targetWaterMl: assignedRole === 'patient' ? 3000 : undefined,
        createdAt: new Date().toISOString(),
      };

      try {
        saveUser(newUser);
        
        // If cloud sync is enabled, immediately push new user to cloud so other devices have it
        const cloudConfig = getCloudConfig();
        if (cloudConfig?.enabled) {
          pushToCloud(cloudConfig, getAllAppData()).catch(err => {
            console.warn('Could not auto-push new user to cloud:', err);
          });
        }

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
              {email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              ) : (
                <HeartHandshake className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              )}
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



          {showCrossDeviceHelp && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-xs">
              <div className="flex items-start space-x-2 text-amber-900 dark:text-amber-200 font-bold">
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>¿Te registraste desde tu computador?</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                El navegador de este teléfono no tiene tus cuentas creadas en el computador hasta que las vincules una sola vez.
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic([15]);
                  onClose();
                  if (onOpenDeviceSync) onOpenDeviceSync();
                }}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Vincular Celular con Código QR o Enlace</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isCheckingCloud}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {isCheckingCloud ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Comprobando cuenta en la nube...</span>
              </span>
            ) : mode === 'login' ? (
              'Iniciar Sesión'
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Cross-device link footer */}
        <div className="pt-3 text-center border-t border-sky-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
              if (onOpenDeviceSync) onOpenDeviceSync();
            }}
            className="text-xs text-sky-700 dark:text-sky-400 hover:underline font-semibold inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-500" />
            <span>¿Te registraste en PC? Vincular con código QR</span>
          </button>
        </div>

      </div>
    </div>
  );
};
