import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Edit, Trash2, ArrowLeft, Users } from 'lucide-react';
import { db } from '../../db/schema';
import type { Event, User as UserType, Class } from '../../types';
import Button from '../../components/ui/Button';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [responsable, setResponsable] = useState<UserType | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEvent(parseInt(id));
    }
  }, [id]);

  const loadEvent = async (eventId: number) => {
    try {
      const eventData = await db.events.get(eventId);
      if (eventData) {
        setEvent(eventData);
        
        // Load responsable
        const responsableData = await db.users.get(eventData.responsable_id);
        setResponsable(responsableData || null);
        
        // Load classes concernées
        if (eventData.classes_concernees && eventData.classes_concernees.length > 0) {
          const classesData = await db.classes.where('id').anyOf(eventData.classes_concernees).toArray();
          setClasses(classesData);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await db.events.delete(event.id);
        navigate('/events');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Planifié': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'En cours': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Terminé': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Annulé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gai-blue"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Événement non trouvé
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          L'événement que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link to="/events">
          <Button>Retour aux événements</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/events')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{event.titre}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(event.statut)}`}>
                {event.statut}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gai-blue text-white rounded-full">
                {event.type_activite}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to={`/events/${event.id}/edit`}>
            <Button variant="secondary" className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </Button>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Date and Time Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Informations temporelles
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gai-blue" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Date de début</p>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(event.date_debut)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gai-blue" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Date de fin</p>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(event.date_fin)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gai-blue" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Horaires</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatTime(event.heure_debut)} - {formatTime(event.heure_fin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Informations pratiques
              </h3>
              
              <div className="space-y-3">
                {event.lieu && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gai-blue" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Lieu</p>
                      <p className="text-gray-600 dark:text-gray-400">{event.lieu}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gai-blue" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Responsable</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {responsable ? `${responsable.prenom} ${responsable.nom}` : 'Non assigné'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classes concernées */}
          {classes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gai-blue" />
                Classes concernées
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {classes.map(classe => (
                  <div
                    key={classe.id}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
                  >
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {classe.nom_classe}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {classe.niveau}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                Créé le {new Date(event.created_at).toLocaleDateString('fr-FR')}
              </span>
              <span>
                Modifié le {new Date(event.updated_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}