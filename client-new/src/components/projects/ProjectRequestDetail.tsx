import React from 'react';
import { Link } from 'react-router-dom';
import { RequestDetail, RequestStatus, RequestStatusColors, ProjectTypeLabels, PriorityLabels } from '../../types/request';
import { Icon } from '../ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProjectRequestDetailProps {
  request: RequestDetail;
  isAdmin: boolean;
  onStatusChange?: (status: RequestStatus) => void;
  onAddComment?: (comment: string) => void;
}

/**
 * Componente para mostrar la vista detallada de una solicitud de proyecto
 * Organiza la información en secciones lógicas y proporciona acciones contextuales
 * según el rol del usuario y el estado del proyecto
 */
const ProjectRequestDetail: React.FC<ProjectRequestDetailProps> = ({
  request,
  isAdmin,
  onStatusChange,
  onAddComment
}) => {
  // Estado para el nuevo comentario
  const [newComment, setNewComment] = React.useState('');
  // Estado para el formulario de cambio de estado
  const [changeStatusReason, setChangeStatusReason] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<RequestStatus | ''>('');
  
  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Formatear fecha y hora
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'PPPp', { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Obtener color de estado
  const getStatusColor = (status: RequestStatus) => {
    return RequestStatusColors[status] || 'gray';
  };
  
  // Enviar comentario
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };
  
  // Cambiar estado
  const handleSubmitStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    
    if (onStatusChange) {
      onStatusChange(selectedStatus);
      setSelectedStatus('');
      setChangeStatusReason('');
    }
  };
  
  // Verificar si el proyecto puede pasar al siguiente estado
  const canAdvanceStatus = (currentStatus: RequestStatus): RequestStatus | null => {
    // Definimos el flujo de estados como un mapeo parcial en lugar de Record completo
    const statusFlow = {
      [RequestStatus.DRAFT]: RequestStatus.SUBMITTED,
      [RequestStatus.SUBMITTED]: RequestStatus.REQUIREMENTS_ANALYSIS,
      [RequestStatus.REQUIREMENTS_ANALYSIS]: RequestStatus.PLANNING,
      [RequestStatus.PLANNING]: RequestStatus.ESTIMATION,
      [RequestStatus.ESTIMATION]: RequestStatus.PROPOSAL_READY,
      [RequestStatus.PROPOSAL_READY]: RequestStatus.APPROVED,
      [RequestStatus.APPROVED]: RequestStatus.IN_DEVELOPMENT,
      [RequestStatus.IN_DEVELOPMENT]: RequestStatus.COMPLETED,
      [RequestStatus.COMPLETED]: RequestStatus.COMPLETED, // Ya está completado
      [RequestStatus.REJECTED]: RequestStatus.REJECTED, // Ya está rechazado
      // Estados legacy
      [RequestStatus.IN_PROCESS]: RequestStatus.REQUIREMENTS_ANALYSIS,
      [RequestStatus.IN_REVIEW]: RequestStatus.PLANNING
    } as Partial<Record<RequestStatus, RequestStatus>>;
    
    return statusFlow[currentStatus] || null;
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Encabezado */}
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <span className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(request.status)}-100 text-${getStatusColor(request.status)}-800`}>
              {request.statusLabel}
            </span>
            {request.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Solicitud #{request.id.substring(0, 8)} • Creada {formatDate(request.createdAt)}
          </p>
        </div>
        
        {/* Acciones rápidas */}
        <div className="flex space-x-3">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setSelectedStatus(canAdvanceStatus(request.status) || '')}
                disabled={!canAdvanceStatus(request.status)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Avanzar estado
              </button>
              
              {request.status !== RequestStatus.REJECTED && (
                <button
                  type="button"
                  onClick={() => setSelectedStatus(RequestStatus.REJECTED)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Rechazar
                </button>
              )}
            </>
          )}
          
          {!isAdmin && request.status === RequestStatus.DRAFT && (
            <button
              type="button"
              onClick={() => onStatusChange && onStatusChange(RequestStatus.SUBMITTED)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enviar solicitud
            </button>
          )}
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Descripción del proyecto */}
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-2">Descripción del Proyecto</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line text-sm text-gray-700">{request.description}</p>
              </div>
            </div>
            
            {/* Requisitos técnicos */}
            {request.technicalRequirements && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Requisitos Técnicos</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-line text-sm text-gray-700">{request.technicalRequirements}</p>
                </div>
              </div>
            )}
            
            {/* Objetivos de negocio */}
            {request.businessGoals && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Objetivos de Negocio</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-line text-sm text-gray-700">{request.businessGoals}</p>
                </div>
              </div>
            )}
            
            {/* Integraciones y público */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {request.integrationsNeeded && (
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-2">Integraciones Necesarias</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-line text-sm text-gray-700">{request.integrationsNeeded}</p>
                  </div>
                </div>
              )}
              
              {request.targetAudience && (
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-2">Público Objetivo</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-line text-sm text-gray-700">{request.targetAudience}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Información adicional */}
            {request.additionalInfo && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Información Adicional</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-line text-sm text-gray-700">{request.additionalInfo}</p>
                </div>
              </div>
            )}
            
            {/* Etiquetas */}
            {request.tags && request.tags.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {request.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Icon name="TagIcon" size="sm" className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Archivos adjuntos */}
            {request.files && request.files.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Archivos Adjuntos</h4>
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {request.files.map((file) => (
                    <li key={file.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <Icon name="PaperClipIcon" className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <span className="ml-2 flex-1 w-0 truncate">{file.filename}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Descargar
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Columna derecha - Información adicional y acciones */}
          <div className="space-y-6">
            {/* Información del cliente */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-base font-medium text-gray-900 mb-2">Cliente</h4>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Icon name="UserIcon" className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{request.client?.name || 'No asignado'}</p>
                  <p className="text-sm text-gray-500">{request.client?.email || 'No disponible'}</p>
                </div>
              </div>
            </div>
            
            {/* Detalles del proyecto */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-base font-medium text-gray-900 mb-2">Detalles del Proyecto</h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Tipo de Proyecto</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.projectType ? (Object.prototype.hasOwnProperty.call(ProjectTypeLabels, request.projectType) ? ProjectTypeLabels[request.projectType as keyof typeof ProjectTypeLabels] : request.projectType) : 'No especificado'}
                  </dd>
                </div>
                
                {request.priority && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Prioridad</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {PriorityLabels[request.priority]}
                    </dd>
                  </div>
                )}
                
                {request.budget !== undefined && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Presupuesto</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      ${request.budget.toLocaleString()}
                    </dd>
                  </div>
                )}
                
                {request.timeframe && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Plazo Deseado</dt>
                    <dd className="mt-1 text-sm text-gray-900">{request.timeframe}</dd>
                  </div>
                )}
                
                {request.estimatedHours !== undefined && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Horas Estimadas</dt>
                    <dd className="mt-1 text-sm text-gray-900">{request.estimatedHours}</dd>
                  </div>
                )}
                
                {request.costEstimate !== undefined && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Costo Estimado</dt>
                    <dd className="mt-1 text-sm text-gray-900">${request.costEstimate.toLocaleString()}</dd>
                  </div>
                )}
                
                {request.proposedStartDate && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Inicio Propuesto</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(request.proposedStartDate)}</dd>
                  </div>
                )}
                
                {request.proposedEndDate && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Finalización Propuesta</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(request.proposedEndDate)}</dd>
                  </div>
                )}
              </dl>
            </div>
            
            {/* Historial de cambios de estado */}
            {request.statusHistory && request.statusHistory.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Historial de Estado</h4>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {request.statusHistory.map((change, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== request.statusHistory.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center bg-${getStatusColor(change.toStatus)}-100`}>
                                <Icon name="ArrowPathIcon" className={`h-5 w-5 text-${getStatusColor(change.toStatus)}-600`} />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Cambió de <span className="font-medium">{change.fromStatusLabel || 'Inicial'}</span> a{' '}
                                  <span className="font-medium">{change.toStatusLabel}</span>
                                </p>
                                {change.reason && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    Razón: {change.reason}
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={change.changedAt}>{formatDateTime(change.changedAt)}</time>
                                <p className="text-xs">{change.changedBy?.name || 'Sistema'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Formulario de cambio de estado (para administradores) */}
            {isAdmin && selectedStatus && (
              <div className="bg-white border border-gray-200 p-4 rounded-md">
                <h4 className="text-base font-medium text-gray-900 mb-2">Cambiar Estado</h4>
                <form onSubmit={handleSubmitStatusChange}>
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Nuevo Estado
                    </label>
                    <select
                      id="status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as RequestStatus)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Seleccionar estado</option>
                      {Object.entries(RequestStatus)
                        .filter(([_, value]) => value !== request.status)
                        .map(([key, value]) => (
                          <option key={key} value={value}>
                            {key}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Razón del Cambio
                    </label>
                    <textarea
                      id="reason"
                      value={changeStatusReason}
                      onChange={(e) => setChangeStatusReason(e.target.value)}
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Explique por qué está cambiando el estado"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('')}
                      className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Guardar Cambio
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Comentarios */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">Comentarios</h4>
        
        {request.comments && request.comments.length > 0 ? (
          <ul className="space-y-4">
            {request.comments.map((comment) => (
              <li key={comment.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Icon name="UserIcon" className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user?.name || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(comment.createdAt)}
                    </p>
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                      {comment.content}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hay comentarios aún.</p>
        )}
        
        {/* Formulario de comentario */}
        <form onSubmit={handleSubmitComment} className="mt-6">
          <div>
            <label htmlFor="comment" className="sr-only">Añadir comentario</label>
            <textarea
              id="comment"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Añadir un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Icon name="PaperAirplaneIcon" className="h-4 w-4 mr-1" />
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectRequestDetail;