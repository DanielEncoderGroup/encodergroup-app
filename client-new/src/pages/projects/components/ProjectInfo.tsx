import React from 'react';
import { Icon } from '../../../components/ui';

interface ProjectInfoProps {
  project: any;
}

/**
 * Componente para mostrar la información general de un proyecto
 */
const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      {/* Descripción del proyecto */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-start">
          <Icon name="DocumentTextIcon" className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Descripción del Proyecto</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalle completo del proyecto y sus objetivos.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {project.description}
          </p>
        </div>
      </div>

      {/* Objetivos y metas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Objetivos y Metas</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Principales objetivos y resultados esperados del proyecto.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <ul className="space-y-3 list-disc pl-5 text-sm text-gray-600">
            <li>Desarrollar un sistema completo de gestión empresarial que integre todos los departamentos</li>
            <li>Automatizar procesos manuales para reducir tiempos operativos en un 40%</li>
            <li>Implementar reportes en tiempo real para mejorar la toma de decisiones</li>
            <li>Integrar el sistema con plataformas externas para centralizar la información</li>
            <li>Implementar un sistema de seguridad robusto que cumpla con estándares internacionales</li>
          </ul>
        </div>
      </div>

      {/* Alcance del proyecto */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Alcance del Proyecto</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Límites y delimitaciones del trabajo a realizar.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">Incluido en el alcance:</h4>
              <ul className="mt-2 space-y-2 list-disc pl-5">
                <li>Desarrollo de módulos de inventario, ventas, compras, RRHH y finanzas</li>
                <li>Migración de datos desde sistemas anteriores</li>
                <li>Capacitación a usuarios finales y administradores</li>
                <li>Soporte técnico durante 6 meses post-implementación</li>
                <li>Integración con sistemas de facturación electrónica</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Fuera del alcance:</h4>
              <ul className="mt-2 space-y-2 list-disc pl-5">
                <li>Desarrollo de aplicaciones móviles nativas (solo versión web responsive)</li>
                <li>Modificación de procesos empresariales existentes</li>
                <li>Mantenimiento de hardware e infraestructura del cliente</li>
                <li>Integración con sistemas no especificados en el contrato inicial</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Información financiera */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Información Financiera</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detalles sobre presupuesto, gastos y facturación.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Presupuesto total</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(project.budget)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Facturado hasta la fecha</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(project.budget * 0.4)} (40%)
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gastos actuales</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(project.budget * 0.35)} (35%)
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Próxima facturación</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(project.budget * 0.2)} (15 de mayo de 2023)
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Cronograma */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Cronograma</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Hitos principales y fechas clave del proyecto.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hito
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha planificada
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Kickoff del proyecto
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15/01/2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completado
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Finalización de diseño y arquitectura
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  28/02/2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completado
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Entrega de Backend MVP
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  30/04/2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    En progreso
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Integración completa de sistemas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  31/05/2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Pendiente
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Pruebas y QA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15/06/2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Pendiente
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Lanzamiento
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  30/06/2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Pendiente
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;