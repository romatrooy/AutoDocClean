from typing import Annotated, Optional, Union
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, OAuth2PasswordBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.crud.user import get_user_by_email

# Поддерживаем оба способа авторизации
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")
http_bearer = HTTPBearer()

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    bearer_auth: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Пробуем получить токен из bearer_auth
    if bearer_auth:
        token = bearer_auth.credentials
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user
