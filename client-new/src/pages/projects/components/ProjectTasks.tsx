import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Icon } from '../../../components/ui';

interface ProjectTasksProps {
  tasks: any[];
}

/**
 * Componente para mostrar y gestionar las tareas de un proyecto
 */
const ProjectTasks: React.FC<ProjectTasksProps> = ({ tasks }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Filtrar tareas según el estado seleccionado
  const filteredTasks = activeFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === activeFilter);
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No definida';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Obtener clase para el estado de la tarea
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'en-progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendiente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtener texto legible para el estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completada':
        return 'Completada';
      case 'en-progreso':
        return 'En progreso';
      case 'pendiente':
        return 'Pendiente';
      default:
        return status;
    }
  };
  
  // Obtener icono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completada':
        return <Icon name="CheckCircleIcon" className="h-5 w-5 text-green-500" />;
      case 'en-progreso':
        return <Icon name="ClockIcon" className="h-5 w-5 text-yellow-500" />;
      case 'pendiente':
        return <Icon name="ClockIcon" className="h-5 w-5 text-gray-400" />;
      default:
        return <Icon name="ClockIcon" className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Acciones y filtros */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            type="button"
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeFilter === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeFilter === 'pendiente' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter('pendiente')}
          >
            Pendientes
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeFilter === 'en-progreso' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter('en-progreso')}
          >
            En progreso
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeFilter === 'completada' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter('completada')}
          >
            Completadas
          </button>
        </div>
        
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon name="PlusIcon" className="-ml-1 mr-2 h-5 w-5" />
          Nueva tarea
        </button>
      </div>
      
      {/* Lista de tareas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredTasks.length === 0 ? (
            <li className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500">No hay tareas que coincidan con el filtro seleccionado.</p>
            </li>
          ) : (
            filteredTasks.map(task => (
              <li key={task.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(task.status)}
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">{task.title}</h4>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    
                    <div className="ml-3 relative flex-shrink-0">
                      <Menu as="div">
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <span className="sr-only">Abrir menú</span>
                          <Icon name="DotsVerticalIcon" className="h-5 w-5" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Ver detalles
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Editar
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Cambiar estado
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-red-700`}
                              >
                                Eliminar
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Icon name="UserIcon" className="h-4 w-4 mr-1" />
                    Asignado a: {task.assignee}
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center text-gray-500 mr-4">
                      <span className="mr-1">Fecha límite:</span>
                      <span className={`${
                        task.status !== 'completada' && new Date(task.dueDate) < new Date() 
                          ? 'text-red-500 font-medium' 
                          : ''
                      }`}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    {task.completedAt && (
                      <div className="flex items-center text-green-500">
                        <Icon name="CheckCircleIcon" className="h-4 w-4 mr-1" />
                        Completada: {formatDate(task.completedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectTasks;