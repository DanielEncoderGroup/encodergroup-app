import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Request {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  projectId?: string;
  projectName?: string;
  requestType: string;
  user: {
    id: string;
    name: string;
  };
}

const RequestsList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setRequests([
        {
          id: '1',
          title: 'Viaje a conferencia de tecnología',
          description: 'Gastos de transporte y alojamiento para conferencia en Madrid',
          amount: 1200,
          status: 'pending',
          createdAt: '2023-05-10T08:30:00Z',
          projectId: '1',
          projectName: 'Implementación ERP',
          requestType: 'travel',
          user: {
            id: '1',
            name: 'Carlos Rodríguez'
          }
        },
        {
          id: '2',
          title: 'Capacitación equipo desarrollo',
          description: 'Gastos de capacitación para el equipo de desarrollo en nuevas tecnologías',
          amount: 800,
          status: 'approved',
          createdAt: '2023-05-05T10:15:00Z',
          projectId: '2',
          projectName: 'Migración a la nube',
          requestType: 'training',
          user: {
            id: '2',
            name: 'Ana Gómez'
          }
        },
        {
          id: '3',
          title: 'Materiales para oficina',
          description: 'Compra de materiales y equipos para nuevas estaciones de trabajo',
          amount: 350,
          status: 'rejected',
          createdAt: '2023-05-02T14:45:00Z',
          requestType: 'supplies',
          user: {
            id: '3',
            name: 'Miguel Sánchez'
          }
        },
        {
          id: '4',
          title: 'Viaje a reunión con cliente',
          description: 'Gastos de transporte y comida para reunión con cliente en Barcelona',
          amount: 250,
          status: 'completed',
          createdAt: '2023-04-28T09:00:00Z',
          projectId: '3',
          projectName: 'Desarrollo app móvil',
          requestType: 'travel',
          user: {
            id: '4',
            name: 'Laura Torres'
          }
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar solicitudes
  const filteredRequests = requests.filter((request) => {
    // Filtrar por término de búsqueda
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por estado
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const getRequestTypeText = (type: string) => {
    switch (type) {
      case 'travel':
        return 'Viaje';
      case 'training':
        return 'Capacitación';
      case 'supplies':
        return 'Suministros';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900">Solicitudes de viáticos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Lista de todas las solicitudes de viáticos y gastos.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/app/requests/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nueva solicitud
          </Link>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
        <div className="mb-4 sm:mb-0 w-full sm:w-64">
          <label htmlFor="search" className="sr-only">
            Buscar solicitudes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Buscar solicitudes"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="status-filter" className="sr-only">
            Filtrar por estado
          </label>
          <select
            id="status-filter"
            name="status-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
            <option value="completed">Completadas</option>
          </select>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <li key={request.id}>
                <Link to={`/app/requests/${request.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {request.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                            {getStatusText(request.status)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm font-medium text-gray-900">${request.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1zM9 5h2v4H9V5z" clipRule="evenodd" />
                          </svg>
                          {request.projectName || 'Sin proyecto asociado'}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                          {getRequestTypeText(request.requestType)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p>
                          {new Date(request.createdAt).toLocaleDateString()} por {request.user.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No se encontraron solicitudes que coincidan con los criterios de búsqueda.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RequestsList;