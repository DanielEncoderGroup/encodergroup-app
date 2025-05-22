import React from 'react';
import { Icon } from './index';

/**
 * Componente de demostración para mostrar el uso del componente Icon
 */
const IconDemo: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Demostración de Iconos</h2>
      
      <div className="space-y-6">
        {/* Sección de tamaños */}
        <div>
          <h3 className="text-lg font-medium mb-2">Tamaños de iconos</h3>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <Icon name="UserIcon" size="sm" />
              <span className="text-sm mt-1">Pequeño</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="UserIcon" size="md" />
              <span className="text-sm mt-1">Mediano</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="UserIcon" size="lg" />
              <span className="text-sm mt-1">Grande</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="UserIcon" size="xl" />
              <span className="text-sm mt-1">Extra Grande</span>
            </div>
          </div>
        </div>
        
        {/* Sección de variantes */}
        <div>
          <h3 className="text-lg font-medium mb-2">Variantes de iconos</h3>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <Icon name="UserIcon" variant="outline" size="lg" />
              <span className="text-sm mt-1">Outline</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="UserIcon" variant="solid" size="lg" />
              <span className="text-sm mt-1">Solid</span>
            </div>
          </div>
        </div>
        
        {/* Sección de colores */}
        <div>
          <h3 className="text-lg font-medium mb-2">Colores personalizados</h3>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <Icon name="ExclamationCircleIcon" size="lg" className="text-red-500" />
              <span className="text-sm mt-1">Rojo</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="CheckCircleIcon" size="lg" className="text-green-500" />
              <span className="text-sm mt-1">Verde</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="InformationCircleIcon" size="lg" className="text-blue-500" />
              <span className="text-sm mt-1">Azul</span>
            </div>
          </div>
        </div>
        
        {/* Sección de iconos comunes */}
        <div>
          <h3 className="text-lg font-medium mb-2">Iconos comunes</h3>
          <div className="grid grid-cols-6 gap-4">
            <div className="flex flex-col items-center">
              <Icon name="UserIcon" size="md" />
              <span className="text-xs mt-1">UserIcon</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="EnvelopeIcon" size="md" />
              <span className="text-xs mt-1">EnvelopeIcon</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="LockClosedIcon" variant="solid" size="md" />
              <span className="text-xs mt-1">LockClosedIcon</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="DocumentTextIcon" size="md" />
              <span className="text-xs mt-1">DocumentTextIcon</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="PlusIcon" size="md" />
              <span className="text-xs mt-1">PlusIcon</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="TrashIcon" size="md" />
              <span className="text-xs mt-1">TrashIcon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconDemo;
