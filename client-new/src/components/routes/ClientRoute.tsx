import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ClientRouteProps {
  element?: React.ReactElement;
}

/**
 * Componente para proteger rutas que solo deben ser accesibles por clientes
 * Si el usuario no está autenticado, redirige a login
 * Si el usuario está autenticado pero no es cliente, redirige a dashboard
 */
const ClientRoute: React.FC<ClientRouteProps> = ({ element }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Mientras se verifica la autenticación, mostrar nada
  if (loading) {
    return null;
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado pero no es usuario regular (cliente), redirigir a dashboard
  if (user?.role !== 'user') {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Si es cliente, mostrar el elemento o el Outlet para rutas anidadas
  return element ? element : <Outlet />;
};

export default ClientRoute;