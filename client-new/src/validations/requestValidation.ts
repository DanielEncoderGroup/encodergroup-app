import * as Yup from 'yup';

// Esquema de validación simplificado para evitar errores de TypeScript
const RequestSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es obligatorio')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  description: Yup.string()
    .required('La descripción es obligatoria')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder los 1000 caracteres'),
  // Campos opcionales sin validación avanzada para evitar errores de TS
  amount: Yup.string(),
  dueDate: Yup.string()
});

export default RequestSchema;