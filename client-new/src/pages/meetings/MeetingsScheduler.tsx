import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  organizer: string;
  attendees: string[];
  status: string;
  projectId?: string;
  projectName?: string;
}

const MeetingsScheduler: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setMeetings([
        {
          id: '1',
          title: 'Reunión de inicio de proyecto ERP',
          date: '2023-05-25',
          time: '10:00',
          duration: 60,
          location: 'Sala de conferencias A',
          organizer: 'Carlos Rodríguez',
          attendees: ['Ana Gómez', 'Miguel Sánchez', 'Laura Torres'],
          status: 'scheduled',
          projectId: '1',
          projectName: 'Implementación ERP'
        },
        {
          id: '2',
          title: 'Revisión de avance mensual',
          date: '2023-05-30',
          time: '14:30',
          duration: 90,
          location: 'Sala de conferencias B',
          organizer: 'Carlos Rodríguez',
          attendees: ['Ana Gómez', 'Miguel Sánchez', 'Laura Torres', 'Roberto Díaz'],
          status: 'scheduled',
          projectId: '1',
          projectName: 'Implementación ERP'
        },
        {
          id: '3',
          title: 'Planificación de migración a la nube',
          date: '2023-06-05',
          time: '11:00',
          duration: 120,
          location: 'Sala de conferencias A',
          organizer: 'Roberto Díaz',
          attendees: ['Ana Gómez', 'Miguel Sánchez', 'Laura Torres'],
          status: 'scheduled',
          projectId: '2',
          projectName: 'Migración a la nube'
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reuniones
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Agenda y administra tus reuniones de proyecto.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/app/meetings/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nueva reunión
          </Link>
        </div>
      </div>

      {/* Vista conmutador */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              className={`${
                view === 'list'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              onClick={() => setView('list')}
            >
              Lista
            </button>
            <button
              className={`${
                view === 'calendar'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              onClick={() => setView('calendar')}
            >
              Calendario
            </button>
          </nav>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {meetings.map((meeting) => (
              <li key={meeting.id}>
                <Link to={`/app/meetings/${meeting.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {meeting.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {meeting.status === 'scheduled'
                              ? 'Programada'
                              : meeting.status === 'completed'
                              ? 'Completada'
                              : 'Cancelada'}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <svg
                          className="mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm text-gray-500">
                          {new Date(meeting.date).toLocaleDateString()} a las {meeting.time}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1zM9 5h2v4H9V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {meeting.projectName || 'Sin proyecto asociado'}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {meeting.location}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p>
                          {meeting.organizer}{' '}
                          <span className="text-gray-400">
                            ({meeting.attendees.length} participantes)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
          <div className="text-center py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Vista de calendario en desarrollo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Próximamente podrás ver tus reuniones en formato de calendario.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsScheduler;