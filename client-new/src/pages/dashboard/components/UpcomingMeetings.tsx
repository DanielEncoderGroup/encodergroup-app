import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../components/ui';

interface UpcomingMeetingsProps {
  loading: boolean;
}

/**
 * Componente UpcomingMeetings que muestra las próximas reuniones en el Dashboard
 */
const UpcomingMeetings: React.FC<UpcomingMeetingsProps> = ({ loading }) => {
  // Datos de ejemplo para reuniones próximas
  const meetings = [
    {
      id: 1,
      title: 'Revisión de Requisitos',
      project: 'Sistema de Gestión Empresarial',
      datetime: '2023-04-12T10:00:00',
      duration: 60,
      type: 'virtual',
      link: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 2,
      title: 'Demo de Avance',
      project: 'Aplicación Móvil de Logística',
      datetime: '2023-04-14T15:30:00',
      duration: 45,
      type: 'virtual',
      link: 'https://zoom.us/j/123456789'
    },
    {
      id: 3,
      title: 'Planificación de Sprint',
      project: 'Plataforma E-learning',
      datetime: '2023-04-15T09:00:00',
      duration: 90,
      type: 'presencial',
      location: 'Oficina principal - Sala Turing'
    },
    {
      id: 4,
      title: 'Retrospectiva',
      project: 'Portal de Análisis de Datos',
      datetime: '2023-04-16T14:00:00',
      duration: 60,
      type: 'virtual',
      link: 'https://teams.microsoft.com/l/meeting/123'
    }
  ];

  // Función para formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date),
      time: new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    };
  };

  // Componente para el Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="p-4 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex items-center mt-2">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Icon name="CalendarIcon" className="h-5 w-5 text-green-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Próximas Reuniones</h2>
        </div>
        <Link 
          to="/app/meetings" 
          className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
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
            {meetings.map((meeting) => {
              const { date, time } = formatDateTime(meeting.datetime);
              return (
                <li key={meeting.id}>
                  <Link to={`/app/meetings/${meeting.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-green-600 truncate">{meeting.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            meeting.type === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {meeting.type === 'virtual' ? 'Virtual' : 'Presencial'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Proyecto: {meeting.project}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Icon name="CalendarIcon" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>
                          {date} - {time} ({meeting.duration} min)
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        {meeting.type === 'virtual' ? (
                          <>
                            <Icon name="VideoCameraIcon" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p className="truncate">Link de acceso disponible</p>
                          </>
                        ) : (
                          <>
                            <Icon name="MapPinIcon" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p className="truncate">{meeting.location}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetings;