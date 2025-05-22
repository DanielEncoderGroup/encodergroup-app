import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PhotoIcon } from '@heroicons/react/24/outline';

/**
 * Componente para mostrar y editar la información personal del usuario
 */
const ProfileInfo: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Esquema de validación para el formulario
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('El nombre es obligatorio')
      .max(100, 'El nombre debe tener menos de 100 caracteres'),
    email: Yup.string()
      .email('Email inválido')
      .required('El email es obligatorio'),
    phone: Yup.string()
      .matches(/^[+\d\s()-]+$/, 'Formato de teléfono inválido'),
    position: Yup.string()
      .max(100, 'El cargo debe tener menos de 100 caracteres'),
    company: Yup.string()
      .max(100, 'La empresa debe tener menos de 100 caracteres'),
    bio: Yup.string()
      .max(500, 'La biografía debe tener menos de 500 caracteres')
  });
  
  // Valores iniciales para el formulario
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: '', // Estos campos no están en el tipo User pero los mantenemos en el formulario
    position: '',
    company: '',
    bio: ''
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Simulamos la actualización del perfil con un timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      // En una implementación real, aquí llamaríamos a la API para actualizar el perfil
      setSuccessMessage('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrorMessage('Ha ocurrido un error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
      
      // Limpiar mensajes después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-medium text-gray-900">Información Personal</h2>
      
      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Sección de foto de perfil */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={user?.profileImage || '/assets/images/default-avatar.jpg'}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Foto de perfil</h3>
              <p className="mt-1 text-sm text-gray-500">
                Esta foto se mostrará en tu perfil y será visible para otros usuarios.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PhotoIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                  Cambiar foto
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulario de información personal */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-6 bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo
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
            
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Cargo
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="position"
                  id="position"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="position" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Empresa
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="company"
                  id="company"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="company" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Biografía
              </label>
              <div className="mt-1">
                <Field
                  as="textarea"
                  name="bio"
                  id="bio"
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Breve descripción sobre ti. Esta información será visible en tu perfil público.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ProfileInfo;