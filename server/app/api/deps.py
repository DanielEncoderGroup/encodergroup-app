from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.database import get_database
from app.models.user import UserPublic, UserRole
from bson import ObjectId
from typing import Optional, List

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
        role=user.get("role", UserRole.CLIENT),  # Default to CLIENT if role not set
        createdAt=user["createdAt"]
    )

def check_roles(allowed_roles: List[str]):
    """
    Dependency that checks if the current user has one of the allowed roles
    """
    async def _check_roles(current_user: UserPublic = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Operation not permitted: insufficient privileges"
            )
        return current_user
    return _check_roles

# Common role-based dependencies
get_admin_user = check_roles([UserRole.ADMIN])
get_client_user = check_roles([UserRole.CLIENT])
get_any_user = check_roles([UserRole.ADMIN, UserRole.CLIENT])