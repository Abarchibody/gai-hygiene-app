import { useState, useEffect } from 'react';
import { Users, School, GraduationCap, Heart, Rocket, Bell } from 'lucide-react';
import { getStatistics } from '../utils/dataManager';


export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalParents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRelations: 0,
    totalReminders: 0,
    activeReminders: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const statistics = await getStatistics();
    setStats(statistics);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-600">Vue d'ensemble du système GAI Hygiène</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-blue mr-3">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Utilisateurs</h3>
              <p className="text-2xl font-bold text-gai-blue">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-green mr-3">
              <School className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Classes</h3>
              <p className="text-2xl font-bold text-gai-green">{stats.totalClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-orange mr-3">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Élèves Assignés</h3>
              <p className="text-2xl font-bold text-gai-orange">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-purple-500 mr-3">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Relations Parent-Élève</h3>
              <p className="text-2xl font-bold text-purple-500">{stats.totalRelations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-gai-orange mr-3">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Rappels d'Hygiène</h3>
              <p className="text-2xl font-bold text-gai-orange">{stats.totalReminders}</p>
            </div>
          </div>
        </div>
      </div>


      
      {/* Tests E2E */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md p-6 text-white mt-8">
        <h3 className="text-xl font-semibold mb-2 flex items-center">
          <Rocket className="w-6 h-6 mr-2" />
          Tests E2E Puppeteer
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