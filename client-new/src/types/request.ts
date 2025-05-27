import { User } from './index';

// Estados posibles de una solicitud
export enum RequestStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted', // Enviado para evaluación inicial
  REQUIREMENTS_ANALYSIS = 'requirements_analysis', // Análisis de requisitos
  PLANNING = 'planning', // Planificación técnica
  ESTIMATION = 'estimation', // Estimación de recursos
  PROPOSAL_READY = 'proposal_ready', // Propuesta lista para presentación
  APPROVED = 'approved', // Proyecto aprobado
  REJECTED = 'rejected', // Proyecto rechazado
  IN_DEVELOPMENT = 'in_development', // En desarrollo (seguimiento)
  COMPLETED = 'completed', // Completado
  // Estados legacy para compatibilidad
  IN_PROCESS = 'in_process',
  IN_REVIEW = 'in_review',
  CANCELED = 'canceled' // Cancelado por el cliente o admin
}

// Etiquetas para los estados
export const RequestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.DRAFT]: 'Borrador',
  [RequestStatus.SUBMITTED]: 'Enviado',
  [RequestStatus.REQUIREMENTS_ANALYSIS]: 'Análisis de Requisitos',
  [RequestStatus.PLANNING]: 'Planificación',
  [RequestStatus.ESTIMATION]: 'Estimación',
  [RequestStatus.PROPOSAL_READY]: 'Propuesta Lista',
  [RequestStatus.APPROVED]: 'Aprobado',
  [RequestStatus.REJECTED]: 'Rechazado',
  [RequestStatus.IN_DEVELOPMENT]: 'En Desarrollo',
  [RequestStatus.COMPLETED]: 'Completado',
  // Estados legacy
  [RequestStatus.IN_PROCESS]: 'En Proceso',
  [RequestStatus.IN_REVIEW]: 'En Revisión',
  [RequestStatus.CANCELED]: 'Cancelado'
};

// Colores para los estados
export const RequestStatusColors: Record<RequestStatus, string> = {
  [RequestStatus.DRAFT]: 'gray',
  [RequestStatus.SUBMITTED]: 'blue',
  [RequestStatus.REQUIREMENTS_ANALYSIS]: 'purple',
  [RequestStatus.PLANNING]: 'indigo',
  [RequestStatus.ESTIMATION]: 'orange',
  [RequestStatus.PROPOSAL_READY]: 'cyan',
  [RequestStatus.APPROVED]: 'green',
  [RequestStatus.REJECTED]: 'red',
  [RequestStatus.IN_DEVELOPMENT]: 'teal',
  [RequestStatus.COMPLETED]: 'emerald',
  // Estados legacy
  [RequestStatus.IN_PROCESS]: 'blue',
  [RequestStatus.IN_REVIEW]: 'purple',
  [RequestStatus.CANCELED]: 'gray'
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
  projectType: ProjectType;
  projectTypeLabel: string;
  priority?: ProjectPriority;
  priorityLabel?: string;
  clientId: string;
  client?: User;
  assignedTo?: string;
  assignedAdmin?: User;
  budget?: number;
  timeframe?: string;
  estimatedHours?: number;
  costEstimate?: number;
  proposedStartDate?: string;
  proposedEndDate?: string;
  tags: string[];
  commentsCount: number;
  filesCount: number;
  createdAt: string;
  updatedAt?: string;
  progress?: number; // Porcentaje de progreso (0-100)
  viewed?: boolean; // Indica si la solicitud ha sido vista por un administrador
  // Campos adicionales para proyectos IT
  technicalRequirements?: string; // Requisitos técnicos específicos
  businessGoals?: string; // Objetivos de negocio del proyecto
  integrationsNeeded?: string; // Sistemas con los que debe integrarse
  targetAudience?: string; // Público objetivo del proyecto
  additionalInfo?: string; // Información adicional relevante
  // Campos legacy para compatibilidad
  amount?: number; // Campo legacy para presupuesto
  dueDate?: string; // Campo legacy para fecha límite
}

