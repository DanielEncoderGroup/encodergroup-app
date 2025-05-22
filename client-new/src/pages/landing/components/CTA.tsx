import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente CTA (Call to Action) para invitar a los visitantes a contactar o registrarse
 */
const CTA: React.FC = () => {
  return (
    <div className="bg-blue-700" id="contact">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">¿Listo para transformar tu negocio?</span>
          <span className="block text-blue-200">Comienza hoy mismo con EncoderGroup.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
            >
              Registrarse
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <a
              href="mailto:contacto@encodergroup.com"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Contactar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;