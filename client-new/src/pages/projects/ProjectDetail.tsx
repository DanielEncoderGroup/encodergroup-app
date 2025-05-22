import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: string;
  budget: number;
  team: string[];
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de carga de datos del proyecto
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProject({
        id: id || '1',
        name: 'Implementación ERP',
        description: 'Implementación de sistema ERP para gestión financiera y control de presupuestos en toda la organización. El proyecto incluye la capacitación de usuarios finales y la migración de datos desde sistemas anteriores.',
        status: 'active',
        startDate: '2023-01-15',
        endDate: '2023-07-30',
        manager: 'Carlos Rodríguez',
        budget: 120000,
        team: ['Ana Gómez', 'Miguel Sánchez', 'Laura Torres', 'Roberto Díaz']
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Proyecto no encontrado</h2>
          <p className="mt-1 text-sm text-gray-500">
            El proyecto que buscas no existe o ha sido eliminado.
          </p>
          <div className="mt-6">
            <Link
              to="/app/projects"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Volver a la lista de proyectos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Detalles del proyecto y actividades relacionadas.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/app/projects/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Editar
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Agregar tarea
          </button>
        </div>
      </div>

      {/* Estado del proyecto */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Información del proyecto
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalles y estado actual del proyecto.
            </p>
          </div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
            ${project.status === 'active' ? 'bg-green-100 text-green-800' : 
              project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'}`}>
            {project.status === 'active' ? 'Activo' : 
             project.status === 'pending' ? 'Pendiente' : 'Completado'}
          </span>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Descripción
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Responsable
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.manager}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Fechas
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Presupuesto
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ${project.budget.toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Equipo
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {project.team.map((member, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate">
                          {member}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Pestañas para secciones adicionales */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Tareas
            </button>
            <button
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Reuniones
            </button>
            <button
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Solicitudes
            </button>
            <button
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Documentos
            </button>
          </nav>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando una nueva tarea para este proyecto.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nueva tarea
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;