// Modelo de solicitud detallada
export interface RequestDetail extends RequestSummary {
  comments: RequestComment[];
  files: RequestFile[];
  statusHistory: StatusChange[];
  technicalRequirements?: string;
  businessGoals?: string;
  integrationsNeeded?: string;
  targetAudience?: string;
  additionalInfo?: string;
}

// Tipos de proyectos tecnológicos
export enum ProjectType {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  DESKTOP_APP = 'desktop_app',
  E_COMMERCE = 'e_commerce',
  INTEGRATION = 'integration',
  CLOUD_MIGRATION = 'cloud_migration',
  DATA_ANALYTICS = 'data_analytics',
  AUTOMATION = 'automation',
  CUSTOM = 'custom'
}

// Etiquetas para tipos de proyectos
export const ProjectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.WEB_APP]: 'Aplicación Web',
  [ProjectType.MOBILE_APP]: 'Aplicación Móvil',
  [ProjectType.DESKTOP_APP]: 'Aplicación de Escritorio',
  [ProjectType.E_COMMERCE]: 'Comercio Electrónico',
  [ProjectType.INTEGRATION]: 'Integración de Sistemas',
  [ProjectType.CLOUD_MIGRATION]: 'Migración a la Nube',
  [ProjectType.DATA_ANALYTICS]: 'Análisis de Datos',
  [ProjectType.AUTOMATION]: 'Automatización de Procesos',
  [ProjectType.CUSTOM]: 'Proyecto Personalizado'
}

// Prioridades de proyecto
export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Etiquetas para prioridades
export const PriorityLabels: Record<ProjectPriority, string> = {
  [ProjectPriority.LOW]: 'Baja',
  [ProjectPriority.MEDIUM]: 'Media',
  [ProjectPriority.HIGH]: 'Alta',
  [ProjectPriority.URGENT]: 'Urgente'
}

// Modelo para crear una solicitud
export interface RequestCreate {
  title: string;
  description: string;
  projectType: ProjectType;
  priority?: ProjectPriority;
  budget?: number;
  timeframe?: string; // Plazo deseado para completar el proyecto
  technicalRequirements?: string; // Requisitos técnicos específicos
  businessGoals?: string; // Objetivos de negocio del proyecto
  integrationsNeeded?: string; // Sistemas con los que debe integrarse
  targetAudience?: string; // Público objetivo del proyecto
  additionalInfo?: string; // Información adicional relevante
  tags?: string[];
  // Campos legacy para compatibilidad
  amount?: number; // Campo legacy para presupuesto
  dueDate?: string; // Campo legacy para fecha límite
}

// Modelo para actualizar una solicitud
export interface RequestUpdate {
  title?: string;
  description?: string;
  status?: RequestStatus;
  assignedTo?: string;
  projectType?: ProjectType;
  priority?: ProjectPriority;
  budget?: number;
  timeframe?: string;
  technicalRequirements?: string;
  businessGoals?: string;
  integrationsNeeded?: string;
  targetAudience?: string;
  additionalInfo?: string;
  estimatedHours?: number; // Horas estimadas para el desarrollo
  costEstimate?: number; // Estimación de costo total
  proposedStartDate?: string; // Fecha propuesta para inicio
  proposedEndDate?: string; // Fecha propuesta para finalización
  tags?: string[];
  // Campos legacy para compatibilidad
  amount?: number; // Campo legacy para presupuesto
  dueDate?: string; // Campo legacy para fecha límite
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
  // Alias para compatibilidad con componentes que esperan 'items'
  items?: RequestSummary[];
  // Campos adicionales para paginación
  page?: number;
  pages?: number;
}

// Respuesta de una solicitud individual
export interface RequestResponse {
  success: boolean;
  request: RequestDetail;
}