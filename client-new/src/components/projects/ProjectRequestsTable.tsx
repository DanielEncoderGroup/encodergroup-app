import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RequestSummary, RequestStatus, RequestStatusLabels, RequestStatusColors, ProjectType, ProjectTypeLabels } from '../../types/request';
import { Icon } from '../ui';

interface ProjectRequestsTableProps {
  requests: RequestSummary[];
  loading: boolean;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onStatusFilterChange: (status: RequestStatus | null) => void;
  onSearch: (term: string) => void;
  onRequestClick: (id: string) => void;
  filterStatus: RequestStatus | null;
  searchTerm: string;
  isAdmin: boolean;
}

/**
 * Tabla para mostrar y administrar solicitudes de proyectos informáticos
 */
const ProjectRequestsTable: React.FC<ProjectRequestsTableProps> = ({
  requests,
  loading,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onStatusFilterChange,
  onSearch,
  onRequestClick,
  filterStatus,
  searchTerm,
  isAdmin
}) => {
  const [sortColumn, setSortColumn] = useState<keyof RequestSummary>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Calcular número total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Manejar cambio de ordenación
  const handleSort = (column: keyof RequestSummary) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Manejar búsqueda
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  // Manejar reseteo de filtros
  const handleResetFilters = () => {
    setSearchInput('');
    onSearch('');
    onStatusFilterChange(null);
  };

  // Renderizar el estado con el color correspondiente
  const renderStatus = (status: RequestStatus, statusLabel: string) => {
    const color = RequestStatusColors[status] || 'gray';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
        {statusLabel}
      </span>
    );
  };

  // Renderizar el tipo de proyecto
  const renderProjectType = (type: ProjectType) => {
    // Verificar de manera segura si el tipo existe en ProjectTypeLabels
    const label = Object.prototype.hasOwnProperty.call(ProjectTypeLabels, type)
      ? ProjectTypeLabels[type]
      : type;
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {label}
      </span>
    );
  };

  // Renderizar las etiquetas
  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
            +{tags.length - 3}
          </span>
        )}
      </div>
    );
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Renderizar indicador de ordenación
  const renderSortIndicator = (column: keyof RequestSummary) => {
    if (column !== sortColumn) return null;
    
    return sortDirection === 'asc' 
      ? <Icon name="ChevronUpIcon" className="w-4 h-4 ml-1" /> 
      : <Icon name="ChevronDownIcon" className="w-4 h-4 ml-1" />;
  };

  // Manejar paginación
  const handlePrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  // Renderizar filtros de estado
  const renderStatusFilters = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        <button
          onClick={() => onStatusFilterChange(null)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filterStatus === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {Object.entries(RequestStatusLabels).map(([status, label]) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status as RequestStatus)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Controles de búsqueda y filtrado */}
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="MagnifyingGlassIcon" className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Buscar por título o descripción..."
            />
          </div>
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Buscar
          </button>
          {(searchTerm || filterStatus) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpiar filtros
            </button>
          )}
        </form>
      </div>

      {/* Filtros de estado */}
      {renderStatusFilters()}

      {/* Tabla de solicitudes */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Título
                  {renderSortIndicator('title')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Estado
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('projectType')}
              >
                <div className="flex items-center">
                  Tipo
                  {renderSortIndicator('projectType')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Etiquetas
              </th>
              {isAdmin && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('client')}
                >
                  <div className="flex items-center">
                    Cliente
                    {renderSortIndicator('client')}
                  </div>
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Fecha
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Cargando solicitudes...</span>
                  </div>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <div className="py-8">
                    <Icon name="InboxIcon" className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-base font-medium text-gray-900">No hay solicitudes disponibles</p>
                    <p className="text-gray-500">
                      {searchTerm || filterStatus
                        ? 'Prueba a cambiar los filtros de búsqueda'
                        : 'Crea una nueva solicitud para comenzar'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRequestClick(request.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.title}</div>
                    {request.progress !== undefined && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${request.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatus(request.status, request.statusLabel || RequestStatusLabels[request.status])}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderProjectType(request.projectType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderTags(request.tags || [])}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.client?.name}</div>
                      <div className="text-xs text-gray-500">{request.client?.email}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestClick(request.id);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <span className="sr-only">Ver detalles</span>
                      <Icon name="EyeIcon" className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{Math.min(currentPage * itemsPerPage + 1, totalItems)}</span> a{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * itemsPerPage, totalItems)}
                </span>{' '}
                de <span className="font-medium">{totalItems}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <Icon name="ChevronLeftIcon" className="h-5 w-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNumber: number;
                  if (totalPages <= 5) {
                    pageNumber = i;
                  } else if (currentPage < 3) {
                    pageNumber = i;
                  } else if (currentPage > totalPages - 3) {
                    pageNumber = totalPages - 5 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => onPageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <Icon name="ChevronRightIcon" className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRequestsTable;