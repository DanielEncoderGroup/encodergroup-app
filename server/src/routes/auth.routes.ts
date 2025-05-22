import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Validaciones para el registro
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'
    ),
];

// Validaciones para el inicio de sesión
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

// Rutas de autenticación
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', body('email').isEmail(), authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/me', protect, authController.getMe);

export default router;