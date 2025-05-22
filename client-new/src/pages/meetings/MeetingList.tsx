import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  VideoCameraIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Interfaces
interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'presencial' | 'virtual';
  location: string;
  participants: Participant[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  attendance?: 'confirmed' | 'pending' | 'declined';
}

/**
 * Componente que muestra el listado de reuniones
 */
const MeetingList: React.FC = () => {
  // Estado para las reuniones
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Cargar datos de ejemplo
  useEffect(() => {
    // Simulamos una carga de datos
    const loadMeetings = async () => {
      setIsLoading(true);
      try {
        // Aquí iría la llamada a la API para obtener las reuniones
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo
        const mockMeetings: Meeting[] = [
          {
            id: '1',
            title: 'Revisión del proyecto Alpha',
            description: 'Revisión del progreso del proyecto Alpha y planificación de próximos pasos',
            date: '2025-05-22',
            startTime: '10:00',
            endTime: '11:30',
            type: 'presencial',
            location: 'Sala de Juntas 1, Oficina Central',
            participants: [
              { id: '1', name: 'Carlos Martínez', avatar: '/avatars/1.jpg', role: 'Project Manager' },
              { id: '2', name: 'Ana García', avatar: '/avatars/2.jpg', role: 'Developer', attendance: 'confirmed' },
              { id: '3', name: 'Luis Rodríguez', avatar: '/avatars/3.jpg', role: 'Designer', attendance: 'pending' }
            ],
            status: 'scheduled'
          },
          {
            id: '2',
            title: 'Sprint Planning Q2',
            description: 'Planificación del sprint para el segundo trimestre',
            date: '2025-05-25',
            startTime: '09:00',
            endTime: '12:00',
            type: 'virtual',
            location: 'Zoom (ID: 123-456-789)',
            participants: [
              { id: '1', name: 'Carlos Martínez', avatar: '/avatars/1.jpg', role: 'Project Manager' },
              { id: '4', name: 'Elena Pérez', avatar: '/avatars/4.jpg', role: 'Backend Developer', attendance: 'confirmed' },
              { id: '5', name: 'Miguel Torres', avatar: '/avatars/5.jpg', role: 'Frontend Developer', attendance: 'confirmed' },
              { id: '6', name: 'Sara López', avatar: '/avatars/6.jpg', role: 'QA Engineer', attendance: 'declined' }
            ],
            status: 'scheduled'
          },
          {
            id: '3',
            title: 'Retrospectiva de Abril',
            description: 'Análisis de lo que salió bien y lo que se puede mejorar del mes anterior',
            date: '2025-04-30',
            startTime: '15:00',
            endTime: '16:00',
            type: 'virtual',
            location: 'Microsoft Teams',
            participants: [
              { id: '1', name: 'Carlos Martínez', avatar: '/avatars/1.jpg', role: 'Project Manager' },
              { id: '2', name: 'Ana García', avatar: '/avatars/2.jpg', role: 'Developer', attendance: 'confirmed' },
              { id: '4', name: 'Elena Pérez', avatar: '/avatars/4.jpg', role: 'Backend Developer', attendance: 'confirmed' },
              { id: '5', name: 'Miguel Torres', avatar: '/avatars/5.jpg', role: 'Frontend Developer', attendance: 'confirmed' }
            ],
            status: 'completed'
          },
          {
            id: '4',
            title: 'Presentación al cliente',
            description: 'Presentación de avances al cliente',
            date: '2025-04-28',
            startTime: '11:00',
            endTime: '12:30',
            type: 'presencial',
            location: 'Oficinas del cliente',
            participants: [
              { id: '1', name: 'Carlos Martínez', avatar: '/avatars/1.jpg', role: 'Project Manager' },
              { id: '7', name: 'Javier Ruiz', avatar: '/avatars/7.jpg', role: 'CEO', attendance: 'confirmed' },
              { id: '8', name: 'Patricia Gómez', avatar: '/avatars/8.jpg', role: 'Account Manager', attendance: 'confirmed' }
            ],
            status: 'completed'
          },
          {
            id: '5',
            title: 'Reunión técnica - Arquitectura',
            description: 'Discusión sobre la arquitectura del nuevo módulo',
            date: '2025-05-15',
            startTime: '14:00',
            endTime: '15:30',
            type: 'virtual',
            location: 'Google Meet',
            participants: [
              { id: '4', name: 'Elena Pérez', avatar: '/avatars/4.jpg', role: 'Backend Developer', attendance: 'confirmed' },
              { id: '5', name: 'Miguel Torres', avatar: '/avatars/5.jpg', role: 'Frontend Developer', attendance: 'confirmed' },
              { id: '9', name: 'Roberto Sánchez', avatar: '/avatars/9.jpg', role: 'CTO', attendance: 'pending' }
            ],
            status: 'cancelled'
          }
        ];
        
        setMeetings(mockMeetings);
        setFilteredMeetings(mockMeetings);
      } catch (err) {
        console.error('Error al cargar las reuniones:', err);
        setError('Error al cargar las reuniones. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMeetings();
  }, []);
  
  // Filtrar reuniones cuando cambian los filtros
  useEffect(() => {
    let result = meetings;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(meeting => 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(meeting => meeting.status === statusFilter);
    }
    
    // Filtrar por tipo
    if (typeFilter !== 'all') {
      result = result.filter(meeting => meeting.type === typeFilter);
    }
    
    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      if (dateFilter === 'today') {
        result = result.filter(meeting => meeting.date === todayStr);
      } else if (dateFilter === 'upcoming') {
        result = result.filter(meeting => meeting.date > todayStr);
      } else if (dateFilter === 'past') {
        result = result.filter(meeting => meeting.date < todayStr);
      }
    }
    
    setFilteredMeetings(result);
  }, [meetings, searchTerm, statusFilter, typeFilter, dateFilter]);
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Obtener el color de la etiqueta de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtener el nombre legible del estado
  const getStatusName = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };
  
  // Renderizar contenido principal
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (filteredMeetings.length === 0) {
      return (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reuniones</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all'
              ? 'No se encontraron reuniones con los filtros seleccionados.'
              : 'Comienza creando una nueva reunión.'}
          </p>
          <div className="mt-6">
            <Link
              to="/meetings/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nueva reunión
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="overflow-hidden shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredMeetings.map((meeting) => (
            <li key={meeting.id}>
              <Link to={`/meetings/${meeting.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${meeting.type === 'virtual' ? 'bg-purple-100' : 'bg-yellow-100'} rounded-md p-2`}>
                        {meeting.type === 'virtual' ? (
                          <VideoCameraIcon className="h-5 w-5 text-purple-600" />
                        ) : (
                          <UserGroupIcon className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600 truncate">{meeting.title}</p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{formatDate(meeting.date)}</span>
                          <span className="mx-2">&middot;</span>
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{meeting.startTime} - {meeting.endTime}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-4">
                        {meeting.participants.slice(0, 3).map((participant) => (
                          <div
                            key={participant.id}
                            className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                            title={participant.name}
                          >
                            {participant.avatar ? (
                              <img src={participant.avatar} alt={participant.name} />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-xs font-medium">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            )}
                          </div>
                        ))}
                        {meeting.participants.length > 3 && (
                          <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">+{meeting.participants.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {getStatusName(meeting.status)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="truncate">
                        <span className="font-medium">Ubicación:</span> {meeting.location}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reuniones</h1>
        <Link
          to="/meetings/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nueva reunión
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Buscar
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Buscar reuniones"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                id="status-filter"
                name="status-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="scheduled">Programadas</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                id="type-filter"
                name="type-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <select
                id="date-filter"
                name="date-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="today">Hoy</option>
                <option value="upcoming">Próximas</option>
                <option value="past">Pasadas</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de reuniones */}
      {renderContent()}
    </div>
  );
};

export default MeetingList;