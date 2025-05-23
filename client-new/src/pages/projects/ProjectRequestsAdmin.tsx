import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/requestService';
import { RequestSummary, RequestStatus } from '../../types/request';
import { toast } from 'react-hot-toast';
import ProjectRequestsTable from '../../components/projects/ProjectRequestsTable';

/**
 * Página de administración de solicitudes de proyectos
 * Permite a los administradores visualizar, filtrar y gestionar todas las solicitudes
 * de proyectos informáticos en un formato optimizado
 */
const ProjectRequestsAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    approved: 0,
    rejected: 0
  });

  // Verificar que el usuario es administrador
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('No tienes permiso para acceder a esta página');
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  // Cargar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const response = await requestService.getAll();
        
        // Filtrar solo solicitudes de proyectos (aquellas que tienen projectType)
        const projectRequests = response.requests.filter((req: RequestSummary) => req.projectType);
        setRequests(projectRequests);
        
        // Calcular estadísticas
        const pending = projectRequests.filter((req: RequestSummary) => 
          req.status === RequestStatus.DRAFT || 
          req.status === RequestStatus.SUBMITTED ||
          req.status === RequestStatus.REQUIREMENTS_ANALYSIS
        ).length;
        
        const inProgress = projectRequests.filter((req: RequestSummary) => 
          req.status === RequestStatus.PLANNING || 
          req.status === RequestStatus.ESTIMATION ||
          req.status === RequestStatus.PROPOSAL_READY ||
          req.status === RequestStatus.IN_DEVELOPMENT
        ).length;
        
        const completed = projectRequests.filter((req: RequestSummary) => 
          req.status === RequestStatus.COMPLETED
        ).length;
        
        const approved = projectRequests.filter((req: RequestSummary) => 
          req.status === RequestStatus.APPROVED
        ).length;
        
        const rejected = projectRequests.filter((req: RequestSummary) => 
          req.status === RequestStatus.REJECTED
        ).length;
        
        setStats({
          total: projectRequests.length,
          pending,
          inProgress,
          completed,
          approved,
          rejected
        });
        
      } catch (error) {
        console.error('Error loading requests:', error);
        toast.error('Error al cargar las solicitudes de proyectos');
      } finally {
        setLoading(false);
      }
    };
    
    loadRequests();
  }, []);
  
  // Cambiar estado de una solicitud
  const handleChangeStatus = async (requestId: string, newStatus: RequestStatus) => {
    try {
      await requestService.changeStatus(requestId, {
        status: newStatus,
        reason: 'Actualización de estado desde panel de administración'
      });
      
      // Actualizar la lista de solicitudes
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus, statusLabel: newStatus } 
            : request
        )
      );
      
      toast.success(`Estado actualizado a ${newStatus}`);
    } catch (error) {
      console.error('Error changing request status:', error);
      toast.error('Error al cambiar el estado de la solicitud');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Administración de Solicitudes de Proyectos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona todas las solicitudes de proyectos informáticos en un solo lugar
        </p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Solicitudes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.pending}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">En Progreso</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats.inProgress}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Aprobados</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.approved}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completados</dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">{stats.completed}</dd>
          </div>
        </div>
      </div>
      
      {/* Tabla de solicitudes */}
      <ProjectRequestsTable 
        requests={requests} 
        isLoading={loading}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
};

export default ProjectRequestsAdmin;