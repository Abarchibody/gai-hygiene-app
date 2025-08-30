import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { authService, userService } from '../services';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ProfilePage() {
  const user = authService.getCurrentUser();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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
      if (user?.id && user.id > 0) {
        const dbUser = await userService.getOne(user.id);
        if (!dbUser || dbUser.password !== formData.currentPassword) {
          setError('Mot de passe actuel incorrect');
          setLoading(false);
          return;
        }

        await userService.update(user.id, {
          password: formData.newPassword,
          updated_at: new Date()
        });
      }
      
      setSuccess('Mot de passe modifié avec succès');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
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

  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400">Gérez votre profil et vos paramètres</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <User className="w-5 h-5 mr-2 text-gai-blue" />
              Mon Profil
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gai-blue rounded-full flex items-center justify-center text-white text-xl font-medium mr-4">
                {user.prenom.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {user.nom} {user.prenom}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.type_utilisateur}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type de compte
                </label>
                <p className="text-gray-900 dark:text-gray-100">{user.type_utilisateur}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-gai-blue" />
              Sécurité
            </h3>
          </div>
          <div className="p-6">
            {!showPasswordForm ? (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Modifiez votre mot de passe pour sécuriser votre compte
                </p>
                <Button onClick={() => setShowPasswordForm(true)}>
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
                  </div>
                )}

                {user.id && user.id > 0 && (
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
                )}

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

                <div className="flex space-x-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Modification...' : 'Modifier'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      setShowPasswordForm(false);
                      setError('');
                      setSuccess('');
                      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}