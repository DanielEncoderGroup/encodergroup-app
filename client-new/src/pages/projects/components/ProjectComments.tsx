import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface ProjectCommentsProps {
  comments: any[];
}

/**
 * Componente para mostrar y gestionar los comentarios de un proyecto
 */
const ProjectComments: React.FC<ProjectCommentsProps> = ({ comments: initialComments }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace unos segundos';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
  };
  
  // Manejar envío de nuevo comentario
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Aquí iría la llamada a la API para guardar el comentario
      // Por ahora, simulamos con un nuevo objeto de comentario
      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        author: user?.name || 'Usuario actual',
        authorAvatar: user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Usuario')}&background=random`,
        createdAt: new Date().toISOString()
      };
      
      // Actualizar el estado local
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Formulario para nuevo comentario */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Añadir comentario</h3>
          <form onSubmit={handleSubmitComment} className="mt-5">
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Publicar comentario'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Lista de comentarios */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Comentarios recientes</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {comments.length === 0 ? (
            <li className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500">No hay comentarios en este proyecto todavía.</p>
            </li>
          ) : (
            comments.map((comment) => (
              <li key={comment.id} className="px-4 py-6 sm:px-6">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={comment.authorAvatar}
                      alt={comment.author}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                      {comment.text}
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-900 font-medium"
                      >
                        Responder
                      </button>
                      <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-900 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
        {comments.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 sm:px-6 text-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cargar más comentarios
            </button>
          </div>
        )}
      </div>
      
      {/* Guía de comunicación */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Guía de comunicación</h3>
          <p className="mt-1 text-sm text-gray-500">
            Lineamientos para una comunicación efectiva en el proyecto.
          </p>
        </div>
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              Para mantener una comunicación efectiva en este proyecto, te pedimos que sigas estas pautas:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sé claro y conciso en tus comentarios.</li>
              <li>Menciona a las personas usando @ si necesitas su atención específica.</li>
              <li>Utiliza un lenguaje profesional y respetuoso.</li>
              <li>Incluye capturas de pantalla o enlaces relevantes cuando sea necesario.</li>
              <li>Categoriza tus comentarios (pregunta, problema, sugerencia, etc.) cuando sea posible.</li>
            </ul>
            <p>
              Recuerda que todos los comentarios quedan registrados y son visibles para el equipo y el cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectComments;