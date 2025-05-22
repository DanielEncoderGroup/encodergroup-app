import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from app.core.config import settings

def send_email(to_email, subject, text_content, html_content):
    """
    Función para enviar correos electrónicos utilizando diferentes proveedores
    según la configuración.
    
    Args:
        to_email (str): Dirección de correo del destinatario
        subject (str): Asunto del correo
        text_content (str): Contenido en texto plano
        html_content (str): Contenido en HTML
    
    Returns:
        bool: True si el correo se envía correctamente, False en caso contrario
    """
    # Configurar el mensaje
    msg = MIMEMultipart('alternative')
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = settings.SMTP_USER
    msg['To'] = to_email
    
    # Adjuntar las versiones de texto y HTML
    part1 = MIMEText(text_content, 'plain', 'utf-8')
    part2 = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(part1)
    msg.attach(part2)
    
    # Intentar enviar por SMTP configurado
    try:
        # Configurar contexto SSL
        context = ssl.create_default_context()
        # Deshabilitar verificación de certificados para servidores con problemas de SSL
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        print(f"Conectando a {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
        
        # Enviar correo
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
            print(f"Correo enviado exitosamente a {to_email}")
            return True
            
    except Exception as e:
        print(f"Error al enviar el correo vía SMTP: {str(e)}")
        
        # Si falla el envío por SMTP y hay configuración de respaldo, intentar con ella
        if hasattr(settings, 'BACKUP_EMAIL_SERVICE') and settings.BACKUP_EMAIL_SERVICE:
            try:
                # Aquí podrías implementar una alternativa como SendGrid, Mailgun, etc.
                print("Intentando enviar correo a través del servicio de respaldo...")
                
                # Por ahora, solo imprimimos la información para debug
                print("URL para restablecer disponible en los logs del servidor")
                return False
                
            except Exception as backup_error:
                print(f"Error al enviar correo con servicio de respaldo: {str(backup_error)}")
                return False
        else:
            # Si no hay servicio de respaldo, simplemente informamos
            print("No hay servicio de correo de respaldo configurado.")
            print("El usuario deberá usar la URL manual para restablecer la contraseña.")
            return False
            
    return False