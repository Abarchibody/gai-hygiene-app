import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { db } from '../../db/schema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ChangePassword() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères');
      setLoading(false);
      return;
    }

    try {
      const userId = parseInt(id!);
      const user = await db.users.get(userId);
      
      if (!user) {
        setError('Utilisateur introuvable');
        setLoading(false);
        return;
      }

      if (user.password !== formData.currentPassword) {
        setError('Mot de passe actuel incorrect');
        setLoading(false);
        return;
      }

      await db.users.update(userId, {
        password: formData.newPassword,
        updated_at: new Date()
      });

      navigate(`/users/${id}`, { 
        state: { message: 'Mot de passe modifié avec succès' }
      });
    } catch (error) {
      setError('Erreur lors de la modification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link 
          to={`/users/${id}`}
          className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au profil
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-gai-blue" />
              Changer le mot de passe
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="relative">
              <Input
                label="Mot de passe actuel"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Nouveau mot de passe"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirmer le nouveau mot de passe"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Conseils de sécurité :</strong><br />
                • Utilisez au moins 4 caractères<br />
                • Mélangez lettres et chiffres<br />
                • Ne partagez jamais votre mot de passe
              </p>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" disabled={loading} className="flex-1">
                <Lock className="w-4 h-4 mr-2" />
                {loading ? 'Modification...' : 'Changer le mot de passe'}
              </Button>
              <Link to={`/users/${id}`}>
                <Button variant="secondary">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}