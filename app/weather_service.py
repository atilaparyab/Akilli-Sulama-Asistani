"""
2. Katman: Çevresel Girdiler -> Meteoroloji API -> Canlı Hava Analizi
Open-Meteo ücretsiz API'si kullanılır (API key gerekmez).
Hata yönetimi (Error Handling) ve yedek (Fallback) senaryoları entegre edilmiştir.
"""
import logging
from dataclasses import dataclass
from datetime import datetime

import httpx

from app.config import settings

# Loglama ayarlarını başlat (Hataları konsolda görebilmek için)
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


@dataclass
class HavaDurumu:
    sicaklik: float          # °C, o anki (veya öğle saatindeki) sıcaklık
    yagis_olasiligi: float   # % cinsinden, bugünkü maksimum yağış olasılığı
    yagis_mm: float          # mm cinsinden, bugünkü toplam yağış miktarı
    ruzgar_hizi: float       # km/s
    saat: int                # sorgu anındaki saat (0-23)


def hava_durumu_getir(latitude: float, longitude: float) -> HavaDurumu:
    """
    Canlı Hava Analizi kutusu.
    Open-Meteo'dan güncel sıcaklık, yağış olasılığı, yağış miktarı ve rüzgarı çeker.
    API hata verirse, sistemin çökmemesi için güvenli varsayılan değerler döndürür.
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,wind_speed_10m",
        "daily": "precipitation_probability_max,precipitation_sum",
        "timezone": "auto",
    }

    try:
        # Timeout süresini 10 saniye olarak koruyoruz
        with httpx.Client(timeout=10.0) as client:
            response = client.get(settings.open_meteo_base_url, params=params)
            response.raise_for_status()  # 4xx veya 5xx hatalarını yakalar
            data = response.json()

        current = data.get("current", {})
        daily = data.get("daily", {})

        return HavaDurumu(
            sicaklik=current.get("temperature_2m", 0.0),
            yagis_olasiligi=(daily.get("precipitation_probability_max") or [0])[0],
            yagis_mm=(daily.get("precipitation_sum") or [0])[0],
            ruzgar_hizi=current.get("wind_speed_10m", 0.0),
            saat=datetime.now().hour,
        )

    except (httpx.RequestError, httpx.HTTPStatusError) as exc:
        # API'ye ulaşılamazsa veya sunucu hatası dönerse burası çalışır
        logger.error(f"Meteoroloji API'sine ulaşılamadı. Hata: {exc}")
        
    except Exception as exc:
        # Beklenmeyen diğer tüm hataları (örneğin JSON parse hatası) yakalar
        logger.error(f"Hava durumu verisi işlenirken beklenmeyen bir hata oluştu: {exc}")

    # Fallback (Yedek) Senaryo:
    # API çökerse sulama sisteminin tamamen durmaması için ortalama, risksiz değerler döneriz.
    logger.warning("Güvenli varsayılan (fallback) hava durumu değerleri kullanılıyor.")
    return HavaDurumu(
        sicaklik=25.0,          # Ortalama, buharlaşma filtresine takılmayacak bir sıcaklık
        yagis_olasiligi=0.0,    # Sulamayı iptal etmemek için yağmur ihtimali sıfır kabul ediliyor
        yagis_mm=0.0,
        ruzgar_hizi=5.0,        # Hafif rüzgar
        saat=datetime.now().hour,
    )