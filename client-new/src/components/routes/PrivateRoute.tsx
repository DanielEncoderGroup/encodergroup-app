import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Mostrar un indicador de carga mientras se verifica la autenticación
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    // Guardar la ruta a la que intentaba acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{element}</>;
};

export default PrivateRoute;