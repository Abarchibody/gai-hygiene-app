import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Heart, School, Lock } from 'lucide-react';
import { UserService } from '../../services';
import type { User } from '../../types';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser(parseInt(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      const userData = await UserService.getInstance().getOne(userId);
      setUser(userData || null);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await UserService.getInstance().delete(user.id!);
      navigate('/users?deleted=1');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    try {
      await UserService.getInstance().update(user.id!, { password: 'Password123!', updated_at: new Date() });
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'Élève': return 'bg-blue-100 text-blue-800';
      case 'Parent': return 'bg-green-100 text-green-800';
      case 'Enseignant': return 'bg-purple-100 text-purple-800';
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Utilisateur introuvable</h2>
        <Link to="/users" className="text-gai-blue hover:underline">
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
            to="/users" 
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Link>
        </div>
        <div className="flex space-x-3">
          <Link to={`/users/${user.id}/edit`}>
            <Button variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <Button 
            variant="secondary"
            onClick={() => setShowResetDialog(true)}
          >
            <Lock className="w-4 h-4 mr-2" />
            Réinitialiser mot de passe
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
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
                <div className="w-12 h-12 bg-gai-blue rounded-full flex items-center justify-center text-white text-lg font-medium mr-4">
                  {user.prenom.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {user.nom} {user.prenom}
                  </h2>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.type_utilisateur)}`}>
                    {user.type_utilisateur}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Informations personnelles
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.nom} {user.prenom}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type d'utilisateur
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.type_utilisateur}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user.email || <span className="text-gray-400 dark:text-gray-500 italic">Non renseigné</span>}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user.telephone || <span className="text-gray-400 dark:text-gray-500 italic">Non renseigné</span>}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Créé le
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Modifié le
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user.updated_at ? new Date(user.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Relations et actions */}
        <div className="space-y-6">
          {user.type_utilisateur === 'Élève' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-green-500" />
                  Parent
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <span className="text-gray-400 dark:text-gray-500 italic mr-2">Non renseigné</span>
                  <Link to={`/users/${user.id}/assign-parent`}>
                    <Button size="sm">
                      Assigner un parent
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {user.type_utilisateur === 'Élève' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <School className="w-5 h-5 mr-2 text-blue-500" />
                  Classe
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <span className="text-gray-400 dark:text-gray-500 italic mr-2">Non assigné</span>
                  <Button size="sm">
                    Assigner à une classe
                  </Button>
                </div>
              </div>
            </div>
          )}

          {user.type_utilisateur === 'Parent' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-green-500" />
                  Enfants
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-400 dark:text-gray-500 italic">Aucun enfant assigné</p>
              </div>
            </div>
          )}

          {user.type_utilisateur === 'Enseignant' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <School className="w-5 h-5 mr-2 text-blue-500" />
                  Classes enseignées
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-400 dark:text-gray-500 italic">Aucune classe assignée</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success message */}
      {resetSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg">
          <p className="text-green-800 dark:text-green-200 text-sm">
            ✅ Mot de passe réinitialisé à "Password123!"
          </p>
        </div>
      )}

      {/* Reset Password Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleResetPassword}
        title="Réinitialiser le mot de passe"
        message={`Réinitialiser le mot de passe de ${user?.prenom} ${user?.nom} à "Password123!" ?`}
        type="warning"
        confirmText="Réinitialiser"
      />

      {/* Delete User Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer ${user?.prenom} ${user?.nom} ? Cette action est irréversible.`}
        type="danger"
        confirmText="Supprimer"
      />
    </div>
  );
}