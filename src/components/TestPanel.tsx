import { useState } from 'react';
import { Play, Clock, Bell, Database, CheckCircle } from 'lucide-react';
import { notificationService } from '../utils/notificationService';
import { db } from '../db/schema';
import Button from './ui/Button';

export default function TestPanel() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const runCompleteTest = async () => {
    setTesting(true);
    setTestResults([]);
    
    try {
      addResult('🚀 Début du test complet du système');

      // Test 1: Vérifier les données
      const users = await db.users.count();
      const classes = await db.classes.count();
      const reminders = await db.reminders.count();
      addResult(`📊 Données: ${users} utilisateurs, ${classes} classes, ${reminders} rappels`);

      // Test 2: Vérifier les permissions
      const hasPermission = await notificationService.checkPermission();
      addResult(`🔔 Permissions notifications: ${hasPermission ? 'Accordées' : 'Non accordées'}`);

      // Test 3: Créer une notification de test immédiate
      if (hasPermission) {
        const testNotification = {
          id: Date.now(),
          title: 'Test GAI Hygiène',
          message: 'Notification de test - système fonctionnel !',
          type: 'reminder' as const,
          status: 'pending' as const,
          scheduled_at: new Date(),
          created_at: new Date()
        };

        await db.notifications.add(testNotification);
        await notificationService.sendNotification(testNotification);
        addResult('✅ Notification de test envoyée');
      } else {
        addResult('⚠️ Permissions requises pour tester les notifications');
      }

      // Test 4: Vérifier les assignations
      const assignments = await db.reminderAssignments.count();
      addResult(`🔗 Assignations rappels: ${assignments} relations`);

      // Test 5: Programmer des notifications pour rappels actifs
      const activeReminders = await db.reminders.where('statut').equals('Actif').toArray();
      let totalScheduled = 0;
      
      for (const reminder of activeReminders) {
        const assignments = await db.reminderAssignments.where('rappel_id').equals(reminder.id!).toArray();
        if (assignments.length > 0) {
          await notificationService.scheduleReminderNotifications(reminder);
          totalScheduled++;
        }
      }
      
      addResult(`📅 ${totalScheduled} rappels programmés pour notifications`);

      // Test 6: Statistiques finales
      const notifications = await db.notifications.count();
      addResult(`📈 Total notifications en base: ${notifications}`);

      addResult('🎉 Test complet terminé avec succès !');
      
    } catch (error) {
      addResult(`❌ Erreur lors du test: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testSingleNotification = async () => {
    try {
      const hasPermission = await notificationService.checkPermission();
      if (!hasPermission) {
        addResult('⚠️ Veuillez d\'abord autoriser les notifications');
        return;
      }

      new Notification('GAI Hygiène - Test Simple', {
        body: 'Ceci est une notification de test simple',
        icon: '/favicon.ico',
        tag: 'test-simple'
      });
      
      addResult('🔔 Notification simple envoyée');
    } catch (error) {
      addResult(`❌ Erreur notification: ${error}`);
    }
  };

  const startScheduler = () => {
    notificationService.startNotificationScheduler();
    addResult('⏰ Planificateur de notifications démarré');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Play className="w-5 h-5 mr-2 text-gai-blue" />
          Panel de test du système
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <Button 
          onClick={runCompleteTest} 
          disabled={testing}
          className="w-full"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {testing ? 'Test en cours...' : 'Test complet'}
        </Button>
        
        <Button 
          onClick={testSingleNotification}
          variant="secondary"
          className="w-full"
        >
          <Bell className="w-4 h-4 mr-2" />
          Test notification
        </Button>
        
        <Button 
          onClick={startScheduler}
          variant="secondary"
          className="w-full"
        >
          <Clock className="w-4 h-4 mr-2" />
          Démarrer planificateur
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="font-medium text-gray-800 mb-2">Résultats des tests :</h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-700">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}