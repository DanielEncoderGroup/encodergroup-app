import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routes/PrivateRoute';

// Landing page
import LandingPage from './pages/landing/LandingPage';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Dashboard and app pages
import Dashboard from './pages/dashboard/Dashboard';
import ProjectsList from './pages/projects/ProjectsList';
import ProjectForm from './pages/projects/ProjectForm';
import ProjectDetail from './pages/projects/ProjectDetail';
import MeetingsScheduler from './pages/meetings/MeetingsScheduler';
import RequestForm from './pages/requests/RequestForm';
import Statistics from './pages/dashboard/Statistics';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public landing page as the main route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Protected routes - all under /app prefix */}
        <Route path="/app" element={<PrivateRoute element={<Layout />} />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="meetings" element={<MeetingsScheduler />} />
          <Route path="requests" element={<RequestForm />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;