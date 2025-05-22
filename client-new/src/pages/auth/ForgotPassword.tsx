import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/api';
import { Icon } from '../../components/ui';

const ForgotPassword: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Esquema de validación
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es obligatorio')
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await authService.requestPasswordReset(values.email);
        setSuccess(true);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Error al solicitar el restablecimiento de contraseña';
        setError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Icon name="XCircleIcon" variant="solid" className="text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    type="button"
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Cerrar</span>
                    <Icon name="XMarkIcon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Icon name="CheckCircleIcon" variant="solid" className="text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Solicitud enviada</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <Link
                      to="/login"
                      className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                    >
                      Volver a iniciar sesión
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formik.touched.email && formik.errors.email 
                      ? 'border-red-300 text-red-900 placeholder-red-300' 
                      : 'border-gray-300 placeholder-gray-500 text-gray-900'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="tu@ejemplo.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.email as string}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Volver a iniciar sesión
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Icon name="EnvelopeIcon" className="text-blue-500 group-hover:text-blue-400" />
                </span>
                {formik.isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;