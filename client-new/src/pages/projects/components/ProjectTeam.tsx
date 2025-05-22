import React, { useState } from 'react';
import { Icon } from '../../../components/ui';

interface ProjectTeamProps {
  team: any[];
}

/**
 * Componente para mostrar y gestionar el equipo de un proyecto
 */
const ProjectTeam: React.FC<ProjectTeamProps> = ({ team }) => {
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Acciones */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Equipo del Proyecto</h3>
        <button
          type="button"
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon name="PlusIcon" className="-ml-1 mr-2 h-5 w-5" />
          Añadir miembro
        </button>
      </div>
      
      {/* Formulario para añadir miembro (condicional) */}
      {showAddMemberForm && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Añadir nuevo miembro</h3>
            <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="role"
                    id="role"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddMemberForm(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de miembros del equipo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {team.map((member) => (
          <div key={member.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                    alt={member.name}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Icon name="EnvelopeIcon" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Icon name="PhoneIcon" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span>+34 612 345 678</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Icon name="PencilIcon" className="-ml-0.5 mr-1 h-4 w-4" />
                Editar
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Icon name="TrashIcon" className="-ml-0.5 mr-1 h-4 w-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Roles y responsabilidades */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Roles y Responsabilidades</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Definición de los roles en el proyecto y sus responsabilidades principales.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Project Manager</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Planificación y coordinación general del proyecto</li>
                  <li>Gestión de recursos y presupuesto</li>
                  <li>Comunicación con el cliente</li>
                  <li>Seguimiento y reporte de avances</li>
                </ul>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Lead Developer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Diseño de la arquitectura del sistema</li>
                  <li>Revisión de código y estándares de calidad</li>
                  <li>Toma de decisiones técnicas</li>
                  <li>Mentoring a desarrolladores junior</li>
                </ul>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">UI/UX Designer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Diseño de interfaces de usuario</li>
                  <li>Creación de prototipos interactivos</li>
                  <li>Pruebas de usabilidad</li>
                  <li>Desarrollo de guías de estilo</li>
                </ul>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Backend Developer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Desarrollo de APIs y servicios</li>
                  <li>Diseño e implementación de bases de datos</li>
                  <li>Integración con sistemas externos</li>
                  <li>Optimización de rendimiento</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProjectTeam;