import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear la aplicación Express
const app = express();

// Middleware
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear form data

// Configuración de CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de bienvenida
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API de MisViaticos - Bienvenido',
    status: 'Online',
    version: '1.0.0',
  });
});

// Middleware para manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Middleware para manejo de errores
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Exportar la aplicación para testing
export default app;