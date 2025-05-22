import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ReceiptFormValues {
  description: string;
  amount: string;
  date: string;
  type: string;
  imageFile: File | null;
}

const ReceiptForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Utilizamos setIsLoading en el submit
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<{ title: string; id: string } | null>(null);

  // Simulación de carga de datos de la solicitud
  useEffect(() => {
    if (id) {
      const timer = setTimeout(() => {
        setRequestData({
          id,
          title: 'Viaje a conferencia de tecnología'
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id]);

  // Validación con Yup
  const validationSchema = Yup.object({
    description: Yup.string().required('La descripción es obligatoria'),
    amount: Yup.number()
      // @ts-ignore: typeError existe en Yup 0.32.11 pero no en las definiciones de tipos
      .typeError('El monto debe ser un número')
      .positive('El monto debe ser positivo')
      .required('El monto es obligatorio'),
    date: Yup.date().required('La fecha es obligatoria'),
    type: Yup.string().required('El tipo de comprobante es obligatorio'),
    // @ts-ignore: mixed existe en Yup 0.32.11 pero no en las definiciones de tipos
    imageFile: Yup.mixed().required('La imagen del comprobante es obligatoria')
  });

  // Configuración de Formik
  const formik = useFormik<ReceiptFormValues>({
    initialValues: {
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      type: 'transport',
      imageFile: null
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Simulación de envío de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Datos enviados:', values);
        navigate(`/app/requests/${id}`);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Manejar la selección de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue('imageFile', file);
    
    // Crear URL para la vista previa
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Añadir comprobante
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {requestData ? `Para solicitud: ${requestData.title}` : 'Cargando datos de la solicitud...'}
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción del comprobante
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.description && formik.errors.description ? 'border-red-300' : ''
                    }`}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.description)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Monto ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.amount && formik.errors.amount ? 'border-red-300' : ''
                    }`}
                    placeholder="0.00"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.amount)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.date && formik.errors.date ? 'border-red-300' : ''
                    }`}
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.date)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo de comprobante
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formik.touched.type && formik.errors.type ? 'border-red-300' : ''
                    }`}
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="transport">Transporte</option>
                    <option value="accommodation">Alojamiento</option>
                    <option value="meals">Comidas</option>
                    <option value="supplies">Suministros</option>
                    <option value="other">Otro</option>
                  </select>
                  {formik.touched.type && formik.errors.type && (
                    <p className="mt-2 text-sm text-red-600">{String(formik.errors.type)}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Imagen del comprobante
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div>
                        <img src={previewUrl} alt="Vista previa" className="mx-auto h-48 object-contain" />
                        <button
                          type="button"
                          className="mt-2 text-sm text-red-600 hover:text-red-900"
                          onClick={() => {
                            formik.setFieldValue('imageFile', null);
                            setPreviewUrl(null);
                          }}
                        >
                          Eliminar imagen
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="imageFile"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Subir un archivo</span>
                            <input
                              id="imageFile"
                              name="imageFile"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      </>
                    )}
                  </div>
                </div>
                {formik.touched.imageFile && formik.errors.imageFile && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.imageFile as string}</p>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              onClick={() => navigate(`/app/requests/${id}`)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {formik.isSubmitting ? 'Guardando...' : 'Añadir comprobante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptForm;