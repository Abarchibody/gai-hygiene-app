import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Filter, Search, Clock, MapPin, User } from 'lucide-react';
import { userService, eventService } from '../../services';
import type { Event, User as UserType } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    loadEvents();
    loadUsers();
  }, []);

  const loadEvents = async () => {
    try {
      console.log('Loading events...');
      const allEvents = await eventService.getList();
      console.log('Events loaded:', allEvents.length);
      setEvents(allEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setEvents([]); // Set empty array on error
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getList();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const getResponsableName = (responsableId: number) => {
    const user = users.find(u => u.id === responsableId);
    return user ? `${user.prenom} ${user.nom}` : 'Non assigné';
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || event.statut === statusFilter;
    const matchesType = !typeFilter || event.type_activite === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Gestion des événements et activités d'hygiène</p>
        </div>
        <Link to="/events/create">
          <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel événement</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Tous les statuts</option>
              <option value="Planifié">Planifié</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-gai-blue focus:border-gai-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Tous les types</option>
              <option value="Sensibilisation">Sensibilisation</option>
              <option value="Formation">Formation</option>
              <option value="Contrôle">Contrôle</option>
              <option value="Activité collective">Activité collective</option>
              <option value="Personnalisé">Personnalisé</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              className="flex-1 sm:flex-none px-3 py-2"
            >
              Liste
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('calendar')}
              className="flex-1 sm:flex-none px-3 py-2"
            >
              <Calendar className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Calendrier</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Commencez par créer votre premier événement d'hygiène.
              </p>
              <Link to="/events/create">
                <Button>Créer un événement</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-4 lg:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 mb-3">
                        <Link
                          to={`/events/${event.id}`}
                          className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-gai-blue"
                        >
                          {event.titre}
                        </Link>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.statut)}`}>
                            {event.statut}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium bg-gai-blue text-white rounded-full">
                            {event.type_activite}
                          </span>
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>
                      )}
                      
                      <div className="flex flex-col space-y-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:space-y-0 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(event.date_debut)}
                            {event.date_debut !== event.date_fin && ` - ${formatDate(event.date_fin)}`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(event.heure_debut)} - {formatTime(event.heure_fin)}</span>
                        </div>
                        {event.lieu && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.lieu}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{getResponsableName(event.responsable_id)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Calendar View Placeholder */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Vue Calendrier
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            La vue calendrier sera disponible dans une prochaine version.
          </p>
        </div>
      )}
    </div>
  );
}