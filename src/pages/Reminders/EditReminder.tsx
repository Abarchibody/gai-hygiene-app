import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { db } from '../../db/schema';
import type { Reminder, ReminderCategory, ReminderRecurrence, ReminderStatus, User } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function EditReminder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '' as ReminderCategory | '',
    recurrence: '' as ReminderRecurrence | '',
    date_debut: '',
    heure: '',
    statut: '' as ReminderStatus | '',
    createur_id: ''
  });

  useEffect(() => {
    if (id) {
      loadReminder(parseInt(id));
    }
    loadTeachers();
  }, [id]);

  const loadReminder = async (reminderId: number) => {
    try {
      const reminder = await db.reminders.get(reminderId);
      if (reminder) {
        setFormData({
          titre: reminder.titre,
          description: reminder.description || '',
          categorie: reminder.categorie,
          recurrence: reminder.recurrence,
          date_debut: reminder.date_debut.toISOString().split('T')[0],
          heure: reminder.heure,
          statut: reminder.statut,
          createur_id: reminder.createur_id.toString()
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const teachersData = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
      setTeachers(teachersData);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Sélectionner une catégorie' },
    { value: 'Lavage mains', label: 'Lavage des mains' },
    { value: 'Brossage dents', label: 'Brossage des dents' },
    { value: 'Hygiène corporelle', label: 'Hygiène corporelle' },
    { value: 'Personnalisé', label: 'Rappel personnalisé' }
  ];

  const recurrenceOptions = [
    { value: '', label: 'Sélectionner la récurrence' },
    { value: 'Quotidien', label: 'Quotidien' },
    { value: 'Hebdomadaire', label: 'Hebdomadaire' },
    { value: 'Mensuel', label: 'Mensuel' },
    { value: 'Unique', label: 'Une seule fois' }
  ];

  const statusOptions = [
    { value: '', label: 'Sélectionner le statut' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
    { value: 'Terminé', label: 'Terminé' }
  ];

  const creatorOptions = [
    { value: '', label: 'Sélectionner un créateur' },
    ...teachers.map(teacher => ({
      value: teacher.id!.toString(),
      label: `${teacher.nom} ${teacher.prenom}`
    }))
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }
    if (!formData.categorie) {
      newErrors.categorie = 'La catégorie est requise';
    }
    if (!formData.recurrence) {
      newErrors.recurrence = 'La récurrence est requise';
    }
    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est requise';
    }
    if (!formData.heure) {
      newErrors.heure = 'L\'heure est requise';
    }
    if (!formData.statut) {
      newErrors.statut = 'Le statut est requis';
    }
    if (!formData.createur_id) {
      newErrors.createur_id = 'Le créateur est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;

    setLoading(true);
    try {
      const updatedReminder: Partial<Reminder> = {
        titre: formData.titre,
        description: formData.description || undefined,
        categorie: formData.categorie as ReminderCategory,
        recurrence: formData.recurrence as ReminderRecurrence,
        date_debut: new Date(formData.date_debut),
        heure: formData.heure,
        statut: formData.statut as ReminderStatus,
        createur_id: parseInt(formData.createur_id),
        updated_at: new Date()
      };

      await db.reminders.update(parseInt(id), updatedReminder);
      navigate(`/reminders/${id}?updated=1`);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setErrors({ submit: 'Erreur lors de la modification du rappel' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link 
            to={`/reminders/${id}`}
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au détail
          </Link>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Modifier le rappel d'hygiène
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Modifiez les paramètres de ce rappel automatisé
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Titre du rappel"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              error={errors.titre}
              placeholder="Ex: Lavage des mains avant le repas"
              required
            />

            <Select
              label="Catégorie"
              value={formData.categorie}
              onChange={(e) => handleChange('categorie', e.target.value)}
              options={categoryOptions}
              error={errors.categorie}
              required
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnelle)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gai-blue focus:border-gai-blue"
                rows={3}
                placeholder="Décrivez les instructions spécifiques pour ce rappel..."
              />
            </div>

            <Select
              label="Récurrence"
              value={formData.recurrence}
              onChange={(e) => handleChange('recurrence', e.target.value)}
              options={recurrenceOptions}
              error={errors.recurrence}
              required
            />

            <Select
              label="Statut"
              value={formData.statut}
              onChange={(e) => handleChange('statut', e.target.value)}
              options={statusOptions}
              error={errors.statut}
              required
            />

            <Select
              label="Créé par"
              value={formData.createur_id}
              onChange={(e) => handleChange('createur_id', e.target.value)}
              options={creatorOptions}
              error={errors.createur_id}
              required
            />

            <Input
              label="Date de début"
              type="date"
              value={formData.date_debut}
              onChange={(e) => handleChange('date_debut', e.target.value)}
              error={errors.date_debut}
              required
            />

            <Input
              label="Heure"
              type="time"
              value={formData.heure}
              onChange={(e) => handleChange('heure', e.target.value)}
              error={errors.heure}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <div className="text-sm text-gray-500">
              Les champs marqués d'un * sont obligatoires
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/reminders/${id}`)}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Modification...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}