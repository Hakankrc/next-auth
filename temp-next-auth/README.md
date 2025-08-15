# NextAuth.js ile Kimlik Doğrulama Uygulaması

Bu proje, Next.js 15 ve NextAuth.js kullanarak modern bir kimlik doğrulama sistemi oluşturur. Auth0 provider entegrasyonu ile güvenli ve ölçeklenebilir bir çözüm sunar.

## 🚀 Özellikler

- **Next.js 15** - En son Next.js sürümü ile App Router desteği
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **NextAuth.js** - Güvenli kimlik doğrulama sistemi
- **Auth0 Provider** - Profesyonel kimlik doğrulama servisi
- **TailwindCSS** - Modern ve responsive tasarım
- **ESLint** - Kod kalitesi ve tutarlılık
- **Middleware** - Sayfa koruma ve yönlendirme

## 📋 Gereksinimler

- Node.js 18.17 veya üzeri
- npm veya yarn paket yöneticisi

## 🛠️ Kurulum

1. **Projeyi klonlayın:**
   ```bash
   git clone <repository-url>
   cd next-auth
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini yapılandırın:**
   `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
   ```env
   # Auth0 Configuration
   AUTH0_CLIENT_ID=your_auth0_client_id_here
   AUTH0_CLIENT_SECRET=your_auth0_client_secret_here
   AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com

   # NextAuth.js Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

5. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

## 🔧 Auth0 Kurulumu

1. [Auth0 Dashboard](https://manage.auth0.com/) adresine gidin
2. Yeni bir uygulama oluşturun
3. Application Type olarak "Single Page Application" seçin
4. Allowed Callback URLs: `http://localhost:3000/api/auth/callback/nextauth`
5. Allowed Logout URLs: `http://localhost:3000`
6. Client ID ve Client Secret'ı `.env.local` dosyasına ekleyin

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth.js API rotası
│   ├── dashboard/
│   │   └── page.tsx                  # Dashboard sayfası
│   ├── login/
│   │   └── page.tsx                  # Giriş sayfası
│   ├── globals.css                   # Global stiller
│   ├── layout.tsx                    # Ana layout
│   ├── page.tsx                      # Ana sayfa
│   └── providers.tsx                 # NextAuth.js provider
├── types/
│   └── next-auth.d.ts               # NextAuth.js tip tanımları
└── middleware.ts                     # Sayfa koruma middleware'i
```

## 🎯 Kullanım

### Giriş Yapma
- `/login` sayfasından Auth0 ile giriş yapın
- Başarılı girişten sonra dashboard'a yönlendirilirsiniz

### Dashboard
- `/dashboard` sayfası sadece giriş yapmış kullanıcılar tarafından görüntülenebilir
- Kullanıcı bilgileri ve hızlı işlemler burada bulunur

### Çıkış Yapma
- Dashboard'daki "Çıkış Yap" butonuna tıklayarak çıkış yapabilirsiniz
- Ana sayfaya yönlendirilirsiniz

## 🔒 Güvenlik

- **Middleware** ile sayfa koruması
- **JWT** tabanlı oturum yönetimi
- **Auth0** ile güvenli kimlik doğrulama
- **Environment variables** ile hassas bilgi koruması

## 🚀 Production Deployment

1. **Ortam değişkenlerini güncelleyin:**
   - `NEXTAUTH_URL` production URL'inizi kullanın
   - `AUTH0_ISSUER_BASE_URL` production Auth0 domain'inizi kullanın

2. **Build alın:**
   ```bash
   npm run build
   ```

3. **Production sunucusunu başlatın:**
   ```bash
   npm start
   ```

## 📚 Teknolojiler

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** TailwindCSS
- **Authentication:** NextAuth.js, Auth0
- **Development:** ESLint, PostCSS
- **Build Tool:** Next.js built-in bundler

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues'da sorun bildirin
2. Dokümantasyonu kontrol edin
3. NextAuth.js ve Auth0 dokümantasyonlarını inceleyin

## 🔄 Güncellemeler

- **v1.0.0** - İlk sürüm, temel kimlik doğrulama sistemi
- NextAuth.js v5 desteği
- Auth0 provider entegrasyonu
- Modern UI/UX tasarımı
