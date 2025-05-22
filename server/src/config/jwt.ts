import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Clave secreta para firmar los tokens
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Genera un token JWT para autenticación de usuario
 * @param userId ID del usuario
 * @returns Token JWT generado
 */
export const generateToken = (userId: string): string => {
  // Usamos any para evitar problemas de tipado con la biblioteca
  const options: any = {
    expiresIn: JWT_EXPIRES_IN
  };
  return jwt.sign({ id: userId }, JWT_SECRET, options);
};

/**
 * Genera un token temporal para verificaciones o recuperación de contraseña
 * @param payload Datos a incluir en el token
 * @param expiresIn Tiempo de expiración
 * @returns Token temporal generado
 */
export const generateTemporaryToken = (payload: object, expiresIn: string = '1h'): string => {
  // Usamos any para evitar problemas de tipado con la biblioteca
  const options: any = {
    expiresIn: expiresIn
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verifica la validez de un token JWT
 * @param token Token JWT a verificar
 * @returns Payload decodificado o null si el token es inválido
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  generateTemporaryToken,
  verifyToken
};