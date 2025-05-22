import React, { useState } from 'react';
// Importamos Switch de Headless UI directamente usando su ruta completa
import { Switch } from '@headlessui/react/dist/components/switch/switch';
import { ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Componente para gestionar las configuraciones de seguridad del usuario
 */
const SecuritySettings: React.FC = () => {
  // Estado para las diferentes configuraciones de seguridad
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [trustedDevices, setTrustedDevices] = useState<{ id: string; name: string; lastUsed: string; location: string }[]>([
    { id: '1', name: 'Chrome en Windows', lastUsed: '2023-04-11T10:20:00', location: 'Madrid, España' },
    { id: '2', name: 'Safari en iPhone', lastUsed: '2023-04-10T18:45:00', location: 'Madrid, España' },
    { id: '3', name: 'Firefox en MacBook', lastUsed: '2023-04-05T09:30:00', location: 'Barcelona, España' }
  ]);
  
  // Estado para mensajes de éxito/error
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado para indicar envío de formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  
  // Función auxiliar para renderizar switches
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };
  
  // Manejar guardar configuraciones
  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Aquí iría la llamada a la API para guardar las configuraciones
      console.log('Guardando configuraciones de seguridad:', {
        twoFactorAuth,
        loginNotifications,
        sessionTimeout
      });
      
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos éxito
      setSuccessMessage('Configuración de seguridad actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setErrorMessage('Ha ocurrido un error al guardar la configuración');
    } finally {
      setIsSubmitting(false);
      
      // Limpiar mensajes después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
  };
  
  // Manejar eliminación de dispositivo de confianza
  const handleRemoveDevice = (deviceId: string) => {
    setTrustedDevices(trustedDevices.filter(device => device.id !== deviceId));
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-medium text-gray-900">Configuración de Seguridad</h2>
      
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
      
      {/* Alerta de seguridad recomendada */}
      {!twoFactorAuth && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Recomendación de seguridad</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Te recomendamos activar la autenticación de dos factores para aumentar la seguridad de tu cuenta.
                  Esto añade una capa adicional de protección a tu inicio de sesión.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Configuración principal */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Opciones de seguridad</h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configura las opciones de seguridad de tu cuenta.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Autenticación de dos factores</h4>
                <p className="text-sm text-gray-500">Añade una capa adicional de seguridad a tu cuenta</p>
              </div>
              <div className="flex items-center">
                <Switch
                  checked={twoFactorAuth}
                  onChange={(checked: boolean) => {
                    if (checked) {
                      setShowTwoFactorModal(true);
                    } else {
                      setTwoFactorAuth(false);
                    }
                  }}
                  className={classNames(
                    twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200',
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  )}
                >
                  <span className="sr-only">Activar autenticación de dos factores</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      twoFactorAuth ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
                {twoFactorAuth && (
                  <button
                    type="button"
                    className="ml-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => setShowTwoFactorModal(true)}
                  >
                    Configurar
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notificaciones de inicio de sesión</h4>
                <p className="text-sm text-gray-500">Recibe notificaciones cuando inicies sesión desde un nuevo dispositivo</p>
              </div>
              <Switch
                checked={loginNotifications}
                onChange={setLoginNotifications}
                className={classNames(
                  loginNotifications ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <span className="sr-only">Activar notificaciones de inicio de sesión</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    loginNotifications ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
            
            <div>
              <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-900">
                Tiempo de inactividad de sesión (minutos)
              </label>
              <select
                id="session-timeout"
                name="session-timeout"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Tu sesión se cerrará automáticamente después de este tiempo de inactividad.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dispositivos de confianza */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Dispositivos de confianza</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Dispositivos desde los que has iniciado sesión recientemente.
          </p>
        </div>
        <div className="bg-white">
          <ul className="divide-y divide-gray-200">
            {trustedDevices.length === 0 ? (
              <li className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">No hay dispositivos registrados.</p>
              </li>
            ) : (
              trustedDevices.map((device) => (
                <li key={device.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{device.name}</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>Último uso: {formatDate(device.lastUsed)}</span>
                        <span className="mx-2">&middot;</span>
                        <span>{device.location}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDevice(device.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Revocar
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      
      {/* Historial de acceso */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Historial de acceso</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Actividad de inicio de sesión reciente.
          </p>
        </div>
        <div className="bg-white">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4 sm:px-6">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Inicio de sesión exitoso</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span>11 de abril de 2023, 10:20</span>
                    <span className="mx-2">&middot;</span>
                    <span>Chrome en Windows</span>
                    <span className="mx-2">&middot;</span>
                    <span>Madrid, España</span>
                  </div>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Inicio de sesión exitoso</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span>10 de abril de 2023, 18:45</span>
                    <span className="mx-2">&middot;</span>
                    <span>Safari en iPhone</span>
                    <span className="mx-2">&middot;</span>
                    <span>Madrid, España</span>
                  </div>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-red-600">Intento de inicio de sesión fallido</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span>8 de abril de 2023, 22:10</span>
                    <span className="mx-2">&middot;</span>
                    <span>Dispositivo desconocido</span>
                    <span className="mx-2">&middot;</span>
                    <span>Kiev, Ucrania</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver historial completo
          </button>
        </div>
      </div>
      
      {/* Botón para guardar cambios */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveSettings}
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
            'Guardar configuración'
          )}
        </button>
      </div>
      
      {/* Modal para configurar 2FA (simplificado) */}
      {showTwoFactorModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Configurar autenticación de dos factores</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Escanea el código QR con tu aplicación de autenticación o ingresa el código manualmente.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="p-2 bg-white border border-gray-300 rounded-lg">
                        <div className="h-40 w-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          Código QR
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Código manual:</p>
                      <p className="text-lg font-mono bg-gray-100 p-2 rounded mt-1">ABCD-EFGH-IJKL-MNOP</p>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 text-left">
                        Código de verificación
                      </label>
                      <input
                        type="text"
                        name="verification-code"
                        id="verification-code"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Ingresa el código de 6 dígitos"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={() => {
                    setTwoFactorAuth(true);
                    setShowTwoFactorModal(false);
                  }}
                >
                  Verificar y activar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowTwoFactorModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;