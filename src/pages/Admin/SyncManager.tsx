import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, Settings, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { syncService } from '../../utils/syncService';
import type { SyncStatus, SyncConfig } from '../../utils/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function SyncManager() {
  const [status, setStatus] = useState<SyncStatus>(syncService.getStatus());
  const [config, setConfig] = useState<SyncConfig>(syncService.getConfig());
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const loadLastSync = async () => {
      const lastSync = await syncService.getLastSyncTime();
      setLastSyncTime(lastSync);
    };
    
    loadLastSync();
    
    const interval = setInterval(() => {
      setStatus(syncService.getStatus());
      setConfig(syncService.getConfig());
      loadLastSync();
    }, 5000); // Check every 5 seconds instead of every second

    return () => clearInterval(interval);
  }, []);

  const handleEnableSync = async () => {
    setLoading(true);
    try {
      syncService.enableSync({
        autoSync: config.autoSync,
        syncInterval: config.syncInterval
      });
      
      // Test initial de synchronisation
      await syncService.syncToCloud();
    } catch (error) {
      console.error('Erreur activation sync:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableSync = () => {
    syncService.disableSync();
  };

  const handleManualSync = async () => {
    setLoading(true);
    try {
      console.log('Starting manual sync...');
      const result = await syncService.smartSync();
      console.log('Sync result:', result);
      
      // Refresh last sync time after successful sync
      setTimeout(async () => {
        const lastSync = await syncService.getLastSyncTime();
        console.log('Refreshed last sync time:', lastSync);
        setLastSyncTime(lastSync);
      }, 1000);
    } catch (error) {
      console.error('Erreur sync manuelle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const result = await syncService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = async (field: keyof SyncConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    
    // Save sync interval to cloud settings
    if (field === 'syncInterval') {
      await syncService.setSetting('sync_interval', value, 'sync');
    }
    
    if (config.enabled) {
      syncService.enableSync(newConfig);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${config.enabled ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
              {config.enabled ? (
                <Cloud className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <CloudOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Synchronisation Cloud
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Synchronisation avec Supabase pour multi-appareils
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {status.isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm ${status.isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {status.isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* État de la synchronisation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Statut</span>
              {config.enabled ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {config.enabled ? 'Activé' : 'Désactivé'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dernière sync</span>
              <RefreshCw className={`w-5 h-5 ${status.syncInProgress ? 'animate-spin text-blue-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {lastSyncTime ? lastSyncTime.toLocaleString('fr-FR') : 'Jamais'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Modifications</span>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {status.pendingChanges}
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.autoSync}
                  onChange={(e) => handleConfigChange('autoSync', e.target.checked)}
                  className="rounded border-gray-300 text-gai-blue focus:ring-gai-blue"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Synchronisation automatique</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Intervalle (minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="60"
                value={config.syncInterval}
                onChange={(e) => handleConfigChange('syncInterval', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!config.enabled ? (
            <Button
              onClick={handleEnableSync}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Cloud className="w-4 h-4" />
              <span>Activer la synchronisation</span>
            </Button>
          ) : (
            <Button
              onClick={handleDisableSync}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <CloudOff className="w-4 h-4" />
              <span>Désactiver</span>
            </Button>
          )}

          <Button
            onClick={handleManualSync}
            disabled={loading || !config.enabled || !status.isOnline}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Synchroniser maintenant</span>
          </Button>

          <Button
            onClick={handleTestConnection}
            disabled={loading}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            {testResult === null ? (
              <Settings className="w-4 h-4" />
            ) : testResult ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span>Tester la connexion</span>
          </Button>
        </div>

        {/* Résultat du test */}
        {testResult !== null && (
          <div className={`p-4 rounded-lg ${testResult ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            <p className={`text-sm ${testResult ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {testResult ? '✅ Connexion Supabase réussie' : '❌ Impossible de se connecter à Supabase'}
            </p>
          </div>
        )}

        {/* Informations */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">ℹ️ Informations</h5>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Les données restent disponibles hors ligne</li>
            <li>• La synchronisation se fait automatiquement quand vous êtes en ligne</li>
            <li>• Vos données locales sont prioritaires en cas de conflit</li>
            <li>• Configuration requise: Variables d'environnement Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}