import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, generateTemporaryToken, verifyToken } from '../config/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/email';

// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Este correo electrónico ya está registrado',
      });
      return;
    }

    // Crear el token de verificación
    const verificationToken = generateTemporaryToken(
      { email },
      '24h' // Expira en 24 horas
    );

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    // Enviar correo de verificación
    await sendVerificationEmail(email, name, verificationToken);

    // Responder sin incluir datos sensibles
    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito. Por favor, verifica tu correo electrónico.',
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario',
    });
  }
};

// Verificación de correo electrónico
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    // Verificar el token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.email) {
      res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
      return;
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Actualizar el estado de verificación
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Correo electrónico verificado con éxito',
    });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el correo electrónico',
    });
  }
};

// Iniciar sesión
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Verificar que se proporcionaron email y password
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Por favor, proporciona correo electrónico y contraseña',
      });
      return;
    }

    // Buscar usuario y obtener explícitamente el campo password
    const user = await User.findOne({ email }).select('+password');

    // Verificar si el usuario existe y la contraseña es correcta
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: 'Correo electrónico o contraseña incorrectos',
      });
      return;
    }

    // Verificar si el usuario ha verificado su email
    if (!user.isVerified) {
      res.status(401).json({
        success: false,
        message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión',
      });
      return;
    }

    // Generar token JWT
    const token = generateToken(user._id.toString());

    // Eliminar el password de la respuesta
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    // Enviar respuesta
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
    });
  }
};

// Solicitar restablecimiento de contraseña
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      res.status(200).json({
        success: true,
        message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña',
      });
      return;
    }

    // Generar token para restablecer contraseña
    const resetToken = generateTemporaryToken(
      { id: user._id.toString() },
      '1h' // Expira en 1 hora
    );

    // Guardar el token y la fecha de expiración
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    // Enviar correo con instrucciones
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.status(200).json({
      success: true,
      message: 'Se han enviado instrucciones para restablecer tu contraseña',
    });
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
    });
  }
};

// Restablecer contraseña
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verificar el token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
      return;
    }

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
      return;
    }

    // Actualizar contraseña
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña restablecida con éxito',
    });
  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restablecer la contraseña',
    });
  }
};

// Obtener usuario actual
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // El usuario ya está en req.user gracias al middleware protect
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
      },
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
    });
  }
};

export default {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getMe,
};