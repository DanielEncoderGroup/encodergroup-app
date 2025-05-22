import React, { Fragment, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '../ui';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

/**
 * Componente Sidebar que muestra la navegación lateral
 * Incluye versión móvil (Dialog) y versión desktop
 */
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Ruta del logo
  const logoIconPath = '/assets/encoder-logo.svg';
  
  // Elementos de navegación
  const navigation = [
    { name: 'Dashboard', href: '/app', iconName: 'HomeIcon' },
    { name: 'Proyectos', href: '/app/projects', iconName: 'DocumentTextIcon' },
    { name: 'Nuevo Proyecto', href: '/app/projects/new', iconName: 'PlusCircleIcon' },
    { name: 'Reuniones', href: '/app/meetings', iconName: 'CalendarIcon' },
    { name: 'Solicitud', href: '/app/requests', iconName: 'ClipboardDocumentListIcon' },
    { name: 'Estadísticas', href: '/app/stats', iconName: 'ChartBarIcon' },
    { name: 'Mi Perfil', href: '/app/profile', iconName: 'UserIcon' }
  ];

  // Cerrar el sidebar con tecla Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [setSidebarOpen]);

  // Verificar si una ruta está activa (incluyendo subrutas)
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Sidebar para móviles (slide over) */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
          open={sidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Cerrar sidebar</span>
                    <Icon name="XMarkIcon" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src={logoIconPath}
                    alt="EncoderGroup"
                  />
                  <span className="ml-2 text-xl font-bold text-primary-700">EncoderGroup</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        group flex items-center px-2 py-2 text-base font-medium rounded-md
                        ${
                          isActive(item.href)
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon 
                        name={item.iconName}
                        className={`
                          mr-4 flex-shrink-0 h-6 w-6
                          ${
                            isActive(item.href)
                              ? 'text-primary-600'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }
                        `}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      {user?.profileImage ? (
                        <img
                          className="inline-block h-9 w-9 rounded-full"
                          src={user.profileImage}
                          alt=""
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                          <Icon name="UserIcon" className="h-6 w-6 text-primary-700" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        Ver perfil
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">{/* Fuerza al sidebar a reducirse para ajustarse al ícono de cierre */}</div>
        </Dialog>
      </Transition.Root>

      {/* Sidebar estático para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="h-8 w-auto"
                src={logoIconPath}
                alt="EncoderGroup"
              />
              <span className="ml-2 text-xl font-bold text-primary-700">EncoderGroup</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon 
                    name={item.iconName}
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6
                      ${
                        isActive(item.href)
                          ? 'text-primary-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  {user?.profileImage ? (
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={user.profileImage}
                      alt=""
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                      <Icon name="UserIcon" className="h-6 w-6 text-primary-700" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    v1.0.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;