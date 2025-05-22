import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="relative bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="text-white text-2xl font-bold">MisViaticos</span>
            </div>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link
                to="/login"
                className="whitespace-nowrap text-base font-medium text-white hover:text-gray-200"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-700 bg-white hover:bg-gray-100"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative bg-indigo-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Gestiona tus viáticos y solicitudes de manera eficiente
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            MisViaticos te permite gestionar tus solicitudes de viáticos, programar reuniones y llevar un control detallado de tus gastos de manera sencilla y eficiente.
          </p>
          <div className="mt-10 flex items-center space-x-6">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50"
            >
              Comenzar ahora
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Características
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Todo lo que necesitas para gestionar tus viáticos
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Una plataforma completa diseñada para simplificar la gestión de viáticos y solicitudes en tu organización.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">
                    Gestión de solicitudes
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Crea, edita y da seguimiento a tus solicitudes de viáticos de manera sencilla y rápida.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">
                    Programación de reuniones
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Programa y administra tus reuniones relacionadas con proyectos y viáticos.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">
                    Estadísticas y reportes
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Visualiza datos y genera reportes detallados sobre tus gastos y solicitudes.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">
                    Gestión de proyectos
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Organiza tus solicitudes y reuniones por proyectos para un mejor seguimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block">Regístrate hoy mismo.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Únete a la plataforma que está transformando la manera en que las organizaciones gestionan sus viáticos y solicitudes.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Registrarse gratis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <span className="text-gray-400 text-sm">
                © 2023 EncoderGroup. Todos los derechos reservados.
              </span>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                Una aplicación desarrollada por EncoderGroup.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;