import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { RequestStatus, RequestSummary } from '../../types/request';
import { requestService } from '../../services/requestService';
import { Icon } from '../../components/ui';
import ProjectRequestsTable from '../../components/projects/ProjectRequestsTable';

/**
 * Página de administración de solicitudes de proyectos informáticos
 * Para uso exclusivo de administradores
 */
const ProjectRequestsAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<RequestStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar solicitudes al iniciar o cuando cambian los filtros
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const response = await requestService.getAll(
          filterStatus || undefined,
          undefined,
          searchTerm || undefined,
          currentPage * itemsPerPage,
          itemsPerPage
        );
        // Usar response.requests (definido en la interfaz) y validar que no sea undefined
        setRequests(response.requests || response.items || []);
        setTotalItems(response.total);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        toast.error('No se pudieron cargar las solicitudes');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [filterStatus, searchTerm, currentPage, itemsPerPage]);

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Manejar cambio de filtro de estado
  const handleStatusFilterChange = (status: RequestStatus | null) => {
    setFilterStatus(status);
    setCurrentPage(0); // Resetear a primera página al cambiar filtro
  };

  // Manejar búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0); // Resetear a primera página al buscar
  };

  // Manejar clic en una solicitud
  const handleRequestClick = (requestId: string) => {
    navigate(`/app/requests/${requestId}`);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración de Solicitudes de Proyectos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona y revisa las solicitudes de proyectos informáticos de los clientes
          </p>
        </div>
      </div>

      {/* Banner informativo para administradores */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon name="InformationCircleIcon" className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">Sección de administración avanzada</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Esta sección permite gestionar todas las solicitudes de proyectos informáticos de manera centralizada.
                Puedes cambiar estados, asignar prioridades y comunicarte con los clientes directamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <ProjectRequestsTable 
        requests={requests}
        loading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onStatusFilterChange={handleStatusFilterChange}
        onSearch={handleSearch}
        onRequestClick={handleRequestClick}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        isAdmin={true}
      />
    </div>
  );
};

export default ProjectRequestsAdmin;