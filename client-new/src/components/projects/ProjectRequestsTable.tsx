import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestSummary, RequestStatus, RequestStatusColors, ProjectTypeLabels, PriorityLabels } from '../../types/request';
import { Icon } from '../ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProjectRequestsTableProps {
  requests: RequestSummary[];
  isLoading: boolean;
  onChangeStatus?: (requestId: string, status: RequestStatus) => void;
}

/**
 * Componente de tabla para mostrar y administrar solicitudes de proyectos
 * Incluye funcionalidades de filtrado, ordenamiento y acciones para los administradores
 */
const ProjectRequestsTable: React.FC<ProjectRequestsTableProps> = ({
  requests,
  isLoading,
  onChangeStatus
}) => {
  const navigate = useNavigate();
  
  // Estados para filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof RequestSummary>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Funciones de formateo y utilidad
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Manejar el cambio de ordenamiento
  const handleSort = (field: keyof RequestSummary) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filtrar y ordenar las solicitudes
  const filteredAndSortedRequests = useMemo(() => {
    return requests
      .filter(request => {
        // Filtro por búsqueda
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = 
          !searchTerm || 
          request.title.toLowerCase().includes(searchTermLower) ||
          request.description?.toLowerCase().includes(searchTermLower) ||
          request.client?.name?.toLowerCase().includes(searchTermLower) ||
          request.client?.email?.toLowerCase().includes(searchTermLower) ||
          request.id.toLowerCase().includes(searchTermLower);
        
        // Filtro por estado
        const matchesStatus = !statusFilter || request.status === statusFilter;
        
        // Filtro por tipo de proyecto
        const matchesType = !typeFilter || request.projectType === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        // Ordenamiento
        if (a[sortField] === undefined || b[sortField] === undefined) return 0;
        
        const valueA = a[sortField];
        const valueB = b[sortField];
        
        // Comparar fechas
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          const dateA = valueA ? new Date(valueA as string).getTime() : 0;
          const dateB = valueB ? new Date(valueB as string).getTime() : 0;
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Comparar strings
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
        
        // Comparar números
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        return 0;
      });
  }, [requests, searchTerm, statusFilter, typeFilter, sortField, sortDirection]);
  
  // Navegar a la vista detallada
  const handleViewDetails = (requestId: string) => {
    navigate(`/app/requests/${requestId}`);
  };
  
  // Opciones para los filtros select
  const statusOptions = useMemo(() => {
    // Usar un objeto para rastrear valores únicos en lugar de Set
    const statusMap: Record<string, boolean> = {};
    requests.forEach(req => {
      if (req.status) statusMap[req.status] = true;
    });
    const statuses = Object.keys(statusMap);
    
    return statuses.map(status => ({
      value: status,
      label: Object.entries(RequestStatus).find(([_, val]) => val === status)?.[0] || status
    }));
  }, [requests]);
  
  const typeOptions = useMemo(() => {
    // Usar un objeto para rastrear valores únicos en lugar de Set
    const typeMap: Record<string, boolean> = {};
    requests.forEach(req => {
      if (req.projectType) typeMap[req.projectType] = true;
    });
    const types = Object.keys(typeMap);
    
    return types.map(type => ({
      value: type || '',
      label: type ? (Object.prototype.hasOwnProperty.call(ProjectTypeLabels, type) ? ProjectTypeLabels[type as keyof typeof ProjectTypeLabels] : type) : 'No especificado'
    }));
  }, [requests]);
  
  return (
    <div className="flex flex-col">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[250px]">
            <label htmlFor="search" className="sr-only">Buscar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="MagnifyingGlassIcon" className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtro por estado */}
          <div className="w-full sm:w-auto">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              id="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por tipo */}
          <div className="w-full sm:w-auto">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">Tipo de Proyecto</label>
            <select
              id="type-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabla */}
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Columna de título */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Título
                      {sortField === 'title' && (
                        <Icon 
                          name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                          className="ml-1 h-4 w-4" 
                        />
                      )}
                    </div>
                  </th>
                  
                  {/* Columna de cliente */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('client')}
                  >
                    <div className="flex items-center">
                      Cliente
                      {sortField === 'client' && (
                        <Icon 
                          name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                          className="ml-1 h-4 w-4" 
                        />
                      )}
                    </div>
                  </th>
                  
                  {/* Columna de tipo */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('projectType')}
                  >
                    <div className="flex items-center">
                      Tipo
                      {sortField === 'projectType' && (
                        <Icon 
                          name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                          className="ml-1 h-4 w-4" 
                        />
                      )}
                    </div>
                  </th>
                  
                  {/* Columna de estado */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Estado
                      {sortField === 'status' && (
                        <Icon 
                          name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                          className="ml-1 h-4 w-4" 
                        />
                      )}
                    </div>
                  </th>
                  
                  {/* Columna de fecha */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Fecha
                      {sortField === 'createdAt' && (
                        <Icon 
                          name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                          className="ml-1 h-4 w-4" 
                        />
                      )}
                    </div>
                  </th>
                  
                  {/* Columna de acciones */}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      <Icon name="ArrowPathIcon" className="h-5 w-5 animate-spin inline mr-2" />
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : filteredAndSortedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron solicitudes de proyectos
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                      {/* Título */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-start">
                          <span className="truncate max-w-xs">{request.title}</span>
                        </div>
                      </td>
                      
                      {/* Cliente */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.client?.name || 'No asignado'}
                      </td>
                      
                      {/* Tipo */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.projectType ? (Object.prototype.hasOwnProperty.call(ProjectTypeLabels, request.projectType) ? ProjectTypeLabels[request.projectType as keyof typeof ProjectTypeLabels] : request.projectType) : 'N/A'}
                      </td>
                      
                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${RequestStatusColors[request.status]}-100 text-${RequestStatusColors[request.status]}-800`}>
                          {request.statusLabel || request.status}
                        </span>
                      </td>
                      
                      {/* Fecha */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                      
                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* Ver detalles */}
                          <button
                            type="button"
                            onClick={() => handleViewDetails(request.id)}
                            className="text-blue-600 hover:text-blue-900 focus:outline-none"
                            title="Ver detalles"
                          >
                            <Icon name="EyeIcon" className="h-5 w-5" />
                          </button>
                          
                          {/* Menú desplegable para cambio de estado */}
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-700 focus:outline-none"
                              title="Más acciones"
                              onClick={() => {
                                // Aquí implementar un menú desplegable con opciones como:
                                // - Avanzar estado
                                // - Rechazar
                                // - Otras acciones relevantes
                                // Por simplicidad, lo dejamos como una función directa para 
                                // avanzar estado (esto normalmente requeriría un componente de menú)
                                const nextStatus = (() => {
                                  switch (request.status) {
                                    case RequestStatus.SUBMITTED:
                                      return RequestStatus.REQUIREMENTS_ANALYSIS;
                                    case RequestStatus.REQUIREMENTS_ANALYSIS:
                                      return RequestStatus.PLANNING;
                                    case RequestStatus.PLANNING:
                                      return RequestStatus.ESTIMATION;
                                    case RequestStatus.ESTIMATION:
                                      return RequestStatus.PROPOSAL_READY;
                                    case RequestStatus.PROPOSAL_READY:
                                      return RequestStatus.APPROVED;
                                    case RequestStatus.APPROVED:
                                      return RequestStatus.IN_DEVELOPMENT;
                                    case RequestStatus.IN_DEVELOPMENT:
                                      return RequestStatus.COMPLETED;
                                    default:
                                      return null;
                                  }
                                })();
                                
                                if (nextStatus && onChangeStatus) {
                                  onChangeStatus(request.id, nextStatus);
                                }
                              }}
                            >
                              <Icon name="EllipsisVerticalIcon" className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRequestsTable;