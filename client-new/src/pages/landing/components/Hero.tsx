import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Hero para la sección principal de la Landing Page
 */
const Hero: React.FC = () => {
  return (
    <div className="relative" id="hero">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-50"></div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
          <div className="absolute inset-0">
            <img 
              className="h-full w-full object-cover" 
              src="/assets/hero-background.jpg" 
              alt="Tecnología" 
            />
            <div className="absolute inset-0 bg-blue-700" style={{ mixBlendMode: 'multiply', opacity: 0.8 }}></div>
          </div>
          <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
            <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-white">EncoderGroup</span>
              <span className="block text-blue-200">Soluciones Tecnológicas Avanzadas</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-center text-xl text-white sm:max-w-3xl">
              Transformamos ideas en soluciones digitales innovadoras. Especialistas en desarrollo de software, 
              inteligencia artificial y consultoría tecnológica para empresas líderes.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <a
                  href="#services"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-900 bg-white hover:bg-blue-50 sm:px-8"
                >
                  Nuestras Soluciones
                </a>
                <a
                  href="#contact"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 bg-opacity-80 hover:bg-opacity-90 sm:px-8"
                >
                  Contactar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;