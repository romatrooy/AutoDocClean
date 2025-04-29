from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx

from app.api import deps
from app.core.google_config import google_settings
from app.crud.user import get_or_create_google_user
from app.db.database import get_db
from app.core.security import create_access_token

router = APIRouter()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

@router.get("/login")
async def google_login():
    """
    Возвращает URL для авторизации через Google
    """
    auth_url = (
        f"{google_settings.GOOGLE_AUTH_URI}"
        f"?response_type=code"
        f"&client_id={google_settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={google_settings.GOOGLE_REDIRECT_URI}"
        f"&scope={' '.join(google_settings.GOOGLE_SCOPES)}"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return {"auth_url": auth_url}

@router.post("/callback")
async def google_callback(code_data: dict, db: Session = Depends(deps.get_db)):
    """
    Обрабатывает callback от Google OAuth2
    """
    code = code_data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    token_data = {
        "code": code,
        "client_id": google_settings.GOOGLE_CLIENT_ID,
        "client_secret": google_settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": google_settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    try:
        async with httpx.AsyncClient() as client:
            # Получаем токен
            token_response = await client.post(
                google_settings.GOOGLE_TOKEN_URI,
                data=token_data
            )
            
            if token_response.status_code != 200:
                print(f"Google token error: {token_response.text}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to get token from Google: {token_response.text}"
                )
            
            token_json = token_response.json()
            
            # Получаем информацию о пользователе
            userinfo_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token_json['access_token']}"}
            )
            
            if userinfo_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to get user info"
                )
            
            user_info = userinfo_response.json()

            # Создаем или получаем пользователя
            user = get_or_create_google_user(
                db=db,
                email=user_info["email"],
                google_id=user_info["id"]
            )
            
            # Сохраняем токены
            user.google_token = token_json['access_token']
            user.google_refresh_token = token_json.get('refresh_token')
            db.commit()

            # Создаем JWT токен
            access_token = create_access_token(data={"sub": user.email})
            
            return {
                "access_token": access_token,
                "token_type": "bearer"
            }

    except Exception as e:
        print(f"Error in google callback: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
