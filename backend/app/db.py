import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# On Vercel, the filesystem is read-only, so we must use /tmp for sqlite
if os.getenv("VERCEL"):
    default_db = "sqlite:////tmp/learnpath.db"
else:
    default_db = "sqlite:///./learnpath.db"

DATABASE_URL = os.getenv("DATABASE_URL", default_db)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
