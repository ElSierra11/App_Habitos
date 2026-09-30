import React, { useState } from 'react';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Database, 
  Copy, 
  Check, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { testCloudConnection, pushToCloud, pullFromCloud, mergeAppData, SUPABASE_SQL_SETUP } from '../utils/cloudSync';
import { getAllAppData, importAllAppData } from '../utils/storage';

export const CloudSyncModal = ({
  isOpen,
  onClose,
  cloudConfig,
  onSaveCloudConfig,
  onDataSynced
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(cloudConfig?.supabaseUrl || '');
  const [anonKey, setAnonKey] = useState(cloudConfig?.supabaseAnonKey || '');
  const [tableName, setTableName] = useState(cloudConfig?.tableName || 'breyhabitos_sync');
  const [roomId, setRoomId] = useState(cloudConfig?.roomId || 'brey_alejandro_salud');
  const [autoSync, setAutoSync] = useState(cloudConfig?.autoSync !== false);

  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showGuide, setShowGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMsg(null);
    triggerHaptic([20]);

    const cfg = {
      supabaseUrl: url.trim(),
      supabaseAnonKey: anonKey.trim(),
      tableName: tableName.trim() || 'breyhabitos_sync',
      roomId: roomId.trim() || 'brey_alejandro_salud'
    };

    const res = await testCloudConnection(cfg);
    setTesting(false);

    if (res.success) {
      triggerHaptic([20, 50]);
      setStatusMsg({ type: 'success', text: '¡Conexión exitosa con Supabase! Tabla encontrada y lista.' });
    } else {
      triggerHaptic([40, 80]);
      setStatusMsg({ type: 'error', text: res.error });
    }
  };

  const handleSaveAndSync = async (e) => {
    e.preventDefault();
    setSyncing(true);
    setStatusMsg(null);
    triggerHaptic([20, 40]);

    const updatedConfig = {
      ...cloudConfig,
      enabled: Boolean(url.trim() && anonKey.trim()),
      supabaseUrl: url.trim(),
      supabaseAnonKey: anonKey.trim(),
      tableName: tableName.trim() || 'breyhabitos_sync',
      roomId: roomId.trim() || 'brey_alejandro_salud',
      autoSync,
      lastSyncedAt: new Date().toISOString()
    };

    // 1. Save config
    onSaveCloudConfig(updatedConfig);

    if (!updatedConfig.enabled) {
      setSyncing(false);
      setStatusMsg({ type: 'success', text: 'Modo local guardado (Sincronización en la nube desactivada).' });
      return;
    }

    // 2. Perform bidirectional sync
    try {
      const localData = getAllAppData();
      const pullRes = await pullFromCloud(updatedConfig);

      let finalData = localData;

      if (pullRes.success && pullRes.cloudData) {
        // Merge cloud with local
        finalData = mergeAppData(localData, pullRes.cloudData);
        importAllAppData(finalData);
      }

      // Push final merged data to cloud
      const pushRes = await pushToCloud(updatedConfig, finalData);

      setSyncing(false);

      if (pushRes.success) {
        triggerHaptic([20, 60]);
        setStatusMsg({ type: 'success', text: '¡Sincronización completa! Ambos dispositivos están al día.' });
        if (onDataSynced) onDataSynced(finalData);
      } else {
        setStatusMsg({ type: 'error', text: 'Error al enviar datos: ' + (pushRes.error || 'Verifica credenciales') });
      }
    } catch (err) {
      setSyncing(false);
      setStatusMsg({ type: 'error', text: 'Error inesperado: ' + err.message });
    }
  };

  const handleCopySql = () => {
    triggerHaptic([15]);
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-sky-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-5 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                Sincronización en la Nube
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                Conecta el celular de Brey con la PC/celular de Alejandro
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
          cloudConfig?.enabled && cloudConfig?.supabaseUrl
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
            : 'bg-sky-50 dark:bg-slate-800/80 border-sky-200 dark:border-slate-700 text-sky-900 dark:text-sky-300'
        }`}>
          <div className="flex items-center space-x-2.5">
            {cloudConfig?.enabled ? (
              <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
            ) : (
              <CloudOff className="w-4 h-4 text-sky-600 dark:text-slate-400 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {cloudConfig?.enabled ? 'Nube Conectada y Activa' : 'Modo Solo Local (LocalStorage)'}
              </span>
              <span className="text-[11px] opacity-80">
                {cloudConfig?.lastSyncedAt 
                  ? `Última sincronización: ${new Date(cloudConfig.lastSyncedAt).toLocaleTimeString()}`
                  : 'Sin sincronización remota aún'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center space-x-1 font-bold text-sky-700 dark:text-sky-400 hover:underline shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guía</span>
            {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Step-by-step Setup Guide */}
        {showGuide && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-700 dark:text-slate-300 space-y-3 animate-fadeIn">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Cómo conectar Supabase gratis en 3 pasos:</span>
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-slate-600 dark:text-slate-300">
              <li>Crea un proyecto gratis en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 font-bold underline">supabase.com</a>.</li>
              <li>Ve a <strong>SQL Editor</strong>, pega el script de abajo y presiona <strong>Run</strong>.</li>
              <li>Ve a <strong>Project Settings &gt; API</strong>, copia tu <em>Project URL</em> y <em>anon key</em> aquí debajo y guarda.</li>
            </ol>

            <div className="relative">
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] overflow-x-auto font-mono max-h-32">
                {SUPABASE_SQL_SETUP}
              </pre>
              <button
                type="button"
                onClick={handleCopySql}
                className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold flex items-center space-x-1 shadow-sm cursor-pointer"
              >
                {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSaveAndSync} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px]">
              URL de Supabase (Project URL)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px]">
              Supabase Anon Public Key (anon public)
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px]">
                Nombre de Tabla
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px]">
                Código de Sala Compartido
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <label className="flex items-center space-x-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500"
            />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Sincronizar automáticamente en segundo plano cada 30 segundos
            </span>
          </label>

          {/* Feedback message */}
          {statusMsg && (
            <div className={`p-3 rounded-xl border flex items-start space-x-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="font-semibold text-xs leading-tight">{statusMsg.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !url.trim() || !anonKey.trim()}
              className="px-3.5 py-2.5 rounded-xl border border-sky-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
            </button>

            <button
              type="submit"
              disabled={syncing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-indigo-700 transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
            >
              {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{syncing ? 'Sincronizando...' : 'Guardar y Sincronizar'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
