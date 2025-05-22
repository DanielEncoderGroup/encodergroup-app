import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../components/ui';

interface RecentProjectsProps {
  loading: boolean;
}

/**
 * Componente RecentProjects que muestra los proyectos recientes en el Dashboard
 */
const RecentProjects: React.FC<RecentProjectsProps> = ({ loading }) => {
  // Datos de ejemplo para proyectos recientes
  const projects = [
    {
      id: 1,
      name: 'Sistema de Gestión Empresarial',
      client: 'TechCorp',
      progress: 75,
      lastUpdated: '2023-04-10T14:30:00',
      status: 'En progreso'
    },
    {
      id: 2,
      name: 'Aplicación Móvil de Logística',
      client: 'LogiTrans',
      progress: 40,
      lastUpdated: '2023-04-08T10:15:00',
      status: 'En progreso'
    },
    {
      id: 3,
      name: 'Plataforma E-learning',
      client: 'EduTech',
      progress: 90,
      lastUpdated: '2023-04-05T16:45:00',
      status: 'En revisión'
    },
    {
      id: 4,
      name: 'Portal de Análisis de Datos',
      client: 'DataInsights',
      progress: 60,
      lastUpdated: '2023-04-02T09:20:00',
      status: 'En progreso'
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

  // Función para determinar el color de la barra de progreso
  const getProgressColorClass = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Componente para el Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="p-4 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/5"></div>
            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Icon name="ClockIcon" className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Proyectos Recientes</h2>
        </div>
        <Link 
          to="/app/projects" 
          className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
        >
          Ver todos
          <Icon name="ArrowRightIcon" className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="bg-white">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id}>
                <Link to={`/app/projects/${project.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{project.name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'En progreso' ? 'bg-yellow-100 text-yellow-800' : 
                          project.status === 'En revisión' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Cliente: {project.client}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Actualizado: {formatDate(project.lastUpdated)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Progreso: {project.progress}%</div>
                        <div className="text-xs text-gray-500">{project.progress}%</div>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${getProgressColorClass(project.progress)} h-2 rounded-full`} 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentProjects;