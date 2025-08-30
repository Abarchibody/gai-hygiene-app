import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, School, UserPlus, AlertCircle } from 'lucide-react';
import { reminderService, userService, classService } from '../../services';
import type { Reminder, User, Class } from '../../types';
import Button from '../../components/ui/Button';

export default function AssignReminder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'classes'>('users');

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (reminderId: number) => {
    try {
      // Charger le rappel
      const reminderData = await reminderService.getOne(reminderId);
      if (!reminderData) {
        navigate('/reminders');
        return;
      }
      setReminder(reminderData);

      // Charger tous les utilisateurs
      const allUsers = await userService.getList();
      setUsers(allUsers);

      // Charger toutes les classes
      const allClasses = await classService.getList();
      setClasses(allClasses);

      // Note: Assignment loading would need to be implemented in services
      // For now, start with empty selections
      setSelectedUserIds([]);
      setSelectedClassIds([]);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleClassToggle = (classId: number) => {
    setSelectedClassIds(prev => 
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reminder) return;

    setSubmitting(true);
    try {
      // Note: Assignment functionality would need to be implemented in ReminderService
      // For now, just log the selections and navigate back
      console.log('Assigning reminder to users:', selectedUserIds, 'and classes:', selectedClassIds);

      const totalAssigned = selectedUserIds.length + selectedClassIds.length;
      navigate(`/reminders/${reminder.id}?assigned=${totalAssigned}`);
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!reminder) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Rappel introuvable</h2>
        <Link to="/reminders" className="text-gai-blue hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link 
            to={`/reminders/${reminder.id}`}
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au détail
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-gai-blue" />
            Assigner le rappel : {reminder.titre}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Sélectionnez les utilisateurs et/ou classes qui recevront ce rappel
          </p>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-gai-blue text-gai-blue'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Utilisateurs individuels
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'classes'
                  ? 'border-gai-blue text-gai-blue'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <School className="w-4 h-4 inline mr-2" />
              Classes entières
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'users' && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Sélectionner les utilisateurs
              </h3>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucun utilisateur disponible</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-3">
                  {users.map((user) => (
                    <label 
                      key={user.id} 
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id!)}
                        onChange={() => handleUserToggle(user.id!)}
                        className="mr-3"
                      />
                      <div className="w-8 h-8 bg-gai-blue rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {user.prenom.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user.nom} {user.prenom}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.type_utilisateur}
                          {user.email && ` • ${user.email}`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'classes' && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Sélectionner les classes
              </h3>
              {classes.length === 0 ? (
                <div className="text-center py-8">
                  <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucune classe disponible</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-3">
                  {classes.map((classe) => (
                    <label 
                      key={classe.id} 
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClassIds.includes(classe.id!)}
                        onChange={() => handleClassToggle(classe.id!)}
                        className="mr-3"
                      />
                      <div className="w-8 h-8 bg-gai-green rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {classe.nom_classe.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {classe.nom_classe}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {classe.niveau}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {selectedUserIds.length} utilisateur{selectedUserIds.length > 1 ? 's' : ''} et {selectedClassIds.length} classe{selectedClassIds.length > 1 ? 's' : ''} sélectionné{selectedUserIds.length + selectedClassIds.length > 1 ? 's' : ''}
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/reminders/${reminder.id}`)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                <UserPlus className="w-4 h-4 mr-2" />
                {submitting ? 'Assignation...' : 'Enregistrer les assignations'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}