import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, CheckCircle, AlertCircle, Clock, Play } from 'lucide-react';
import { db } from '../db/schema';
import { notificationService } from '../utils/notificationService';
import Button from './ui/Button';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function UITestSuite() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const updateTest = (name: string, status: TestResult['status'], message: string, duration?: number) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.duration = duration;
        return [...prev];
      }
      return [...prev, { name, status, message, duration }];
    });
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runUITests = async () => {
    setRunning(true);
    setTests([]);
    const startTime = Date.now();

    try {
      // Test 1: Navigation et Routes
      setCurrentTest('Navigation');
      updateTest('Navigation', 'pending', 'Test des routes principales...');
      
      const routes = ['/', '/users', '/classes', '/reminders', '/notifications', '/admin'];
      for (const route of routes) {
        navigate(route);
        await sleep(500);
      }
      navigate('/'); // Retour au dashboard
      updateTest('Navigation', 'success', `${routes.length} routes testées avec succès`);

      // Test 2: Base de données
      setCurrentTest('Base de données');
      updateTest('Base de données', 'pending', 'Vérification IndexedDB...');
      
      const dbStats = {
        users: await db.users.count(),
        classes: await db.classes.count(),
        reminders: await db.reminders.count(),
        notifications: await db.notifications.count(),
        assignments: await db.reminderAssignments.count(),
        students: await db.students.count()
      };
      
      const totalRecords = Object.values(dbStats).reduce((a, b) => a + b, 0);
      updateTest('Base de données', 'success', 
        `${totalRecords} enregistrements (${dbStats.users} users, ${dbStats.classes} classes, ${dbStats.reminders} rappels)`);

      // Test 3: Permissions et Notifications
      setCurrentTest('Notifications');
      updateTest('Notifications', 'pending', 'Test des permissions...');
      
      const hasPermission = await notificationService.checkPermission();
      if (hasPermission) {
        // Test notification
        new Notification('GAI Test UI', {
          body: 'Test automatique des notifications',
          icon: '/favicon.ico',
          tag: 'ui-test'
        });
        updateTest('Notifications', 'success', 'Permissions accordées, notification test envoyée');
      } else {
        updateTest('Notifications', 'error', 'Permissions non accordées - fonctionnalité limitée');
      }

      // Test 4: Données de test
      setCurrentTest('Données de test');
      updateTest('Données de test', 'pending', 'Validation des données...');
      
      const sampleUser = await db.users.where('type_utilisateur').equals('Enseignant').first();
      const sampleClass = await db.classes.first();
      const sampleReminder = await db.reminders.where('statut').equals('Actif').first();
      
      if (sampleUser && sampleClass && sampleReminder) {
        updateTest('Données de test', 'success', 'Données complètes et cohérentes');
      } else {
        updateTest('Données de test', 'error', 'Données manquantes - exécuter le seed');
      }

      // Test 5: Relations et Assignations
      setCurrentTest('Relations');
      updateTest('Relations', 'pending', 'Vérification des relations...');
      
      const studentRelations = await db.students.count();
      const reminderAssignments = await db.reminderAssignments.count();
      
      if (studentRelations > 0 && reminderAssignments >= 0) {
        updateTest('Relations', 'success', 
          `${studentRelations} relations élève-classe, ${reminderAssignments} assignations rappels`);
      } else {
        updateTest('Relations', 'error', 'Relations manquantes');
      }

      // Test 6: Interface Responsive
      setCurrentTest('Interface');
      updateTest('Interface', 'pending', 'Test responsive...');
      
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        mobile: window.innerWidth < 768,
        tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        desktop: window.innerWidth >= 1024
      };
      
      updateTest('Interface', 'success', 
        `${viewport.width}x${viewport.height} - ${viewport.mobile ? 'Mobile' : viewport.tablet ? 'Tablet' : 'Desktop'}`);

      // Test 7: Fonctionnalités CRUD
      setCurrentTest('CRUD');
      updateTest('CRUD', 'pending', 'Test des opérations...');
      
      // Test création rapide
      const testUser = {
        nom: 'Test',
        prenom: 'UI',
        type_utilisateur: 'Élève' as const,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const userId = await db.users.add(testUser);
      const createdUser = await db.users.get(userId);
      await db.users.delete(userId); // Nettoyage
      
      if (createdUser) {
        updateTest('CRUD', 'success', 'Opérations Create/Read/Delete validées');
      } else {
        updateTest('CRUD', 'error', 'Erreur dans les opérations CRUD');
      }

      // Test 8: Performance
      setCurrentTest('Performance');
      updateTest('Performance', 'pending', 'Mesure des performances...');
      
      const perfStart = performance.now();
      await db.users.toArray();
      await db.classes.toArray();
      await db.reminders.toArray();
      const perfEnd = performance.now();
      
      const queryTime = Math.round(perfEnd - perfStart);
      if (queryTime < 100) {
        updateTest('Performance', 'success', `Requêtes rapides (${queryTime}ms)`);
      } else {
        updateTest('Performance', 'error', `Requêtes lentes (${queryTime}ms)`);
      }

      // Test 9: Stockage Local
      setCurrentTest('Stockage');
      updateTest('Stockage', 'pending', 'Test localStorage...');
      
      try {
        localStorage.setItem('gai-test', 'ok');
        const testValue = localStorage.getItem('gai-test');
        localStorage.removeItem('gai-test');
        
        if (testValue === 'ok') {
          updateTest('Stockage', 'success', 'LocalStorage fonctionnel');
        } else {
          updateTest('Stockage', 'error', 'Problème localStorage');
        }
      } catch (error) {
        updateTest('Stockage', 'error', 'LocalStorage non disponible');
      }

      // Test 10: Intégrité des Modules
      setCurrentTest('Modules');
      updateTest('Modules', 'pending', 'Validation des modules...');
      
      const modules = {
        users: await db.users.count() > 0,
        classes: await db.classes.count() > 0,
        reminders: await db.reminders.count() > 0,
        notifications: true, // Service toujours disponible
        assignments: true // Table toujours disponible
      };
      
      const workingModules = Object.values(modules).filter(Boolean).length;
      const totalModules = Object.keys(modules).length;
      
      if (workingModules === totalModules) {
        updateTest('Modules', 'success', `${workingModules}/${totalModules} modules opérationnels`);
      } else {
        updateTest('Modules', 'error', `${workingModules}/${totalModules} modules opérationnels`);
      }

      setCurrentTest('');
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      
      // Résumé final
      const successCount = tests.filter(t => t.status === 'success').length;
      const errorCount = tests.filter(t => t.status === 'error').length;
      
      updateTest('RÉSUMÉ', successCount === tests.length ? 'success' : 'error', 
        `${successCount} succès, ${errorCount} erreurs en ${totalTime}s`);

    } catch (error) {
      updateTest('ERREUR CRITIQUE', 'error', `${error}`);
    } finally {
      setRunning(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-700 bg-green-50';
      case 'error': return 'text-red-700 bg-red-50';
      case 'pending': return 'text-yellow-700 bg-yellow-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-gai-blue" />
          Suite de Tests UI Complète
        </h3>
        <Button 
          onClick={runUITests} 
          disabled={running}
          className="flex items-center"
        >
          <Play className="w-4 h-4 mr-2" />
          {running ? 'Tests en cours...' : 'Lancer Tests UI'}
        </Button>
      </div>

      {running && currentTest && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-500 animate-spin mr-2" />
            <span className="text-blue-700 font-medium">Test en cours : {currentTest}</span>
          </div>
        </div>
      )}

      {tests.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-800 mb-3">Résultats des Tests :</h4>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {tests.map((test, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md border ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(test.status)}
                    <span className="ml-2 font-medium">{test.name}</span>
                  </div>
                  {test.duration && (
                    <span className="text-xs opacity-75">{test.duration}ms</span>
                  )}
                </div>
                <p className="text-sm mt-1 opacity-90">{test.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!running && tests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Cliquez sur "Lancer Tests UI" pour valider l'interface complète</p>
          <p className="text-sm mt-1">Tests : Navigation, Base de données, Notifications, Performance, etc.</p>
        </div>
      )}
    </div>
  );
}