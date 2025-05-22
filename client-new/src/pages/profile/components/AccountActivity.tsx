import React, { useState } from 'react';
// Importamos el componente Icon centralizado en lugar de importar directamente de Heroicons
import Icon from '../../../components/ui/Icon';

/**
 * Componente para mostrar el historial de actividad de la cuenta del usuario
 */
const AccountActivity: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Datos de ejemplo para la actividad de la cuenta
  const activities = [
    {
      id: 1,
      type: 'login',
      description: 'Inicio de sesión exitoso',
      deviceInfo: 'Chrome en Windows',
      location: 'Madrid, España',
      ipAddress: '192.168.1.1',
      timestamp: '2023-04-11T10:20:00',
      iconName: "ArrowRightOnRectangleIcon"
    },
    {
      id: 2,
      type: 'profile',
      description: 'Actualización de perfil',
      deviceInfo: 'Chrome en Windows',
      location: 'Madrid, España',
      ipAddress: '192.168.1.1',
      timestamp: '2023-04-11T10:25:00',
      iconName: "UserIcon"
    },
    {
      id: 3,
      type: 'login',
      description: 'Inicio de sesión exitoso',
      deviceInfo: 'Safari en iPhone',
      location: 'Madrid, España',
      ipAddress: '192.168.1.2',
      timestamp: '2023-04-10T18:45:00',
      iconName: "ArrowRightOnRectangleIcon"
    },
    {
      id: 4,
      type: 'logout',
      description: 'Cierre de sesión',
      deviceInfo: 'Safari en iPhone',
      location: 'Madrid, España',
      ipAddress: '192.168.1.2',
      timestamp: '2023-04-10T19:30:00',
      iconName: "ArrowLeftOnRectangleIcon"
    },
    {
      id: 5,
      type: 'settings',
      description: 'Cambio de configuración de notificaciones',
      deviceInfo: 'Firefox en MacBook',
      location: 'Barcelona, España',
      ipAddress: '192.168.1.3',
      timestamp: '2023-04-05T09:30:00',
      // Usamos el nombre del icono como string para el componente Icon
      iconName: "CogIcon"
    },
    {
      id: 6,
      type: 'password',
      description: 'Cambio de contraseña',
      deviceInfo: 'Firefox en MacBook',
      location: 'Barcelona, España',
      ipAddress: '192.168.1.3',
      timestamp: '2023-04-05T09:35:00',
      iconName: "KeyIcon"
    },
    {
      id: 7,
      type: 'security',
      description: 'Intento de inicio de sesión fallido',
      deviceInfo: 'Dispositivo desconocido',
      location: 'Kiev, Ucrania',
      ipAddress: '203.0.113.1',
      timestamp: '2023-04-08T22:10:00',
      iconName: "ExclamationTriangleIcon"
    }
  ];
  
  // Filtrar actividades según los filtros seleccionados
  const filteredActivities = activities.filter((activity) => {
    // Filtro por tipo
    if (typeFilter !== 'all' && activity.type !== typeFilter) {
      return false;
    }
    
    // Filtro por tiempo
    if (timeFilter !== 'all') {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (timeFilter === 'today' && daysDiff >= 1) {
        return false;
      } else if (timeFilter === 'week' && daysDiff >= 7) {
        return false;
      } else if (timeFilter === 'month' && daysDiff >= 30) {
        return false;
      }
    }
    
    return true;
  });
  
  // Función para formatear fecha
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
  
  // Función para obtener clase de color según el tipo de actividad
  const getActivityColorClass = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      case 'password':
        return 'bg-blue-100 text-blue-800';
      case 'profile':
        return 'bg-purple-100 text-purple-800';
      case 'settings':
        return 'bg-yellow-100 text-yellow-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Función para obtener nombre legible del tipo de actividad
  const getActivityTypeName = (type: string) => {
    switch (type) {
      case 'login':
        return 'Inicio de sesión';
      case 'logout':
        return 'Cierre de sesión';
      case 'password':
        return 'Contraseña';
      case 'profile':
        return 'Perfil';
      case 'settings':
        return 'Configuración';
      case 'security':
        return 'Seguridad';
      default:
        return type;
    }
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-medium text-gray-900">Actividad de la Cuenta</h2>
      
      {/* Filtros */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Historial de actividad</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Registro de actividades recientes en tu cuenta.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 bg-gray-50">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700">
                Filtrar por tiempo
              </label>
              <select
                id="time-filter"
                name="time-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
              </select>
            </div>
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                Filtrar por tipo
              </label>
              <select
                id="type-filter"
                name="type-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="login">Inicios de sesión</option>
                <option value="logout">Cierres de sesión</option>
                <option value="password">Cambios de contraseña</option>
                <option value="profile">Actualizaciones de perfil</option>
                <option value="settings">Cambios de configuración</option>
                <option value="security">Alertas de seguridad</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de actividades */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="bg-white">
          <ul className="divide-y divide-gray-200">
            {filteredActivities.length === 0 ? (
              <li className="px-4 py-10 text-center">
                <Icon name="DocumentTextIcon" className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividad</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontró actividad con los filtros seleccionados.
                </p>
              </li>
            ) : (
              filteredActivities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`rounded-md p-2 ${activity.type === 'security' ? 'bg-red-100' : 'bg-blue-100'}`}>
                        <Icon name={activity.iconName} className={`h-5 w-5 ${activity.type === 'security' ? 'text-red-600' : 'text-blue-600'}`} />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{activity.description}</h4>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{formatDate(activity.timestamp)}</span>
                          <span className="mx-2">&middot;</span>
                          <span>{activity.deviceInfo}</span>
                          <span className="mx-2">&middot;</span>
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColorClass(activity.type)}`}>
                        {getActivityTypeName(activity.type)}
                      </span>
                    </div>
                  </div>
                  {activity.type === 'security' && (
                    <div className="mt-2 ml-11 text-sm text-red-600">
                      IP: {activity.ipAddress} - Este inicio de sesión fue bloqueado por motivos de seguridad.
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
        
        {filteredActivities.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Mostrando {filteredActivities.length} de {activities.length} actividades
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Exportar actividad
            </button>
          </div>
        )}
      </div>
      
      {/* Información de seguridad */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Información</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Mantenemos un registro de la actividad de tu cuenta durante 90 días por motivos de seguridad.
                Si detectas alguna actividad sospechosa, te recomendamos cambiar tu contraseña inmediatamente y contactar con soporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountActivity;