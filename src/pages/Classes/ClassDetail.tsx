import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Users, UserPlus, User } from 'lucide-react';
import { classService, userService } from '../../services';
import type { Class, User as UserType } from '../../types';
import Button from '../../components/ui/Button';

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classe, setClasse] = useState<Class | null>(null);
  const [teacher, setTeacher] = useState<UserType | null>(null);
  const [students, setStudents] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadClass(parseInt(id));
    }
  }, [id]);

  const loadClass = async (classId: number) => {
    try {
      const classData = await classService.getOne(classId);
      setClasse(classData);

      if (classData?.enseignant_id) {
        const teacherData = await userService.getOne(classData.enseignant_id);
        setTeacher(teacherData);
      }

      // Charger les élèves de cette classe
      const studentsData = await classService.getStudents(classId);
      setStudents(studentsData.map(s => s.utilisateur).filter(Boolean));
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classe || !confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      return;
    }

    try {
      await classService.delete(classe.id!);
      navigate('/classes?deleted=1');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!classe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Classe introuvable</h2>
        <Link to="/classes" className="text-gai-blue hover:underline">
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
            to="/classes" 
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Link>
        </div>
        <div className="flex space-x-3">
          <Link to={`/classes/${classe.id}/edit`}>
            <Button variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
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
                <div className="w-12 h-12 bg-gai-green rounded-full flex items-center justify-center text-white text-lg font-medium mr-4">
                  {classe.nom_classe.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {classe.nom_classe}
                  </h2>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {classe.niveau}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Informations de la classe
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom de la classe
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{classe.nom_classe}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Niveau
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{classe.niveau}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Enseignant responsable
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {teacher ? `${teacher.nom} ${teacher.prenom}` : 
                     <span className="text-gray-400 dark:text-gray-500 italic">Non assigné</span>}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Nombre d'élèves
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{students.length} élève{students.length > 1 ? 's' : ''}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Créée le
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(classe.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modifiée le
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(classe.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Élèves de la classe */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gai-blue" />
                Élèves ({students.length})
              </h3>
              <Link to={`/classes/${classe.id}/assign-students`}>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </Link>
            </div>
            
            <div className="p-6">
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun élève assigné</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="w-8 h-8 bg-gai-blue rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {student.prenom.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {student.nom} {student.prenom}
                        </div>
                        {student.email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{student.email}</div>
                        )}
                      </div>
                      <Link 
                        to={`/users/${student.id}`}
                        className="text-gai-blue hover:text-blue-600 text-sm"
                      >
                        Voir
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}