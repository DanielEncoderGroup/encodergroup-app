from datetime import datetime, timedelta
from typing import Any
import smtplib
import ssl
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm

from app.models.user import (
    UserCreate,
    UserLogin,
    ForgotPassword,
    ResetPassword,
    UserRole,
)
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_reset_token,
    create_email_verification_token,
)
from app.core.database import get_database
from app.api.deps import get_current_user
from app.core.email_service import send_email
from app.templates.email_verification import get_email_verification_template
from app.templates.password_reset import get_password_reset_template
from app.core.config import settings

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate = Body(...)) -> Any:
    """
    Register a new user and send the verification e-mail.
    """
    db = get_database()

    # ¿El correo ya existe?
    if await db.users.find_one({"email": user_in.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Generar token/verificación
    verification_token = create_email_verification_token(user_in.email)
    token_expiry = datetime.utcnow() + timedelta(hours=24)

    # Crear usuario
    user_data = {
        "firstName": user_in.firstName,
        "lastName": user_in.lastName,
        "email": user_in.email,
        "password": get_password_hash(user_in.password),
        "role": UserRole.CLIENT,  # Por defecto, todos los usuarios nuevos son clientes
        "emailVerified": False,
        "emailVerificationToken": verification_token,
        "emailVerificationExpire": token_expiry,
        "createdAt": datetime.utcnow(),
        "updatedAt": None,
    }

    result = await db.users.insert_one(user_data)
    created_user = await db.users.find_one({"_id": result.inserted_id})

    # URL de verificación
    verification_url = f"{settings.CLIENT_URL}/verify-email/{verification_token}"
    user_name = f"{user_in.firstName} {user_in.lastName}"
    html_content, text_content = get_email_verification_template(
        user_name, verification_url
    )

    # Enviar e-mail de verificación
    try:
        send_email(
            to_email=user_in.email,
            subject="Verifica tu correo electrónico - EncoderGroup",
            text_content=text_content,
            html_content=html_content,
        )
    except Exception as e:
        # No detengas el registro por fallo de e-mail; deja info en logs
        print(f"Error enviando e-mail de verificación: {e}")

    # Hasta verificar, el frontend debe saber que falta verificación
    return {
        "success": True,
        "message": "User registered successfully. Please check your e-mail.",
        "requiresVerification": True,
        "user": {
            "id": str(created_user["_id"]),
            "firstName": created_user["firstName"],
            "lastName": created_user["lastName"],
            "email": created_user["email"],
            "token": "verification_required",
        },
    }


@router.post("/login")
async def login(login_data: UserLogin = Body(...)) -> Any:
    """
    Login y obtención de JWT si el correo está verificado.
    """
    db = get_database()
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("emailVerified", False):
        verification_token = user.get("emailVerificationToken")
        if not verification_token or user.get("emailVerificationExpire") < datetime.utcnow():
            verification_token = create_email_verification_token(user["email"])
            await db.users.update_one(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "emailVerificationToken": verification_token,
                        "emailVerificationExpire": datetime.utcnow() + timedelta(hours=24),
                    }
                },
            )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "Email not verified. Check your inbox.",
                "verification_url": f"{settings.CLIENT_URL}/verify-email/{verification_token}",
                "email": user["email"],
            },
        )

    return {
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "firstName": user["firstName"],
            "lastName": user["lastName"],
            "email": user["email"],
            "token": create_access_token(user["_id"]),
        },
    }


