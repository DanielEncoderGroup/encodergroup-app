import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  change: string;
  loading: boolean;
  color: 'blue' | 'green' | 'yellow' | 'indigo' | 'red' | 'purple';
}

/**
 * Componente StatCard que muestra una estadística con título, valor e icono
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, loading, color }) => {
  // Mapa de colores para los diferentes estilos
  const colorMap = {
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-100',
      text: 'text-blue-800',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-100',
      text: 'text-green-800',
      icon: 'text-green-500'
    },
    yellow: {
      bg: 'bg-yellow-500',
      light: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: 'text-yellow-500'
    },
    indigo: {
      bg: 'bg-indigo-500',
      light: 'bg-indigo-100',
      text: 'text-indigo-800',
      icon: 'text-indigo-500'
    },
    red: {
      bg: 'bg-red-500',
      light: 'bg-red-100',
      text: 'text-red-800',
      icon: 'text-red-500'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-100',
      text: 'text-purple-800',
      icon: 'text-purple-500'
    }
  };

  const colorClasses = colorMap[color];
  
  // Determinar si el cambio es positivo o negativo
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-md ${colorClasses.light}`}>
            <Icon className={`h-6 w-6 ${colorClasses.icon}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                {loading ? (
                  <div className="h-7 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {change}
                    </div>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className={`${colorClasses.bg} px-5 py-1`}>
        <div className="text-xs text-white">
          Actualizado hoy
        </div>
      </div>
    </div>
  );
};

export default StatCard;