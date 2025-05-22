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
    try {
      const response = await api.get<RequestResponse>(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Crear una nueva solicitud
  create: async (request: RequestCreate) => {
    try {
      const response = await api.post('/requests', request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Actualizar una solicitud existente
  update: async (id: string, request: RequestUpdate) => {
    try {
      const response = await api.put(`/requests/${id}`, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Eliminar una solicitud
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Cambiar el estado de una solicitud (solo admin)
  changeStatus: async (id: string, statusChange: StatusChangeRequest) => {
    try {
      const response = await api.patch(`/requests/${id}/status`, statusChange);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Añadir un comentario a una solicitud
  addComment: async (id: string, comment: CommentCreate) => {
    try {
      const response = await api.post(`/requests/${id}/comments`, comment);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Enviar una solicitud para revisión (cambiar de DRAFT a IN_PROCESS)
  submitRequest: async (id: string) => {
    try {
      const response = await api.post(`/requests/${id}/submit`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default requestService;