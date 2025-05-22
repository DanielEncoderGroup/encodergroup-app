import React from 'react';
import { Icon } from '../../../components/ui';

/**
 * Componente Features para mostrar los servicios/características de EncoderGroup
 */
const Features: React.FC = () => {
  const features = [
    {
      name: 'Desarrollo a Medida',
      description: 'Creamos aplicaciones y software que se adaptan perfectamente a las necesidades específicas de tu negocio, garantizando soluciones personalizadas y escalables.',
      iconName: "DocumentTextIcon",
    },
    {
      name: 'Inteligencia Artificial',
      description: 'Implementamos soluciones de IA y aprendizaje automático para optimizar procesos y descubrir insights valiosos en tus datos empresariales.',
      iconName: "CpuChipIcon",
    },
    {
      name: 'Servicios Cloud',
      description: 'Diseñamos e implementamos arquitecturas cloud escalables, seguras y optimizadas para tus aplicaciones y datos en AWS, Azure o Google Cloud.',
      iconName: "CloudArrowUpIcon",
    },
    {
      name: 'Aplicaciones Móviles',
      description: 'Desarrollamos apps nativas y multiplataforma con interfaces intuitivas y rendimiento optimizado para iOS y Android.',
      iconName: "DevicePhoneMobileIcon",
    },
    {
      name: 'Ciberseguridad',
      description: 'Protegemos tus activos digitales con soluciones de seguridad avanzadas, análisis de vulnerabilidades y planes de contingencia.',
      iconName: "ShieldCheckIcon",
    },
    {
      name: 'Business Intelligence',
      description: 'Transformamos datos en insights accionables con dashboards interactivos y reportes personalizados para la toma de decisiones.',
      iconName: "ChartBarIcon",
    },
  ];

  return (
    <div className="py-12 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">NUESTROS SERVICIOS</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Soluciones completas para tus necesidades tecnológicas
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
            En EncoderGroup combinamos experiencia técnica con innovación para crear soluciones digitales
            que transforman negocios y resuelven desafíos complejos.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <Icon name={feature.iconName} className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;