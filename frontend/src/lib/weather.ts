import type { Weather } from "@/lib/types"

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,wind_speed_10m",
    daily: "precipitation_probability_max,precipitation_sum",
    timezone: "auto",
  })

  const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Hava durumu servisine ulaşılamadı")
  }

  const data = await response.json()
  const current = data.current ?? {}
  const daily = data.daily ?? {}

  return {
    sicaklik: current.temperature_2m ?? 0,
    yagisOlasiligi: (daily.precipitation_probability_max ?? [0])[0] ?? 0,
    yagisMm: (daily.precipitation_sum ?? [0])[0] ?? 0,
    ruzgarHizi: current.wind_speed_10m ?? 0,
    saat: new Date().getHours(),
  }
}
