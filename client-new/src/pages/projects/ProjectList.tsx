import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui';

/**
 * Página que muestra el listado de proyectos
 */
const ProjectList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Datos de ejemplo para proyectos
  const mockProjects = [
    {
      id: 1,
      name: 'Sistema de Gestión Empresarial',
      description: 'Plataforma integral para gestión de recursos y procesos empresariales',
      client: 'TechCorp',
      startDate: '2023-01-15',
      endDate: '2023-06-30',
      status: 'en-progreso',
      progress: 75,
      updatedAt: '2023-04-10T14:30:00',
      team: ['Ana Silva', 'Roberto Martínez', 'Carlos Ruiz'],
      budget: 120000
    },
    {
      id: 2,
      name: 'Aplicación Móvil de Logística',
      description: 'App para seguimiento y gestión de operaciones logísticas en tiempo real',
      client: 'LogiTrans',
      startDate: '2023-02-01',
      endDate: '2023-05-15',
      status: 'en-progreso',
      progress: 40,
      updatedAt: '2023-04-08T10:15:00',
      team: ['Diego Morales', 'Lucía Fernández', 'Marina López'],
      budget: 85000
    },
    {
      id: 3,
      name: 'Plataforma E-learning',
      description: 'Sistema de educación en línea con cursos interactivos y seguimiento de progreso',
      client: 'EduTech',
      startDate: '2023-01-10',
      endDate: '2023-04-20',
      status: 'en-revision',
      progress: 90,
      updatedAt: '2023-04-05T16:45:00',
      team: ['Carmen Rodríguez', 'Alejandro Gómez'],
      budget: 70000
    },
    {
      id: 4,
      name: 'Portal de Análisis de Datos',
      description: 'Plataforma para visualización y análisis de datos con dashboards personalizados',
      client: 'DataInsights',
      startDate: '2023-03-01',
      endDate: '2023-07-15',
      status: 'en-progreso',
      progress: 60,
      updatedAt: '2023-04-02T09:20:00',
      team: ['Roberto Martínez', 'Ana Silva'],
      budget: 95000
    },
    {
      id: 5,
      name: 'Sistema de Inventario',
      description: 'Aplicación para gestión y control de inventario con seguimiento en tiempo real',
      client: 'Distribuidora Global',
      startDate: '2022-11-15',
      endDate: '2023-03-01',
      status: 'completado',
      progress: 100,
      updatedAt: '2023-03-01T11:30:00',
      team: ['Carlos Ruiz', 'Lucía Fernández'],
      budget: 60000
    },
    {
      id: 6,
      name: 'App de Reservas',
      description: 'Aplicación para gestión de reservas y citas en múltiples locales',
      client: 'ServiceBook',
      startDate: '2022-12-10',
      endDate: '2023-02-28',
      status: 'completado',
      progress: 100,
      updatedAt: '2023-02-28T15:45:00',
      team: ['Marina López', 'Diego Morales'],
      budget: 45000
    }
  ];

  // Simular carga de datos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Aquí se implementaría la llamada real a la API
        // Por ahora, simulamos datos con un retraso
        setTimeout(() => {
          setProjects(mockProjects);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filtrar y ordenar proyectos
  useEffect(() => {
    let filtered = [...projects];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        project => 
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'client') {
        comparison = a.client.localeCompare(b.client);
      } else if (sortField === 'progress') {
        comparison = a.progress - b.progress;
      } else if (sortField === 'startDate') {
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (sortField === 'endDate') {
        comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      } else if (sortField === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortField === 'budget') {
        comparison = a.budget - b.budget;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, sortField, sortDirection]);

  // Función para cambiar el campo de ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  // Función para obtener clase CSS para el estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'en-progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'en-revision':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'pausado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener nombre legible del estado
  const getStatusName = (status: string) => {
    switch (status) {
      case 'en-progreso':
        return 'En Progreso';
      case 'en-revision':
        return 'En Revisión';
      case 'completado':
        return 'Completado';
      case 'pausado':
        return 'Pausado';
      default:
        return status;
    }
  };

  // Componente para el Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white overflow-hidden shadow rounded-lg mb-4">
          <div className="px-4 py-5 sm:p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>
          <Link
            to="/app/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Icon name="PlusIcon" className="-ml-1 mr-2 h-5 w-5" />
            Nuevo Proyecto
          </Link>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex items-center">
            <Icon name="MagnifyingGlassIcon" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              className="pl-10 py-2 pr-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="FunnelIcon" className="h-5 w-5 text-gray-400" />
            <select
              className="py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="en-progreso">En Progreso</option>
              <option value="en-revision">En Revisión</option>
              <option value="completado">Completado</option>
              <option value="pausado">Pausado</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="BarsArrowUpIcon" className="h-5 w-5 text-gray-400" />
            <select
              className="py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="updatedAt">Ordenar por: Última actualización</option>
              <option value="name">Ordenar por: Nombre</option>
              <option value="client">Ordenar por: Cliente</option>
              <option value="progress">Ordenar por: Progreso</option>
              <option value="startDate">Ordenar por: Fecha de inicio</option>
              <option value="endDate">Ordenar por: Fecha de fin</option>
              <option value="budget">Ordenar por: Presupuesto</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {sortDirection === 'asc' ? (
                <Icon name="ChevronUpIcon" className="h-5 w-5 text-gray-500" />
              ) : (
                <Icon name="ChevronDownIcon" className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        {/* Resultados */}
        <div className="mt-6">
          {loading ? (
            <SkeletonLoader />
          ) : (
            filteredProjects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Icon name="DocumentTextIcon" className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron proyectos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Prueba con otros filtros o crea un nuevo proyecto.
                </p>
                <div className="mt-6">
                  <Link
                    to="/app/projects/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Icon name="PlusIcon" className="-ml-1 mr-2 h-5 w-5" />
                    Crear proyecto
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Mostrando {filteredProjects.length} proyectos
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 truncate">
                              <Link to={`/app/projects/${project.id}`} className="hover:text-blue-600">
                                {project.name}
                              </Link>
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{project.client}</p>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(project.status)}`}>
                            {getStatusName(project.status)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Fecha de inicio:</span>
                            <span className="ml-2 font-medium">{formatDate(project.startDate)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Fecha de fin:</span>
                            <span className="ml-2 font-medium">{formatDate(project.endDate)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Última actualización:</span>
                            <span className="ml-2 font-medium">{formatDate(project.updatedAt)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Presupuesto:</span>
                            <span className="ml-2 font-medium">
                              {new Intl.NumberFormat('es-ES', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(project.budget)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <div className="flex items-center justify-between text-sm">
                            <div>Progreso: {project.progress}%</div>
                            <div className="flex -space-x-1">
                              {project.team.slice(0, 3).map((member: string, index: number) => (
                                <span
                                  key={index}
                                  className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 border border-white"
                                  title={member}
                                >
                                  {member.charAt(0)}
                                </span>
                              ))}
                              {project.team.length > 3 && (
                                <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 border border-white">
                                  +{project.team.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${getProgressColorClass(project.progress)} h-2 rounded-full`} 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <Link
                            to={`/app/projects/${project.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Ver detalles
                          </Link>
                          <Link
                            to={`/app/projects/${project.id}/edit`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Editar
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;