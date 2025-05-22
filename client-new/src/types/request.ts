import { User } from './index';

// Estados posibles de una solicitud
export enum RequestStatus {
  DRAFT = 'draft',
  IN_PROCESS = 'in_process',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Etiquetas para los estados
export const RequestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.DRAFT]: 'Borrador',
  [RequestStatus.IN_PROCESS]: 'En proceso',
  [RequestStatus.IN_REVIEW]: 'En revisión',
  [RequestStatus.APPROVED]: 'Aprobado',
  [RequestStatus.REJECTED]: 'Rechazado'
};

// Colores para los estados
export const RequestStatusColors: Record<RequestStatus, string> = {
  [RequestStatus.DRAFT]: 'gray',
  [RequestStatus.IN_PROCESS]: 'blue',
  [RequestStatus.IN_REVIEW]: 'yellow',
  [RequestStatus.APPROVED]: 'green',
  [RequestStatus.REJECTED]: 'red'
};

// Modelo para comentarios
export interface RequestComment {
  id: string;
  content: string;
  createdAt: string;
  user?: User;
}

// Modelo para archivos adjuntos
export interface RequestFile {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  user?: User;
}

// Modelo para cambios de estado
export interface StatusChange {
  fromStatus: RequestStatus | null;
  fromStatusLabel?: string;
  toStatus: RequestStatus;
  toStatusLabel?: string;
  changedAt: string;
  reason?: string;
  changedBy?: User;
}

// Modelo de solicitud (resumido para listados)
export interface RequestSummary {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  statusLabel: string;
  clientId: string;
  client?: User;
  assignedTo?: string;
  assignedAdmin?: User;
  amount?: number;
  dueDate?: string;
  tags: string[];
  commentsCount: number;
  filesCount: number;
  createdAt: string;
  updatedAt?: string;
}

// Modelo de solicitud detallada
export interface RequestDetail extends RequestSummary {
  comments: RequestComment[];
  files: RequestFile[];
  statusHistory: StatusChange[];
}

// Modelo para crear una solicitud
export interface RequestCreate {
  title: string;
  description: string;
  amount?: number;
  dueDate?: string;
  tags?: string[];
}

// Modelo para actualizar una solicitud
export interface RequestUpdate {
  title?: string;
  description?: string;
  status?: RequestStatus;
  assignedTo?: string;
  amount?: number;
  dueDate?: string;
  tags?: string[];
}

// Modelo para cambiar el estado
export interface StatusChangeRequest {
  status: RequestStatus;
  reason?: string;
}

// Modelo para crear un comentario
export interface CommentCreate {
  content: string;
}

// Respuesta de listado de solicitudes
export interface RequestsListResponse {
  success: boolean;
  total: number;
  skip: number;
  limit: number;
  requests: RequestSummary[];
}

// Respuesta de una solicitud individual
export interface RequestResponse {
  success: boolean;
  request: RequestDetail;
}