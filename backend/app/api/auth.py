from datetime import datetime, timedelta
import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.schemas import UserRegister, UserLogin, Token

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)})
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.post("/register", response_model=Token)
def register(body: UserRegister, db: Session = Depends(get_db)):
    from sqlalchemy import text
    existing = db.execute(text("SELECT id FROM users WHERE email = :email"), {"email": body.email}).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = pwd.hash(body.password)
    result = db.execute(
        text("INSERT INTO users (name, email, hashed_password, goal_skill) VALUES (:name, :email, :pw, :goal) RETURNING id"),
        {"name": body.name, "email": body.email, "pw": hashed, "goal": body.goal_skill or ""},
    )
    user_id = result.fetchone()[0]
    db.commit()
    token = create_access_token({"sub": str(user_id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(body: UserLogin, db: Session = Depends(get_db)):
    from sqlalchemy import text
    row = db.execute(text("SELECT id, hashed_password FROM users WHERE email = :email"), {"email": body.email}).fetchone()
    if not row or not pwd.verify(body.password, row[1]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(row[0])})
    return {"access_token": token, "token_type": "bearer"}
