import React from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckBadgeIcon,
  UserIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Importamos el componente Icon centralizado
import Icon from '../../../components/ui/Icon';

// Interfaces
interface RequestInfoProps {
  request: {
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
    amount?: number;
    currency?: string;
    startDate?: string;
    endDate?: string;
    reason?: string;
  };
}

/**
 * Componente que muestra la información detallada de una solicitud
 */
const RequestInfo: React.FC<RequestInfoProps> = ({ request }) => {
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
  
  // Renderizar información específica según el tipo de solicitud
  const renderTypeSpecificInfo = () => {
    switch (request.type) {
      case 'viático':
        return (
          <>
            {request.amount && request.currency && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Monto solicitado</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.amount.toLocaleString('es-ES')} {request.currency}
                </dd>
              </div>
            )}
            {request.startDate && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Fecha de inicio</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(request.startDate)}</dd>
              </div>
            )}
            {request.endDate && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Fecha de fin</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(request.endDate)}</dd>
              </div>
            )}
          </>
        );
      case 'permiso':
        return (
          <>
            {request.startDate && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Fecha de inicio</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(request.startDate)}</dd>
              </div>
            )}
            {request.endDate && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Fecha de fin</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(request.endDate)}</dd>
              </div>
            )}
            {request.reason && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Motivo</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.reason}</dd>
              </div>
            )}
          </>
        );
      case 'material':
        return (
          <>
            {request.amount && request.currency && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Costo estimado</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.amount.toLocaleString('es-ES')} {request.currency}
                </dd>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`${getStatusColor(request.status)} p-2 rounded-md mr-3`}>
              {getStatusIcon(request.status)}
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{request.title}</h3>
          </div>
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {getStatusName(request.status)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
              {getPriorityName(request.priority)}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Descripción</dt>
            <dd className="mt-1 text-sm text-gray-900">{request.description}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Icon name="TicketIcon" className="h-4 w-4 text-gray-400 mr-1" />
              Tipo de solicitud
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{getTypeName(request.type)}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
              Solicitante
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {request.requestedBy.name} ({request.requestedBy.department})
            </dd>
          </div>
          
          {request.assignedTo && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                Asignado a
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{request.assignedTo.name}</dd>
            </div>
          )}
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
              Fecha de creación
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(request.createdAt)}</dd>
          </div>
          
          {request.dueDate && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                Fecha límite
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(request.dueDate)}</dd>
            </div>
          )}
          
          {/* Información específica según el tipo de solicitud */}
          {renderTypeSpecificInfo()}
          
          {request.priority === 'urgente' && (
            <div className="sm:col-span-2">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Solicitud urgente</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Esta solicitud requiere atención inmediata. Por favor, procésala lo antes posible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default RequestInfo;