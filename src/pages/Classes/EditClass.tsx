import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { db } from '../../db/schema';
import type { Class, User } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function EditClass() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nom_classe: '',
    niveau: '',
    enseignant_id: ''
  });

  useEffect(() => {
    if (id) {
      loadClass(parseInt(id));
    }
    loadTeachers();
  }, [id]);

  const loadClass = async (classId: number) => {
    try {
      const classe = await db.classes.get(classId);
      if (classe) {
        setFormData({
          nom_classe: classe.nom_classe,
          niveau: classe.niveau,
          enseignant_id: classe.enseignant_id?.toString() || ''
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

  const teacherOptions = [
    { value: '', label: 'Aucun enseignant assigné' },
    ...teachers.map(teacher => ({
      value: teacher.id!.toString(),
      label: `${teacher.nom} ${teacher.prenom}`
    }))
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom_classe.trim()) {
      newErrors.nom_classe = 'Le nom de la classe est requis';
    }
    if (!formData.niveau.trim()) {
      newErrors.niveau = 'Le niveau est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;

    setLoading(true);
    try {
      const updatedClass: Partial<Class> = {
        nom_classe: formData.nom_classe,
        niveau: formData.niveau,
        enseignant_id: formData.enseignant_id ? parseInt(formData.enseignant_id) : undefined,
        updated_at: new Date()
      };

      await db.classes.update(parseInt(id), updatedClass);
      navigate(`/classes/${id}?updated=1`);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setErrors({ submit: 'Erreur lors de la modification de la classe' });
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
        <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link 
            to={`/classes/${id}`}
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au détail
          </Link>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{errors.submit}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Modifier la classe
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Modifiez les informations de la classe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nom de la classe"
              value={formData.nom_classe}
              onChange={(e) => handleChange('nom_classe', e.target.value)}
              error={errors.nom_classe}
              placeholder="Ex: 6ème A, CP1, etc."
              required
            />

            <Input
              label="Niveau"
              value={formData.niveau}
              onChange={(e) => handleChange('niveau', e.target.value)}
              error={errors.niveau}
              placeholder="Ex: Primaire, Secondaire, etc."
              required
            />

            <div className="md:col-span-2">
              <Select
                label="Enseignant responsable"
                value={formData.enseignant_id}
                onChange={(e) => handleChange('enseignant_id', e.target.value)}
                options={teacherOptions}
                error={errors.enseignant_id}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Les champs marqués d'un * sont obligatoires
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/classes/${id}`)}
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