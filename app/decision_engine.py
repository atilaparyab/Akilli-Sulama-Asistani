"""
3. Katman: Karar Mekanizması & Optimizasyon
README diyagramındaki mantığın kod karşılığı:

Çiftçi Girdisi + Meteoroloji API -> Dinamik Optimizasyon Motoru
    -> F_toprak & F_sicaklik çarpanları
    -> Yağmur Filtresi
        -> Yağış > %60 VEYA > 5mm  => "Sulama Tamamen İptal"
        -> Yağış Yok               => Buharlaşma Filtresi
                -> Sıcaklık > 35°C & Saat Öğlen => "Saati Akşama Ötele"
                -> Şartlar Uygun                => "Nihai Süreyi Onayla"
    -> Asistan Notu Oluştur
"""
from dataclasses import dataclass

from app.models import Crop, SoilType
from app.weather_service import HavaDurumu

# --- Sabitler ---
BASE_DURATION_MINUTES = 30  # taban sulama süresi (dakika)

RAIN_PROBABILITY_THRESHOLD = 60   # %
RAIN_MM_THRESHOLD = 5             # mm
HIGH_TEMP_THRESHOLD = 35          # °C
MIDDAY_START_HOUR = 11
MIDDAY_END_HOUR = 16
EVENING_SUGGESTED_TIME = "20:00"


@dataclass
class SulamaOnerisi:
    status: str                    # "iptal" | "ertelendi" | "onaylandi"
    final_duration_minutes: float
    suggested_time: str
    note: str
    base_duration_minutes: float
    f_toprak: float
    f_sicaklik: float


def hesapla_baz_sulama_suresi(crop: Crop, soil_type: SoilType) -> float:
    """
    'Baz Sulama Süresi' kutusu.
    FAO bitki su tüketim katsayısı (Kc) ve toprağın su tutma katsayısına göre
    taban sulama süresini dakika cinsinden hesaplar.
    """
    return BASE_DURATION_MINUTES * crop.kc_factor * soil_type.water_retention_factor


def hesapla_f_toprak(soil_type: SoilType) -> float:
    """
    F_toprak çarpanı: toprağın su tutma kapasitesine göre süreyi ayarlar.
    Kumlu topraklar suyu hızlı kaybeder (daha az süre), killi topraklar
    daha uzun tutar (daha uzun süre gerektirebilir de, model burada
    doğrudan su_tutma_katsayisi'nı kullanır).
    """
    return soil_type.water_retention_factor


def hesapla_f_sicaklik(sicaklik: float) -> float:
    """
    F_sicaklik çarpanı: hava sıcaklığına göre süreyi artırır/azaltır.
    Sıcaklık arttıkça buharlaşma artar, bu yüzden süre biraz uzatılır;
    ama aşırı sıcakta (>35°C) zaten Buharlaşma Filtresi devreye girip
    saati erteler, süre uzatmak yerine zamanlama değiştirilir.
    """
    if sicaklik > 35:
        return 1.3
    elif sicaklik > 30:
        return 1.15
    elif sicaklik < 15:
        return 0.8
    return 1.0


def yagmur_filtresi(hava: HavaDurumu) -> bool:
    """True dönerse sulama tamamen iptal edilir."""
    return (
        hava.yagis_olasiligi > RAIN_PROBABILITY_THRESHOLD
        or hava.yagis_mm > RAIN_MM_THRESHOLD
    )


def buharlasma_filtresi(hava: HavaDurumu) -> bool:
    """True dönerse sulama akşama ertelenir."""
    return (
        hava.sicaklik > HIGH_TEMP_THRESHOLD
        and MIDDAY_START_HOUR <= hava.saat <= MIDDAY_END_HOUR
    )


def asistan_notu_olustur(
    status: str, final_duration: float, suggested_time: str, hava: HavaDurumu
) -> str:
    """'Asistan Notu Oluştur' kutusu: çiftçiye gösterilecek nihai metni üretir."""
    if status == "iptal":
        return (
            f"Bugün yağış bekleniyor (%{hava.yagis_olasiligi:.0f} olasılık, "
            f"{hava.yagis_mm:.1f} mm). Sulamaya gerek yok, sulama tamamen iptal edildi."
        )
    if status == "ertelendi":
        return (
            f"Sıcaklık {hava.sicaklik:.0f}°C ile öğlen saatlerinde çok yüksek. "
            f"Buharlaşmayı önlemek için sulama saat {suggested_time}'a ertelendi. "
            f"Önerilen süre: {final_duration:.0f} dakika."
        )
    return (
        f"Koşullar sulama için uygun. Önerilen sulama süresi: "
        f"{final_duration:.0f} dakika, saat {suggested_time}."
    )


def sulama_onerisi_hesapla(
    crop: Crop, soil_type: SoilType, hava: HavaDurumu
) -> SulamaOnerisi:
    """
    Dinamik Optimizasyon Motoru'nun tamamı.
    Baz süre + çarpanlar + filtreler zincirini işletip nihai öneriyi döndürür.
    """
    base_duration = hesapla_baz_sulama_suresi(crop, soil_type)
    f_toprak = hesapla_f_toprak(soil_type)
    f_sicaklik = hesapla_f_sicaklik(hava.sicaklik)

    optimized_duration = base_duration * f_toprak * f_sicaklik

    # 1) Yağmur Filtresi
    if yagmur_filtresi(hava):
        note = asistan_notu_olustur("iptal", 0, "-", hava)
        return SulamaOnerisi(
            status="iptal",
            final_duration_minutes=0,
            suggested_time="-",
            note=note,
            base_duration_minutes=base_duration,
            f_toprak=f_toprak,
            f_sicaklik=f_sicaklik,
        )

    # 2) Buharlaşma Filtresi
    if buharlasma_filtresi(hava):
        note = asistan_notu_olustur(
            "ertelendi", optimized_duration, EVENING_SUGGESTED_TIME, hava
        )
        return SulamaOnerisi(
            status="ertelendi",
            final_duration_minutes=optimized_duration,
            suggested_time=EVENING_SUGGESTED_TIME,
            note=note,
            base_duration_minutes=base_duration,
            f_toprak=f_toprak,
            f_sicaklik=f_sicaklik,
        )

    # 3) Şartlar uygun -> Nihai Süreyi Onayla
    suggested_time = f"{hava.saat:02d}:00"
    note = asistan_notu_olustur("onaylandi", optimized_duration, suggested_time, hava)
    return SulamaOnerisi(
        status="onaylandi",
        final_duration_minutes=optimized_duration,
        suggested_time=suggested_time,
        note=note,
        base_duration_minutes=base_duration,
        f_toprak=f_toprak,
        f_sicaklik=f_sicaklik,
    )
