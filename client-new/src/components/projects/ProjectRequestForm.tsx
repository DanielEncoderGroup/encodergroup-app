import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Icon } from '../ui';
import { 
  RequestCreate, 
  RequestUpdate, 
  RequestDetail, 
  ProjectType, 
  ProjectTypeLabels, 
  ProjectPriority, 
  PriorityLabels 
} from '../../types/request';
import { requestService } from '../../services/requestService';

// Esquema de validación específico para proyectos
const ProjectRequestSchema = Yup.object().shape({
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

interface ProjectRequestFormProps {
  requestId?: string;
  initialData?: RequestDetail | null;
  onSaved?: (id: string) => void;
  onCancel?: () => void;
}

/**
 * Formulario avanzado para solicitudes de proyectos informáticos
 * Soporta creación y edición de solicitudes con campos específicos para proyectos tecnológicos
 */
const ProjectRequestForm: React.FC<ProjectRequestFormProps> = ({ 
  requestId, 
  initialData, 
  onSaved, 
  onCancel 
}) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const isEditMode = !!requestId;

  // Cargar etiquetas iniciales
  useEffect(() => {
    if (initialData?.tags) {
      setTags(initialData.tags);
    }
  }, [initialData]);

  // Gestión de etiquetas
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Validación manual complementaria
  const validateProjectData = (values: any) => {
    const errors: Record<string, string> = {};
    
    // Validar presupuesto si existe
    if (values.budget !== undefined) {
      const num = parseFloat(values.budget.toString());
      if (isNaN(num)) {
        errors.budget = 'El presupuesto debe ser un número válido';
      } else if (num < 0) {
        errors.budget = 'El presupuesto no puede ser negativo';
      }
    }
    
    // Validaciones específicas para proyectos informáticos
    if (values.businessGoals && values.businessGoals.length < 10) {
      errors.businessGoals = 'Los objetivos de negocio deben ser más detallados';
    }
    
    return errors;
  };

  // Envío del formulario
  const handleSubmit = async (values: any) => {
    // Validar manualmente
    const validationErrors = validateProjectData(values);
    if (Object.keys(validationErrors).length > 0) {
      // Mostrar errores
      for (const [field, message] of Object.entries(validationErrors)) {
        toast.error(message);
      }
      return;
    }
    
    // Formatear datos para envío
    const requestData = {
      ...values,
      tags,
      // Asegurar que los campos numéricos se envíen como números
      budget: values.budget ? parseFloat(values.budget.toString()) : undefined
    };

    try {
      setSaving(true);
      
      if (isEditMode && requestId) {
        // Actualizar solicitud existente
        await requestService.update(requestId, requestData as RequestUpdate);
        toast.success('Proyecto actualizado correctamente');
        
        if (onSaved) {
          onSaved(requestId);
        } else {
          navigate(`/app/requests/${requestId}`);
        }
      } else {
        // Crear nueva solicitud de proyecto
        const response = await requestService.create(requestData);
        toast.success('Solicitud de proyecto enviada correctamente');
        
        if (response.requestId) {
          if (onSaved) {
            onSaved(response.requestId);
          } else {
            navigate(`/app/requests/${response.requestId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error al guardar la solicitud de proyecto:', error);
      toast.error('Error al enviar la solicitud de proyecto');
    } finally {
      setSaving(false);
    }
  };

  // Cancelar y volver
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(isEditMode && requestId ? `/app/requests/${requestId}` : '/app/requests');
    }
  };

  // Valores iniciales para el formulario
  const initialValues = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    projectType: initialData?.projectType || ProjectType.WEB_APP,
    priority: initialData?.priority || ProjectPriority.MEDIUM,
    budget: initialData?.budget ? initialData.budget.toString() : '',
    timeframe: initialData?.timeframe || '',
    technicalRequirements: initialData?.technicalRequirements || '',
    businessGoals: initialData?.businessGoals || '',
    integrationsNeeded: initialData?.integrationsNeeded || '',
    targetAudience: initialData?.targetAudience || '',
    additionalInfo: initialData?.additionalInfo || '',
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {isEditMode ? 'Editar Solicitud de Proyecto' : 'Nueva Solicitud de Proyecto'}
        </h3>
        
        <Formik
          initialValues={initialValues}
          validationSchema={ProjectRequestSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formikProps) => {
            const { values, setFieldValue } = formikProps;
            
            return (
              <Form className="space-y-6">
                {/* Sección de información básica */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-base font-medium text-gray-700 mb-3">Información Básica</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Título del Proyecto *
                      </label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Nombre descriptivo para el proyecto"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descripción del Proyecto *
                      </label>
                      <div className="mt-1">
                        <Field
                          as="textarea"
                          name="description"
                          id="description"
                          rows={4}
                          placeholder="Describe el proyecto y sus objetivos principales"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
                          Tipo de Proyecto *
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="projectType"
                            id="projectType"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {Object.entries(ProjectTypeLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="projectType" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Prioridad
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="priority"
                            id="priority"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {Object.entries(PriorityLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </Field>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                          Presupuesto Estimado
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <Field
                            type="number"
                            name="budget"
                            id="budget"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                          />
                          <ErrorMessage name="budget" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
                          Plazo Deseado
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="timeframe"
                            id="timeframe"
                            placeholder="Ej: 3 meses, antes de diciembre, etc."
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de requisitos técnicos */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-base font-medium text-gray-700 mb-3">Requisitos y Objetivos</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="technicalRequirements" className="block text-sm font-medium text-gray-700">
                        Requisitos Técnicos
                      </label>
                      <div className="mt-1">
                        <Field
                          as="textarea"
                          name="technicalRequirements"
                          id="technicalRequirements"
                          rows={3}
                          placeholder="Describe los requisitos técnicos específicos del proyecto (lenguajes, plataformas, etc.)"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="businessGoals" className="block text-sm font-medium text-gray-700">
                        Objetivos de Negocio
                      </label>
                      <div className="mt-1">
                        <Field
                          as="textarea"
                          name="businessGoals"
                          id="businessGoals"
                          rows={3}
                          placeholder="¿Qué objetivos empresariales busca lograr con este proyecto?"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="integrationsNeeded" className="block text-sm font-medium text-gray-700">
                          Integraciones Necesarias
                        </label>
                        <div className="mt-1">
                          <Field
                            as="textarea"
                            name="integrationsNeeded"
                            id="integrationsNeeded"
                            rows={3}
                            placeholder="¿Con qué sistemas existentes debe integrarse? (APIs, servicios, etc.)"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                          Público Objetivo
                        </label>
                        <div className="mt-1">
                          <Field
                            as="textarea"
                            name="targetAudience"
                            id="targetAudience"
                            rows={3}
                            placeholder="¿Quiénes son los usuarios finales del proyecto?"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                        Información Adicional
                      </label>
                      <div className="mt-1">
                        <Field
                          as="textarea"
                          name="additionalInfo"
                          id="additionalInfo"
                          rows={3}
                          placeholder="Cualquier otra información relevante para el proyecto"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de etiquetas */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-base font-medium text-gray-700 mb-3">Etiquetas</h4>
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Etiquetas *
                    </label>
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Añadir etiqueta"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Icon name="PlusIcon" size="sm" className="mr-1" /> Añadir
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <div
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Icon name="TagIcon" size="sm" className="mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                          >
                            <Icon name="XMarkIcon" size="sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {tags.length === 0 && (
                      <p className="mt-1 text-sm text-red-600">Añade al menos una etiqueta para continuar</p>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || tags.length === 0}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="inline-flex items-center">
                        <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Guardando...
                      </div>
                    ) : (
                      isEditMode ? 'Actualizar proyecto' : 'Crear solicitud de proyecto'
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ProjectRequestForm;