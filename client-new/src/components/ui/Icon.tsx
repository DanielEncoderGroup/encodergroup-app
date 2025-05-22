import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';

// Tipo para la variante del icono
type IconVariant = 'outline' | 'solid';

// Props para nuestro componente Icon
export interface IconProps {
  // Nombre del icono a renderizar
  name: string;
  // Variante del icono (outline o solid)
  variant?: IconVariant;
  // Tamaño del icono (pequeño, mediano, grande)
  size?: 'sm' | 'md' | 'lg' | 'xl';
  // Clases CSS adicionales
  className?: string;
  // Props adicionales de SVG
  [key: string]: any;
}

/**
 * Componente de abstracción para iconos de Heroicons
 * 
 * Este componente permite usar iconos de manera consistente en toda la aplicación
 * y facilita posibles migraciones futuras a otras librerías de iconos.
 * 
 * @example
 * // Icono básico
 * <Icon name="UserIcon" />
 * 
 * // Icono con variante solid
 * <Icon name="UserIcon" variant="solid" />
 * 
 * // Icono con tamaño personalizado
 * <Icon name="UserIcon" size="lg" />
 */
const Icon: React.FC<IconProps> = ({ 
  name, 
  variant = 'outline', 
  size = 'md',
  className = '',
  ...rest 
}) => {
  // Seleccionar el conjunto de iconos según la variante
  const icons = variant === 'outline' ? OutlineIcons : SolidIcons;
  
  // Obtener el componente de icono dinámicamente
  const IconComponent = icons[name as keyof typeof icons];
  
  if (!IconComponent) {
    console.warn(`Icon '${name}' no encontrado en la variante '${variant}'.`);
    return null;
  }
  
  // Mapear tamaños a clases de Tailwind
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };
  
  // Combinar clases
  const combinedClassName = `${sizeClasses[size]} ${className}`;
  
  return <IconComponent className={combinedClassName} aria-hidden="true" {...rest} />;
};

export default Icon;
