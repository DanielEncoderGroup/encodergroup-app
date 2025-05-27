import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import requestService from '../../services/requestService';

const RequestNotifications: React.FC = () => {
  const [unviewedCount, setUnviewedCount] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Solo los administradores pueden ver las notificaciones
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    // Si el usuario no es admin, no hacemos nada
    if (!isAdmin) return;
    
    // Función para obtener el conteo de solicitudes no vistas
    const fetchUnviewedCount = async () => {
      try {
        const response = await requestService.getUnviewedCount();
        if (response.success) {
          setUnviewedCount(response.count);
        }
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };
    
    // Obtener el conteo inicial
    fetchUnviewedCount();
    
    // Configurar un intervalo para actualizar el conteo cada minuto
    const intervalId = setInterval(fetchUnviewedCount, 60000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [isAdmin]);
  
  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Navegar a la página de solicitudes y marcar como vistas
  const handleViewRequests = () => {
    navigate('/app/projects/admin');
    setDropdownOpen(false);
  };
  
  // Si el usuario no es admin, no mostramos nada
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Ver notificaciones"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Contador de notificaciones */}
        {unviewedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
            {unviewedCount > 9 ? '9+' : unviewedCount}
          </span>
        )}
      </button>
      
      {/* Dropdown de notificaciones */}
      {dropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Notificaciones</h3>
            </div>
            
            {unviewedCount > 0 ? (
              <div className="px-4 py-3">
                <p className="text-sm text-gray-700">
                  Tienes {unviewedCount} {unviewedCount === 1 ? 'solicitud nueva' : 'solicitudes nuevas'} sin revisar.
                </p>
                <button
                  onClick={handleViewRequests}
                  className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ver solicitudes
                </button>
              </div>
            ) : (
              <div className="px-4 py-3">
                <p className="text-sm text-gray-700">
                  No tienes notificaciones nuevas.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestNotifications;
