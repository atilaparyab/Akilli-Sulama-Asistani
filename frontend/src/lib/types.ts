export type IrrigationStatus = "onaylandi" | "ertelendi" | "iptal"

export interface Weather {
  sicaklik: number
  yagisOlasiligi: number
  yagisMm: number
  ruzgarHizi: number
  saat: number
}

export interface Recommendation {
  status: IrrigationStatus
  finalDurationMinutes: number
  suggestedTime: string
  note: string
  baseDurationMinutes: number
  fToprak: number
  fSicaklik: number
  temperature: number
  rainProbability: number
  rainMm: number
  source: "backend" | "local"
}

export interface Crop {
  id: string
  name: string
  kcFactor: number
}

export interface SoilType {
  id: string
  name: string
  waterRetentionFactor: number
  description: string
}

export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
}
