import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import User from '../models/User';

// Extender la interfaz Request para añadir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware para proteger rutas que requieren autenticación
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Verificar que exista un token en los headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Obtener el token del header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      // O del cookie
      token = req.cookies.jwt;
    }

    // Si no hay token, responder con un error
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No estás autorizado para acceder a este recurso',
      });
      return;
    }

    // Verificar el token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
      return;
    }

    // Verificar si el usuario aún existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'El usuario asociado a este token ya no existe',
      });
      return;
    }

    // Verificar si el usuario ha verificado su email
    if (!currentUser.isVerified) {
      res.status(401).json({
        success: false,
        message: 'Por favor, verifica tu correo electrónico para continuar',
      });
      return;
    }

    // Añadir el usuario a la solicitud
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Error de autenticación',
    });
  }
};

// Middleware para restringir acceso por roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el usuario tenga uno de los roles permitidos
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción',
      });
    }
    next();
  };
};

export default {
  protect,
  restrictTo
};