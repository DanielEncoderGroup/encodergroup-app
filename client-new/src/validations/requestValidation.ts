import * as Yup from 'yup';
import { ProjectType, ProjectPriority } from '../types/request';

// Esquema de validación para solicitudes de proyectos tecnológicos
const RequestSchema = Yup.object().shape({
  // Campos obligatorios con validación completa
  title: Yup.string()
    .required('El título del proyecto es obligatorio')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  description: Yup.string()
    .required('La descripción del proyecto es obligatoria')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder los 2000 caracteres'),
  projectType: Yup.string()
    .required('El tipo de proyecto es obligatorio'),
    
  // Campos opcionales con validación básica
  priority: Yup.string(),
  budget: Yup.string(),
  timeframe: Yup.string(),
  technicalRequirements: Yup.string(),
  businessGoals: Yup.string(),
  integrationsNeeded: Yup.string(),
  targetAudience: Yup.string(),
  additionalInfo: Yup.string()
});

export default RequestSchema;