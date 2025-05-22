import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración del transporter de nodemailer
const createTransporter = () => {
  const useSSL = process.env.SMTP_SSL === 'true';
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: useSSL, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Función para enviar correos electrónicos
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `MisViaticos <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

// Plantilla para el correo de verificación de email
export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string
): Promise<boolean> => {
  const subject = 'Verificación de correo electrónico - MisViaticos';
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4F46E5;">MisViaticos</h1>
      </div>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 5px;">
        <h2 style="color: #334155;">¡Hola ${name}!</h2>
        <p style="color: #64748b; line-height: 1.6;">
          Gracias por registrarte en MisViaticos. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el botón a continuación:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Verificar mi correo electrónico
          </a>
        </div>
        <p style="color: #64748b; line-height: 1.6;">
          Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
        </p>
        <p style="background-color: #e2e8f0; padding: 10px; border-radius: 3px; word-break: break-all;">
          ${verificationUrl}
        </p>
        <p style="color: #64748b; line-height: 1.6;">
          Si no has solicitado este correo, puedes ignorarlo con seguridad.
        </p>
        <p style="color: #64748b; line-height: 1.6; margin-top: 30px;">
          Saludos,<br>
          El equipo de MisViaticos
        </p>
      </div>
    </div>
  `;
  
  return sendEmail(to, subject, html);
};

// Plantilla para el correo de restablecimiento de contraseña
export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  token: string
): Promise<boolean> => {
  const subject = 'Restablecimiento de contraseña - MisViaticos';
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4F46E5;">MisViaticos</h1>
      </div>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 5px;">
        <h2 style="color: #334155;">¡Hola ${name}!</h2>
        <p style="color: #64748b; line-height: 1.6;">
          Has solicitado restablecer tu contraseña. Haz clic en el botón a continuación para crear una nueva contraseña:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color: #64748b; line-height: 1.6;">
          Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
        </p>
        <p style="background-color: #e2e8f0; padding: 10px; border-radius: 3px; word-break: break-all;">
          ${resetUrl}
        </p>
        <p style="color: #64748b; line-height: 1.6;">
          Este enlace expirará en 1 hora por razones de seguridad.
        </p>
        <p style="color: #64748b; line-height: 1.6;">
          Si no has solicitado restablecer tu contraseña, puedes ignorar este correo con seguridad.
        </p>
        <p style="color: #64748b; line-height: 1.6; margin-top: 30px;">
          Saludos,<br>
          El equipo de MisViaticos
        </p>
      </div>
    </div>
  `;
  
  return sendEmail(to, subject, html);
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};