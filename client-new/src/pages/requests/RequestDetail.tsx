import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/requestService';
import {
  RequestDetail as RequestDetailType,
  RequestStatus,
  RequestStatusColors,
  RequestStatusLabels,
  CommentCreate,
  StatusChangeRequest
} from '../../types/request';
import { Icon } from '../../components/ui';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<RequestDetailType | null>(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus | ''>('');
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isOwner = isClient && request?.clientId === user?.id;
  const isDraft = request?.status === RequestStatus.DRAFT;

  // Cargar detalle de la solicitud
  const loadRequest = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await requestService.getById(id);
      setRequest(response.request);
      setLoading(false);
    } catch (error) {
      console.error('Error loading request:', error);
      toast.error('Error al cargar la solicitud');
      setLoading(false);
      navigate('/app/requests');
    }
  };

  useEffect(() => {
    loadRequest();
  }, [id]);

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Función para obtener tiempo relativo
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Función para enviar un comentario
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }
    
    try {
      setSubmittingComment(true);
      const commentData: CommentCreate = { content: comment };
      await requestService.addComment(id!, commentData);
      setComment('');
      loadRequest();
      toast.success('Comentario añadido correctamente');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error al añadir el comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Función para cambiar el estado de la solicitud (admin)
  const handleStatusChange = async () => {
    if (!newStatus || !statusChangeReason.trim()) {
      toast.error('Debe seleccionar un estado y proporcionar una razón');
      return;
    }
    
    try {
      setChangingStatus(true);
      const statusChange: StatusChangeRequest = {
        status: newStatus as RequestStatus,
        reason: statusChangeReason
      };
      
      await requestService.changeStatus(id!, statusChange);
      setShowStatusChangeDialog(false);
      setNewStatus('');
      setStatusChangeReason('');
      loadRequest();
      toast.success(`Estado actualizado a ${RequestStatusLabels[newStatus as RequestStatus]}`);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Error al cambiar el estado');
    } finally {
      setChangingStatus(false);
    }
  };

  // Función para enviar una solicitud (cambiar de DRAFT a IN_PROCESS)
  const handleSubmitRequest = async () => {
    if (!window.confirm('¿Está seguro de enviar esta solicitud para revisión? No podrá modificarla una vez enviada.')) {
      return;
    }
    
    try {
      await requestService.submitRequest(id!);
      loadRequest();
      toast.success('Solicitud enviada correctamente para revisión');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Error al enviar la solicitud');
    }
  };

  // Función para eliminar una solicitud
  const handleDeleteRequest = async () => {
    if (!window.confirm('¿Está seguro de eliminar esta solicitud? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setDeleting(true);
      await requestService.delete(id!);
      toast.success('Solicitud eliminada correctamente');
      navigate('/app/requests');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Error al eliminar la solicitud');
      setDeleting(false);
    }
  };

  // Función para obtener el icono de estado
  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.DRAFT:
        return <Icon name="ClockIcon" className="text-gray-500" />;
      case RequestStatus.IN_PROCESS:
        return <Icon name="ArrowRightIcon" className="text-blue-500" />;
      case RequestStatus.IN_REVIEW:
        return <Icon name="MagnifyingGlassIcon" className="text-yellow-500" />;
      case RequestStatus.APPROVED:
        return <Icon name="CheckCircleIcon" className="text-green-500" />;
      case RequestStatus.REJECTED:
        return <Icon name="XCircleIcon" className="text-red-500" />;
      default:
        return <Icon name="ClockIcon" className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No se encontró la solicitud</p>
        <button
          onClick={() => navigate('/app/requests')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon name="ChevronLeftIcon" className="mr-2" />
          Volver a solicitudes
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Botón volver y acciones */}
      <div className="sm:flex sm:items-center justify-between mb-6">
        <button
          onClick={() => navigate('/app/requests')}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon name="ChevronLeftIcon" className="mr-1" />
          Volver
        </button>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {isOwner && isDraft && (
            <>
              <button
                onClick={() => navigate(`/app/requests/edit/${request.id}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Icon name="PencilIcon" className="mr-2 text-gray-500" />
                Editar
              </button>
              
              <button
                onClick={handleSubmitRequest}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Icon name="PaperAirplaneIcon" className="mr-2" />
                Enviar
              </button>
              
              <button
                onClick={handleDeleteRequest}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {deleting ? (
                  <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <Icon name="TrashIcon" className="mr-2" />
                )}
                Eliminar
              </button>
            </>
          )}
          
          {isAdmin && (
            <button
              onClick={() => setShowStatusChangeDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon name="ArrowRightIcon" className="mr-2" />
              Cambiar estado
            </button>
          )}
        </div>
      </div>

      {/* Información de la solicitud */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                {getStatusIcon(request.status)}
                <span className="ml-2">{request.title}</span>
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Creada {getRelativeTime(request.createdAt)}
                {request.updatedAt && ` · Actualizada ${getRelativeTime(request.updatedAt)}`}
              </p>
            </div>
            <div className={`px-2 py-1 rounded-full bg-${RequestStatusColors[request.status]}-100 text-${RequestStatusColors[request.status]}-800 text-xs font-medium`}>
              {request.statusLabel}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{request.description}</dd>
            </div>
            
            {request.amount && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Monto</dt>
                <dd className="mt-1 text-sm text-gray-900">${request.amount.toLocaleString()}</dd>
              </div>
            )}
            
            {request.dueDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha límite</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(request.dueDate)}</dd>
              </div>
            )}
            
            {request.tags && request.tags.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Etiquetas</dt>
                <dd className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {request.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Icon name="TagIcon" size="sm" className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            )}
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Cliente</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Icon name="UserIcon" size="sm" className="mr-1 text-gray-400" />
                {request.client ? `${request.client.firstName} ${request.client.lastName}` : 'No disponible'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Administrador asignado</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                {request.assignedAdmin ? (
                  <>
                    <Icon name="UserIcon" size="sm" className="mr-1 text-gray-400" />
                    {`${request.assignedAdmin.firstName} ${request.assignedAdmin.lastName}`}
                  </>
                ) : (
                  <span className="text-gray-500">No asignado</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Historial de estados */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">Historial de estados</h4>
            <div className="mt-4 flow-root">
              <ul className="-mb-8">
                {request.statusHistory.map((statusChange, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== request.statusHistory.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-${statusChange.toStatus ? RequestStatusColors[statusChange.toStatus as RequestStatus] : 'gray'}-100`}>
                            {getStatusIcon(statusChange.toStatus as RequestStatus)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {statusChange.fromStatus 
                                ? `Cambió de ${statusChange.fromStatusLabel} a ${statusChange.toStatusLabel}` 
                                : `Estado inicial: ${statusChange.toStatusLabel}`}
                              {statusChange.reason && (
                                <span className="font-medium text-gray-900"> - {statusChange.reason}</span>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={statusChange.changedAt}>
                              {formatDate(statusChange.changedAt)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Icon name="ChatBubbleLeftIcon" className="mr-2 text-gray-400" />
              Comentarios ({request.comments.length})
            </h4>
            
            {/* Formulario para añadir comentario */}
            <div className="mt-4">
              <form onSubmit={handleSubmitComment}>
                <div>
                  <label htmlFor="comment" className="sr-only">Añadir comentario</label>
                  <textarea
                    id="comment"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Añadir un comentario..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !comment.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submittingComment ? (
                      <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <Icon name="PaperAirplaneIcon" className="mr-2" />
                    )}
                    Enviar
                  </button>
                </div>
              </form>
            </div>
            
            {/* Lista de comentarios */}
            <div className="mt-6 space-y-6">
              {request.comments.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">No hay comentarios aún</p>
              ) : (
                request.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="font-medium text-gray-900 flex items-center">
                        {comment.user && (
                          <>
                            <Icon name="UserIcon" size="sm" className="mr-1 text-gray-400" />
                            {`${comment.user.firstName} ${comment.user.lastName}`}
                            {comment.user.role === 'admin' && (
                              <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                Admin
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getRelativeTime(comment.createdAt)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de cambio de estado (para administradores) */}
      {showStatusChangeDialog && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Cambiar estado de la solicitud</h3>
                  <div className="mt-4">
                    <label htmlFor="new-status" className="block text-sm font-medium text-gray-700">
                      Nuevo estado
                    </label>
                    <select
                      id="new-status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Seleccionar estado</option>
                      {Object.entries(RequestStatusLabels)
                        .filter(([key]) => key !== request.status) // Excluir el estado actual
                        .map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="status-reason" className="block text-sm font-medium text-gray-700">
                      Razón del cambio
                    </label>
                    <textarea
                      id="status-reason"
                      rows={3}
                      value={statusChangeReason}
                      onChange={(e) => setStatusChangeReason(e.target.value)}
                      className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Razón para el cambio de estado..."
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleStatusChange}
                  disabled={changingStatus || !newStatus || !statusChangeReason.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {changingStatus ? (
                    <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    'Guardar'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusChangeDialog(false);
                    setNewStatus('');
                    setStatusChangeReason('');
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;