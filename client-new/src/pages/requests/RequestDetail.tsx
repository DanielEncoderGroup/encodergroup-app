import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface Receipt {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: string;
  imageUrl?: string;
  status: string;
}

interface Request {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  projectName?: string;
  requestType: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  approver?: {
    id: string;
    name: string;
    email: string;
  };
  rejectionReason?: string;
  receipts: Receipt[];
  comments: {
    id: string;
    text: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
  }[];
}

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Simulación de carga de datos de la solicitud
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRequest({
        id: id || '1',
        title: 'Viaje a conferencia de tecnología',
        description: 'Gastos de transporte y alojamiento para conferencia en Madrid sobre nuevas tecnologías cloud. Incluye billetes de avión, hotel por 3 noches y gastos de alimentación.',
        amount: 1200,
        status: 'pending',
        createdAt: '2023-05-10T08:30:00Z',
        updatedAt: '2023-05-10T10:15:00Z',
        projectId: '1',
        projectName: 'Implementación ERP',
        requestType: 'travel',
        user: {
          id: '1',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@empresa.com'
        },
        receipts: [
          {
            id: '1',
            description: 'Billete de avión',
            amount: 350,
            date: '2023-05-08',
            type: 'transport',
            imageUrl: 'https://via.placeholder.com/150',
            status: 'approved'
          },
          {
            id: '2',
            description: 'Hotel (3 noches)',
            amount: 600,
            date: '2023-05-08',
            type: 'accommodation',
            imageUrl: 'https://via.placeholder.com/150',
            status: 'pending'
          },
          {
            id: '3',
            description: 'Comidas',
            amount: 250,
            date: '2023-05-09',
            type: 'meals',
            imageUrl: 'https://via.placeholder.com/150',
            status: 'pending'
          }
        ],
        comments: [
          {
            id: '1',
            text: 'Por favor, adjunta la información detallada del hotel.',
            createdAt: '2023-05-10T09:45:00Z',
            user: {
              id: '5',
              name: 'Elena García'
            }
          },
          {
            id: '2',
            text: 'Información adjuntada en el recibo correspondiente.',
            createdAt: '2023-05-10T10:15:00Z',
            user: {
              id: '1',
              name: 'Carlos Rodríguez'
            }
          }
        ]
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleApprove = () => {
    if (request) {
      setRequest({ 
        ...request, 
        status: 'approved',
        approver: {
          id: '5',
          name: 'Elena García',
          email: 'elena.garcia@empresa.com'
        },
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleReject = () => {
    // En un caso real, aquí se mostraría un modal para pedir la razón del rechazo
    if (request) {
      setRequest({ 
        ...request, 
        status: 'rejected',
        rejectionReason: 'Los montos exceden los límites establecidos para viáticos de este tipo.',
        approver: {
          id: '5',
          name: 'Elena García',
          email: 'elena.garcia@empresa.com'
        },
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleMarkAsCompleted = () => {
    if (request) {
      setRequest({ 
        ...request, 
        status: 'completed',
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    
    // Simular envío de comentario
    setTimeout(() => {
      if (request) {
        const newComment = {
          id: Math.random().toString(36).substr(2, 9),
          text: comment,
          createdAt: new Date().toISOString(),
          user: {
            id: '5',
            name: 'Elena García'
          }
        };
        
        setRequest({
          ...request,
          comments: [...request.comments, newComment]
        });
        
        setComment('');
        setSubmittingComment(false);
      }
    }, 500);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const getReceiptTypeText = (type: string) => {
    switch (type) {
      case 'transport':
        return 'Transporte';
      case 'accommodation':
        return 'Alojamiento';
      case 'meals':
        return 'Comidas';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Solicitud no encontrada</h2>
          <p className="mt-1 text-sm text-gray-500">
            La solicitud que buscas no existe o ha sido eliminada.
          </p>
          <div className="mt-6">
            <Link
              to="/app/requests"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Volver a la lista de solicitudes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{request.title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Solicitud #{request.id} - Creada el {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          {request.status === 'pending' && (
            <>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={handleReject}
              >
                Rechazar
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={handleApprove}
              >
                Aprobar
              </button>
            </>
          )}
          {request.status === 'approved' && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={handleMarkAsCompleted}
            >
              Marcar como completada
            </button>
          )}
        </div>
      </div>

      {/* Estado de la solicitud */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Información de la solicitud
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalles y estado actual
            </p>
          </div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
            {getStatusText(request.status)}
          </span>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Solicitante
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.user.name} ({request.user.email})
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Tipo de solicitud
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.requestType === 'travel' ? 'Viaje' : 
                 request.requestType === 'training' ? 'Capacitación' : 
                 request.requestType === 'supplies' ? 'Suministros' : request.requestType}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Proyecto asociado
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.projectName ? (
                  <Link to={`/app/projects/${request.projectId}`} className="text-indigo-600 hover:text-indigo-900">
                    {request.projectName}
                  </Link>
                ) : (
                  'Sin proyecto asociado'
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Descripción
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.description}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Monto total
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                ${request.amount.toLocaleString()}
              </dd>
            </div>
            {request.status === 'rejected' && request.rejectionReason && (
              <div className="bg-red-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-red-500">
                  Motivo de rechazo
                </dt>
                <dd className="mt-1 text-sm text-red-700 sm:mt-0 sm:col-span-2">
                  {request.rejectionReason}
                </dd>
              </div>
            )}
            {(request.status === 'approved' || request.status === 'completed') && request.approver && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Aprobado por
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {request.approver.name} ({request.approver.email})
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Recibos y comprobantes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recibos y comprobantes
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Documentos justificativos de los gastos
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {request.receipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {receipt.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getReceiptTypeText(receipt.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(receipt.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(receipt.status)}`}>
                        {getStatusText(receipt.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {receipt.imageUrl && (
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            // En un caso real, aquí se abriría una ventana modal con la imagen
                            alert('Ver comprobante');
                          }}
                        >
                          Ver comprobante
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 text-right">
            <Link
              to={`/app/requests/${request.id}/add-receipt`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              + Añadir comprobante
            </Link>
          </div>
        </div>
      </div>

      {/* Comentarios */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Comentarios
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Discusión y notas sobre la solicitud
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6 space-y-4">
            {request.comments.length > 0 ? (
              request.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{comment.user.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-800">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">
                No hay comentarios aún.
              </p>
            )}
            
            {/* Formulario para añadir comentario */}
            <form onSubmit={handleSubmitComment} className="mt-4">
              <div>
                <label htmlFor="comment" className="sr-only">
                  Comentario
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Añade un comentario..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="mt-3 text-right">
                <button
                  type="submit"
                  disabled={submittingComment || !comment.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submittingComment ? 'Enviando...' : 'Enviar comentario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;