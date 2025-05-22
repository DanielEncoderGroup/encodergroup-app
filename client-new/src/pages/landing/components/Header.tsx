import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Componente Header para la Landing Page
 * Incluye navegación y botón de inicio de sesión
 */
const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Servicios', href: '#services' },
    { name: 'Metodología', href: '#methodology' },
    { name: 'Stack Tecnológico', href: '#stack' },
    { name: 'Valores', href: '#values' },
    { name: 'Testimonios', href: '#testimonials' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <header className="relative bg-gradient-to-r from-blue-800 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/">
              <span className="sr-only">EncoderGroup</span>
              <div className="flex items-center">
                <img
                  className="h-10 w-auto sm:h-12"
                  src="/assets/encoder-logo.svg"
                  alt="EncoderGroup"
                />
                <span className="ml-3 text-xl font-bold text-white">EncoderGroup</span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="bg-blue-800 rounded-md p-2 inline-flex items-center justify-center text-white hover:text-gray-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-base font-medium text-white hover:text-blue-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Login button */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link
              to="/login"
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-900 bg-white hover:bg-blue-50"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="/assets/encoder-logo.svg"
                    alt="EncoderGroup"
                  />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Cerrar menú</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;