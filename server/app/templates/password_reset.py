def get_password_reset_template(user_name, reset_url):
    """
    Genera la plantilla HTML para el correo de restablecimiento de contraseña.
    
    Args:
        user_name (str): Nombre del usuario
        reset_url (str): URL para restablecer la contraseña
        
    Returns:
        tuple: (html_content, text_content)
    """
    
    # Versión HTML
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Restablecimiento de Contraseña - MisViaticos</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://i.imgur.com/VZF6Wzt.png" alt="MisViaticos Logo" style="max-width: 150px;">
                <h1 style="color: #4F46E5; margin-top: 10px;">Restablecimiento de Contraseña</h1>
            </div>
            
            <div style="margin-bottom: 30px;">
                <p>Hola {user_name},</p>
                <p>Has solicitado restablecer tu contraseña para tu cuenta de MisViaticos. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" style="display: inline-block; background-color: #4F46E5; color: white; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        Restablecer mi contraseña
                    </a>
                </div>
                
                <p>O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                <p style="word-break: break-all; background-color: #f7f7f7; padding: 10px; border-radius: 3px;">{reset_url}</p>
                
                <p>Este enlace expirará en 30 minutos por razones de seguridad.</p>
                
                <p>Si no solicitaste este cambio, por favor ignora este correo o contáctanos si crees que alguien está intentando acceder a tu cuenta.</p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
                <p>&copy; 2025 MisViaticos. Todos los derechos reservados.</p>
                <p>Si tienes alguna pregunta, contáctanos en <a href="mailto:soporte@misviaticos.com" style="color: #4F46E5;">soporte@misviaticos.com</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Versión de texto plano
    text_content = f"""
    Restablecimiento de Contraseña - MisViaticos
    
    Hola {user_name},
    
    Has solicitado restablecer tu contraseña para tu cuenta de MisViaticos. Por favor, visita el siguiente enlace para crear una nueva contraseña:
    
    {reset_url}
    
    Este enlace expirará en 30 minutos por razones de seguridad.
    
    Si no solicitaste este cambio, por favor ignora este correo o contáctanos si crees que alguien está intentando acceder a tu cuenta.
    
    --
    © 2025 MisViaticos. Todos los derechos reservados.
    """
    
    return (html_content, text_content)