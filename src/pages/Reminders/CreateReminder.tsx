import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { db } from '../../db/schema';
import type { Reminder, ReminderCategory, ReminderRecurrence, User } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function CreateReminder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '' as ReminderCategory | '',
    recurrence: '' as ReminderRecurrence | '',
    date_debut: '',
    heure: '',
    createur_id: ''
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const teachersData = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
      setTeachers(teachersData);
      // Sélectionner le premier enseignant par défaut
      if (teachersData.length > 0) {
        setFormData(prev => ({ ...prev, createur_id: teachersData[0].id!.toString() }));
      }
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
    if (!formData.createur_id) {
      newErrors.createur_id = 'Le créateur est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newReminder: Omit<Reminder, 'id'> = {
        titre: formData.titre,
        description: formData.description || undefined,
        categorie: formData.categorie as ReminderCategory,
        recurrence: formData.recurrence as ReminderRecurrence,
        date_debut: new Date(formData.date_debut),
        heure: formData.heure,
        statut: 'Actif',
        createur_id: parseInt(formData.createur_id),
        created_at: new Date(),
        updated_at: new Date()
      };

      const reminderId = await db.reminders.add(newReminder);
      
      // Programmer automatiquement les notifications si le rappel est actif
      if (newReminder.statut === 'Actif') {
        // Importer le service de notifications
        const { notificationService } = await import('../../utils/notificationService');
        const reminderWithId = { ...newReminder, id: reminderId };
        await notificationService.scheduleReminderNotifications(reminderWithId);
      }
      
      navigate('/reminders?created=1');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setErrors({ submit: 'Erreur lors de la création du rappel' });
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

  return (
    <div>
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
      </div>

      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Créer un nouveau rappel d'hygiène
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configurez un rappel automatisé pour promouvoir les bonnes pratiques d'hygiène
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optionnelle)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Les champs marqués d'un * sont obligatoires
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/reminders')}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Création...' : 'Créer le rappel'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}