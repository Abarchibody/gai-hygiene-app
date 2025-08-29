import { useState, useEffect } from 'react';
import { Bell, TrendingUp, Users, Calendar, BarChart3, Heart } from 'lucide-react';
import { authService } from '../services';
import type { Reminder, Notification } from '../types';

interface DashboardStats {
  activeReminders: number;
  todayNotifications: number;
  weeklyProgress: number;
  upcomingEvents: number;
  remindersByCategory: { [key: string]: number };
  recentActivity: Array<{
    type: string;
    message: string;
    time: string;
  }>;
}

export default function Dashboard() {
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState<DashboardStats>({
    activeReminders: 0,
    todayNotifications: 0,
    weeklyProgress: 0,
    upcomingEvents: 0,
    remindersByCategory: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      let reminders: Reminder[] = [];
      let notifications: Notification[] = [];
      let events: any[] = [];

      // Placeholder data for now - will be replaced with service calls
      setStats({
        activeReminders: 8,
        todayNotifications: 3,
        weeklyProgress: 75,
        upcomingEvents: 2,
        remindersByCategory: {
          'Lavage mains': 3,
          'Brossage dents': 2,
          'Hygiène corporelle': 2,
          'Personnalisé': 1
        },
        recentActivity: [
          { type: 'notification', message: 'Rappel "Lavage des mains" envoyé', time: '14:30' },
          { type: 'notification', message: 'Rappel "Brossage des dents" programmé', time: '08:00' }
        ]
      });
      setLoading(false);
      return;


    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400">
          {user?.type_utilisateur === 'Admin'
            ? 'Vue d\'ensemble du système GAI Hygiène'
            : user?.type_utilisateur === 'Enseignant'
            ? 'Suivi de vos rappels et classes'
            : user?.type_utilisateur === 'Parent'
            ? 'Suivi de l\'hygiène de vos enfants'
            : 'Suivi de vos pratiques d\'hygiène quotidiennes'
          }
        </p>
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
                {user?.type_utilisateur === 'Enseignant' ? 'créés' : 'en cours'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Aujourd'hui</h3>
              <p className="text-2xl font-bold text-blue-500">{stats.todayNotifications}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">notifications</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Progrès Semaine</h3>
              <p className="text-2xl font-bold text-green-500">{stats.weeklyProgress}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">complété</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Événements</h3>
              <p className="text-2xl font-bold text-purple-500">{stats.upcomingEvents}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">à venir</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rappels par catégorie */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-gai-blue" />
              {user?.type_utilisateur === 'Enseignant' 
                ? 'Rappels que j\'ai créés'
                : user?.type_utilisateur === 'Parent'
                ? 'Rappels de mes enfants'
                : 'Mes rappels d\'hygiène'
              }
            </h3>
          </div>
          <div className="p-6">
            {Object.keys(stats.remindersByCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.remindersByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{category}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                        <div 
                          className="bg-gai-blue h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (count / Math.max(...Object.values(stats.remindersByCategory))) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-6">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Aucun rappel actif pour le moment
              </p>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Users className="w-5 h-5 mr-2 text-gai-green" />
              {user?.type_utilisateur === 'Parent' 
                ? 'Activité de mes enfants'
                : 'Mon activité récente'
              }
            </h3>
          </div>
          <div className="p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{activity.message}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Message d'encouragement */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Continuez vos bonnes habitudes ! 🌟
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {user?.type_utilisateur === 'Enseignant'
            ? stats.activeReminders > 0
              ? `Vous avez créé ${stats.activeReminders} rappel${stats.activeReminders > 1 ? 's' : ''} actif${stats.activeReminders > 1 ? 's' : ''} pour vos élèves.`
              : "Créez des rappels personnalisés pour aider vos élèves à développer de bonnes habitudes."
            : user?.type_utilisateur === 'Parent'
            ? stats.weeklyProgress >= 80
              ? "Excellent ! Vos enfants maintiennent de très bonnes pratiques d'hygiène."
              : "Encouragez vos enfants à suivre leurs rappels quotidiens."
            : stats.weeklyProgress >= 80 
            ? "Excellent travail ! Vous maintenez de très bonnes pratiques d'hygiène."
            : stats.weeklyProgress >= 60
            ? "Bon progrès ! Continuez à suivre vos rappels quotidiens."
            : "Chaque petit geste compte. Suivez vos rappels pour améliorer vos habitudes."
          }
        </p>
      </div>
    </div>
  );
}