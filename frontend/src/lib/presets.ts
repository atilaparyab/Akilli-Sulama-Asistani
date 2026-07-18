import type { Crop, Location, SoilType } from "@/lib/types"

export const CROPS: Crop[] = [
  { id: "domates", name: "Domates", kcFactor: 1.15 },
  { id: "misir", name: "Mısır", kcFactor: 1.2 },
  { id: "bugday", name: "Buğday", kcFactor: 1.15 },
  { id: "biber", name: "Biber", kcFactor: 1.05 },
  { id: "patates", name: "Patates", kcFactor: 1.15 },
  { id: "aycicegi", name: "Ayçiçeği", kcFactor: 1.0 },
  { id: "pamuk", name: "Pamuk", kcFactor: 1.2 },
  { id: "cim", name: "Çim / Mera", kcFactor: 0.85 },
]

export const SOIL_TYPES: SoilType[] = [
  {
    id: "kumlu",
    name: "Kumlu",
    waterRetentionFactor: 0.8,
    description: "Suyu hızlı kaybeder, sık ve kısa sulama ister.",
  },
  {
    id: "tinli",
    name: "Tınlı",
    waterRetentionFactor: 1.0,
    description: "Dengeli su tutma, çoğu mahsul için ideal.",
  },
  {
    id: "killi",
    name: "Killi",
    waterRetentionFactor: 1.2,
    description: "Suyu uzun tutar, daha uzun aralıklı sulama.",
  },
]

export const LOCATIONS: Location[] = [
  { id: "ankara", name: "Ankara", latitude: 39.93, longitude: 32.86 },
  { id: "istanbul", name: "İstanbul", latitude: 41.01, longitude: 28.98 },
  { id: "izmir", name: "İzmir", latitude: 38.42, longitude: 27.14 },
  { id: "antalya", name: "Antalya", latitude: 36.9, longitude: 30.7 },
  { id: "konya", name: "Konya", latitude: 37.87, longitude: 32.48 },
  { id: "sanliurfa", name: "Şanlıurfa", latitude: 37.17, longitude: 38.79 },
  { id: "adana", name: "Adana", latitude: 37.0, longitude: 35.32 },
  { id: "bursa", name: "Bursa", latitude: 40.19, longitude: 29.06 },
]
