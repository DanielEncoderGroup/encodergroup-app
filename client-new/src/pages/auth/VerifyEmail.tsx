import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setError('Token inválido');
        setVerifying(false);
        return;
      }

      try {
        await authService.verifyEmail(token);
        setSuccess(true);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Error al verificar el correo electrónico';
        setError(errorMessage);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {verifying ? (
          <div className="text-center">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verificando...
            </h2>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : success ? (
          <div>
            <div className="text-center">
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                ¡Verificación exitosa!
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Tu correo electrónico ha sido verificado correctamente. Ahora puedes iniciar sesión en tu cuenta.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Error de verificación
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {error || 'No se pudo verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.'}
              </p>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registrarse de nuevo
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;