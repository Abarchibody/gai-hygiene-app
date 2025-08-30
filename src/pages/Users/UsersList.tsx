import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { UserService } from '../../services';
import type { User } from '../../types';
import Button from '../../components/ui/Button';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await UserService.getInstance().getList();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || user.type_utilisateur === filterType;
    return matchesSearch && matchesType;
  });

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'Élève': return 'bg-blue-100 text-blue-800';
      case 'Parent': return 'bg-green-100 text-green-800';
      case 'Enseignant': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Gestion des utilisateurs du système</p>
          </div>
          <Link to="/users/create">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="Élève">Élèves</option>
              <option value="Parent">Parents</option>
              <option value="Enseignant">Enseignants</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Users className="w-5 h-5 mr-2 text-gai-blue" />
            Utilisateurs ({filteredUsers.length})
          </h3>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">Aucun utilisateur trouvé</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {users.length === 0 ? 'Commencez par créer votre premier utilisateur.' : 'Essayez de modifier vos critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gai-blue rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {user.prenom.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.nom} {user.prenom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.type_utilisateur)}`}>
                        {user.type_utilisateur}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        {user.email && <div>{user.email}</div>}
                        {user.telephone && <div>{user.telephone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/users/${user.id}`} className="text-gai-blue hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/users/${user.id}/edit`} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
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