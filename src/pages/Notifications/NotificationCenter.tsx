import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, Settings, Smartphone, Download } from 'lucide-react';
import { db } from '../../db/schema';
import { notificationService } from '../../utils/notificationService';
import { pwaService } from '../../utils/pwaService';
import type { Notification } from '../../types';
import Button from '../../components/ui/Button';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    read: 0,
    failed: 0
  });
  const [pwaInstallable, setPwaInstallable] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    loadNotifications();
    checkPermission();
    checkPWAStatus();
  }, []);

  const checkPWAStatus = async () => {
    setPwaInstallable(pwaService.isInstallable());
    const registered = await pwaService.registerServiceWorker();
    setSwRegistered(registered);
  };

  const loadNotifications = async () => {
    try {
      const allNotifications = await db.notifications
        .orderBy('scheduled_at')
        .reverse()
        .limit(50)
        .toArray();
      
      setNotifications(allNotifications);

      // Utiliser la nouvelle méthode du service
      const statsData = await notificationService.getNotificationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
  };

  const startScheduler = () => {
    notificationService.startNotificationScheduler();
  };

  const testNotification = async () => {
    const success = await notificationService.sendTestNotification();
    if (success) {
      // Recharger les statistiques après le test
      setTimeout(loadNotifications, 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'sent': return <Bell className="w-4 h-4" />;
      case 'read': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400">Centre de gestion des notifications automatisées</p>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-yellow-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Envoyées</p>
              <p className="text-xl font-bold text-blue-600">{stats.sent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lues</p>
              <p className="text-xl font-bold text-green-600">{stats.read}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Échecs</p>
              <p className="text-xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gai-blue" />
            Configuration des notifications
          </h3>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Permissions navigateur</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Statut : 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  permission === 'granted' ? 'bg-green-100 text-green-800' :
                  permission === 'denied' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {permission === 'granted' ? 'Accordées' :
                   permission === 'denied' ? 'Refusées' : 'Non demandées'}
                </span>
              </p>
            </div>
            {permission !== 'granted' && (
              <Button onClick={requestPermission}>
                Autoriser les notifications
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={testNotification}>
              Tester une notification
            </Button>
            <Button onClick={startScheduler}>
              Démarrer le planificateur
            </Button>
            <Button variant="secondary" onClick={loadNotifications}>
              Actualiser
            </Button>
            {pwaInstallable && (
              <Button variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                Installer l'app
              </Button>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center text-sm text-blue-800 dark:text-blue-300">
              <Smartphone className="w-4 h-4 mr-2" />
              <span>
                Service Worker : 
                <span className={swRegistered ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {swRegistered ? 'Actif' : 'Inactif'}
                </span>
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {swRegistered ? 'Notifications en arrière-plan activées' : 'Notifications limitées à l\'onglet actif'}
            </p>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Historique des notifications (50 dernières)
          </h3>
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">Aucune notification</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Les notifications apparaîtront ici une fois les rappels programmés.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getStatusIcon(notification.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{notification.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Programmée : {notification.scheduled_at.toLocaleString('fr-FR')}</span>
                        {notification.sent_at && (
                          <span>Envoyée : {notification.sent_at.toLocaleString('fr-FR')}</span>
                        )}
                        {notification.read_at && (
                          <span>Lue : {notification.read_at.toLocaleString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                    {notification.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}