import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Project {
  id: string;
  name: string;
}

interface MeetingFormValues {
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  organizer: string;
  attendees: string;
  projectId: string;
  notes: string;
}

const MeetingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialValues, setInitialValues] = useState<MeetingFormValues>({
    title: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    description: '',
    organizer: '',
    attendees: '',
    projectId: '',
    notes: ''
  });

  const isEditMode = Boolean(id);

  // Validación con Yup
  const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    date: Yup.date().required('La fecha es obligatoria'),
    time: Yup.string().required('La hora es obligatoria'),
    duration: Yup.number()
      // @ts-ignore: typeError existe en Yup 0.32.11 pero no en las definiciones de tipos
      .typeError('La duración debe ser un número')
      .positive('La duración debe ser positiva')
      .required('La duración es obligatoria'),
    location: Yup.string().required('La ubicación es obligatoria'),
    description: Yup.string().required('La descripción es obligatoria'),
    organizer: Yup.string().required('El organizador es obligatorio'),
    attendees: Yup.string().required('Los participantes son obligatorios'),
    projectId: Yup.string(),
    notes: Yup.string()
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
      // Simulación de carga de datos de la reunión para edición
      setTimeout(() => {
        setInitialValues({
          title: 'Reunión de inicio de proyecto ERP',
          date: '2023-05-25',
          time: '10:00',
          duration: '60',
          location: 'Sala de conferencias A',
          description: 'Reunión para dar inicio al proyecto de implementación del sistema ERP. Se discutirán los objetivos, alcance, cronograma y asignación de responsabilidades.',
          organizer: 'Carlos Rodríguez',
          attendees: 'Ana Gómez, Miguel Sánchez, Laura Torres, Roberto Díaz',
          projectId: '1',
          notes: 'Preparar presentación inicial del proyecto. Tener listos los documentos de alcance y cronograma tentativo.'
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
        navigate('/app/meetings');
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
            {isEditMode ? 'Editar reunión' : 'Nueva reunión'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? 'Actualiza la información de la reunión existente'
              : 'Programa una nueva reunión en el sistema'}
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título de la reunión
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

              <div className="sm:col-span-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.date && formik.errors.date ? 'border-red-300' : ''
                    }`}
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.date)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Hora
                </label>
                <div className="mt-1">
                  <input
                    type="time"
                    id="time"
                    name="time"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.time && formik.errors.time ? 'border-red-300' : ''
                    }`}
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.time && formik.errors.time && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.time)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duración (minutos)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    min="15"
                    step="15"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.duration && formik.errors.duration ? 'border-red-300' : ''
                    }`}
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.duration && formik.errors.duration && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.duration)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.location && formik.errors.location ? 'border-red-300' : ''
                    }`}
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.location)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                  Organizador
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.organizer && formik.errors.organizer ? 'border-red-300' : ''
                    }`}
                    value={formik.values.organizer}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.organizer && formik.errors.organizer && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.organizer)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
                  Participantes (nombres separados por comas)
                </label>
                <div className="mt-1">
                  <textarea
                    id="attendees"
                    name="attendees"
                    rows={2}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.attendees && formik.errors.attendees ? 'border-red-300' : ''
                    }`}
                    placeholder="Ej. Juan Pérez, María González, Carlos Rodríguez"
                    value={formik.values.attendees}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.attendees && formik.errors.attendees && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.attendees)}</p>
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
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notas adicionales (opcional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              onClick={() => navigate('/app/meetings')}
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

export default MeetingForm;