"""
2. Katman: Çevresel Girdiler -> Meteoroloji API -> Canlı Hava Analizi
Open-Meteo ücretsiz API'si kullanılır (API key gerekmez).
"""
from dataclasses import dataclass
from datetime import datetime

import httpx

from app.config import settings


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
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,wind_speed_10m",
        "daily": "precipitation_probability_max,precipitation_sum",
        "timezone": "auto",
    }

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
