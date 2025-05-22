import React from 'react';

/**
 * Componente TechStack que muestra las tecnologías utilizadas por EncoderGroup
 */
const TechStack: React.FC = () => {
  const technologies = {
    frontend: [
      { name: 'React', logo: '/assets/tech/react.svg' },
      { name: 'Angular', logo: '/assets/tech/angular.svg' },
      { name: 'Vue.js', logo: '/assets/tech/vue.svg' },
      { name: 'TypeScript', logo: '/assets/tech/typescript.svg' },
      { name: 'Tailwind CSS', logo: '/assets/tech/tailwind.svg' },
    ],
    backend: [
      { name: 'Node.js', logo: '/assets/tech/nodejs.svg' },
      { name: 'Python', logo: '/assets/tech/python.svg' },
      { name: 'Java', logo: '/assets/tech/java.svg' },
      { name: '.NET', logo: '/assets/tech/dotnet.svg' },
      { name: 'Go', logo: '/assets/tech/go.svg' },
    ],
    cloud: [
      { name: 'AWS', logo: '/assets/tech/aws.svg' },
      { name: 'Azure', logo: '/assets/tech/azure.svg' },
      { name: 'Google Cloud', logo: '/assets/tech/gcp.svg' },
      { name: 'Docker', logo: '/assets/tech/docker.svg' },
      { name: 'Kubernetes', logo: '/assets/tech/kubernetes.svg' },
    ],
    database: [
      { name: 'PostgreSQL', logo: '/assets/tech/postgresql.svg' },
      { name: 'MongoDB', logo: '/assets/tech/mongodb.svg' },
      { name: 'MySQL', logo: '/assets/tech/mysql.svg' },
      { name: 'Redis', logo: '/assets/tech/redis.svg' },
      { name: 'Firebase', logo: '/assets/tech/firebase.svg' },
    ]
  };

  const categories = [
    { title: 'Frontend', description: 'Interfaces modernas y experiencias de usuario excepcionales', items: technologies.frontend },
    { title: 'Backend', description: 'Servicios robustos y APIs de alto rendimiento', items: technologies.backend },
    { title: 'Cloud & DevOps', description: 'Escalabilidad y despliegue continuo', items: technologies.cloud },
    { title: 'Bases de Datos', description: 'Almacenamiento y gestión eficiente de datos', items: technologies.database },
  ];

  return (
    <div className="py-12 bg-white" id="stack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">STACK TECNOLÓGICO</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestras herramientas preferidas
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
            Utilizamos las tecnologías más modernas y eficientes para cada proyecto, asegurando soluciones robustas, escalables y de fácil mantenimiento.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.title} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                  <p className="mt-2 text-gray-500">{category.description}</p>
                  
                  <div className="mt-8 flex flex-wrap gap-6 justify-center">
                    {category.items.map((tech) => (
                      <div key={tech.name} className="flex flex-col items-center">
                        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm p-2">
                          <img 
                            src={tech.logo} 
                            alt={tech.name} 
                            className="h-10 w-10 object-contain" 
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{tech.name}</p>
                      </div>
                    ))}
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

export default TechStack;