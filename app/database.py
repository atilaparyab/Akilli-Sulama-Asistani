"""
1. Katman: Tarımsal Girdiler -> Veritabanı bağlantısı
README diyagramındaki "Veritabanı" kutusuna karşılık gelir.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: her istek için bir DB session açar, sonunda kapatır."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
