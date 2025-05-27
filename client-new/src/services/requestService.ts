import api from './api';
import {
  RequestCreate,
  RequestUpdate,
  StatusChangeRequest,
  CommentCreate,
  RequestsListResponse,
  RequestResponse,
  RequestStatus
} from '../types/request';
// Importamos el servicio mock para desarrollo
import { mockRequestService } from './mockRequestService';

// Flag para activar o desactivar el modo mock (desarrollo)
const USE_MOCK_SERVICE = true;

// Servicio para gestión de solicitudes
export const requestService = {
  // Obtener listado de solicitudes con filtros opcionales
  getAll: async (
    status?: RequestStatus,
    clientId?: string,
    search?: string,
    skip: number = 0,
    limit: number = 10
  ) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      return mockRequestService.getAll(status, clientId, search, skip, limit);
    }
    
    try {
      let url = `/requests?skip=${skip}&limit=${limit}`;
      
      if (status) {
        url += `&status=${status}`;
      }
      
      if (clientId) {
        url += `&client_id=${clientId}`;
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await api.get<RequestsListResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener una solicitud por su ID
  getById: async (id: string) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      return mockRequestService.getById(id);
    }
    
    try {
      const response = await api.get<RequestResponse>(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Crear una nueva solicitud
  create: async (request: RequestCreate) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      return mockRequestService.create(request);
    }
    
    try {
      const response = await api.post('/requests', request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Actualizar una solicitud existente
  update: async (id: string, request: RequestUpdate) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      return mockRequestService.update(id, request);
    }
    
    try {
      const response = await api.put(`/requests/${id}`, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Eliminar una solicitud
  delete: async (id: string) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      // No implementamos delete en el mock, pero devolvemos un objeto de éxito
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Solicitud eliminada correctamente' };
    }
    
    try {
      const response = await api.delete(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Cambiar el estado de una solicitud (solo admin)
  changeStatus: async (id: string, statusChange: StatusChangeRequest) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      return mockRequestService.changeStatus(id, statusChange);
    }
    
    try {
      const response = await api.patch(`/requests/${id}/status`, statusChange);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Añadir un comentario a una solicitud
  addComment: async (id: string, comment: CommentCreate) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      return mockRequestService.addComment(id, comment);
    }
    
    try {
      const response = await api.post(`/requests/${id}/comments`, comment);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Enviar una solicitud para revisión (cambiar de DRAFT a SUBMITTED)
  submitRequest: async (id: string) => {
    // Si estamos en modo mock, usamos el servicio mock
    if (USE_MOCK_SERVICE) {
      return mockRequestService.submitRequest(id);
    }
    
    try {
      const response = await api.post(`/requests/${id}/submit`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener el conteo de solicitudes no vistas (solo para administradores)
  getUnviewedCount: async () => {
    // Si estamos en modo mock, simulamos la respuesta
    if (USE_MOCK_SERVICE) {
      // Simulamos una respuesta con un número aleatorio entre 0 y 5
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, count: Math.floor(Math.random() * 6) };
    }
    
    try {
      const response = await api.get('/requests/unviewed/count');
      return response.data;
    } catch (error) {
      console.error('Error al obtener conteo de solicitudes no vistas:', error);
      return { success: false, count: 0 };
    }
  },
  
  // Marcar una solicitud como vista (solo para administradores)
  markRequestAsViewed: async (id: string) => {
    // Si estamos en modo mock, simulamos la respuesta
    if (USE_MOCK_SERVICE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, message: 'Solicitud marcada como vista' };
    }
    
    try {
      const response = await api.patch(`/requests/${id}/mark-viewed`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default requestService;