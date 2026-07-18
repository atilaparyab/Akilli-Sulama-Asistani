import { CheckCircle2, CloudRain, Clock, type LucideIcon } from "lucide-react"

import type { IrrigationStatus } from "@/lib/types"

interface StatusMeta {
  label: string
  headline: string
  icon: LucideIcon
  badgeVariant: "approved" | "postponed" | "canceled"
  buttonVariant: "approved" | "postponed" | "canceled"
  accentClass: string
  softClass: string
}

export const STATUS_META: Record<IrrigationStatus, StatusMeta> = {
  onaylandi: {
    label: "Onaylandı",
    headline: "Sulama için koşullar uygun",
    icon: CheckCircle2,
    badgeVariant: "approved",
    buttonVariant: "approved",
    accentClass: "text-approved",
    softClass: "bg-approved-soft",
  },
  ertelendi: {
    label: "Ertelendi",
    headline: "Sıcaklık yüksek, sulama akşama ötelendi",
    icon: Clock,
    badgeVariant: "postponed",
    buttonVariant: "postponed",
    accentClass: "text-postponed-foreground",
    softClass: "bg-postponed-soft",
  },
  iptal: {
    label: "İptal",
    headline: "Yağış bekleniyor, sulamaya gerek yok",
    icon: CloudRain,
    badgeVariant: "canceled",
    buttonVariant: "canceled",
    accentClass: "text-canceled",
    softClass: "bg-canceled-soft",
  },
}
