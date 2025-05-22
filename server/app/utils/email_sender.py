import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import logging

logger = logging.getLogger(__name__)

class EmailSender:
    def __init__(self, host, port, username, password):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
    
    def send_email(self, recipient, subject, html_content, text_content=None):
        """
        Envía un correo electrónico con contenido HTML y opcionalmente texto plano.
        
        Args:
            recipient (str): Dirección de correo del destinatario
            subject (str): Asunto del correo
            html_content (str): Contenido HTML del correo
            text_content (str, optional): Contenido de texto plano alternativo
        
        Returns:
            bool: True si el envío fue exitoso, False en caso contrario
        """
        try:
            # Crear mensaje
            msg = MIMEMultipart('alternative')
            
            # Configurar encabezados
            msg['From'] = self.username
            msg['To'] = recipient
            msg['Subject'] = Header(subject, 'utf-8').encode()
            
            # Añadir contenido de texto plano (alternativo)
            if text_content:
                part1 = MIMEText(text_content, 'plain', 'utf-8')
                msg.attach(part1)
            
            # Añadir contenido HTML
            part2 = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(part2)
            
            # Conectar al servidor SMTP
            with smtplib.SMTP(self.host, self.port) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                
                # Iniciar sesión
                server.login(self.username, self.password)
                
                # Enviar correo
                server.sendmail(self.username, recipient, msg.as_string())
                
            logger.info(f"Correo enviado exitosamente a {recipient}")
            return True
        
        except Exception as e:
            logger.error(f"Error al enviar correo a {recipient}: {str(e)}")
            return False