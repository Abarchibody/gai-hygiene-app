import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Bell, Clock, User, Users, Calendar } from 'lucide-react';
import { db } from '../../db/schema';
import type { Reminder, User as UserType } from '../../types';
import Button from '../../components/ui/Button';

export default function ReminderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [creator, setCreator] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadReminder(parseInt(id));
    }
  }, [id]);

  const loadReminder = async (reminderId: number) => {
    try {
      const reminderData = await db.reminders.get(reminderId);
      setReminder(reminderData || null);

      if (reminderData?.createur_id) {
        const creatorData = await db.users.get(reminderData.createur_id);
        setCreator(creatorData || null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reminder || !confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) {
      return;
    }

    try {
      await db.reminders.delete(reminder.id!);
      navigate('/reminders?deleted=1');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
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
            to="/reminders" 
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Link>
        </div>
        <div className="flex space-x-3">
          <Link to={`/reminders/${reminder.id}/edit`}>
            <Button variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gai-orange rounded-full flex items-center justify-center text-white text-lg font-medium mr-4">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {reminder.titre}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(reminder.categorie)}`}>
                      {reminder.categorie}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.statut)}`}>
                      {reminder.statut}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Détails du rappel
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{reminder.titre}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{reminder.categorie}</p>
                </div>

                {reminder.description && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      {reminder.description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Récurrence
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{reminder.recurrence}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{reminder.statut}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de début
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(reminder.date_debut).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Heure
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{reminder.heure}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Créé par
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {creator ? `${creator.nom} ${creator.prenom}` : 'Utilisateur introuvable'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Créé le
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(reminder.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignations */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gai-blue" />
                Assignations
              </h3>
            </div>
            
            <div className="p-6">
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Aucune assignation</p>
                <Link to={`/reminders/${reminder.id}/assign`}>
                  <Button size="sm">
                    Assigner aux utilisateurs
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Actions rapides
              </h3>
            </div>
            
            <div className="p-6 space-y-3">
              <Button variant="secondary" className="w-full">
                {reminder.statut === 'Actif' ? 'Désactiver' : 'Activer'} le rappel
              </Button>
              <Button variant="secondary" className="w-full">
                Dupliquer le rappel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}