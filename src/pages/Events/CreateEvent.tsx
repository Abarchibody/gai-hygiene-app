import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Save, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../db/schema';
import type { Event, User as UserType, Class } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';


export default function CreateEvent() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_activite: 'Sensibilisation' as const,
    date_debut: '',
    heure_debut: '',
    date_fin: '',
    heure_fin: '',
    lieu: '',
    responsable_id: '',
    statut: 'Planifié' as const,
    classes_concernees: [] as number[]
  });

  useEffect(() => {
    loadUsers();
    loadClasses();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    }
  };

  const loadClasses = async () => {
    try {
      const allClasses = await db.classes.toArray();
      setClasses(allClasses);
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData: Event = {
        titre: formData.titre,
        description: formData.description,
        type_activite: formData.type_activite,
        date_debut: new Date(formData.date_debut),
        heure_debut: formData.heure_debut,
        date_fin: new Date(formData.date_fin),
        heure_fin: formData.heure_fin,
        lieu: formData.lieu,
        responsable_id: parseInt(formData.responsable_id),
        statut: formData.statut,
        classes_concernees: formData.classes_concernees,
        created_at: new Date(),
        updated_at: new Date()
      };

      await db.events.add(eventData);
      navigate('/events');
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassToggle = (classeId: number) => {
    setFormData(prev => ({
      ...prev,
      classes_concernees: prev.classes_concernees.includes(classeId)
        ? prev.classes_concernees.filter(id => id !== classeId)
        : [...prev.classes_concernees, classeId]
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link 
            to="/events" 
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Créer un nouvel événement
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Remplissez les informations pour créer un nouvel événement d'hygiène
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre de l'événement *
              </label>
              <Input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                placeholder="Ex: Séance de sensibilisation au lavage des mains"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description détaillée de l'événement..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gai-blue focus:border-gai-blue dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'activité *
              </label>
              <select
                value={formData.type_activite}
                onChange={(e) => setFormData(prev => ({ ...prev, type_activite: e.target.value as any }))}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Sensibilisation">Sensibilisation</option>
                <option value="Formation">Formation</option>
                <option value="Contrôle">Contrôle</option>
                <option value="Activité collective">Activité collective</option>
                <option value="Personnalisé">Personnalisé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Planifié">Planifié</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de début *
              </label>
              <Input
                type="date"
                value={formData.date_debut}
                onChange={(e) => setFormData(prev => ({ ...prev, date_debut: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Heure de début *
              </label>
              <Input
                type="time"
                value={formData.heure_debut}
                onChange={(e) => setFormData(prev => ({ ...prev, heure_debut: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de fin *
              </label>
              <Input
                type="date"
                value={formData.date_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, date_fin: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Heure de fin *
              </label>
              <Input
                type="time"
                value={formData.heure_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, heure_fin: e.target.value }))}
                required
              />
            </div>
          </div>

            {/* Location and Responsible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Lieu
              </label>
              <Input
                type="text"
                value={formData.lieu}
                onChange={(e) => setFormData(prev => ({ ...prev, lieu: e.target.value }))}
                placeholder="Ex: Salle de classe, Cour de récréation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Responsable *
              </label>
              <select
                value={formData.responsable_id}
                onChange={(e) => setFormData(prev => ({ ...prev, responsable_id: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un enseignant</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.prenom} {user.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

            {/* Classes concernées */}
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Classes concernées
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {classes.map(classe => (
                <label key={classe.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.classes_concernees.includes(classe.id!)}
                    onChange={() => handleClassToggle(classe.id!)}
                    className="rounded border-gray-300 text-gai-blue focus:ring-gai-blue"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {classe.nom_classe}
                  </span>
                </label>
              ))}
            </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Les champs marqués d'un * sont obligatoires
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/events')}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Création...' : 'Créer l\'événement'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}