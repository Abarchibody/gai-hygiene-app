import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { db } from '../../db/schema';
import type { User, UserType } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    type_utilisateur: '' as UserType | ''
  });

  const userTypeOptions = [
    { value: '', label: 'Sélectionner un type' },
    { value: 'Élève', label: 'Élève' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Enseignant', label: 'Enseignant' }
  ];

  useEffect(() => {
    if (id) {
      loadUser(parseInt(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      const user = await db.users.get(userId);
      if (user) {
        setFormData({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email || '',
          telephone: user.telephone || '',
          type_utilisateur: user.type_utilisateur
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    if (!formData.type_utilisateur) {
      newErrors.type_utilisateur = 'Le type d\'utilisateur est requis';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;

    setLoading(true);
    try {
      const updatedUser: Partial<User> = {
        ...formData,
        type_utilisateur: formData.type_utilisateur as UserType,
        updated_at: new Date()
      };

      await db.users.update(parseInt(id), updatedUser);
      navigate(`/users/${id}?updated=1`);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setErrors({ submit: 'Erreur lors de la modification de l\'utilisateur' });
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link 
            to={`/users/${id}`}
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au profil
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
            Modifier l'utilisateur
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Modifiez les informations de l'utilisateur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              error={errors.nom}
              required
            />

            <Input
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              error={errors.prenom}
              required
            />

            <Select
              label="Type d'utilisateur"
              value={formData.type_utilisateur}
              onChange={(e) => handleChange('type_utilisateur', e.target.value)}
              options={userTypeOptions}
              error={errors.type_utilisateur}
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <Input
              label="Téléphone"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              error={errors.telephone}
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
                onClick={() => navigate(`/users/${id}`)}
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