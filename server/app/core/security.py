from datetime import datetime, timedelta
from typing import Optional, Any
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)

def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_reset_token(email: str) -> str:
    """Create a password reset token."""
    expire = datetime.utcnow() + timedelta(minutes=30)  # 30 minutes validity
    to_encode = {"exp": expire, "sub": email, "type": "reset_password"}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_email_verification_token(email: str) -> str:
    """Create an email verification token."""
    expire = datetime.utcnow() + timedelta(hours=24)  # 24 hours validity
    to_encode = {"exp": expire, "sub": email, "type": "email_verification"}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt