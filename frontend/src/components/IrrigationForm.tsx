import { Droplets, Loader2, MapPin, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CROPS, LOCATIONS, SOIL_TYPES } from "@/lib/presets"

interface IrrigationFormProps {
  cropId: string
  soilId: string
  locationId: string
  loading: boolean
  onCropChange: (value: string) => void
  onSoilChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSubmit: () => void
}

export function IrrigationForm({
  cropId,
  soilId,
  locationId,
  loading,
  onCropChange,
  onSoilChange,
  onLocationChange,
  onSubmit,
}: IrrigationFormProps) {
  const soil = SOIL_TYPES.find((item) => item.id === soilId)

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Sprout className="h-5 w-5" />
          </span>
          Arazi Bilgileri
        </CardTitle>
        <CardDescription>
          Mahsul, toprak türü ve konumu seçin; asistan canlı hava durumuna
          göre reçetenizi hazırlasın.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Sprout className="h-4 w-4 text-accent" />
            Mahsul
          </Label>
          <Select value={cropId} onValueChange={onCropChange}>
            <SelectTrigger>
              <SelectValue placeholder="Mahsul seçin" />
            </SelectTrigger>
            <SelectContent>
              {CROPS.map((crop) => (
                <SelectItem key={crop.id} value={crop.id}>
                  {crop.name}  ·  Kc {crop.kcFactor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-primary" />
            Toprak Türü
          </Label>
          <Select value={soilId} onValueChange={onSoilChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toprak türü seçin" />
            </SelectTrigger>
            <SelectContent>
              {SOIL_TYPES.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}  ·  su tutma {item.waterRetentionFactor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {soil ? (
            <p className="text-xs text-muted-foreground">{soil.description}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-deep-blue" />
            Konum
          </Label>
          <Select value={locationId} onValueChange={onLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Konum seçin" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="cta"
          size="lg"
          className="w-full"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Hesaplanıyor...
            </>
          ) : (
            <>
              <Droplets className="h-5 w-5" />
              Sulama Önerisi Al
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
