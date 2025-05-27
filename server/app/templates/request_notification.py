def get_request_notification_template(admin_name, client_name, request_title, request_type, request_id, admin_url):
    """
    Genera la plantilla HTML para la notificación de nueva solicitud a administradores.
    
    Args:
        admin_name (str): Nombre del administrador
        client_name (str): Nombre del cliente que creó la solicitud
        request_title (str): Título de la solicitud
        request_type (str): Tipo de proyecto solicitado
        request_id (str): ID de la solicitud
        admin_url (str): URL para ver la solicitud en el panel de administrador
        
    Returns:
        tuple: (html_content, text_content)
    """
    
    # Versión HTML
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Nueva Solicitud - EncoderGroup</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://i.imgur.com/VZF6Wzt.png" alt="EncoderGroup Logo" style="max-width: 150px;">
                <h1 style="color: #4F46E5; margin-top: 10px;">Nueva Solicitud Recibida</h1>
            </div>
            
            <div style="margin-bottom: 30px;">
                <p>Hola {admin_name},</p>
                <p>Se ha recibido una nueva solicitud en EncoderGroup que requiere tu atención.</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #4F46E5;">Detalles de la Solicitud:</h3>
                    <ul style="padding-left: 20px; margin-bottom: 0;">
                        <li><strong>Cliente:</strong> {client_name}</li>
                        <li><strong>Título:</strong> {request_title}</li>
                        <li><strong>Tipo de Proyecto:</strong> {request_type}</li>
                        <li><strong>ID de Solicitud:</strong> {request_id}</li>
                    </ul>
                </div>
                
                <p>Por favor, revisa esta solicitud tan pronto como sea posible para proporcionar una respuesta oportuna a nuestro cliente.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{admin_url}" style="display: inline-block; background-color: #4F46E5; color: white; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        Ver Solicitud
                    </a>
                </div>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
                <p>&copy; 2025 EncoderGroup. Todos los derechos reservados.</p>
                <p>Si tienes alguna pregunta, contáctanos en <a href="mailto:soporte@encodergroup.com" style="color: #4F46E5;">soporte@encodergroup.com</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Versión de texto plano
    text_content = f"""
    Nueva Solicitud Recibida - EncoderGroup
    
    Hola {admin_name},
    
    Se ha recibido una nueva solicitud en EncoderGroup que requiere tu atención.
    
    Detalles de la Solicitud:
    - Cliente: {client_name}
    - Título: {request_title}
    - Tipo de Proyecto: {request_type}
    - ID de Solicitud: {request_id}
    
    Por favor, revisa esta solicitud tan pronto como sea posible para proporcionar una respuesta oportuna a nuestro cliente.
    
    Para ver la solicitud, visita el siguiente enlace:
    {admin_url}
    
    --
    © 2025 EncoderGroup. Todos los derechos reservados.
    """
    
    return (html_content, text_content)
