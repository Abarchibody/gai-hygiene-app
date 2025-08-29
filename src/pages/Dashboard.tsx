import { useState, useEffect } from 'react';
import { Users, School, GraduationCap, Heart, Rocket, Bell, Database, Calendar } from 'lucide-react';
import { getStatistics } from '../utils/dataManager';
import { seedDatabase } from '../db/seedData';
import Button from '../components/ui/Button';


export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalParents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRelations: 0,
    totalReminders: 0,
    activeReminders: 0,
    totalEvents: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const statistics = await getStatistics();
    setStats(statistics);
  };

  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      await seedDatabase();
      await loadStats();
      alert('Données de test chargées avec succès !');
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400">Vue d'ensemble du système GAI Hygiène</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-blue mr-3">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Utilisateurs</h3>
              <p className="text-2xl font-bold text-gai-blue">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-green mr-3">
              <School className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Classes</h3>
              <p className="text-2xl font-bold text-gai-green">{stats.totalClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-orange mr-3">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Élèves Assignés</h3>
              <p className="text-2xl font-bold text-gai-orange">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-purple-500 mr-3">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Relations Parent-Élève</h3>
              <p className="text-2xl font-bold text-purple-500">{stats.totalRelations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-orange mr-3">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Rappels d'Hygiène</h3>
              <p className="text-2xl font-bold text-gai-orange">{stats.totalReminders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-indigo-500 mr-3">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Événements</h3>
              <p className="text-2xl font-bold text-indigo-500">{stats.totalEvents}</p>
            </div>
          </div>
        </div>
      </div>


      
      {/* Chargement des données */}
      {stats.totalUsers === 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md p-6 text-white mb-8">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Database className="w-6 h-6 mr-2" />
            Base de données vide
          </h3>
          <p className="mb-4 opacity-90">
            Aucune donnée détectée. Chargez les données de test pour commencer.
          </p>
          <Button 
            onClick={handleSeedDatabase}
            disabled={loading}
            className="bg-white text-orange-600 hover:bg-gray-100"
          >
            <Database className="w-4 h-4 mr-2" />
            {loading ? 'Chargement...' : 'Charger les données de test'}
          </Button>
        </div>
      )}

      {/* Tests E2E */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md p-6 text-white mt-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center">
          <Rocket className="w-6 h-6 mr-2" />
          Tests E2E Playwright
        </h3>
        <p className="mb-4 opacity-90">
          Démonstration automatique avec navigateur réel.
        </p>
        <div className="flex items-center space-x-4">
          <span className="text-green-300 font-medium">✅ Application - OPÉRATIONNELLE</span>
          <code className="bg-black bg-opacity-30 px-2 py-1 rounded text-sm">npm run test:e2e</code>
        </div>
      </div>
    </div>
  );
}