import smtplib
import ssl
import os
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from app.core.config import settings
import datetime
import re

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
    
    # Intentar enviar por SMTP principal
    success = _send_email_via_smtp(msg, to_email)
    if success:
        return True
        
    # Si falla el envío por SMTP principal, intentar con servicio de respaldo
    if hasattr(settings, 'BACKUP_EMAIL_SERVICE') and settings.BACKUP_EMAIL_SERVICE:
        return _send_email_via_backup(msg, to_email)
    else:
        # Si no hay servicio de respaldo, informamos y retornamos False
        print("No hay servicio de correo de respaldo configurado.")
        print("El usuario deberá usar la URL manual para completar el proceso.")
        return False

def _send_email_via_smtp(msg, to_email):
    """
    Envía un correo electrónico usando el servidor SMTP configurado.
    
    Args:
        msg: El mensaje MIMEMultipart configurado
        to_email: Email del destinatario
        
    Returns:
        bool: True si el envío fue exitoso, False en caso contrario
    """
    server = None
    try:
        print(f"Conectando a servidor SMTP: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
        
        # Configurar el contexto SSL según las preferencias de verificación
        if settings.SMTP_VERIFY_SSL:
            context = ssl.create_default_context()
            print("Usando verificación SSL estándar")
        else:
            # Crear un contexto SSL que ignore completamente los problemas de certificado
            context = ssl._create_unverified_context()
            print("Verificación SSL completamente desactivada")
            
        # Establecer conexión SMTP con el contexto personalizado
        server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context)
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        print(f"Correo enviado exitosamente a {to_email}")
        return True
        
    except Exception as e:
        print(f"Error al enviar email: {str(e)}")
        return False
        
    finally:
        # Asegurar que siempre cerremos la conexión SMTP
        if server:
            try:
                server.quit()
            except Exception:
                pass

def _send_email_via_backup(msg, to_email):
    """
    Envía un correo electrónico usando el servicio de respaldo configurado.
    
    Args:
        msg: El mensaje MIMEMultipart configurado
        to_email: Email del destinatario
        
    Returns:
        bool: True si el envío fue exitoso, False en caso contrario
    """
    try:
        # Aquí se implementaría una alternativa como SendGrid, Mailgun, etc.
        print("Intentando enviar correo a través del servicio de respaldo...")
        
        # Por ahora, solo imprimimos la información para debug
        print("URL para completar el proceso disponible en los logs del servidor")
        return False
        
    except Exception as backup_error:
        print(f"Error al enviar correo con servicio de respaldo: {str(backup_error)}")
        return False