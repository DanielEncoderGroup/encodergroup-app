import React, { useState } from 'react';
import { 
  ChatBubbleLeftIcon, 
  PaperClipIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Interfaces
interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: string;
  }[];
}

interface RequestCommentsProps {
  comments: Comment[];
  onAddComment: (content: string, attachments: File[]) => Promise<void>;
}

/**
 * Componente para gestionar los comentarios de una solicitud
 */
const RequestComments: React.FC<RequestCommentsProps> = ({ comments, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  // Manejar envío de un nuevo comentario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onAddComment(commentText, attachments);
      setCommentText('');
      setAttachments([]);
    } catch (err) {
      console.error('Error al añadir comentario:', err);
      setError('Error al añadir el comentario. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Manejar carga de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };
  
  // Eliminar un archivo adjunto
  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
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
  
  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center">
          <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Comentarios</h3>
          <span className="ml-2 text-sm text-gray-500">({comments.length})</span>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Lista de comentarios */}
        {comments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No hay comentarios. Sé el primero en comentar.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    {comment.user.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={comment.user.avatar}
                        alt={comment.user.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{comment.user.name}</h4>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>{comment.content}</p>
                    </div>
                    
                    {/* Archivos adjuntos */}
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="mt-2 flex flex-col space-y-2">
                        {comment.attachments.map((file) => (
                          <div key={file.id} className="flex items-center text-sm text-gray-500">
                            <PaperClipIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-500"
                            >
                              {file.name}
                            </a>
                            <span className="ml-1">({file.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2 text-sm text-gray-500">
                      <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Formulario para añadir comentarios */}
        <div className="mt-6">
          <form onSubmit={handleSubmit}>
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
            
            <div>
              <label htmlFor="comment" className="sr-only">
                Añadir comentario
              </label>
              <textarea
                id="comment"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Añade un comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            {/* Mostrar archivos adjuntos seleccionados */}
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                <h4 className="text-xs font-medium text-gray-500">Archivos adjuntos:</h4>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
                    >
                      <span className="mr-1">{getFileIcon(file.type)}</span>
                      <span className="truncate max-w-xs">{file.name}</span>
                      <span className="ml-1 text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Adjuntar archivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </label>
                <p className="pl-1 text-xs text-gray-500">Máximo 10 MB por archivo</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Comentar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestComments;