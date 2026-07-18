import logging
from dataclasses import dataclass
from datetime import datetime

import httpx

from app.config import settings

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


@dataclass
class HavaDurumu:
    sicaklik: float          
    yagis_olasiligi: float   
    yagis_mm: float          
    ruzgar_hizi: float      
    saat: int                


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
        
        with httpx.Client(timeout=10.0) as client:
            response = client.get(settings.open_meteo_base_url, params=params)
            response.raise_for_status()  
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
        
        logger.error(f"Meteoroloji API'sine ulaşılamadı. Hata: {exc}")
        
    except Exception as exc:
        
        logger.error(f"Hava durumu verisi işlenirken beklenmeyen bir hata oluştu: {exc}")

    
    logger.warning("Güvenli varsayılan (fallback) hava durumu değerleri kullanılıyor.")
    return HavaDurumu(
        sicaklik=25.0,          
        yagis_olasiligi=0.0,    
        yagis_mm=0.0,
        ruzgar_hizi=5.0,        
        saat=datetime.now().hour,
    )