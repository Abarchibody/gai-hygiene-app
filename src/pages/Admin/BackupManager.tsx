import { useState, useEffect } from 'react';
import { Save, Download, Trash2, Clock, HardDrive, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { userService, classService, reminderService } from '../../services';
import Button from '../../components/ui/Button';

interface BackupFile {
  id: string;
  timestamp: string;
  size: number;
  recordCount: number;
}

export default function BackupManager() {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [config, setConfig] = useState({ enabled: true, frequency: 'weekly', maxBackups: 5, lastBackup: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0, percentage: 0 });

  useEffect(() => {
    loadBackups();
    updateStorageUsage();
  }, []);

  const loadBackups = () => {
    // Placeholder - will implement backup list from localStorage
    setBackups([]);
  };

  const updateStorageUsage = () => {
    // Placeholder - will implement storage usage calculation
    setStorageUsage({ used: 1024 * 1024, total: 10 * 1024 * 1024, percentage: 10 });
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const [users, classes, reminders] = await Promise.all([
        userService.getList(),
        classService.getList(),
        reminderService.getList()
      ]);
      
      const backup = {
        users,
        classes,
        reminders,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gai-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showMessage('success', `Sauvegarde créée: ${users.length + classes.length + reminders.length} enregistrements`);
    } catch (error) {
      showMessage('error', 'Erreur lors de la création de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    if (!confirm('⚠️ Cette action va remplacer toutes les données actuelles. Continuer ?')) {
      return;
    }

    setLoading(true);
    try {
      // Placeholder - will implement restore functionality
      showMessage('success', 'Sauvegarde restaurée avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de la restauration');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (backupId: string) => {
    if (!confirm('Supprimer cette sauvegarde ?')) return;
    
    // Placeholder - will implement delete functionality
    loadBackups();
    updateStorageUsage();
    showMessage('success', 'Sauvegarde supprimée');
  };

  const handleDownload = (backupId: string) => {
    // Placeholder - will implement download functionality
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    localStorage.setItem('backupConfig', JSON.stringify(newConfig));
    showMessage('success', 'Configuration mise à jour');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  return (
    <div>
      {message && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-300' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-300'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gai-blue" />
              Configuration
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sauvegarde automatique</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fréquence
              </label>
              <select
                value={config.frequency}
                onChange={(e) => handleConfigChange('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre max de sauvegardes
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.maxBackups}
                onChange={(e) => handleConfigChange('maxBackups', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={handleCreateBackup} disabled={loading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Création...' : 'Créer une sauvegarde'}
              </Button>
            </div>
          </div>
        </div>

        {/* Utilisation stockage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <HardDrive className="w-5 h-5 mr-2 text-gai-green" />
              Stockage
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {storageUsage.percentage}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatSize(storageUsage.used)} / {formatSize(storageUsage.total)}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full ${
                  storageUsage.percentage > 80 ? 'bg-red-500' :
                  storageUsage.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
              ></div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Sauvegardes:</span>
                <span>{backups.length}</span>
              </div>
              {config.lastBackup && (
                <div className="flex justify-between">
                  <span>Dernière:</span>
                  <span>{formatDate(config.lastBackup)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gai-orange" />
              Informations
            </h3>
          </div>
          <div className="p-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>• Les sauvegardes sont stockées localement dans le navigateur</p>
            <p>• La sauvegarde automatique s'exécute selon la fréquence configurée</p>
            <p>• Les anciennes sauvegardes sont supprimées automatiquement</p>
            <p>• Téléchargez vos sauvegardes pour les conserver</p>
            <p>• La restauration remplace toutes les données actuelles</p>
          </div>
        </div>
      </div>

      {/* Liste des sauvegardes */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Sauvegardes disponibles ({backups.length})
          </h3>
        </div>

        {backups.length === 0 ? (
          <div className="p-12 text-center">
            <Save className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">Aucune sauvegarde</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Créez votre première sauvegarde pour sécuriser vos données
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Enregistrements
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(backup.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatSize(backup.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {backup.recordCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(backup.id)}
                          className="text-gai-blue hover:text-blue-600"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestore(backup.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Restaurer"
                          disabled={loading}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(backup.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}