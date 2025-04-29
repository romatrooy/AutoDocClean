from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password, create_access_token
import secrets

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_or_create_google_user(db: Session, email: str, google_id: str = None) -> User:
    user = get_user_by_email(db, email=email)
    
    if not user:
        # Создаем случайный пароль для Google-пользователя
        random_password = secrets.token_urlsafe(32)
        user = User(
            email=email,
            hashed_password=get_password_hash(random_password),
            is_active=True,
            google_id=google_id,
            google_token=None,  # будет обновлено позже
            google_refresh_token=None  # будет обновлено позже
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user
