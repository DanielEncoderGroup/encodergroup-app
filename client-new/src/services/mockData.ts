import { 
  RequestSummary, 
  RequestDetail,
  RequestStatus,
  ProjectType,
  ProjectPriority
} from '../types/request';

// Datos mock para desarrollo frontend
export const mockRequests: RequestSummary[] = [
  {
    id: '1',
    title: 'Sistema de gestión de inventario',
    description: 'Desarrollo de un sistema completo para gestión de inventario con módulos de compras, ventas y reportes.',
    status: RequestStatus.SUBMITTED,
    statusLabel: 'Enviado',
    projectType: ProjectType.WEB_APP,
    projectTypeLabel: 'Aplicación Web',
    priority: ProjectPriority.HIGH,
    priorityLabel: 'Alta',
    clientId: 'client1',
    client: {
      id: 'client1',
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos@example.com',
      name: 'Carlos García'
    },
    budget: 15000,
    timeframe: '3 meses',
    technicalRequirements: 'React, Node.js, MongoDB',
    businessGoals: 'Optimizar gestión de inventario y reducir pérdidas',
    tags: ['web', 'inventario', 'react'],
    commentsCount: 2,
    filesCount: 1,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 10
  },
  {
    id: '2',
    title: 'Aplicación móvil para delivery',
    description: 'Aplicación para gestión de entregas a domicilio con seguimiento en tiempo real.',
    status: RequestStatus.REQUIREMENTS_ANALYSIS,
    statusLabel: 'Análisis de Requisitos',
    projectType: ProjectType.MOBILE_APP,
    projectTypeLabel: 'Aplicación Móvil',
    priority: ProjectPriority.URGENT,
    priorityLabel: 'Urgente',
    clientId: 'client1',
    client: {
      id: 'client1',
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos@example.com',
      name: 'Carlos García'
    },
    budget: 12000,
    timeframe: '2 meses',
    tags: ['mobile', 'delivery', 'geolocalización'],
    commentsCount: 5,
    filesCount: 2,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 25
  },
  {
    id: '3',
    title: 'Migración a la nube de sistemas legacy',
    description: 'Migración de sistemas empresariales antiguos a infraestructura cloud.',
    status: RequestStatus.PLANNING,
    statusLabel: 'Planificación',
    projectType: ProjectType.CLOUD_MIGRATION,
    projectTypeLabel: 'Migración a la Nube',
    priority: ProjectPriority.MEDIUM,
    priorityLabel: 'Media',
    clientId: 'client1',
    client: {
      id: 'client1',
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos@example.com',
      name: 'Carlos García'
    },
    budget: 25000,
    timeframe: '4 meses',
    tags: ['cloud', 'migración', 'AWS'],
    commentsCount: 3,
    filesCount: 4,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 40
  }
];

// Detalle de solicitud mock
export const getMockRequestDetail = (id: string): RequestDetail => {
  const summary = mockRequests.find(req => req.id === id) || mockRequests[0];
  
  return {
    ...summary,
    comments: [
      {
        id: 'c1',
        content: 'Necesitamos más detalles sobre los requisitos de integración con sistemas existentes.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          id: 'admin1',
          firstName: 'Admin',
          lastName: 'Usuario',
          email: 'admin@encodergroup.com',
          name: 'Admin Usuario'
        }
      },
      {
        id: 'c2',
        content: 'He proporcionado la documentación técnica adicional en los archivos adjuntos.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          id: 'client1',
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos@example.com',
          name: 'Carlos García'
        }
      }
    ],
    files: [
      {
        id: 'f1',
        filename: 'requisitos_tecnicos.pdf',
        fileSize: 1024 * 1024 * 2.5, // 2.5 MB
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          id: 'client1',
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos@example.com',
          name: 'Carlos García'
        }
      }
    ],
    statusHistory: [
      {
        fromStatus: null,
        fromStatusLabel: 'Inicial',
        toStatus: RequestStatus.DRAFT,
        toStatusLabel: 'Borrador',
        changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Creación inicial del proyecto',
        changedBy: {
          id: 'client1',
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos@example.com',
          name: 'Carlos García'
        }
      },
      {
        fromStatus: RequestStatus.DRAFT,
        fromStatusLabel: 'Borrador',
        toStatus: RequestStatus.SUBMITTED,
        toStatusLabel: 'Enviado',
        changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Envío para evaluación inicial',
        changedBy: {
          id: 'client1',
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos@example.com',
          name: 'Carlos García'
        }
      },
      {
        fromStatus: RequestStatus.SUBMITTED,
        fromStatusLabel: 'Enviado',
        toStatus: summary.status,
        toStatusLabel: summary.statusLabel,
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Progreso de la solicitud según evaluación inicial',
        changedBy: {
          id: 'admin1',
          firstName: 'Admin',
          lastName: 'Usuario',
          email: 'admin@encodergroup.com',
          name: 'Admin Usuario'
        }
      }
    ],
    technicalRequirements: 'El sistema deberá funcionar en navegadores modernos como Chrome, Firefox y Safari. Se requiere compatibilidad con dispositivos móviles y tablets mediante un diseño responsivo.',
    businessGoals: 'Aumentar la eficiencia operativa en un 30% y reducir tiempos de respuesta. Mejorar la satisfacción del cliente mediante una interfaz intuitiva.',
    integrationsNeeded: 'Integración con sistema ERP existente SAP y con la plataforma de pagos PayPal/Stripe.',
    targetAudience: 'Personal de operaciones, supervisores de departamento y clientes externos a través del portal web.',
    additionalInfo: 'La implementación debe incluir capacitación para el personal y documentación técnica completa. Se requiere servicio de mantenimiento posterior.'
  };
};