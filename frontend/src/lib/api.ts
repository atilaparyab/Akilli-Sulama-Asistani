import { computeRecommendation } from "@/lib/engine"
import { fetchWeather } from "@/lib/weather"
import type { Crop, Location, Recommendation, SoilType } from "@/lib/types"

const API_BASE = "/api"

interface BackendResponse {
  status: Recommendation["status"]
  final_duration_minutes: number
  suggested_time: string
  note: string
  base_duration_minutes: number
  f_toprak: number
  f_sicaklik: number
  temperature: number
  rain_probability: number
  rain_mm: number
}

function mapBackend(data: BackendResponse): Recommendation {
  return {
    status: data.status,
    finalDurationMinutes: data.final_duration_minutes,
    suggestedTime: data.suggested_time,
    note: data.note,
    baseDurationMinutes: data.base_duration_minutes,
    fToprak: data.f_toprak,
    fSicaklik: data.f_sicaklik,
    temperature: data.temperature,
    rainProbability: data.rain_probability,
    rainMm: data.rain_mm,
    source: "backend",
  }
}

export async function getBackendRecommendation(
  fieldId: number
): Promise<Recommendation> {
  const response = await fetch(`${API_BASE}/sulama-onerisi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field_id: fieldId }),
  })
  if (!response.ok) {
    throw new Error(`Backend hatası (${response.status})`)
  }
  return mapBackend(await response.json())
}

export async function getLocalRecommendation(
  crop: Crop,
  soil: SoilType,
  location: Location
): Promise<Recommendation> {
  const weather = await fetchWeather(location.latitude, location.longitude)
  return computeRecommendation(crop, soil, weather)
}
