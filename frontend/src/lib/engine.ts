import type { Crop, Recommendation, SoilType, Weather } from "@/lib/types"

const BASE_DURATION_MINUTES = 30
const RAIN_PROBABILITY_THRESHOLD = 60
const RAIN_MM_THRESHOLD = 5
const HIGH_TEMP_THRESHOLD = 35
const MIDDAY_START_HOUR = 11
const MIDDAY_END_HOUR = 16
const EVENING_SUGGESTED_TIME = "20:00"

function fToprak(soil: SoilType): number {
  return soil.waterRetentionFactor
}

function fSicaklik(sicaklik: number): number {
  if (sicaklik > 35) return 1.3
  if (sicaklik > 30) return 1.15
  if (sicaklik < 15) return 0.8
  return 1.0
}

function rainFilter(weather: Weather): boolean {
  return (
    weather.yagisOlasiligi > RAIN_PROBABILITY_THRESHOLD ||
    weather.yagisMm > RAIN_MM_THRESHOLD
  )
}

function evaporationFilter(weather: Weather): boolean {
  return (
    weather.sicaklik > HIGH_TEMP_THRESHOLD &&
    weather.saat >= MIDDAY_START_HOUR &&
    weather.saat <= MIDDAY_END_HOUR
  )
}

function buildNote(
  status: Recommendation["status"],
  finalDuration: number,
  suggestedTime: string,
  weather: Weather
): string {
  if (status === "iptal") {
    return `Bugün yağış bekleniyor (%${weather.yagisOlasiligi.toFixed(0)} olasılık, ${weather.yagisMm.toFixed(1)} mm). Sulamaya gerek yok, sulama tamamen iptal edildi.`
  }
  if (status === "ertelendi") {
    return `Sıcaklık ${weather.sicaklik.toFixed(0)}°C ile öğlen saatlerinde çok yüksek. Buharlaşmayı önlemek için sulama saat ${suggestedTime}'a ertelendi. Önerilen süre: ${finalDuration.toFixed(0)} dakika.`
  }
  return `Koşullar sulama için uygun. Önerilen sulama süresi: ${finalDuration.toFixed(0)} dakika, saat ${suggestedTime}.`
}

export function computeRecommendation(
  crop: Crop,
  soil: SoilType,
  weather: Weather
): Recommendation {
  const baseDuration = BASE_DURATION_MINUTES * crop.kcFactor * soil.waterRetentionFactor
  const toprak = fToprak(soil)
  const sicaklik = fSicaklik(weather.sicaklik)
  const optimizedDuration = baseDuration * toprak * sicaklik

  const shared = {
    baseDurationMinutes: baseDuration,
    fToprak: toprak,
    fSicaklik: sicaklik,
    temperature: weather.sicaklik,
    rainProbability: weather.yagisOlasiligi,
    rainMm: weather.yagisMm,
    source: "local" as const,
  }

  if (rainFilter(weather)) {
    return {
      ...shared,
      status: "iptal",
      finalDurationMinutes: 0,
      suggestedTime: "-",
      note: buildNote("iptal", 0, "-", weather),
    }
  }

  if (evaporationFilter(weather)) {
    return {
      ...shared,
      status: "ertelendi",
      finalDurationMinutes: optimizedDuration,
      suggestedTime: EVENING_SUGGESTED_TIME,
      note: buildNote("ertelendi", optimizedDuration, EVENING_SUGGESTED_TIME, weather),
    }
  }

  const suggestedTime = `${String(weather.saat).padStart(2, "0")}:00`
  return {
    ...shared,
    status: "onaylandi",
    finalDurationMinutes: optimizedDuration,
    suggestedTime,
    note: buildNote("onaylandi", optimizedDuration, suggestedTime, weather),
  }
}
