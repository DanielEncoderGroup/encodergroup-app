import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Obtener la URI de MongoDB desde las variables de entorno
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/misviaticos';

// Función para conectar a la base de datos
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbURI);
    console.log('Conexión a MongoDB establecida con éxito');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    // Si hay un error crítico en la conexión, terminamos el proceso
    process.exit(1);
  }
};

// Configuración de eventos de conexión de Mongoose
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('Error en la conexión de MongoDB:', err);
});

// Manejo de señales para cerrar la conexión antes de terminar el proceso
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
  process.exit(0);
});

export default connectDB;