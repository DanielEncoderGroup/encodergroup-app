import React from 'react';

/**
 * Componente Methodology para mostrar las metodologías de trabajo de EncoderGroup
 */
const Methodology: React.FC = () => {
  const methodologies = [
    {
      name: 'Agile',
      description: 'Desarrollamos con metodologías ágiles como Scrum y Kanban para adaptarnos rápidamente a los cambios y entregar valor de forma continua.',
      image: '/assets/methodology-agile.jpg',
      points: [
        'Sprints de 1-2 semanas con entregas continuas',
        'Revisiones y retrospectivas regulares',
        'Comunicación transparente y frecuente',
        'Adaptación constante a los cambios de requisitos'
      ]
    },
    {
      name: 'DevOps',
      description: 'Implementamos prácticas DevOps para automatizar procesos, mejorar la colaboración y entregar software de alta calidad con mayor frecuencia.',
      image: '/assets/methodology-devops.jpg',
      points: [
        'Integración y entrega continua (CI/CD)',
        'Infraestructura como código',
        'Monitoreo y feedback continuo',
        'Automatización de pruebas y despliegues'
      ]
    },
    {
      name: 'Design Thinking',
      description: 'Aplicamos Design Thinking para resolver problemas complejos con soluciones centradas en el usuario y la experiencia del cliente.',
      image: '/assets/methodology-design-thinking.jpg',
      points: [
        'Empatía con los usuarios finales',
        'Ideación colaborativa y prototipos',
        'Iteraciones basadas en feedback',
        'Enfoque en experiencias memorables'
      ]
    }
  ];

  return (
    <div className="py-12 bg-gray-50" id="methodology">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">METODOLOGÍAS</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestro enfoque para el éxito
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
            Combinamos metodologías probadas con procesos innovadores para entregar soluciones de alta calidad de manera consistente.
          </p>
        </div>
        
        <div className="mt-16">
          {methodologies.map((methodology, index) => (
            <div 
              key={methodology.name}
              className={`relative mt-12 lg:mt-20 ${
                index % 2 === 0 ? 'lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center' : 'lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center lg:flex-row-reverse'
              }`}
            >
              <div className={index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1'}>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  {methodology.name}
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  {methodology.description}
                </p>

                <div className="mt-10">
                  <ul className="space-y-4">
                    {methodology.points.map((point) => (
                      <li key={point} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-500">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`mt-10 lg:mt-0 ${index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-2'}`}>
                <div className="aspect-w-16 aspect-h-9 relative bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={methodology.image}
                    alt={methodology.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Methodology;