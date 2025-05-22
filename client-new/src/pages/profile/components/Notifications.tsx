import React, { useState } from 'react';
// Importamos Switch de Headless UI directamente usando su ruta completa
import { Switch } from '@headlessui/react/dist/components/switch/switch';

/**
 * Componente para gestionar las preferencias de notificaciones del usuario
 */
const Notifications: React.FC = () => {
  // Estado para las diferentes preferencias de notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [commentMentions, setCommentMentions] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Estado para mensajes de éxito/error
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado para indicar envío de formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Función auxiliar para renderizar switches
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };
  
  // Manejar guardar preferencias
  const handleSavePreferences = async () => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Aquí iría la llamada a la API para guardar las preferencias
      console.log('Guardando preferencias de notificaciones:', {
        emailNotifications,
        projectUpdates,
        taskAssignments,
        meetingReminders,
        securityAlerts,
        commentMentions,
        weeklyDigest,
        marketingEmails
      });
      
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos éxito
      setSuccessMessage('Preferencias de notificaciones actualizadas correctamente');
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      setErrorMessage('Ha ocurrido un error al guardar las preferencias');
    } finally {
      setIsSubmitting(false);
      
      // Limpiar mensajes después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-medium text-gray-900">Preferencias de Notificaciones</h2>
      
      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Configuración principal */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notificaciones generales</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configura cómo quieres recibir las notificaciones de la plataforma.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notificaciones por email</h4>
                <p className="text-sm text-gray-500">Recibir todas las notificaciones por correo electrónico</p>
              </div>
              <Switch
                checked={emailNotifications}
                onChange={setEmailNotifications}
                className={classNames(
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar notificaciones por email</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    emailNotifications ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Actualizaciones de proyectos</h4>
                <p className="text-sm text-gray-500">Recibir notificaciones cuando haya cambios en tus proyectos</p>
              </div>
              <Switch
                checked={projectUpdates}
                onChange={setProjectUpdates}
                className={classNames(
                  projectUpdates ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar actualizaciones de proyectos</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    projectUpdates ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Asignación de tareas</h4>
                <p className="text-sm text-gray-500">Recibir notificaciones cuando se te asigne una nueva tarea</p>
              </div>
              <Switch
                checked={taskAssignments}
                onChange={setTaskAssignments}
                className={classNames(
                  taskAssignments ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar asignación de tareas</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    taskAssignments ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Recordatorios de reuniones</h4>
                <p className="text-sm text-gray-500">Recibir recordatorios antes de tus reuniones programadas</p>
              </div>
              <Switch
                checked={meetingReminders}
                onChange={setMeetingReminders}
                className={classNames(
                  meetingReminders ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar recordatorios de reuniones</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    meetingReminders ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
      
      {/* Configuraciones adicionales */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notificaciones adicionales</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configura otras preferencias de notificaciones.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Alertas de seguridad</h4>
                <p className="text-sm text-gray-500">Recibir notificaciones sobre actividad sospechosa o cambios de seguridad</p>
              </div>
              <Switch
                checked={securityAlerts}
                onChange={setSecurityAlerts}
                className={classNames(
                  securityAlerts ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar alertas de seguridad</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    securityAlerts ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Menciones en comentarios</h4>
                <p className="text-sm text-gray-500">Recibir notificaciones cuando te mencionen en comentarios</p>
              </div>
              <Switch
                checked={commentMentions}
                onChange={setCommentMentions}
                className={classNames(
                  commentMentions ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar menciones en comentarios</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    commentMentions ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Resumen semanal</h4>
                <p className="text-sm text-gray-500">Recibir un resumen semanal de actividad y próximos eventos</p>
              </div>
              <Switch
                checked={weeklyDigest}
                onChange={setWeeklyDigest}
                className={classNames(
                  weeklyDigest ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar resumen semanal</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    weeklyDigest ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Emails de marketing</h4>
                <p className="text-sm text-gray-500">Recibir información sobre nuevas funciones y ofertas</p>
              </div>
              <Switch
                checked={marketingEmails}
                onChange={setMarketingEmails}
                className={classNames(
                  marketingEmails ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar emails de marketing</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    marketingEmails ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botón para guardar cambios */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSavePreferences}
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            'Guardar preferencias'
          )}
        </button>
      </div>
    </div>
  );
};

export default Notifications;