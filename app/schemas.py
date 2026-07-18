"""
API istek/cevap şemaları (Pydantic).
Frontend (React) ile Backend (FastAPI) arasındaki sözleşme burada tanımlanır.
"""
from pydantic import BaseModel, Field as PydanticField


class SulamaOnerisiRequest(BaseModel):
    """Çiftçi arayüzünden gelen giriş: 'Çiftçi Girdisi' kutusu."""
    field_id: int = PydanticField(..., description="Arazi ID'si")


class SulamaOnerisiResponse(BaseModel):
    """
    'Asistan Notu Oluştur' -> 'Çiftçi Arayüzü: Saat ve Süre' çıktısı.
    """
    status: str  # "iptal" | "ertelendi" | "onaylandi"
    final_duration_minutes: float
    suggested_time: str
    note: str

    base_duration_minutes: float
    f_toprak: float
    f_sicaklik: float

    temperature: float
    rain_probability: float
    rain_mm: float

    class Config:
        from_attributes = True


class SoilTypeCreate(BaseModel):
    name: str
    water_retention_factor: float


class CropCreate(BaseModel):
    name: str
    kc_factor: float


class FieldCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    farmer_id: int
    crop_id: int
    soil_type_id: int
