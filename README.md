# Authentication API (JWT)

JWT tabanlı kullanıcı kimlik doğrulama REST API'si. Node.js, Express ve SQLite kullanılarak geliştirilmiştir.

## Özellikler

- Kullanıcı kaydı (Register) ve şifre hashleme (bcrypt)
- Kullanıcı girişi (Login) ve JWT token üretimi
- Protected route ile oturum doğrulama
- Rate limiting, Helmet güvenlik başlıkları
- Swagger UI dokümantasyonu
- SQLite ile dosya tabanlı veritabanı (kurulum gerektirmez)

## Teknolojiler

| Teknoloji | Açıklama |
| --- | --- |
| Node.js | Runtime |
| Express.js | API framework |
| SQLite (better-sqlite3) | Dosya tabanlı veritabanı |
| JWT | Access token |
| bcryptjs | Şifre hashleme |
| Swagger | API dokümantasyonu |

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env
# .env içindeki JWT_SECRET değerini değiştir

# Geliştirme modunda çalıştır
npm run dev

# Production modunda çalıştır
npm start
```

## Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
| --- | --- | --- |
| `PORT` | Sunucu portu | `5000` |
| `JWT_SECRET` | Token imzalama anahtarı | – |
| `JWT_EXPIRES_IN` | Token geçerlilik süresi | `7d` |

## API Endpoints

| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Yeni kullanıcı kaydı | Hayır |
| `POST` | `/auth/login` | Kullanıcı girişi | Hayır |
| `GET` | `/auth/me` | Giriş yapan kullanıcının bilgileri | Evet (Bearer Token) |

## Swagger Dokümantasyonu

Sunucu çalışırken aşağıdaki adrese gidin:

```
http://localhost:5000/api-docs
```

## Proje Yapısı

```
src/
├── config/
│   ├── db.js           # SQLite bağlantısı ve tablo oluşturma
│   └── swagger.js      # Swagger ayarları
├── controllers/
│   └── authController.js   # Register, Login, GetMe iş mantığı
├── middlewares/
│   ├── auth.js         # JWT doğrulama middleware
│   └── errorHandler.js # Global hata yönetimi
├── models/
│   └── User.js         # Kullanıcı veri işlemleri (SQLite)
├── routes/
│   └── authRoutes.js   # Auth route tanımları
├── utils/
│   └── token.js        # JWT token yardımcı fonksiyonları
└── server.js           # Uygulama giriş noktası
data/
└── auth.db             # SQLite veritabanı dosyası (otomatik oluşur)
```

## Deploy

Render veya Railway üzerinde deploy etmek için:

1. GitHub reposunu bağlayın
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`
4. Ortam değişkenlerini (`.env`) platform üzerinde tanımlayın
