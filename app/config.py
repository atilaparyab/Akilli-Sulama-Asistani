"""
Uygulama genel ayarları.
.env dosyasından veya ortam değişkenlerinden okunur.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:sifre@localhost:5432/agroasistan"
    open_meteo_base_url: str = "https://api.open-meteo.com/v1/forecast"

    class Config:
        env_file = ".env"


settings = Settings()
