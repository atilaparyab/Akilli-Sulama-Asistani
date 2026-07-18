"""
Veri Modelleri (Sprint Review'de netleştirilen):
- Toprak türü (kumlu, killi, tınlı) -> su tutma katsayısı
- Mahsul türü -> FAO Kc (bitki su tüketim katsayısı)
- Çiftçi ve Arazi bilgileri
- Geçmiş sulama önerileri (log)
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class SoilType(Base):
    """Toprak türleri ve FAO standartlarına göre su tutma katsayıları."""
    __tablename__ = "soil_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # kumlu, killi, tınlı
    water_retention_factor = Column(Float, nullable=False)  # su tutma katsayısı

    fields = relationship("Field", back_populates="soil_type")


class Crop(Base):
    """Mahsul türleri ve FAO standartlarındaki bitki su tüketim katsayısı (Kc)."""
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # buğday, mısır, domates vb.
    kc_factor = Column(Float, nullable=False)  # FAO bitki su tüketim katsayısı

    fields = relationship("Field", back_populates="crop")


class Farmer(Base):
    """Çiftçi bilgileri."""
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)

    fields = relationship("Field", back_populates="farmer")


class Field(Base):
    """Arazi/parsel bilgileri - Çiftçi Girdisi kutusunun karşılığı."""
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    soil_type_id = Column(Integer, ForeignKey("soil_types.id"))

    farmer = relationship("Farmer", back_populates="fields")
    crop = relationship("Crop", back_populates="fields")
    soil_type = relationship("SoilType", back_populates="fields")

    logs = relationship("IrrigationLog", back_populates="field")


class IrrigationLog(Base):
    """
    Asistan Notu Oluştur adımının kaydı.
    Karar motorunun her çalışmasında üretilen öneri buraya loglanır.
    """
    __tablename__ = "irrigation_logs"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"))

    base_duration_minutes = Column(Float, nullable=False)
    f_toprak = Column(Float, nullable=False)
    f_sicaklik = Column(Float, nullable=False)
    final_duration_minutes = Column(Float, nullable=False)

    status = Column(String, nullable=False)  # iptal / ertelendi / onaylandi
    suggested_time = Column(String, nullable=True)  # ör. "20:00"
    note = Column(String, nullable=False)  # çiftçiye gösterilecek metin

    rain_probability = Column(Float, nullable=True)
    rain_mm = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    field = relationship("Field", back_populates="logs")
