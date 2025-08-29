import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, School, Eye, Edit, Trash2, Users } from 'lucide-react';
import { db } from '../../db/schema';
import type { Class, User } from '../../types';
import Button from '../../components/ui/Button';

export default function ClassesList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, []);

  const loadClasses = async () => {
    try {
      const allClasses = await db.classes.orderBy('nom_classe').toArray();
      setClasses(allClasses);
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    }
  };

  const loadTeachers = async () => {
    try {
      const allTeachers = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
      setTeachers(allTeachers);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    }
  };

  const getTeacherName = (enseignantId?: number) => {
    if (!enseignantId) return 'Non assigné';
    const teacher = teachers.find(t => t.id === enseignantId);
    return teacher ? `${teacher.nom} ${teacher.prenom}` : 'Enseignant introuvable';
  };

  const filteredClasses = classes.filter(classe => 
    classe.nom_classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.niveau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">Gestion des classes et assignations</p>
        </div>
        <Link to="/classes/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle classe
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom de classe ou niveau..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-gai-blue focus:border-gai-blue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des classes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <School className="w-5 h-5 mr-2 text-gai-green" />
            Classes ({filteredClasses.length})
          </h3>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="p-12 text-center">
            <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aucune classe trouvée</p>
            <p className="text-sm text-gray-400">
              {classes.length === 0 ? 'Commencez par créer votre première classe.' : 'Essayez de modifier vos critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enseignant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élèves
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créée le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClasses.map((classe) => (
                  <tr key={classe.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gai-green rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {classe.nom_classe.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {classe.nom_classe}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {classe.niveau}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTeacherName(classe.enseignant_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        0 élèves
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classe.created_at.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/classes/${classe.id}`} className="text-gai-blue hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/classes/${classe.id}/edit`} className="text-gray-600 hover:text-gray-800">
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