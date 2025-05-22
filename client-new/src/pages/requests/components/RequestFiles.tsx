import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

// Interfaces
interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: string;
}

interface RequestFilesProps {
  files: File[];
  onUploadFile: (files: FileList) => Promise<void>;
  onDeleteFile?: (fileId: string) => Promise<void>;
  readOnly?: boolean;
}

/**
 * Componente para gestionar los archivos de una solicitud
 */
const RequestFiles: React.FC<RequestFilesProps> = ({ 
  files, 
  onUploadFile, 
  onDeleteFile,
  readOnly = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Manejar carga de archivos
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      await onUploadFile(e.target.files);
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      e.target.value = '';
    } catch (err) {
      console.error('Error al subir archivos:', err);
      setError('Error al subir los archivos. Por favor, intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Manejar eliminación de archivo
  const handleDeleteFile = async (fileId: string) => {
    if (!onDeleteFile) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.')) {
      try {
        await onDeleteFile(fileId);
      } catch (err) {
        console.error('Error al eliminar archivo:', err);
        setError('Error al eliminar el archivo. Por favor, intenta de nuevo.');
      }
    }
  };
  
  // Obtener el ícono según el tipo de archivo
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return '🖼️';
    } else if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return '📊';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝';
    } else {
      return '📎';
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Archivos adjuntos</h3>
            <span className="ml-2 text-sm text-gray-500">({files.length})</span>
          </div>
          {!readOnly && (
            <div>
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <span>Subir archivo</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Estado de carga */}
        {isUploading && (
          <div className="mb-4 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Subiendo archivos...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Lista de archivos */}
        {files.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No hay archivos adjuntos a esta solicitud.</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Nombre
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Subido por
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Fecha
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Tamaño
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <span className="mr-2">{getFileIcon(file.type)}</span>
                        <div className="font-medium text-gray-900">{file.name}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {file.uploadedBy.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(file.uploadedAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {file.size}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Descargar {file.name}</span>
                        </a>
                        
                        {!readOnly && onDeleteFile && (
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Eliminar {file.name}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestFiles;