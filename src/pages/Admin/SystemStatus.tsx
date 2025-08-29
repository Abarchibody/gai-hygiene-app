import { useState, useEffect } from 'react';
import { Activity, Database, Bell, Users, School, CheckCircle, AlertTriangle } from 'lucide-react';
import { db } from '../../db/schema';
import { getStatistics } from '../../utils/dataManager';

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  notifications: 'healthy' | 'warning' | 'error';
  permissions: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
}

export default function SystemStatus() {
  const [health, setHealth] = useState<SystemHealth>({
    database: 'healthy',
    notifications: 'healthy',
    permissions: 'healthy',
    storage: 'healthy'
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalReminders: 0,
    totalNotifications: 0,
    activeReminders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      // Test base de données
      const statistics = await getStatistics();
      setStats(statistics);
      
      const dbHealth = statistics.totalUsers > 0 ? 'healthy' : 'warning';
      
      // Test notifications
      const notifPermission = Notification.permission;
      const notifHealth = notifPermission === 'granted' ? 'healthy' : 
                         notifPermission === 'denied' ? 'error' : 'warning';
      
      // Test permissions
      const permHealth = notifPermission === 'granted' ? 'healthy' : 'warning';
      
      // Test stockage
      let storageHealth: 'healthy' | 'warning' | 'error' = 'healthy';
      try {
        localStorage.setItem('test', 'ok');
        localStorage.removeItem('test');
      } catch {
        storageHealth = 'error';
      }
      
      setHealth({
        database: dbHealth,
        notifications: notifHealth,
        permissions: permHealth,
        storage: storageHealth
      });
      
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setHealth({
        database: 'error',
        notifications: 'error',
        permissions: 'error',
        storage: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
    }
  };

  const getHealthIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getHealthText = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'Opérationnel';
      case 'warning': return 'Attention';
      case 'error': return 'Erreur';
    }
  };

  const overallHealth = Object.values(health).every(h => h === 'healthy') ? 'healthy' :
                       Object.values(health).some(h => h === 'error') ? 'error' : 'warning';

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-gai-blue" />
          État du Système
          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getHealthColor(overallHealth)}`}>
            {getHealthIcon(overallHealth)}
            <span className="ml-1">{getHealthText(overallHealth)}</span>
          </span>
        </h3>
      </div>

      <div className="p-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center">
            <Users className="w-6 h-6 text-gai-blue mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.totalUsers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Utilisateurs</div>
          </div>
          <div className="text-center">
            <School className="w-6 h-6 text-gai-green mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.totalClasses}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Classes</div>
          </div>
          <div className="text-center">
            <Bell className="w-6 h-6 text-gai-orange mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.totalReminders}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Rappels</div>
          </div>
          <div className="text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.activeReminders}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Actifs</div>
          </div>
          <div className="text-center">
            <Database className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.totalNotifications}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Notifications</div>
          </div>
        </div>

        {/* État des composants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
              <span className="font-medium text-gray-800 dark:text-white">Base de données IndexedDB</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getHealthColor(health.database)}`}>
              {getHealthIcon(health.database)}
              <span className="ml-1">{getHealthText(health.database)}</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
              <span className="font-medium text-gray-800 dark:text-white">Système de notifications</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getHealthColor(health.notifications)}`}>
              {getHealthIcon(health.notifications)}
              <span className="ml-1">{getHealthText(health.notifications)}</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
              <span className="font-medium text-gray-800 dark:text-white">Permissions navigateur</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getHealthColor(health.permissions)}`}>
              {getHealthIcon(health.permissions)}
              <span className="ml-1">{getHealthText(health.permissions)}</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
              <span className="font-medium text-gray-800 dark:text-white">Stockage local</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getHealthColor(health.storage)}`}>
              {getHealthIcon(health.storage)}
              <span className="ml-1">{getHealthText(health.storage)}</span>
            </span>
          </div>
        </div>

        {/* Recommandations */}
        {overallHealth !== 'healthy' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-800 mb-2">Recommandations :</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {health.database !== 'healthy' && (
                <li>• Exécuter le seed des données de test depuis l'administration</li>
              )}
              {health.notifications !== 'healthy' && (
                <li>• Autoriser les notifications dans les paramètres du navigateur</li>
              )}
              {health.permissions !== 'healthy' && (
                <li>• Vérifier les permissions dans les paramètres du site</li>
              )}
              {health.storage !== 'healthy' && (
                <li>• Vérifier que le stockage local n'est pas désactivé</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}