# AgroAsistan Backend - Kurulum

Bu klasör, README'deki mimari diyagramın (Çiftçi Girdisi -> Veritabanı,
Meteoroloji API -> Canlı Hava Analizi, Karar Mekanizması -> Asistan Notu)
Python/FastAPI koduna dökülmüş halidir.

## 1. Sanal ortam ve bağımlılıklar

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. PostgreSQL ayarı

`.env.example` dosyasını `.env` olarak kopyalayıp kendi veritabanı
bilgilerinizi girin:

```bash
cp .env.example .env
```

PostgreSQL'de boş bir veritabanı oluşturun (örnek):

```sql
CREATE DATABASE agroasistan;
```

Not: Henüz gerçek bir PostgreSQL sunucunuz yoksa, hızlı test için
`DATABASE_URL` değerini `sqlite:///./test.db` yaparak SQLite ile de
çalıştırabilirsiniz.

## 3. Sunucuyu çalıştırma

```bash
uvicorn app.main:app --reload
```

Sunucu ayağa kalktıktan sonra tarayıcıdan:
- http://127.0.0.1:8000/docs  -> otomatik oluşan Swagger arayüzü

## 4. Örnek kullanım akışı

1. `POST /toprak-turleri` -> ör. `{"name": "tinli", "water_retention_factor": 1.0}`
2. `POST /mahsuller` -> ör. `{"name": "domates", "kc_factor": 1.15}`
3. `POST /araziler` -> çiftçi/arazi/mahsul/toprak ilişkisini kurar
4. `POST /sulama-onerisi` -> `{"field_id": 1}` gönderin, sistem Open-Meteo'dan
   canlı hava durumunu çeker, karar motorunu çalıştırır ve size Asistan
   Notu'nu (sulama iptal / ertelendi / onaylandı + süre + saat) döndürür.

## 5. Dosya yapısı

```
app/
  config.py           -> Ayarlar (.env okuma)
  database.py          -> SQLAlchemy engine/session (Veritabanı kutusu)
  models.py            -> ORM tabloları (Çiftçi, Arazi, Mahsul, Toprak Türü, Log)
  schemas.py            -> Pydantic API şemaları
  weather_service.py   -> Open-Meteo entegrasyonu (Meteoroloji API kutusu)
  decision_engine.py   -> Dinamik Optimizasyon Motoru + Yağmur/Buharlaşma filtreleri
  main.py               -> FastAPI endpoint'leri
```

## 6. Sıradaki adımlar

- Alembic ile migration yönetimi kurulabilir (şu an `create_all` ile
  tablo otomatik oluşuyor, prototip için yeterli).
- React frontend, `/sulama-onerisi` ucuna istek atıp dönen `note`,
  `status`, `suggested_time` alanlarını Çiftçi Arayüzü'nde gösterebilir.
- Kimlik doğrulama (JWT) eklenmesi önerilir (şu an açık uçlar var).
