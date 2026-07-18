<p align="center">
  <img src="../logo.png" alt="AgroAsistan" width="200">
</p>

# AgroAsistan — Marka ve Tasarım Rehberi

Bu belge AgroAsistan arayüzünün görsel kimliğini tanımlar. Amaç; su
(mavi) ile toprak/mahsul (yeşil) arasındaki dengeyi taşıyan, güven
veren ve tarımsal bir üründe okunması kolay bir dil kurmaktır.

Renkler tek bir kaynaktan yönetilir: `src/index.css` içindeki CSS
değişkenleri. Bir tonu değiştirmek istediğinizde yalnızca oradaki HSL
değerini güncelleyin; tüm componentler otomatik olarak uyum sağlar.

---

## 1. Renk Paleti

Palet iki aileden oluşur: **Su (Mavi)** ve **Toprak (Yeşil)**.

### Su Ailesi (Mavi)

| Rol | İsim | HEX | RGB | HSL token |
| --- | --- | --- | --- | --- |
| Koyu vurgu / başlık | Deep Blue | `#146D8D` | 20, 109, 141 | `--brand-deep-blue` |
| **Ana marka / Primary** | Blue | `#2699BE` | 38, 153, 190 | `--brand-blue` |
| Yumuşak dolgu / arka plan | Light Blue | `#8CD1E6` | 140, 209, 230 | `--brand-light-blue` |

### Toprak Ailesi (Yeşil)

| Rol | İsim | HEX | RGB | HSL token |
| --- | --- | --- | --- | --- |
| Uyarı / dikkat | Grass Green | `#E0DE6A` | 224, 222, 106 | `--brand-grass` |
| **Başarı / onay** | Green | `#5CA560` | 92, 165, 96 | `--brand-green` |
| Ana metin / koyu buton | Dark Green | `#315325` | 49, 83, 37 | `--brand-dark-green` |

---

## 2. Anlamsal (Semantik) Renkler

Ham renkleri doğrudan kullanmayın; her renk bir **role** bağlıdır. Bu,
tüm arayüzün tutarlı kalmasını sağlar.

| Token | Kaynak renk | Kullanım |
| --- | --- | --- |
| `primary` | Blue `#2699BE` | Ana aksiyonlar, linkler, aktif durum |
| `secondary` | Light Blue `#8CD1E6` | İkincil butonlar, etiketler |
| `accent` | Green `#5CA560` | İkonlar, vurgu rozetleri |
| `foreground` | Dark Green tonlu | Gövde metni |
| `background` | Çok açık mavi | Sayfa zemini |
| `card` | Beyaz | Kart yüzeyleri |
| `border` / `input` | Açık mavi-gri | Çizgiler, form kenarları |
| `ring` | Blue `#2699BE` | Klavye odak halkası |

### Karar Motoru Durum Renkleri

AgroAsistan'ın kalbi olan üç sulama kararı, palete birebir eşlenir:

| Durum | Anlam | Token | Renk | Neden |
| --- | --- | --- | --- | --- |
| `onaylandi` | Sulama uygun | `approved` | Green `#5CA560` | Yeşil = büyüme, olumlu |
| `ertelendi` | Sıcak, akşama ötele | `postponed` | Grass `#E0DE6A` | Sarı-yeşil = dikkat |
| `iptal` | Yağmur var, gerek yok | `canceled` | Blue `#2699BE` | Mavi = yağmur/su |

Her durumun bir de yumuşak arka plan tonu vardır (`*-soft`) — rozet ve
bilgi kutularının zeminidir.

---

## 3. CTA ve Buton Sistemi

Butonlar `src/components/ui/button.tsx` içinde varyant olarak tanımlıdır.
Bir butonun görünümü için sınıf yazmayın, **varyant** seçin.

| Varyant | Görünüm | Ne zaman |
| --- | --- | --- |
| `cta` | Deep Blue → Blue → Green degrade, gölgeli | Sayfadaki **birincil** çağrı ("Sulama Önerisi Al") — ekranda tek olmalı |
| `default` | Dolu Blue | Standart birincil aksiyon |
| `secondary` | Light Blue dolgu | İkincil aksiyon |
| `outline` | Beyaz zemin, ince kenar | Nötr / iptal aksiyonları |
| `ghost` | Zeminsiz | Araç çubuğu, ikon aksiyonları |
| `approved` / `postponed` / `canceled` | Durum renkleri | Bir sonucu doğrudan temsil eden aksiyonlar |
| `link` | Altı çizili metin | Metin içi linkler |

Kural: **Bir ekranda yalnızca bir `cta`.** Birden fazla birincil buton,
kullanıcının odağını dağıtır.

Boyutlar: `sm` (kompakt), `default`, `lg` (hero / geniş dokunmatik alan).

```tsx
<Button variant="cta" size="lg">Sulama Önerisi Al</Button>
<Button variant="outline">Temizle</Button>
```

---

## 4. Tipografi

| Kullanım | Font | Fallback |
| --- | --- | --- |
| Başlıklar (h1–h3, buton metni) | **Poppins** (500–700) | system-ui, sans-serif |
| Gövde metni, form, etiket | **Inter** (400–600) | system-ui, sans-serif |

Tailwind sınıfı olarak: `font-sans` (Poppins) ve `font-body` (Inter).
Başlıklar `font-sans` ile otomatik gelir. Rakamlarda okunabilirlik için
gövde fontunda ince tabular ayarlar açıktır.

---

## 5. Şekil, Yüzey ve Boşluk

- **Köşe yarıçapı:** `--radius` = `0.85rem`. Kartlar `lg`, girişler `md`,
  küçük öğeler `sm` türetir.
- **Gölge:** `shadow-card` — deep-blue tabanlı yumuşak gölge; kartlara
  havada durma hissi verir. Sert siyah gölge kullanmayın.
- **Zemin:** Sayfa `background` (açık mavi), içerik `card` (beyaz)
  üzerinde durur; bu kontrast su/kağıt hissini taşır.

---

## 6. Erişilebilirlik Kuralları

- Grass `#E0DE6A` açık bir renktir; **üzerine beyaz yazı yazmayın.**
  Sarı zeminde her zaman koyu yeşil metin (`postponed-foreground`).
- Blue ve Green üzerine beyaz metin WCAG AA'yı karşılar; bu eşleşmeleri
  koruyun.
- Renk tek başına anlam taşımasın: her durum rozeti bir ikon + metinle
  birlikte gelir (renk körü kullanıcılar için).

---

## 7. Uygulama İlkesi

> Renkleri componentlerin içine gömmeyin. Tek doğruluk kaynağı
> `src/index.css`'teki değişkenlerdir. Yeni bir marka tonu gerektiğinde
> önce burada tanımlayın, sonra `tailwind.config.js` üzerinden isim
> verin, ardından componentte kullanın.
