import React from 'react';

/**
 * Componente Values que muestra los valores corporativos de EncoderGroup
 * Enfatiza el compromiso y la transparencia como pilares fundamentales
 */
const Values: React.FC = () => {
  const values = [
    {
      name: 'Compromiso',
      description: 'Nos comprometemos con cada proyecto como si fuera propio, entregando siempre más allá de lo esperado y asegurando la satisfacción total de nuestros clientes.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Transparencia',
      description: 'Creemos en la comunicación clara y honesta durante todo el proceso de desarrollo. Mantenemos a nuestros clientes informados con total transparencia sobre avances, desafíos y soluciones.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Innovación',
      description: 'Constantemente exploramos nuevas tecnologías y enfoques para ofrecer soluciones innovadoras que destaquen en el mercado y proporcionen ventajas competitivas a nuestros clientes.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      name: 'Excelencia',
      description: 'Buscamos la excelencia en cada línea de código y en cada interacción. Nuestros altos estándares de calidad garantizan productos robustos, eficientes y de alto rendimiento.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-12 bg-gradient-to-r from-blue-700 to-indigo-800 text-white" id="values">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-200 tracking-wide uppercase">NUESTROS VALORES</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Principios que guían nuestro trabajo
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-blue-100">
            En EncoderGroup, nuestros valores definen nuestra identidad y la forma en que nos relacionamos con nuestros clientes y colaboradores.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.name} className="pt-6">
                <div className="flow-root bg-blue-800 bg-opacity-50 rounded-lg px-6 pb-8 h-full backdrop-blur">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-md shadow-lg">
                      {value.icon}
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{value.name}</h3>
                    <p className="mt-5 text-base text-blue-100">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-blue-900 bg-opacity-50 rounded-lg p-8 backdrop-blur">
          <blockquote>
            <div>
              <svg className="h-12 w-12 text-blue-300 opacity-25" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="mt-4 text-xl font-medium text-white">
                Nuestro compromiso y transparencia son la base de relaciones duraderas con nuestros clientes. 
                Entendemos que la confianza se construye con cada interacción y entrega, y nos esforzamos por 
                superar expectativas en cada proyecto.
              </p>
            </div>
            <footer className="mt-6">
              <p className="text-base font-medium text-white">Equipo de EncoderGroup</p>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Values;