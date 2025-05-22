import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Implementación ERP',
          description: 'Implementación de sistema ERP para gestión financiera',
          status: 'active',
          startDate: '2023-01-15',
          endDate: '2023-07-30',
        },
        {
          id: '2',
          name: 'Migración a la nube',
          description: 'Migración de infraestructura local a servicios en la nube',
          status: 'active',
          startDate: '2023-03-01',
          endDate: '2023-09-15',
        },
        {
          id: '3',
          name: 'Desarrollo app móvil',
          description: 'Desarrollo de aplicación móvil para clientes',
          status: 'pending',
          startDate: '2023-06-01',
          endDate: '2023-12-31',
        },
        {
          id: '4',
          name: 'Actualización infraestructura',
          description: 'Actualización de servidores y equipos de red',
          status: 'completed',
          startDate: '2023-02-10',
          endDate: '2023-04-20',
        },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar proyectos
  const filteredProjects = projects.filter((project) => {
    // Filtrar por término de búsqueda
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por estado
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <h2 className="text-2xl font-bold text-gray-900">Proyectos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Lista de todos los proyectos en curso y completados.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/app/projects/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nuevo proyecto
          </Link>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
        <div className="mb-4 sm:mb-0 w-full sm:w-64">
          <label htmlFor="search" className="sr-only">
            Buscar proyectos
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
              placeholder="Buscar proyectos"
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
            <option value="active">Activos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
          </select>
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <li key={project.id}>
                <Link to={`/app/projects/${project.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {project.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${project.status === 'active' ? 'bg-green-100 text-green-800' : 
                              project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {project.status === 'active' ? 'Activo' : 
                             project.status === 'pending' ? 'Pendiente' : 'Completado'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {project.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p>
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No se encontraron proyectos que coincidan con los criterios de búsqueda.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectsList;