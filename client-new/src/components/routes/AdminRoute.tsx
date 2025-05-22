import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  element?: React.ReactElement;
}

/**
 * Componente para proteger rutas que solo deben ser accesibles por administradores
 * Si el usuario no está autenticado, redirige a login
 * Si el usuario está autenticado pero no es admin, redirige a dashboard
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Mientras se verifica la autenticación, mostrar nada
  if (loading) {
    return null;
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado pero no es admin, redirigir a dashboard
  if (user?.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Si es admin, mostrar el elemento o el Outlet para rutas anidadas
  return element ? element : <Outlet />;
};

export default AdminRoute;