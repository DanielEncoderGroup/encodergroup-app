import React from 'react';
import { Icon } from '../../../components/ui';

interface ActivityFeedProps {
  loading: boolean;
}

/**
 * Componente ActivityFeed que muestra la actividad reciente en el Dashboard
 */
const ActivityFeed: React.FC<ActivityFeedProps> = ({ loading }) => {
  // Datos de ejemplo para la actividad reciente
  const activities = [
    {
      id: 1,
      type: 'comment',
      user: 'Ana Silva',
      content: 'Comentó en el documento de especificaciones',
      project: 'Sistema de Gestión Empresarial',
      timestamp: '2023-04-11T15:30:00',
      iconName: 'ChatBubbleLeftEllipsisIcon'
    },
    {
      id: 2,
      type: 'update',
      user: 'Roberto Martínez',
      content: 'Actualizó el estado del sprint a "en revisión"',
      project: 'Aplicación Móvil de Logística',
      timestamp: '2023-04-11T14:15:00',
      iconName: 'PencilIcon'
    },
    {
      id: 3,
      type: 'create',
      user: 'Lucía Fernández',
      content: 'Creó un nuevo documento de arquitectura',
      project: 'Portal de Análisis de Datos',
      timestamp: '2023-04-11T11:40:00',
      iconName: 'DocumentPlusIcon'
    },
    {
      id: 4,
      type: 'complete',
      user: 'Diego Morales',
      content: 'Completó la tarea "Implementación de autenticación"',
      project: 'Plataforma E-learning',
      timestamp: '2023-04-11T10:20:00',
      iconName: 'CheckCircleIcon'
    },
    {
      id: 5,
      type: 'create',
      user: 'Carmen Rodríguez',
      content: 'Creó una nueva solicitud de cambio',
      project: 'Sistema de Gestión Empresarial',
      timestamp: '2023-04-11T09:05:00',
      iconName: 'DocumentPlusIcon'
    }
  ];

  // Función para formatear tiempo relativo
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace unos segundos';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
  };

  // Función para obtener color del icono según tipo
  const getIconColorClass = (type: string) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-100 text-blue-600';
      case 'update':
        return 'bg-yellow-100 text-yellow-600';
      case 'create':
        return 'bg-green-100 text-green-600';
      case 'complete':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Componente para el Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="p-4 flex">
          <div className="mr-4 h-10 w-10 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
      </div>
      
      <div className="bg-white overflow-y-auto" style={{ maxHeight: '32rem' }}>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getIconColorClass(activity.type)}`}>
                          <Icon name={activity.iconName} className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {activity.user}
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {activity.content} • {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Proyecto: {activity.project}</p>
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

export default ActivityFeed;