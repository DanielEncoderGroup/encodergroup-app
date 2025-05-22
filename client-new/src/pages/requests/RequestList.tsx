import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  CheckBadgeIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Interfaces
interface Request {
  id: string;
  title: string;
  description: string;
  type: 'viático' | 'permiso' | 'material' | 'soporte' | 'otro';
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'en_proceso';
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  requestedBy: {
    id: string;
    name: string;
    avatar?: string;
    department: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  comments?: number;
}

/**
 * Componente que muestra el listado de solicitudes
 */
const RequestList: React.FC = () => {
  // Estado para las solicitudes
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Cargar datos de ejemplo
  useEffect(() => {
    // Simulamos una carga de datos
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        // Aquí iría la llamada a la API para obtener las solicitudes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo
        const mockRequests: Request[] = [
          {
            id: '1',
            title: 'Solicitud de viáticos para visita a cliente',
            description: 'Necesito viáticos para la visita al cliente XYZ Corp. en Madrid el día 28 de mayo.',
            type: 'viático',
            status: 'pendiente',
            priority: 'alta',
            requestedBy: {
              id: '2',
              name: 'Ana García',
              avatar: '/avatars/2.jpg',
              department: 'Desarrollo'
            },
            createdAt: '2025-05-20T09:30:00',
            updatedAt: '2025-05-20T09:30:00',
            dueDate: '2025-05-26T00:00:00',
            comments: 2
          },
          {
            id: '2',
            title: 'Permiso para ausentarse por asuntos familiares',
            description: 'Solicito permiso para ausentarme los días 1 y 2 de junio por asuntos familiares.',
            type: 'permiso',
            status: 'aprobada',
            priority: 'media',
            requestedBy: {
              id: '3',
              name: 'Luis Rodríguez',
              avatar: '/avatars/3.jpg',
              department: 'Diseño'
            },
            assignedTo: {
              id: '1',
              name: 'Carlos Martínez',
              avatar: '/avatars/1.jpg'
            },
            createdAt: '2025-05-18T14:20:00',
            updatedAt: '2025-05-19T10:15:00',
            dueDate: '2025-05-31T00:00:00'
          },
          {
            id: '3',
            title: 'Solicitud de material de oficina',
            description: 'Necesito un nuevo monitor para el equipo de desarrollo.',
            type: 'material',
            status: 'en_proceso',
            priority: 'baja',
            requestedBy: {
              id: '4',
              name: 'Elena Pérez',
              avatar: '/avatars/4.jpg',
              department: 'Desarrollo'
            },
            assignedTo: {
              id: '8',
              name: 'Patricia Gómez',
              avatar: '/avatars/8.jpg'
            },
            createdAt: '2025-05-15T11:45:00',
            updatedAt: '2025-05-16T09:30:00',
            comments: 4
          },
          {
            id: '4',
            title: 'Soporte técnico para equipo de desarrollo',
            description: 'El servidor de desarrollo está presentando problemas de rendimiento.',
            type: 'soporte',
            status: 'pendiente',
            priority: 'urgente',
            requestedBy: {
              id: '5',
              name: 'Miguel Torres',
              avatar: '/avatars/5.jpg',
              department: 'Desarrollo'
            },
            createdAt: '2025-05-21T08:15:00',
            updatedAt: '2025-05-21T08:15:00',
            dueDate: '2025-05-22T00:00:00',
            comments: 1
          },
          {
            id: '5',
            title: 'Solicitud de capacitación en React Native',
            description: 'Solicito autorización y presupuesto para asistir al curso de React Native que se impartirá el próximo mes.',
            type: 'otro',
            status: 'rechazada',
            priority: 'media',
            requestedBy: {
              id: '6',
              name: 'Sara López',
              avatar: '/avatars/6.jpg',
              department: 'QA'
            },
            assignedTo: {
              id: '9',
              name: 'Roberto Sánchez',
              avatar: '/avatars/9.jpg'
            },
            createdAt: '2025-05-10T16:20:00',
            updatedAt: '2025-05-12T11:30:00',
            comments: 3
          }
        ];
        
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
      } catch (err) {
        console.error('Error al cargar las solicitudes:', err);
        setError('Error al cargar las solicitudes. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequests();
  }, []);
  
  // Filtrar solicitudes cuando cambian los filtros
  useEffect(() => {
    let result = requests;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(request => 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    // Filtrar por tipo
    if (typeFilter !== 'all') {
      result = result.filter(request => request.type === typeFilter);
    }
    
    // Filtrar por prioridad
    if (priorityFilter !== 'all') {
      result = result.filter(request => request.priority === priorityFilter);
    }
    
    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter, typeFilter, priorityFilter]);
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Obtener el color según el estado de la solicitud
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtener el icono según el estado de la solicitud
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'aprobada':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'rechazada':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'en_proceso':
        return <CheckBadgeIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Obtener el nombre legible del estado
  const getStatusName = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'aprobada':
        return 'Aprobada';
      case 'rechazada':
        return 'Rechazada';
      case 'en_proceso':
        return 'En proceso';
      default:
        return status;
    }
  };
  
  // Obtener el nombre legible del tipo
  const getTypeName = (type: string) => {
    switch (type) {
      case 'viático':
        return 'Viático';
      case 'permiso':
        return 'Permiso';
      case 'material':
        return 'Material';
      case 'soporte':
        return 'Soporte';
      case 'otro':
        return 'Otro';
      default:
        return type;
    }
  };
  
  // Obtener el color según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja':
        return 'bg-green-100 text-green-800';
      case 'media':
        return 'bg-blue-100 text-blue-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'urgente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtener el nombre legible de la prioridad
  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'baja':
        return 'Baja';
      case 'media':
        return 'Media';
      case 'alta':
        return 'Alta';
      case 'urgente':
        return 'Urgente';
      default:
        return priority;
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
    
    if (filteredRequests.length === 0) {
      return (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
              ? 'No se encontraron solicitudes con los filtros seleccionados.'
              : 'Comienza creando una nueva solicitud.'}
          </p>
          <div className="mt-6">
            <Link
              to="/requests/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nueva solicitud
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="overflow-hidden shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <li key={request.id}>
              <Link to={`/requests/${request.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${getStatusColor(request.status)} rounded-md p-2`}>
                        {getStatusIcon(request.status)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600 truncate">{request.title}</p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="truncate">{request.description}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusName(request.status)}
                      </span>
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {getPriorityName(request.priority)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {request.requestedBy.name}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {getTypeName(request.type)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Creada el <time dateTime={request.createdAt}>{formatDate(request.createdAt)}</time>
                      </p>
                      {request.dueDate && (
                        <p className="ml-4">
                          Vence el <time dateTime={request.dueDate}>{formatDate(request.dueDate)}</time>
                        </p>
                      )}
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
        <h1 className="text-2xl font-semibold text-gray-900">Solicitudes</h1>
        <Link
          to="/requests/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nueva solicitud
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="col-span-2">
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
                  placeholder="Buscar solicitudes"
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
                <option value="pendiente">Pendientes</option>
                <option value="en_proceso">En proceso</option>
                <option value="aprobada">Aprobadas</option>
                <option value="rechazada">Rechazadas</option>
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
                <option value="viático">Viáticos</option>
                <option value="permiso">Permisos</option>
                <option value="material">Materiales</option>
                <option value="soporte">Soporte</option>
                <option value="otro">Otros</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700">
                Prioridad
              </label>
              <select
                id="priority-filter"
                name="priority-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de solicitudes */}
      {renderContent()}
    </div>
  );
};

export default RequestList;