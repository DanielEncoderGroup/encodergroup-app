from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.database import get_database
from app.models.user import UserPublic
from bson import ObjectId
from typing import Optional

# OAuth2 password bearer scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPublic:
    """
    Validate token and return current user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if user is None:
        raise credentials_exception
    
    # Convert to UserPublic model
    return UserPublic(
        id=str(user["_id"]),
        firstName=user["firstName"],
        lastName=user["lastName"],
        email=user["email"],
        createdAt=user["createdAt"]
    )