import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Bell, Eye, Edit, Trash2, Clock, User } from 'lucide-react';
import { reminderService, userService, authService } from '../../services';
import type { Reminder, User as UserType } from '../../types';
import Button from '../../components/ui/Button';

export default function RemindersList() {
  const user = authService.getCurrentUser();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (user) {
      loadReminders();
      loadUsers();
    }
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;
    
    try {
      let filteredReminders: Reminder[] = [];
      
      if (user.type_utilisateur === 'Admin') {
        // Admin sees all reminders
        filteredReminders = await reminderService.getList();
      } else if (user.type_utilisateur === 'Enseignant') {
        // Teacher sees only their created reminders
        const allReminders = await reminderService.getList();
        filteredReminders = allReminders.filter(r => r.createur_id === user.id);
      } else {
        // Parent/Student sees assigned reminders
        if (user.id) {
          filteredReminders = await reminderService.getForUser(user.id);
        }
      }
      
      setReminders(filteredReminders);
    } catch (error) {
      console.error('Erreur lors du chargement des rappels:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getList();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const getCreatorName = (createurId: number) => {
    const creator = users.find(u => u.id === createurId);
    return creator ? `${creator.nom} ${creator.prenom}` : 'Utilisateur introuvable';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Lavage mains': return 'bg-blue-100 text-blue-800';
      case 'Brossage dents': return 'bg-green-100 text-green-800';
      case 'Hygiène corporelle': return 'bg-purple-100 text-purple-800';
      case 'Personnalisé': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      case 'Terminé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reminder.description && reminder.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || reminder.categorie === filterCategory;
    const matchesStatus = !filterStatus || reminder.statut === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.type_utilisateur === 'Admin'
              ? 'Gestion des rappels d\'hygiène automatisés'
              : user?.type_utilisateur === 'Enseignant'
              ? 'Mes rappels d\'hygiène créés'
              : user?.type_utilisateur === 'Parent'
              ? 'Rappels d\'hygiène de mes enfants'
              : 'Mes rappels d\'hygiène personnels'
            }
          </p>
        </div>
        {(user?.type_utilisateur === 'Admin' || user?.type_utilisateur === 'Enseignant') && (
          <Link to="/reminders/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau rappel
            </Button>
          </Link>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              <option value="Lavage mains">Lavage mains</option>
              <option value="Brossage dents">Brossage dents</option>
              <option value="Hygiène corporelle">Hygiène corporelle</option>
              <option value="Personnalisé">Personnalisé</option>
            </select>
          </div>
          <div>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des rappels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gai-orange" />
            {user?.type_utilisateur === 'Enseignant'
              ? `Mes rappels (${filteredReminders.length})`
              : user?.type_utilisateur === 'Parent'
              ? `Rappels de mes enfants (${filteredReminders.length})`
              : user?.type_utilisateur === 'Élève'
              ? `Mes rappels (${filteredReminders.length})`
              : `Rappels d'hygiène (${filteredReminders.length})`
            }
          </h3>
        </div>

        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">Aucun rappel trouvé</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {reminders.length === 0 
                ? user?.type_utilisateur === 'Enseignant'
                  ? 'Commencez par créer votre premier rappel d\'hygiène.'
                  : user?.type_utilisateur === 'Parent'
                  ? 'Aucun rappel assigné à vos enfants pour le moment.'
                  : user?.type_utilisateur === 'Élève'
                  ? 'Aucun rappel ne vous a été assigné pour le moment.'
                  : 'Commencez par créer votre premier rappel d\'hygiène.'
                : 'Essayez de modifier vos critères de recherche.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rappel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Récurrence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Créateur
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReminders.map((reminder) => (
                  <tr key={reminder.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gai-orange rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {reminder.titre}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {reminder.heure} - {reminder.date_debut ? new Date(reminder.date_debut).toLocaleDateString('fr-FR') : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(reminder.categorie)}`}>
                        {reminder.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {reminder.recurrence}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.statut)}`}>
                        {reminder.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {getCreatorName(reminder.createur_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/reminders/${reminder.id}`} className="text-gai-blue hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {(user?.type_utilisateur === 'Admin' || reminder.createur_id === user?.id) && (
                          <>
                            <Link to={`/reminders/${reminder.id}/edit`} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
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