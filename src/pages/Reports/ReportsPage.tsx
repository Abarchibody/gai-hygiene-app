import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Users, Bell } from 'lucide-react';
import { db } from '../../db/schema';
import { useAuth } from '../../contexts/AuthContext';
import type { Reminder, User, Class, Notification } from '../../types';
import Button from '../../components/ui/Button';

interface ReportStats {
  totalReminders: number;
  activeReminders: number;
  totalNotifications: number;
  sentNotifications: number;
  readNotifications: number;
  usersByType: { [key: string]: number };
  remindersByCategory: { [key: string]: number };
  remindersByStatus: { [key: string]: number };
  notificationsByStatus: { [key: string]: number };
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReportStats>({
    totalReminders: 0,
    activeReminders: 0,
    totalNotifications: 0,
    sentNotifications: 0,
    readNotifications: 0,
    usersByType: {},
    remindersByCategory: {},
    remindersByStatus: {},
    notificationsByStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    if (user) {
      loadReportData();
    }
  }, [dateRange, user]);

  const loadReportData = async () => {
    if (!user) return;
    
    try {
      let reminders: Reminder[] = [];
      let users: User[] = [];
      let notifications: Notification[] = [];

      // Filter data based on user role and context
      if (user.role.canAccessAdmin) {
        // Admin sees all data
        [reminders, users, notifications] = await Promise.all([
          db.reminders.toArray(),
          db.users.toArray(),
          db.notifications.toArray()
        ]);
      } else if (user.type_utilisateur === 'Enseignant') {
        // Teacher sees their created reminders and related data
        const teacherClasses = await db.classes.where('enseignant_id').equals(user.id).toArray();
        const classIds = teacherClasses.map(c => c.id!);
        
        // Get students from their classes
        const classStudents = await db.students.where('classe_id').anyOf(classIds).toArray();
        const studentIds = classStudents.map(s => s.utilisateur_id);
        
        [reminders, notifications] = await Promise.all([
          db.reminders.where('createur_id').equals(user.id).toArray(),
          db.notifications.where('destinataire_id').anyOf([user.id, ...studentIds]).toArray()
        ]);
        
        // Get users related to teacher (their students + parents)
        const studentUsers = await db.users.where('id').anyOf(studentIds).toArray();
        const parentIds = classStudents.map(s => s.parent_id).filter(Boolean);
        const parentUsers = parentIds.length > 0 ? await db.users.where('id').anyOf(parentIds).toArray() : [];
        
        users = [user, ...studentUsers, ...parentUsers];
      } else if (user.type_utilisateur === 'Parent') {
        // Parent sees data related to their children
        const children = await db.students.where('parent_id').equals(user.id).toArray();
        const childIds = children.map(c => c.utilisateur_id);
        
        [notifications] = await Promise.all([
          db.notifications.where('destinataire_id').anyOf([user.id, ...childIds]).toArray()
        ]);
        
        // Get reminders assigned to their children
        const assignments = await db.reminder_assignments.where('utilisateur_id').anyOf(childIds).toArray();
        const reminderIds = assignments.map(a => a.rappel_id);
        
        if (reminderIds.length > 0) {
          reminders = await db.reminders.where('id').anyOf(reminderIds).toArray();
        }
        
        // Get users (parent + children)
        const childUsers = await db.users.where('id').anyOf(childIds).toArray();
        users = [user, ...childUsers];
      } else if (user.type_utilisateur === 'Élève') {
        // Student sees only their own data
        [notifications] = await Promise.all([
          db.notifications.where('destinataire_id').equals(user.id).toArray()
        ]);
        
        const assignments = await db.reminder_assignments.where('utilisateur_id').equals(user.id).toArray();
        const reminderIds = assignments.map(a => a.rappel_id);
        
        if (reminderIds.length > 0) {
          reminders = await db.reminders.where('id').anyOf(reminderIds).toArray();
        }
        
        users = [user];
      }

      // Calculer les statistiques
      const usersByType = users.reduce((acc, u) => {
        acc[u.type_utilisateur] = (acc[u.type_utilisateur] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const remindersByCategory = reminders.reduce((acc, reminder) => {
        acc[reminder.categorie] = (acc[reminder.categorie] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const remindersByStatus = reminders.reduce((acc, reminder) => {
        acc[reminder.statut] = (acc[reminder.statut] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const notificationsByStatus = notifications.reduce((acc, notification) => {
        acc[notification.status] = (acc[notification.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      setStats({
        totalReminders: reminders.length,
        activeReminders: reminders.filter(r => r.statut === 'Actif').length,
        totalNotifications: notifications.length,
        sentNotifications: notifications.filter(n => n.status === 'sent').length,
        readNotifications: notifications.filter(n => n.status === 'read').length,
        usersByType,
        remindersByCategory,
        remindersByStatus,
        notificationsByStatus
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      period: `${dateRange} derniers jours`,
      statistics: stats
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-gai-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Chargement des rapports...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role.canAccessAdmin
              ? 'Analyse des données d\'hygiène et performance du système'
              : user?.type_utilisateur === 'Enseignant'
              ? 'Analyse de vos rappels et de l\'activité de vos élèves'
              : user?.type_utilisateur === 'Parent'
              ? 'Suivi de l\'hygiène de vos enfants'
              : 'Analyse de votre progression en hygiène'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
            <option value="365">1 an</option>
          </select>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-gai-orange mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {user?.type_utilisateur === 'Enseignant' ? 'Mes Rappels' : 'Rappels Actifs'}
              </h3>
              <p className="text-2xl font-bold text-gai-orange">{stats.activeReminders}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.type_utilisateur === 'Enseignant' ? 'créés' : `sur ${stats.totalReminders} total`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Taux d'envoi</h3>
              <p className="text-2xl font-bold text-blue-500">
                {getPercentage(stats.sentNotifications, stats.totalNotifications)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stats.sentNotifications} envoyées</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Taux de lecture</h3>
              <p className="text-2xl font-bold text-green-500">
                {getPercentage(stats.readNotifications, stats.sentNotifications)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stats.readNotifications} lues</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {user?.type_utilisateur === 'Enseignant' ? 'Mes Élèves' 
                 : user?.type_utilisateur === 'Parent' ? 'Mes Enfants'
                 : 'Utilisateurs'}
              </h3>
              <p className="text-2xl font-bold text-purple-500">
                {Object.values(stats.usersByType).reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.type_utilisateur === 'Parent' ? 'enfants' : 'actifs'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Répartition par catégorie */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-gai-blue" />
              {user?.type_utilisateur === 'Enseignant' ? 'Mes rappels par catégorie'
               : user?.type_utilisateur === 'Parent' ? 'Rappels de mes enfants'
               : 'Rappels par catégorie'}
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(stats.remindersByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{category}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                      <div 
                        className="bg-gai-blue h-2 rounded-full" 
                        style={{ width: `${getPercentage(count, stats.totalReminders)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statuts des rappels */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-gai-green" />
              Statuts des rappels
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(stats.remindersByStatus).map(([status, count]) => {
                const color = status === 'Actif' ? 'bg-green-500' : 
                             status === 'Inactif' ? 'bg-gray-500' : 'bg-red-500';
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{status}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                        <div 
                          className={`${color} h-2 rounded-full`}
                          style={{ width: `${getPercentage(count, stats.totalReminders)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Répartition des utilisateurs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Utilisateurs par type
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(stats.usersByType).map(([type, count]) => {
                const color = type === 'Élève' ? 'bg-blue-500' : 
                             type === 'Parent' ? 'bg-green-500' : 
                             type === 'Enseignant' ? 'bg-purple-500' : 'bg-gray-500';
                const total = Object.values(stats.usersByType).reduce((a, b) => a + b, 0);
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{type}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                        <div 
                          className={`${color} h-2 rounded-full`}
                          style={{ width: `${getPercentage(count, total)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance des notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-gai-orange" />
              Performance notifications
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(stats.notificationsByStatus).map(([status, count]) => {
                const color = status === 'sent' ? 'bg-blue-500' : 
                             status === 'read' ? 'bg-green-500' : 
                             status === 'failed' ? 'bg-red-500' : 'bg-yellow-500';
                const label = status === 'sent' ? 'Envoyées' :
                             status === 'read' ? 'Lues' :
                             status === 'failed' ? 'Échecs' : 'En attente';
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{label}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                        <div 
                          className={`${color} h-2 rounded-full`}
                          style={{ width: `${getPercentage(count, stats.totalNotifications)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {user?.type_utilisateur === 'Enseignant' ? 'Conseils pour vos élèves'
           : user?.type_utilisateur === 'Parent' ? 'Conseils pour vos enfants'
           : user?.role.canAccessAdmin ? 'Recommandations d\'amélioration'
           : 'Conseils personnalisés'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              • <strong>Taux de lecture :</strong> {getPercentage(stats.readNotifications, stats.sentNotifications)}% 
              {getPercentage(stats.readNotifications, stats.sentNotifications) < 70 && 
                <span className="text-orange-600">
                  {user?.type_utilisateur === 'Parent' ? ' - Encouragez vos enfants' : ' - Améliorer l\'engagement'}
                </span>}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              • <strong>
                {user?.type_utilisateur === 'Enseignant' ? 'Mes rappels' : 'Rappels actifs'}
              :</strong> {stats.activeReminders} sur {stats.totalReminders}
              {getPercentage(stats.activeReminders, stats.totalReminders) < 80 && 
                <span className="text-orange-600">
                  {user?.type_utilisateur === 'Enseignant' ? ' - Créer plus de rappels' : ' - Activer plus de rappels'}
                </span>}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              • <strong>
                {user?.type_utilisateur === 'Parent' ? 'Enfants' : 'Couverture'}
              :</strong> {Object.values(stats.usersByType).reduce((a, b) => a + b, 0)} 
              {user?.type_utilisateur === 'Parent' ? ' enfants' : ' utilisateurs actifs'}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              • <strong>Catégories :</strong> {Object.keys(stats.remindersByCategory).length} types de rappels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}