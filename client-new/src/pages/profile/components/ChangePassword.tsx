import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { KeyIcon } from '@heroicons/react/24/outline';

/**
 * Componente para que los usuarios puedan cambiar su contraseña
 */
const ChangePassword: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Esquema de validación para el formulario
  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('La contraseña actual es obligatoria'),
    newPassword: Yup.string()
      .required('La nueva contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      ),
    confirmPassword: Yup.string()
      .required('Debe confirmar la contraseña')
      .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
  });
  
  // Valores iniciales para el formulario
  const initialValues: PasswordFormValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // Definir la interfaz para los valores del formulario
  interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  // Manejar el envío del formulario
  const handleSubmit = async (values: PasswordFormValues, { resetForm }: any) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Aquí iría la llamada a la API para cambiar la contraseña
      console.log('Cambiando contraseña:', values);
      
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos éxito
      setSuccessMessage('Contraseña actualizada correctamente');
      resetForm();
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setErrorMessage('Ha ocurrido un error al cambiar la contraseña');
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
      <h2 className="text-lg font-medium text-gray-900">Cambiar Contraseña</h2>
      
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
      
      {/* Información de seguridad */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <KeyIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Recomendaciones de seguridad</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Usa una contraseña única que no utilices en otros sitios</li>
                <li>Incluye letras mayúsculas, minúsculas, números y símbolos</li>
                <li>Evita información personal como fechas de nacimiento o nombres</li>
                <li>Cambia tu contraseña regularmente para mayor seguridad</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulario de cambio de contraseña */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikBag: any) => (
          <Form className="space-y-6 bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:p-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Contraseña actual
              </label>
              <div className="mt-1">
                <Field
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <div className="mt-1">
                <Field
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña
              </label>
              <div className="mt-1">
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  'Cambiar contraseña'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      
      {/* Historial de cambios de contraseña */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Historial de cambios</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Registro de las últimas actualizaciones de contraseña.
          </p>
        </div>
        <div className="bg-white px-4 py-5 sm:p-6">
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">Cambio de contraseña</p>
                <p className="text-sm text-gray-500">Hace 3 meses</p>
              </div>
              <p className="text-sm text-gray-500">Desde la aplicación web</p>
            </li>
            <li className="py-4">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">Cambio de contraseña</p>
                <p className="text-sm text-gray-500">Hace 8 meses</p>
              </div>
              <p className="text-sm text-gray-500">Desde la aplicación web</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;