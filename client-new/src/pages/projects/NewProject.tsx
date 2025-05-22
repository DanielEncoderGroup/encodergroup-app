import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// @ts-ignore: Importar FieldArray directamente desde Formik
import { FieldArray } from 'formik';
import * as Yup from 'yup';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * Componente para crear un nuevo proyecto
 */
const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('El nombre del proyecto es obligatorio')
      .max(100, 'El nombre debe tener menos de 100 caracteres'),
    description: Yup.string()
      .required('La descripción es obligatoria')
      .max(500, 'La descripción debe tener menos de 500 caracteres'),
    client: Yup.string()
      .required('El cliente es obligatorio'),
    startDate: Yup.date()
      .required('La fecha de inicio es obligatoria'),
    endDate: Yup.date()
      .required('La fecha de fin es obligatoria')
      .min(
        Yup.ref('startDate'),
        'La fecha de fin debe ser posterior a la fecha de inicio'
      ),
    budget: Yup.number()
      .required('El presupuesto es obligatorio')
      .positive('El presupuesto debe ser un número positivo'),
    status: Yup.string()
      .required('El estado es obligatorio'),
    teamMembers: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required('El nombre es obligatorio'),
          role: Yup.string().required('El rol es obligatorio'),
          email: Yup.string().email('Email inválido').required('El email es obligatorio')
        })
      )
      .min(1, 'Debe haber al menos un miembro en el equipo'),
    tasks: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required('El título es obligatorio'),
          description: Yup.string(),
          status: Yup.string().required('El estado es obligatorio')
        })
      )
  });
  
  // Valores iniciales del formulario
  const initialValues = {
    name: '',
    description: '',
    client: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'en-progreso',
    teamMembers: [
      { name: '', role: '', email: '' }
    ],
    tasks: [
      { title: '', description: '', status: 'pendiente' }
    ]
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // Aquí iría la llamada a la API para crear el proyecto
      console.log('Creando proyecto:', values);
      
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la lista de proyectos
      navigate('/app/projects');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/app/projects')}
            className="mr-4 p-1 rounded-full text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Nuevo Proyecto</h1>
        </div>
        
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched }) => (
                <Form className="space-y-8">
                  {/* Información básica */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Información Básica</h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nombre del proyecto
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="name"
                            id="name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-4">
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                          Cliente
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="client"
                            id="client"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="client" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Descripción
                        </label>
                        <div className="mt-1">
                          <Field
                            as="textarea"
                            name="description"
                            id="description"
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Breve descripción del proyecto y sus objetivos principales
                        </p>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Fecha de inicio
                        </label>
                        <div className="mt-1">
                          <Field
                            type="date"
                            name="startDate"
                            id="startDate"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="startDate" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                          Fecha de fin
                        </label>
                        <div className="mt-1">
                          <Field
                            type="date"
                            name="endDate"
                            id="endDate"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="endDate" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                          Presupuesto (€)
                        </label>
                        <div className="mt-1">
                          <Field
                            type="number"
                            name="budget"
                            id="budget"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="budget" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Estado
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="status"
                            id="status"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="en-progreso">En Progreso</option>
                            <option value="en-revision">En Revisión</option>
                            <option value="completado">Completado</option>
                            <option value="pausado">Pausado</option>
                          </Field>
                          <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Equipo del proyecto */}
                  <div className="pt-8">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Equipo del Proyecto</h3>
                    <FieldArray name="teamMembers">
                      {({ remove, push }: { remove: (index: number) => void; push: (obj: any) => void }) => (
                        <div>
                          {values.teamMembers.map((member, index) => (
                            <div key={index} className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-b border-gray-200 pb-6">
                              <div className="sm:col-span-2">
                                <label htmlFor={`teamMembers.${index}.name`} className="block text-sm font-medium text-gray-700">
                                  Nombre
                                </label>
                                <div className="mt-1">
                                  <Field
                                    type="text"
                                    name={`teamMembers.${index}.name`}
                                    id={`teamMembers.${index}.name`}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                  <ErrorMessage name={`teamMembers.${index}.name`} component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-2">
                                <label htmlFor={`teamMembers.${index}.role`} className="block text-sm font-medium text-gray-700">
                                  Rol
                                </label>
                                <div className="mt-1">
                                  <Field
                                    type="text"
                                    name={`teamMembers.${index}.role`}
                                    id={`teamMembers.${index}.role`}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                  <ErrorMessage name={`teamMembers.${index}.role`} component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-2">
                                <label htmlFor={`teamMembers.${index}.email`} className="block text-sm font-medium text-gray-700">
                                  Email
                                </label>
                                <div className="mt-1">
                                  <Field
                                    type="email"
                                    name={`teamMembers.${index}.email`}
                                    id={`teamMembers.${index}.email`}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                  <ErrorMessage name={`teamMembers.${index}.email`} component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-6 flex justify-end">
                                {values.teamMembers.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index as number)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    <TrashIcon className="-ml-0.5 mr-1 h-4 w-4" />
                                    Eliminar miembro
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => push({ name: '', role: '', email: '' })}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
                              Añadir miembro
                            </button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  
                  {/* Tareas iniciales */}
                  <div className="pt-8">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Tareas Iniciales</h3>
                    <FieldArray name="tasks">
                      {({ remove, push }: { remove: (index: number) => void; push: (obj: any) => void }) => (
                        <div>
                          {values.tasks.map((task, index) => (
                            <div key={index} className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-b border-gray-200 pb-6">
                              <div className="sm:col-span-3">
                                <label htmlFor={`tasks.${index}.title`} className="block text-sm font-medium text-gray-700">
                                  Título
                                </label>
                                <div className="mt-1">
                                  <Field
                                    type="text"
                                    name={`tasks.${index}.title`}
                                    id={`tasks.${index}.title`}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                  <ErrorMessage name={`tasks.${index}.title`} component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-2">
                                <label htmlFor={`tasks.${index}.status`} className="block text-sm font-medium text-gray-700">
                                  Estado
                                </label>
                                <div className="mt-1">
                                  <Field
                                    as="select"
                                    name={`tasks.${index}.status`}
                                    id={`tasks.${index}.status`}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="en-progreso">En Progreso</option>
                                    <option value="completada">Completada</option>
                                  </Field>
                                  <ErrorMessage name={`tasks.${index}.status`} component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-5">
                                <label htmlFor={`tasks.${index}.description`} className="block text-sm font-medium text-gray-700">
                                  Descripción
                                </label>
                                <div className="mt-1">
                                  <Field
                                    as="textarea"
                                    name={`tasks.${index}.description`}
                                    id={`tasks.${index}.description`}
                                    rows={2}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                  <ErrorMessage name={`tasks.${index}.description`} component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-6 flex justify-end">
                                {values.tasks.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index as number)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    <TrashIcon className="-ml-0.5 mr-1 h-4 w-4" />
                                    Eliminar tarea
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => push({ title: '', description: '', status: 'pendiente' })}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
                              Añadir tarea
                            </button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate('/app/projects')}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creando...
                          </>
                        ) : (
                          'Crear proyecto'
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;