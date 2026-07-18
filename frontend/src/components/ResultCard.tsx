import {
  Clock,
  CloudRain,
  Droplets,
  Thermometer,
  Timer,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { STATUS_META } from "@/lib/status"
import { cn } from "@/lib/utils"
import type { Recommendation } from "@/lib/types"

interface MetricProps {
  icon: typeof Droplets
  label: string
  value: string
}

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-background/60 p-3">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-sans text-lg font-semibold text-foreground">
        {value}
      </span>
    </div>
  )
}

interface ResultCardProps {
  result: Recommendation
}

export function ResultCard({ result }: ResultCardProps) {
  const meta = STATUS_META[result.status]
  const Icon = meta.icon
  const canceled = result.status === "iptal"

  return (
    <Card className="animate-fade-up overflow-hidden">
      <div className={cn("flex items-start gap-4 p-6", meta.softClass)}>
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm",
            meta.accentClass
          )}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={meta.badgeVariant}>
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </Badge>
            <Badge variant="outline">
              {result.source === "backend" ? "Backend" : "Canlı Önizleme"}
            </Badge>
          </div>
          <h3 className="font-sans text-lg font-semibold text-foreground">
            {meta.headline}
          </h3>
        </div>
      </div>

      <CardContent className="space-y-5 pt-6">
        <p className="text-sm leading-relaxed text-foreground/90">
          {result.note}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Metric
            icon={Timer}
            label="Önerilen süre"
            value={canceled ? "—" : `${result.finalDurationMinutes.toFixed(0)} dk`}
          />
          <Metric
            icon={Clock}
            label="Önerilen saat"
            value={result.suggestedTime}
          />
        </div>

        <Separator />

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Canlı Hava Analizi
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Metric
              icon={Thermometer}
              label="Sıcaklık"
              value={`${result.temperature.toFixed(0)}°C`}
            />
            <Metric
              icon={CloudRain}
              label="Yağış olası."
              value={`%${result.rainProbability.toFixed(0)}`}
            />
            <Metric
              icon={Droplets}
              label="Yağış"
              value={`${result.rainMm.toFixed(1)} mm`}
            />
          </div>
        </div>

        <Separator />

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Optimizasyon Motoru
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Metric
              icon={Timer}
              label="Baz süre"
              value={`${result.baseDurationMinutes.toFixed(0)} dk`}
            />
            <Metric
              icon={Droplets}
              label="F toprak"
              value={`×${result.fToprak.toFixed(2)}`}
            />
            <Metric
              icon={Thermometer}
              label="F sıcaklık"
              value={`×${result.fSicaklik.toFixed(2)}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
