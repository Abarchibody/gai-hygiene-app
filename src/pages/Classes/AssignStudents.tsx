import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, AlertCircle } from 'lucide-react';
import { classService, userService } from '../../services';
import type { Class, User } from '../../types';
import Button from '../../components/ui/Button';

export default function AssignStudents() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classe, setClasse] = useState<Class | null>(null);
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (classId: number) => {
    try {
      // Charger la classe
      const classData = await classService.getOne(classId);
      if (!classData) {
        navigate('/classes');
        return;
      }
      setClasse(classData);

      // Charger tous les élèves
      const allStudents = await userService.getByType('Élève');
      
      // Pour simplifier, on affiche tous les élèves (filtrage des assignés sera implémenté plus tard)
      setAvailableStudents(allStudents);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStudentIds.length === 0 || !classe) return;

    setSubmitting(true);
    try {
      // Assigner les élèves à la classe
      for (const studentId of selectedStudentIds) {
        await classService.assignStudent(classe.id!, studentId);
      }
      navigate(`/classes/${classe.id}?students_assigned=${selectedStudentIds.length}`);
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!classe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Classe introuvable</h2>
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
            to={`/classes/${classe.id}`}
            className="text-gai-blue hover:text-blue-600 mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au détail
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-gai-blue" />
            Assigner des élèves à {classe.nom_classe}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Sélectionnez les élèves à assigner à cette classe
          </p>
        </div>

        {availableStudents.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aucun élève disponible</p>
            <p className="text-sm text-gray-400">
              Tous les élèves sont déjà assignés à des classes ou aucun élève n'existe.
            </p>
            <Link 
              to="/users/create" 
              className="text-gai-blue hover:underline text-sm mt-2 inline-block"
            >
              Créer un nouvel élève
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 inline mr-1" />
                Sélectionner les élèves à assigner
              </label>
              <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3">
                {availableStudents.map((student) => (
                  <label 
                    key={student.id} 
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id!)}
                      onChange={() => handleStudentToggle(student.id!)}
                      className="mr-3"
                    />
                    <div className="w-8 h-8 bg-gai-blue rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {student.prenom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.nom} {student.prenom}
                      </div>
                      {student.email && (
                        <div className="text-sm text-gray-500">{student.email}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {selectedStudentIds.length} élève{selectedStudentIds.length > 1 ? 's' : ''} sélectionné{selectedStudentIds.length > 1 ? 's' : ''}
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/classes/${classe.id}`)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting || selectedStudentIds.length === 0}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {submitting ? 'Assignation...' : `Assigner ${selectedStudentIds.length} élève${selectedStudentIds.length > 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}