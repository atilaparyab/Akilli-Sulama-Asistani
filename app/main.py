"""
AgroAsistan Backend - FastAPI
Diyagramdaki tüm katmanları tek uçta birleştirir:
Çiftçi Girdisi (DB) + Meteoroloji API -> Karar Motoru -> Asistan Notu
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app import models, schemas
from app.weather_service import hava_durumu_getir
from app.decision_engine import sulama_onerisi_hesapla


Base.metadata.create_all(bind=engine)

app = FastAPI(title="AgroAsistan API", version="0.1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"mesaj": "AgroAsistan API çalışıyor"}


# ---------- Tanımlama (setup) uçları ----------

@app.post("/toprak-turleri", response_model=schemas.SoilTypeCreate)
def toprak_turu_ekle(payload: schemas.SoilTypeCreate, db: Session = Depends(get_db)):
    obj = models.SoilType(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.post("/mahsuller", response_model=schemas.CropCreate)
def mahsul_ekle(payload: schemas.CropCreate, db: Session = Depends(get_db)):
    obj = models.Crop(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.post("/araziler", response_model=schemas.FieldCreate)
def arazi_ekle(payload: schemas.FieldCreate, db: Session = Depends(get_db)):
    obj = models.Field(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------- Asıl iş: Sulama Önerisi ----------

@app.post("/sulama-onerisi", response_model=schemas.SulamaOnerisiResponse)
def sulama_onerisi(payload: schemas.SulamaOnerisiRequest, db: Session = Depends(get_db)):
    """
    README'deki tüm akışı çalıştırır:
    1. Katman: Arazi/mahsul/toprak bilgisini DB'den çeker
    2. Katman: Open-Meteo'dan canlı hava durumu çeker
    3. Katman: Karar motorunu çalıştırıp Asistan Notu üretir
    """
    field = db.query(models.Field).filter(models.Field.id == payload.field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Arazi bulunamadı")

    hava = hava_durumu_getir(field.latitude, field.longitude)
    oneri = sulama_onerisi_hesapla(field.crop, field.soil_type, hava)

    # Asistan Notu'nu logla
    log = models.IrrigationLog(
        field_id=field.id,
        base_duration_minutes=oneri.base_duration_minutes,
        f_toprak=oneri.f_toprak,
        f_sicaklik=oneri.f_sicaklik,
        final_duration_minutes=oneri.final_duration_minutes,
        status=oneri.status,
        suggested_time=oneri.suggested_time,
        note=oneri.note,
        rain_probability=hava.yagis_olasiligi,
        rain_mm=hava.yagis_mm,
        temperature=hava.sicaklik,
    )
    db.add(log)
    db.commit()

    return schemas.SulamaOnerisiResponse(
        status=oneri.status,
        final_duration_minutes=oneri.final_duration_minutes,
        suggested_time=oneri.suggested_time,
        note=oneri.note,
        base_duration_minutes=oneri.base_duration_minutes,
        f_toprak=oneri.f_toprak,
        f_sicaklik=oneri.f_sicaklik,
        temperature=hava.sicaklik,
        rain_probability=hava.yagis_olasiligi,
        rain_mm=hava.yagis_mm,
    )
