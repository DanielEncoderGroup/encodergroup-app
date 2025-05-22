import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  description: string;
  organizer: string;
  attendees: string[];
  status: string;
  projectId?: string;
  projectName?: string;
  notes?: string;
}

const MeetingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de carga de datos de la reunión
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMeeting({
        id: id || '1',
        title: 'Reunión de inicio de proyecto ERP',
        date: '2023-05-25',
        time: '10:00',
        duration: 60,
        location: 'Sala de conferencias A',
        description: 'Reunión para dar inicio al proyecto de implementación del sistema ERP. Se discutirán los objetivos, alcance, cronograma y asignación de responsabilidades.',
        organizer: 'Carlos Rodríguez',
        attendees: ['Ana Gómez', 'Miguel Sánchez', 'Laura Torres', 'Roberto Díaz'],
        status: 'scheduled',
        projectId: '1',
        projectName: 'Implementación ERP',
        notes: 'Preparar presentación inicial del proyecto. Tener listos los documentos de alcance y cronograma tentativo.'
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    if (meeting) {
      setMeeting({ ...meeting, status: newStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Reunión no encontrada</h2>
          <p className="mt-1 text-sm text-gray-500">
            La reunión que buscas no existe o ha sido eliminada.
          </p>
          <div className="mt-6">
            <Link
              to="/app/meetings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Volver a la lista de reuniones
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} minutos` : ''}`;
    }
    return `${minutes} minutos`;
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{meeting.title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Detalles de la reunión
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/app/meetings/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Editar
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => {
              // Simular envío de invitaciones
              alert('Invitaciones enviadas a los participantes');
            }}
          >
            Enviar invitaciones
          </button>
        </div>
      </div>

      {/* Estado de la reunión */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Información de la reunión
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalles y estado actual
            </p>
          </div>
          <div className="flex items-center">
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full mr-3
              ${meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' : 
                meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                'bg-red-100 text-red-800'}`}>
              {meeting.status === 'scheduled' ? 'Programada' : 
               meeting.status === 'completed' ? 'Completada' : 'Cancelada'}
            </span>
            {meeting.status === 'scheduled' && (
              <div className="relative">
                <button 
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    const dropdown = document.getElementById('status-dropdown');
                    dropdown?.classList.toggle('hidden');
                  }}
                >
                  Cambiar estado
                </button>
                <div id="status-dropdown" className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleStatusChange('completed')}
                    >
                      Marcar como completada
                    </button>
                    <button
                      className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleStatusChange('cancelled')}
                    >
                      Cancelar reunión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Fecha y hora
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(meeting.date).toLocaleDateString()} a las {meeting.time} ({formatDuration(meeting.duration)})
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Lugar
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {meeting.location}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Proyecto asociado
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {meeting.projectName ? (
                  <Link to={`/app/projects/${meeting.projectId}`} className="text-indigo-600 hover:text-indigo-900">
                    {meeting.projectName}
                  </Link>
                ) : (
                  'Sin proyecto asociado'
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Organizador
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {meeting.organizer}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Descripción
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {meeting.description}
              </dd>
            </div>
            {meeting.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Notas
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {meeting.notes}
                </dd>
              </div>
            )}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Participantes
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {meeting.attendees.map((attendee, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate">
                          {attendee}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Documentos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Documentos relacionados
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Archivos adjuntos y actas de reunión
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza subiendo documentos relacionados a esta reunión.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Subir documento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetail;