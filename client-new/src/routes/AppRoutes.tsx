import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componentes de autenticación
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';

// Componentes de dashboard
import Dashboard from '../pages/dashboard/Dashboard';
import Statistics from '../pages/dashboard/Statistics';

// Componentes de perfil
import Profile from '../pages/profile/Profile';

// Componentes de proyectos
import ProjectsList from '../pages/projects/ProjectsList';
import ProjectDetail from '../pages/projects/ProjectDetail';
import ProjectForm from '../pages/projects/ProjectForm';

// Componentes de reuniones
import MeetingsScheduler from '../pages/meetings/MeetingsScheduler';
import MeetingDetail from '../pages/meetings/MeetingDetail';
import MeetingForm from '../pages/meetings/MeetingForm';

// Componentes de solicitudes
import RequestsList from '../pages/requests/RequestsList';
import RequestDetail from '../pages/requests/RequestDetail';
import RequestForm from '../pages/requests/RequestForm';
import ReceiptForm from '../pages/requests/ReceiptForm';

// Otros componentes
import Layout from '../components/layout/Layout';
import LandingPage from '../pages/landing/LandingPage';
import NotFound from '../pages/NotFound';

// Componente para rutas privadas
import PrivateRoute from '../components/routes/PrivateRoute';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/app/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/app/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* Rutas privadas con Layout */}
      <Route path="/app" element={<PrivateRoute element={<Layout />} />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="statistics" element={<Statistics />} />
        
        <Route path="profile" element={<Profile />} />
        
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        
        <Route path="meetings" element={<MeetingsScheduler />} />
        <Route path="meetings/:id" element={<MeetingDetail />} />
        <Route path="meetings/new" element={<MeetingForm />} />
        <Route path="meetings/:id/edit" element={<MeetingForm />} />
        
        <Route path="requests" element={<RequestsList />} />
        <Route path="requests/:id" element={<RequestDetail />} />
        <Route path="requests/new" element={<RequestForm />} />
        <Route path="requests/:id/edit" element={<RequestForm />} />
        <Route path="requests/:id/add-receipt" element={<ReceiptForm />} />
      </Route>

      {/* Ruta para 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;