import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/requestService';
import { RequestCreate, RequestUpdate, RequestDetail, ProjectType, ProjectTypeLabels, ProjectPriority, PriorityLabels } from '../../types/request';
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik';
import { toast } from 'react-hot-toast';
import { Icon } from '../../components/ui';
import RequestSchema from '../../validations/requestValidation';

const RequestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const isEditMode = !!id;

  // Comprobar si el usuario es cliente
  useEffect(() => {
    if (!user || user.role !== 'client') {
      toast.error('No tienes permiso para acceder a esta página');
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  // Cargar datos de la solicitud si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      const fetchRequest = async () => {
        try {
          setLoading(true);
          const response = await requestService.getById(id);
          
          // Verificar que la solicitud pertenece al usuario actual y está en borrador
          if (response.request.clientId !== user?.id) {
            toast.error('No tienes permiso para editar esta solicitud');
            navigate('/app/requests');
            return;
          }
          
          if (response.request.status !== 'draft') {
            toast.error('Solo puedes editar solicitudes en estado de borrador');
            navigate(`/app/requests/${id}`);
            return;
          }
          
          setRequest(response.request);
          setTags(response.request.tags || []);
          setLoading(false);
        } catch (error) {
          console.error('Error loading request:', error);
          toast.error('Error al cargar la solicitud');
          navigate('/app/requests');
        }
      };
      
      fetchRequest();
    }
  }, [id, isEditMode, user?.id, navigate]);

  // Valores iniciales para el formulario
  const initialValues: RequestCreate = {
    title: request?.title || '',
    description: request?.description || '',
    projectType: request?.projectType || ProjectType.CUSTOM, // Valor por defecto para cumplir con el requisito
    amount: request?.amount || undefined,
    dueDate: request?.dueDate ? request.dueDate.split('T')[0] : '',
    tags: tags
  };

  // Función para agregar una etiqueta
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Función para eliminar una etiqueta
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Función para guardar la solicitud
  // Validación manual para complementar la validación básica de Yup
  const validateRequestData = (values: RequestCreate) => {
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
    
    // Validaciones adicionales específicas para proyectos informáticos
    if (!values.projectType) {
      errors.projectType = 'El tipo de proyecto es obligatorio';
    }
    
    // Validación de objetivos de negocio (campo opcional pero importante)
    if (values.businessGoals && values.businessGoals.length < 10) {
      errors.businessGoals = 'Los objetivos de negocio deben ser más detallados';
    }
    
    return errors;
  };

  const handleSubmit = async (values: RequestCreate) => {
    // Validar manualmente
    const validationErrors = validateRequestData(values);
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
      
      if (isEditMode) {
        // Actualizar solicitud existente
        await requestService.update(id, requestData as RequestUpdate);
        toast.success('Proyecto actualizado correctamente');
      } else {
        // Crear nueva solicitud de proyecto
        const response = await requestService.create(requestData);
        toast.success('Solicitud de proyecto enviada correctamente');
        
        // Navegar a la solicitud creada
        if (response.requestId) {
          navigate(`/app/requests/${response.requestId}`);
          return;
        }
      }
      
      // Volver a la lista de solicitudes o a la solicitud editada
      navigate(isEditMode ? `/app/requests/${id}` : '/app/requests');
    } catch (error) {
      console.error('Error al guardar la solicitud de proyecto:', error);
      toast.error('Error al enviar la solicitud de proyecto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="mb-6">
        <button
          onClick={() => navigate(isEditMode ? `/app/requests/${id}` : '/app/requests')}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
        >
          <Icon name="ChevronLeftIcon" className="mr-1" />
          Volver
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Editar solicitud' : 'Nueva solicitud'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? 'Actualiza los detalles de tu solicitud'
            : 'Crea una nueva solicitud para enviar al equipo administrativo'}
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={RequestSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formikProps) => {
            // Desestructuramos los props de Formik que necesitamos
            const { values, setFieldValue } = formikProps;
            // Formik incluye estas propiedades para control de estado del formulario
            // aunque TypeScript no las reconoce correctamente en algunas versiones
            return (
            <Form className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título *
                </label>
                <div className="mt-1">
                  <Field
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Título de la solicitud"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción *
                </label>
                <div className="mt-1">
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows={5}
                    placeholder="Describe detalladamente tu solicitud"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Monto (opcional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Field
                      type="number"
                      name="amount"
                      id="amount"
                      step="0.01"
                      placeholder="0.00"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <ErrorMessage name="amount" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Fecha límite (opcional)
                  </label>
                  <div className="mt-1">
                    <Field
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="dueDate" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Etiquetas (opcional)
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Añadir etiqueta"
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                  >
                    <Icon name="PlusCircleIcon" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
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
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(isEditMode ? `/app/requests/${id}` : '/app/requests')}
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
                    isEditMode ? 'Actualizar solicitud' : 'Crear solicitud'
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

export default RequestForm;