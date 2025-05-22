import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  DocumentPlusIcon,
  UserIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

// Interfaces
interface Event {
  id: string;
  type: 'created' | 'status_changed' | 'comment_added' | 'file_added' | 'assigned';
  date: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content?: string;
  status?: 'pendiente' | 'aprobada' | 'rechazada' | 'en_proceso';
  fileName?: string;
  fileUrl?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface RequestTimelineProps {
  events: Event[];
}

/**
 * Componente que muestra la línea de tiempo de eventos de una solicitud
 */
const RequestTimeline: React.FC<RequestTimelineProps> = ({ events }) => {
  // Ordenar eventos por fecha (más recientes primero)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Obtener icono según el tipo de evento
  const getEventIcon = (event: Event) => {
    switch (event.type) {
      case 'created':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
            <DocumentPlusIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
          </div>
        );
      case 'status_changed':
        if (event.status === 'aprobada') {
          return (
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
              <CheckCircleIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
          );
        } else if (event.status === 'rechazada') {
          return (
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center ring-8 ring-white">
              <XCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
          );
        } else if (event.status === 'en_proceso') {
          return (
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
              <UserCircleIcon className="h-5 w-5 text-teal-600" aria-hidden="true" />
            </div>
          );
        } else {
          return (
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center ring-8 ring-white">
              <ClockIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
            </div>
          );
        }
      case 'comment_added':
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
            <ChatBubbleLeftIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
        );
      case 'file_added':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ring-8 ring-white">
            <DocumentPlusIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
          </div>
        );
      case 'assigned':
        return (
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
            <UserIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
            <DocumentPlusIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </div>
        );
    }
  };
  
  // Obtener el texto del evento
  const getEventText = (event: Event) => {
    switch (event.type) {
      case 'created':
        return (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">{event.user.name}</span> creó esta solicitud.
          </p>
        );
      case 'status_changed':
        return (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">{event.user.name}</span> cambió el estado de la solicitud a{' '}
            <span className="font-medium">
              {event.status === 'pendiente' && 'Pendiente'}
              {event.status === 'aprobada' && 'Aprobada'}
              {event.status === 'rechazada' && 'Rechazada'}
              {event.status === 'en_proceso' && 'En proceso'}
            </span>
            {event.content && ': ' + event.content}
          </p>
        );
      case 'comment_added':
        return (
          <div>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">{event.user.name}</span> comentó:
            </p>
            {event.content && (
              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100">
                {event.content}
              </div>
            )}
          </div>
        );
      case 'file_added':
        return (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">{event.user.name}</span> añadió un archivo:{' '}
            {event.fileUrl ? (
              <a href={event.fileUrl} className="font-medium text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                {event.fileName}
              </a>
            ) : (
              <span className="font-medium">{event.fileName}</span>
            )}
          </p>
        );
      case 'assigned':
        return (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">{event.user.name}</span> asignó la solicitud a{' '}
            <span className="font-medium text-gray-900">{event.assignedTo?.name}</span>
          </p>
        );
      default:
        return (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">{event.user.name}</span> realizó una acción.
          </p>
        );
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Actividad</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Historial de actividad y cambios de la solicitud.
        </p>
      </div>
      <div className="px-4 py-5 sm:px-6">
        {sortedEvents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No hay actividad registrada para esta solicitud.</p>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {sortedEvents.map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== sortedEvents.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>{getEventIcon(event)}</div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          {getEventText(event)}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={event.date}>{formatDate(event.date)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTimeline;