import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Project {
  id: string;
  name: string;
}

interface RequestFormValues {
  title: string;
  description: string;
  amount: string;
  requestType: string;
  projectId: string;
}

const RequestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialValues, setInitialValues] = useState<RequestFormValues>({
    title: '',
    description: '',
    amount: '',
    requestType: 'travel',
    projectId: ''
  });

  const isEditMode = Boolean(id);

  // Validación con Yup
  const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    amount: Yup.number()
      // @ts-ignore: typeError existe en Yup 0.32.11 pero no en las definiciones de tipos
      .typeError('El monto debe ser un número')
      .positive('El monto debe ser positivo')
      .required('El monto es obligatorio'),
    requestType: Yup.string().required('El tipo de solicitud es obligatorio'),
    projectId: Yup.string()
  });

  // Simular carga de proyectos
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects([
        { id: '1', name: 'Implementación ERP' },
        { id: '2', name: 'Migración a la nube' },
        { id: '3', name: 'Desarrollo app móvil' },
        { id: '4', name: 'Actualización infraestructura' }
      ]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // Simulación de carga de datos de la solicitud para edición
      setTimeout(() => {
        setInitialValues({
          title: 'Viaje a conferencia de tecnología',
          description: 'Gastos de transporte y alojamiento para conferencia en Madrid sobre nuevas tecnologías cloud.',
          amount: '1200',
          requestType: 'travel',
          projectId: '1'
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditMode, id]);

  // Configuración de Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Simulación de envío de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Datos enviados:', values);
        navigate('/app/requests');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  // @ts-ignore: 'dirty' existe en Formik pero TypeScript no lo reconoce correctamente
  if (isLoading && isEditMode && !formik.dirty) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {isEditMode ? 'Editar solicitud' : 'Nueva solicitud'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? 'Actualiza la información de la solicitud existente'
              : 'Crea una nueva solicitud de viáticos'}
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título de la solicitud
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.title && formik.errors.title ? 'border-red-300' : ''
                    }`}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.title)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.description && formik.errors.description ? 'border-red-300' : ''
                    }`}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.description)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">
                  Tipo de solicitud
                </label>
                <div className="mt-1">
                  <select
                    id="requestType"
                    name="requestType"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.requestType && formik.errors.requestType ? 'border-red-300' : ''
                    }`}
                    value={formik.values.requestType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="travel">Viaje</option>
                    <option value="training">Capacitación</option>
                    <option value="supplies">Suministros</option>
                    <option value="other">Otro</option>
                  </select>
                  {formik.touched.requestType && formik.errors.requestType && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.requestType)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Monto total ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.amount && formik.errors.amount ? 'border-red-300' : ''
                    }`}
                    placeholder="0.00"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.amount)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                  Proyecto asociado (opcional)
                </label>
                <div className="mt-1">
                  <select
                    id="projectId"
                    name="projectId"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formik.values.projectId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Seleccionar proyecto</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Después de crear la solicitud, podrás añadir comprobantes y recibos específicos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              onClick={() => navigate('/app/requests')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {formik.isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;