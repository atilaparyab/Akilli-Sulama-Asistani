import { useState } from "react"
import { Droplets, Leaf, Satellite, Waves } from "lucide-react"

import { IrrigationForm } from "@/components/IrrigationForm"
import { LiveBadge } from "@/components/LiveBadge"
import { ResultCard } from "@/components/ResultCard"
import { Card, CardContent } from "@/components/ui/card"
import { getLocalRecommendation } from "@/lib/api"
import { CROPS, LOCATIONS, SOIL_TYPES } from "@/lib/presets"
import type { Recommendation } from "@/lib/types"

function App() {
  const [cropId, setCropId] = useState(CROPS[0].id)
  const [soilId, setSoilId] = useState(SOIL_TYPES[1].id)
  const [locationId, setLocationId] = useState(LOCATIONS[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Recommendation | null>(null)

  async function handleSubmit() {
    const crop = CROPS.find((item) => item.id === cropId)
    const soil = SOIL_TYPES.find((item) => item.id === soilId)
    const location = LOCATIONS.find((item) => item.id === locationId)
    if (!crop || !soil || !location) return

    setLoading(true)
    setError(null)
    try {
      const recommendation = await getLocalRecommendation(crop, soil, location)
      setResult(recommendation)
    } catch {
      setError("Hava durumu alınamadı. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px]"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[-160px] h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-brand-light-blue/40 blur-3xl" />
        <div className="absolute left-[16%] top-0 h-[240px] w-[240px] rounded-full bg-brand-green/25 blur-3xl" />
        <div className="absolute right-[14%] top-[-30px] h-[220px] w-[220px] rounded-full bg-brand-blue/25 blur-3xl" />
      </div>
      <header className="relative border-b border-border/60 bg-card/60 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-deep-blue via-brand-blue to-brand-green text-white shadow-card">
              <Droplets className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="font-sans text-lg font-bold text-foreground">
                AgroAsistan
              </p>
              <p className="text-xs text-muted-foreground">
                Akıllı Sulama Asistanı
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <Satellite className="h-3.5 w-3.5 text-primary" />
            Open-Meteo canlı veri
          </span>
        </div>
      </header>

      <main className="container py-10">
        <section className="mx-auto max-w-3xl text-center">
          <LiveBadge label="Veri odaklı karar destek sistemi" />
          <h1 className="mt-4 font-sans text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Hangi gün, saat kaçta,{" "}
            <span className="bg-gradient-to-r from-brand-deep-blue via-brand-blue to-brand-green bg-clip-text text-transparent">
              kaç dakika sulama?
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Meteorolojik verileri toprak ve mahsul özellikleriyle harmanlar;
            su israfını önleyip verimi artıran net bir sulama reçetesi sunar.
          </p>
        </section>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          <IrrigationForm
            cropId={cropId}
            soilId={soilId}
            locationId={locationId}
            loading={loading}
            onCropChange={setCropId}
            onSoilChange={setSoilId}
            onLocationChange={setLocationId}
            onSubmit={handleSubmit}
          />

          {result ? (
            <ResultCard result={result} />
          ) : (
            <Card className="flex items-center justify-center border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 text-primary">
                  <Waves className="h-7 w-7" />
                </span>
                <p className="font-sans text-lg font-semibold text-foreground">
                  Asistan notunuz burada belirecek
                </p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  {error ??
                    "Soldan seçimlerinizi yapıp Sulama Önerisi Al'a basın."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <section className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
          <FlowStep
            icon={Leaf}
            title="1. Tarımsal Girdiler"
            text="Mahsul Kc ve toprak su tutma katsayısı baz süreyi belirler."
          />
          <FlowStep
            icon={Satellite}
            title="2. Çevresel Girdiler"
            text="Open-Meteo'dan canlı sıcaklık, yağış ve rüzgar çekilir."
          />
          <FlowStep
            icon={Droplets}
            title="3. Karar Motoru"
            text="Yağmur ve buharlaşma filtreleri nihai reçeteyi üretir."
          />
        </section>
      </main>

      <footer className="border-t border-border/60 py-6">
        <p className="container text-center text-xs text-muted-foreground">
          AgroAsistan · Ekip 50 AgroTech Team
        </p>
      </footer>
    </div>
  )
}

interface FlowStepProps {
  icon: typeof Droplets
  title: string
  text: string
}

function FlowStep({ icon: Icon, title, text }: FlowStepProps) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="flex gap-3 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-brand-deep-blue">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-sans text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {text}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default App
