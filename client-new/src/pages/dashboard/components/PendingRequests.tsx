import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../components/ui';

interface PendingRequestsProps {
  loading: boolean;
}

/**
 * Componente PendingRequests que muestra las solicitudes pendientes en el Dashboard
 */
const PendingRequests: React.FC<PendingRequestsProps> = ({ loading }) => {
  // Datos de ejemplo para solicitudes pendientes
  const requests = [
    {
      id: 1,
      title: 'Cambio de alcance en módulo de reportes',
      project: 'Sistema de Gestión Empresarial',
      requester: 'Alejandro Gómez',
      requestDate: '2023-04-08T09:15:00',
      priority: 'alta',
      status: 'pendiente'
    },
    {
      id: 2,
      title: 'Incorporación de nuevo servicio API',
      project: 'Portal de Análisis de Datos',
      requester: 'Marina López',
      requestDate: '2023-04-09T11:30:00',
      priority: 'media',
      status: 'pendiente'
    },
    {
      id: 3,
      title: 'Optimización de consultas en base de datos',
      project: 'Aplicación Móvil de Logística',
      requester: 'Carlos Ruiz',
      requestDate: '2023-04-10T14:45:00',
      priority: 'baja',
      status: 'pendiente'
    }
  ];

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Función para obtener clases de color según prioridad
  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Componente para el Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {[1, 2, 3].map((item) => (
        <div key={item} className="p-4 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex items-center justify-between mt-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Icon name="InboxIcon" className="h-5 w-5 text-yellow-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Solicitudes Pendientes</h2>
        </div>
        <Link 
          to="/app/requests" 
          className="text-sm font-medium text-yellow-600 hover:text-yellow-500 flex items-center"
        >
          Ver todas
          <Icon name="ArrowRightIcon" className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="bg-white">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">{request.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClasses(request.priority)}`}>
                        Prioridad {request.priority}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Proyecto: {request.project}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Solicitado por: {request.requester} ({formatDate(request.requestDate)})
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Icon name="CheckCircleIcon" className="-ml-0.5 mr-1 h-4 w-4" />
                      Aprobar
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Icon name="XCircleIcon" className="-ml-0.5 mr-1 h-4 w-4" />
                      Rechazar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;