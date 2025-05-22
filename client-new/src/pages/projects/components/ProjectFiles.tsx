import React, { useState } from 'react';
import { Icon } from '../../../components/ui';

interface ProjectFilesProps {
  files: any[];
}

/**
 * Componente para gestionar los archivos de un proyecto
 */
const ProjectFiles: React.FC<ProjectFilesProps> = ({ files }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Función para formatear tamaño de archivo
  const formatFileSize = (size: string) => {
    return size;
  };
  
  // Función para formatear fecha
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
  
  // Función para obtener icono según tipo de archivo
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <Icon name="DocumentTextIcon" className="h-6 w-6 text-red-500" />;
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Icon name="PhotoIcon" className="h-6 w-6 text-blue-500" />;
      case 'sketch':
        return <Icon name="DocumentTextIcon" className="h-6 w-6 text-yellow-500" />;
      case 'document':
      case 'doc':
      case 'docx':
        return <Icon name="DocumentTextIcon" className="h-6 w-6 text-blue-600" />;
      default:
        return <Icon name="DocumentIcon" className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Acciones */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Archivos del Proyecto</h3>
        <button
          type="button"
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon name="PlusIcon" className="-ml-1 mr-2 h-5 w-5" />
          Subir archivo
        </button>
      </div>
      
      {/* Formulario para subir archivo (condicional) */}
      {showUploadForm && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Subir nuevo archivo</h3>
            <div className="mt-5">
              <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Icon name="ArrowUpTrayIcon" className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Subir un archivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC hasta 10MB</p>
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="file-name" className="block text-sm font-medium text-gray-700">
                  Nombre del archivo
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="file-name"
                    id="file-name"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="file-description" className="block text-sm font-medium text-gray-700">
                  Descripción (opcional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="file-description"
                    name="file-description"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Subir
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de archivos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Documentos del proyecto</h3>
            <div className="relative">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Buscar archivos..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {files.length === 0 ? (
            <li className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500">No hay archivos en este proyecto.</p>
            </li>
          ) : (
            files.map((file) => (
              <li key={file.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(file.type)}
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-600">{file.name}</h4>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>Subido por {file.uploadedBy} • {formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    <a
                      href={file.url}
                      className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Descargar"
                    >
                      <Icon name="ArrowDownTrayIcon" className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      title="Eliminar"
                    >
                      <Icon name="TrashIcon" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      
      {/* Categorías de archivos */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Icon name="DocumentTextIcon" className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Documentación</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">2 archivos</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <Icon name="PhotoIcon" className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Imágenes</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">1 archivo</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Icon name="DocumentIcon" className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Diseños</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">1 archivo</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFiles;