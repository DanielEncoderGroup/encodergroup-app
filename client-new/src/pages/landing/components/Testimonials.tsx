import React from 'react';

/**
 * Componente Testimonials que muestra testimonios de clientes satisfechos
 */
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      content: "EncoderGroup transformó completamente nuestros procesos internos con su plataforma de gestión. La calidad del código y la intuitividad de la interfaz superaron nuestras expectativas.",
      author: "María Rodríguez",
      position: "CTO, TechSolutions Inc.",
      image: "/assets/testimonials/person1.jpg"
    },
    {
      content: "La transparencia y compromiso del equipo de EncoderGroup fueron clave para el éxito de nuestro proyecto. Siempre estuvieron disponibles y las entregas se realizaron en tiempo y forma.",
      author: "Carlos Méndez",
      position: "Director de Innovación, GlobalBank",
      image: "/assets/testimonials/person2.jpg"
    },
    {
      content: "Implementamos la solución de IA desarrollada por EncoderGroup y logramos reducir costos operativos en un 35%. Su capacidad técnica y visión estratégica marcaron la diferencia.",
      author: "Laura Sánchez",
      position: "CEO, DataInsights",
      image: "/assets/testimonials/person3.jpg"
    }
  ];

  return (
    <div className="py-12 bg-gray-50" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">TESTIMONIOS</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
            Descubre por qué empresas líderes confían en EncoderGroup para sus soluciones tecnológicas.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
                <blockquote>
                  <p className="text-base text-gray-600 italic">"{testimonial.content}"</p>
                </blockquote>
              </div>
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600">
            Más de <span className="font-bold text-blue-600">50 empresas</span> han confiado en nosotros para sus proyectos tecnológicos
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8 grayscale opacity-70">
            <img className="h-8" src="/assets/clients/client1.svg" alt="Cliente 1" />
            <img className="h-8" src="/assets/clients/client2.svg" alt="Cliente 2" />
            <img className="h-8" src="/assets/clients/client3.svg" alt="Cliente 3" />
            <img className="h-8" src="/assets/clients/client4.svg" alt="Cliente 4" />
            <img className="h-8" src="/assets/clients/client5.svg" alt="Cliente 5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;