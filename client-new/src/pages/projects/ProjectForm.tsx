import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ProjectFormValues {
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: string;
  budget: string;
  team: string;
}

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ProjectFormValues>({
    name: '',
    description: '',
    status: 'pending',
    startDate: '',
    endDate: '',
    manager: '',
    budget: '',
    team: ''
  });

  const isEditMode = Boolean(id);

  // Validación con Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    status: Yup.string().required('El estado es obligatorio'),
    startDate: Yup.date().required('La fecha de inicio es obligatoria'),
    endDate: Yup.date()
      .min(
        Yup.ref('startDate'),
        'La fecha de finalización debe ser posterior a la fecha de inicio'
      )
      .required('La fecha de finalización es obligatoria'),
    manager: Yup.string().required('El responsable es obligatorio'),
    budget: Yup.number()
      // @ts-ignore: typeError existe en Yup 0.32.11 pero no en las definiciones de tipos
      .typeError('El presupuesto debe ser un número')
      .positive('El presupuesto debe ser positivo')
      .required('El presupuesto es obligatorio'),
    team: Yup.string().required('El equipo es obligatorio')
  });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // Simulación de carga de datos del proyecto para edición
      setTimeout(() => {
        setInitialValues({
          name: 'Implementación ERP',
          description: 'Implementación de sistema ERP para gestión financiera y control de presupuestos en toda la organización.',
          status: 'active',
          startDate: '2023-01-15',
          endDate: '2023-07-30',
          manager: 'Carlos Rodríguez',
          budget: '120000',
          team: 'Ana Gómez, Miguel Sánchez, Laura Torres, Roberto Díaz'
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
        navigate('/app/projects');
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
            {isEditMode ? 'Editar proyecto' : 'Nuevo proyecto'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? 'Actualiza la información del proyecto existente'
              : 'Crea un nuevo proyecto en el sistema'}
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre del proyecto
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.name && formik.errors.name ? 'border-red-300' : ''
                    }`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.name)}</p>
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
                    rows={4}
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
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.status && formik.errors.status ? 'border-red-300' : ''
                    }`}
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.status)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                  Responsable
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="manager"
                    name="manager"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.manager && formik.errors.manager ? 'border-red-300' : ''
                    }`}
                    value={formik.values.manager}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.manager && formik.errors.manager && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.manager)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Fecha de inicio
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.startDate && formik.errors.startDate ? 'border-red-300' : ''
                    }`}
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.startDate)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  Fecha de finalización
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.endDate && formik.errors.endDate ? 'border-red-300' : ''
                    }`}
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.endDate && formik.errors.endDate && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.endDate)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Presupuesto ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.budget && formik.errors.budget ? 'border-red-300' : ''
                    }`}
                    placeholder="0.00"
                    value={formik.values.budget}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.budget && formik.errors.budget && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.budget)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="team" className="block text-sm font-medium text-gray-700">
                  Equipo (nombres separados por comas)
                </label>
                <div className="mt-1">
                  <textarea
                    id="team"
                    name="team"
                    rows={3}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.team && formik.errors.team ? 'border-red-300' : ''
                    }`}
                    placeholder="Ej. Juan Pérez, María González, Carlos Rodríguez"
                    value={formik.values.team}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.team && formik.errors.team && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.team)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              onClick={() => navigate('/app/projects')}
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

export default ProjectForm;