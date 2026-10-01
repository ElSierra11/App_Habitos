import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BreyHabitos Error Boundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  handleResetSession = () => {
    try {
      localStorage.removeItem('breyhabitos_current_user');
    } catch (e) {
      console.warn(e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800 shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>
            
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              BreyHabitos se recuperó con seguridad
            </h1>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Hubo una interrupción visual, pero no te preocupes: todos tus registros de agua y hábitos continúan guardados intactos.
            </p>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Volver a Cargar BreyHabitos</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetSession}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Restablecer y Entrar al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
