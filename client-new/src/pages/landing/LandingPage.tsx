import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="relative bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="text-white text-2xl font-bold flex items-center">
                <Icon name="CommandLineIcon" className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-blue-500">Encoder</span>Group
              </span>
            </div>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-8">
              <a href="#metodologias" className="text-base font-medium text-gray-300 hover:text-white">
                Metodologías
              </a>
              <a href="#tecnologias" className="text-base font-medium text-gray-300 hover:text-white">
                Tecnologías
              </a>
              <a href="#valores" className="text-base font-medium text-gray-300 hover:text-white">
                Valores
              </a>
              <Link
                to="/login"
                className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-900 bg-blue-500 hover:bg-blue-600"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-gray-900 mix-blend-multiply" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-500 opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Soluciones Tecnológicas <span className="text-blue-400">Escalables</span> para Empresas Modernas
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            EncoderGroup transforma el modo en que las empresas gestionan sus recursos, proyectos y equipos mediante soluciones digitales a medida que crecen con tu negocio.
          </p>
          <div className="mt-10 flex items-center space-x-6">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Comenzar ahora
            </Link>
            <Link
              to="/login"
              className="text-base font-medium text-white hover:text-blue-300"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Metodologías section */}
      <div id="metodologias" className="py-16 bg-white overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Metodologías de Trabajo
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Implementamos metodologías ágiles que garantizan la entrega de valor constante y la adaptación a los cambios.
            </p>
          </div>

          <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="relative p-8 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="h-14 w-14 rounded-md bg-blue-500 flex items-center justify-center mb-5">
                <Icon name="ArrowPathIcon" className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scrum</h3>
              <p className="text-gray-500 mb-3">
                Iteraciones cortas (sprints) que permiten entregar valor de forma incremental y obtener retroalimentación constante.
              </p>
              <ul className="text-gray-500 list-disc pl-5 space-y-1">
                <li>Sprints de 1-2 semanas</li>
                <li>Ceremonias ágiles</li>
                <li>Mejora continua</li>
              </ul>
            </div>

            <div className="relative mt-10 lg:mt-0 p-8 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="h-14 w-14 rounded-md bg-blue-500 flex items-center justify-center mb-5">
                <Icon name="Squares2X2Icon" className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kanban</h3>
              <p className="text-gray-500 mb-3">
                Visualización del flujo de trabajo que permite identificar cuellos de botella y optimizar procesos.
              </p>
              <ul className="text-gray-500 list-disc pl-5 space-y-1">
                <li>Flujo continuo</li>
                <li>Limitación de trabajo en progreso</li>
                <li>Optimización de ciclos</li>
              </ul>
            </div>

            <div className="relative mt-10 lg:mt-0 p-8 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="h-14 w-14 rounded-md bg-blue-500 flex items-center justify-center mb-5">
                <Icon name="CpuChipIcon" className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">DevOps</h3>
              <p className="text-gray-500 mb-3">
                Integración entre desarrollo y operaciones para automatizar procesos y acelerar entregas.
              </p>
              <ul className="text-gray-500 list-disc pl-5 space-y-1">
                <li>CI/CD automatizado</li>
                <li>Infraestructura como código</li>
                <li>Monitoreo continuo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tecnologías section */}
      <div id="tecnologias" className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Stack Tecnológico
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Utilizamos tecnologías modernas y escalables para desarrollar soluciones robustas y adaptables.
            </p>
          </div>

          <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="h-10 w-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Icon name="CodeBracketIcon" className="h-6 w-6" />
                </span>
                Frontend
              </h3>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> React & TypeScript
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> TailwindCSS
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Redux / Context API
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Formik & Yup
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="h-10 w-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Icon name="ServerIcon" className="h-6 w-6" />
                </span>
                Backend
              </h3>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Node.js & Express
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> MongoDB
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> RESTful APIs
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> JWT Authentication
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="h-10 w-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Icon name="CubeIcon" className="h-6 w-6" />
                </span>
                DevOps
              </h3>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Docker & Kubernetes
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> CI/CD Pipelines
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> AWS / Azure
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Monitoring & Logging
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="h-10 w-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Icon name="WrenchScrewdriverIcon" className="h-6 w-6" />
                </span>
                Herramientas
              </h3>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Git & GitHub
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Jira / Trello
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Figma / Adobe XD
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span> Jest / Cypress
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Valores section */}
      <div id="valores" className="py-16 bg-white overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Nuestros Valores
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Estos valores definen nuestra cultura y guían cada decisión que tomamos en EncoderGroup.
            </p>
          </div>

          <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative p-8 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Icon name="ShieldCheckIcon" className="h-6 w-6 mr-2 text-blue-500" />
                Compromiso
              </h3>
              <p className="text-gray-700">
                Nos comprometemos a entregar soluciones de alta calidad que superen las expectativas de nuestros clientes.
                Asumimos la responsabilidad de nuestro trabajo y cumplimos con los plazos establecidos.
              </p>
            </div>

            <div className="relative p-8 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Icon name="LightBulbIcon" className="h-6 w-6 mr-2 text-blue-500" />
                Innovación
              </h3>
              <p className="text-gray-700">
                Buscamos constantemente nuevas formas de resolver problemas y mejorar nuestros procesos.
                Fomentamos la creatividad y el pensamiento disruptivo en todos los niveles de la organización.
              </p>
            </div>

            <div className="relative p-8 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Icon name="UserGroupIcon" className="h-6 w-6 mr-2 text-blue-500" />
                Colaboración
              </h3>
              <p className="text-gray-700">
                Creemos en el poder del trabajo en equipo. Colaboramos estrechamente con nuestros clientes y
                entre nosotros para lograr resultados excepcionales. Valoramos la diversidad de pensamiento y experiencia.
              </p>
            </div>

            <div className="relative p-8 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Icon name="DocumentTextIcon" className="h-6 w-6 mr-2 text-blue-500" />
                Transparencia
              </h3>
              <p className="text-gray-700">
                Mantenemos una comunicación clara y honesta en todas nuestras interacciones. Compartimos abiertamente
                nuestros procesos, decisiones y resultados, construyendo confianza con nuestros clientes y colaboradores.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para transformar tu negocio?</span>
            <span className="block">Comienza tu proyecto con EncoderGroup.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Únete a las empresas que están impulsando su crecimiento con nuestras soluciones tecnológicas escalables y personalizadas.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:w-auto"
            >
              Comenzar proyecto
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 sm:w-auto"
            >
              Acceder a mi cuenta
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-white text-xl font-bold flex items-center mb-4">
                <Icon name="CommandLineIcon" className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-blue-500">Encoder</span>Group
              </span>
              <p className="text-gray-400 text-sm max-w-xs text-center md:text-left">
                Soluciones tecnológicas escalables para empresas que buscan transformar sus procesos y crecer en la era digital.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white text-lg font-semibold mb-4">Navegación</h3>
              <div className="flex flex-col space-y-2">
                <a href="#metodologias" className="text-gray-400 hover:text-white">Metodologías</a>
                <a href="#tecnologias" className="text-gray-400 hover:text-white">Tecnologías</a>
                <a href="#valores" className="text-gray-400 hover:text-white">Valores</a>
                <Link to="/login" className="text-gray-400 hover:text-white">Iniciar sesión</Link>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
              <div className="flex flex-col space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Icon name="EnvelopeIcon" className="h-5 w-5 mr-2 text-blue-500" />
                  <span>info@encodergroup.com</span>
                </div>
                <div className="flex items-center">
                  <Icon name="PhoneIcon" className="h-5 w-5 mr-2 text-blue-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Icon name="MapPinIcon" className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Silicon Valley, California</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EncoderGroup. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;