@router.post("/forgotpassword")
async def forgot_password(email_data: ForgotPassword = Body(...)) -> Any:
    """
    Generates a reset token and sends the password-reset e-mail.
    """
    db = get_database()
    user = await db.users.find_one({"email": email_data.email})
    if not user:
        # Siempre respondemos 200 OK por seguridad
        return {"success": True, "message": "Email sent with instructions"}

    reset_token = create_reset_token(email_data.email)
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "resetPasswordToken": reset_token,
                "resetPasswordExpire": datetime.utcnow() + timedelta(minutes=30),
            }
        },
    )

    reset_url = f"{settings.CLIENT_URL}/reset-password/{reset_token}"
    user_name = f"{user['firstName']} {user['lastName']}"
    html_content, text_content = get_password_reset_template(user_name, reset_url)

    # --- fallback opcional en texto plano ---
    # text_content = (
    #     f"Has solicitado restablecer tu contraseña.\n\n"
    #     f"Visita: {reset_url}\n\n"
    #     f"Este enlace expira en 30 min.\n"
    # )
    # ----------------------------------------

    try:
        # smtp_ip resuelve problemas de DNS dentro de Docker
        smtp_ip = socket.gethostbyname(settings.SMTP_HOST)
        smtp_server = smtp_ip or settings.SMTP_HOST

        msg = MIMEMultipart("alternative")
        msg["Subject"] = Header("Recuperación de contraseña - MisViaticos", "utf-8")
        msg["From"] = settings.SMTP_USER
        msg["To"] = email_data.email
        msg.attach(MIMEText(text_content, "plain", "utf-8"))
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        with smtplib.SMTP_SSL(smtp_server, settings.SMTP_PORT, context=context) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, email_data.email, msg.as_string())

    except Exception as e:
        print(f"Error al enviar e-mail de recuperación: {e}")

    return {"success": True, "message": "Email sent with password reset instructions"}


@router.put("/resetpassword/{reset_token}")
async def reset_password(reset_token: str, data: ResetPassword = Body(...)) -> Any:
    """
    Sets a new password if the reset token is valid.
    """
    db = get_database()
    user = await db.users.find_one(
        {
            "resetPasswordToken": reset_token,
            "resetPasswordExpire": {"$gt": datetime.utcnow()},
        }
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token"
        )

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password": get_password_hash(data.password)},
            "$unset": {"resetPasswordToken": "", "resetPasswordExpire": ""},
        },
    )

    return {
        "success": True,
        "message": "Password updated successfully",
        "token": create_access_token(user["_id"]),
    }


@router.get("/verify-email/{verification_token}")
async def verify_email(verification_token: str) -> Any:
    """
    Verify the user's e-mail using the token sent during registration.
    """
    db = get_database()
    now = datetime.utcnow()
    user = await db.users.find_one(
        {
            "emailVerificationToken": verification_token,
            "emailVerificationExpire": {"$gt": now},
        }
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token"
        )

    if user.get("emailVerified"):
        return {"success": True, "message": "Email already verified"}

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"emailVerified": True},
            "$unset": {"emailVerificationToken": "", "emailVerificationExpire": ""},
        },
    )

    return {
        "success": True,
        "message": "Email successfully verified",
        "accessToken": create_access_token(user["_id"]),
        "user": {
            "id": str(user["_id"]),
            "firstName": user["firstName"],
            "lastName": user["lastName"],
            "email": user["email"],
        },
    }


@router.post("/resend-verification")
async def resend_verification(email_data: ForgotPassword = Body(...)) -> Any:
    """
    Resend the verification e-mail for an unverified account.
    """
    db = get_database()
    user = await db.users.find_one({"email": email_data.email})
    if not user or user.get("emailVerified"):
        # siempre devolvemos éxito
        return {"success": True, "message": "Verification e-mail sent if account exists"}

    verification_token = create_email_verification_token(user["email"])
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "emailVerificationToken": verification_token,
                "emailVerificationExpire": datetime.utcnow() + timedelta(hours=24),
            }
        },
    )

    verification_url = f"{settings.CLIENT_URL}/verify-email/{verification_token}"
    html_content, text_content = get_email_verification_template(
        f"{user['firstName']} {user['lastName']}", verification_url
    )

    try:
        send_email(
            to_email=user["email"],
            subject="Verifica tu correo electrónico - EncoderGroup",
            text_content=text_content,
            html_content=html_content,
        )
    except Exception as e:
        print(f"Error re-enviando verificación: {e}")

    return {"success": True, "message": "Verification e-mail sent if account exists"}


@router.get("/me")
async def get_current_user_info(current_user=Depends(get_current_user)) -> Any:
    """
    Return data of the currently authenticated user.
    """
    return {
        "success": True,
        "user": {
            "id": str(current_user.id) if hasattr(current_user, 'id') else str(getattr(current_user, '_id', '')),
            "firstName": current_user.firstName if hasattr(current_user, 'firstName') else getattr(current_user, 'first_name', ''),
            "lastName": current_user.lastName if hasattr(current_user, 'lastName') else getattr(current_user, 'last_name', ''),
            "email": current_user.email,
            "role": current_user.role,  # Incluir el rol del usuario en la respuesta
        },
    }
