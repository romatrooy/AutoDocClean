from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.crud.user import get_user_by_email

client = TestClient(app)

def test_register():
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login():
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
