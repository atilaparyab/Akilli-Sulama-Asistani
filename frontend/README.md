# AgroAsistan — Frontend

Akıllı Sulama Asistanı'nın React arayüzü. Marka rengi ve tasarım kuralları
için [BRANDING.md](./BRANDING.md) dosyasına bakın.

## Teknoloji

- **Vite + React + TypeScript**
- **Tailwind CSS** — palet, `src/index.css` içindeki CSS değişkenleriyle
- **shadcn/ui** (Radix tabanlı) — `src/components/ui`
- **lucide-react** — ikonlar

## Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Arayüz `http://localhost:5173` adresinde açılır.

## Veri kaynağı

- Varsayılan: tarayıcıdan doğrudan **Open-Meteo** canlı hava durumu çekilir
  ve karar motoru (`src/lib/engine.ts`) reçeteyi üretir. Bu, backend
  ayakta olmadan da çalışan bir önizlemedir.
- Gerçek FastAPI backend'ine bağlanmak için `src/lib/api.ts` içindeki
  `getBackendRecommendation` kullanılır; `vite.config.ts`'teki `/api`
  proxy'si istekleri `http://127.0.0.1:8000`'e yönlendirir.

## Yapı

```
src/
  components/
    ui/                 shadcn componentleri (button, card, select, badge, ...)
    IrrigationForm.tsx  Çiftçi girdi formu
    ResultCard.tsx      Asistan notu / sonuç kartı
  lib/
    presets.ts          Mahsul (Kc), toprak (su tutma), konum verileri
    weather.ts          Open-Meteo istemcisi
    engine.ts           Karar motoru (backend decision_engine.py karşılığı)
    api.ts              Backend / yerel öneri katmanı
    status.ts           Durum renk ve ikon eşlemesi
    types.ts            Ortak tipler
  App.tsx               Sayfa düzeni
```
