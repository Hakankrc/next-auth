# NextAuth.js ile Kitap Mağazası Uygulaması

Bu proje, Next.js 15 ve NextAuth.js kullanarak modern bir kitap mağazası ve kimlik doğrulama sistemi oluşturur. Credentials provider ile güvenli giriş, kitap satın alma, sepet yönetimi ve admin paneli özellikleri sunar.

## 🚀 Özellikler

- **Next.js 15** - En son Next.js sürümü ile App Router desteği
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **NextAuth.js** - Güvenli kimlik doğrulama sistemi (Credentials Provider)
- **Kitap Mağazası** - Kitap listeleme, sepet yönetimi, sipariş sistemi
- **Admin Panel** - Kitap ekleme, kullanıcı yönetimi
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

## 🔑 Varsayılan Kullanıcı Bilgileri

### Admin Kullanıcısı
- **Kullanıcı bilgileri giriş ekranına eklendi** 


## 📁 Proje Yapısı

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       ├── authOptions.ts    # NextAuth.js konfigürasyonu
│   │   │       └── route.ts          # NextAuth.js API rotası
│   │   ├── register/
│   │   │   └── route.ts              # Kullanıcı kayıt API'si
│   │   └── users/
│   │       ├── route.ts              # Kullanıcı listesi API'si
│   │       └── delete/
│   │           └── route.ts          # Kullanıcı silme API'si
│   ├── cart/
│   │   └── page.tsx                  # Sepet sayfası
│   ├── dashboard/
│   │   └── page.tsx                  # Kitap mağazası ana sayfası
│   ├── login/
│   │   └── page.tsx                  # Giriş/kayıt sayfası
│   ├── order-success/
│   │   └── page.tsx                  # Sipariş başarı sayfası
│   ├── profile/
│   │   └── page.tsx                  # Profil ve admin paneli
│   ├── globals.css                   # Global stiller
│   ├── layout.tsx                    # Ana layout
│   ├── page.tsx                      # Ana sayfa
│   └── providers.tsx                 # NextAuth.js provider
├── components/
│   ├── ConfirmationModal.tsx         # Onay modal bileşeni
│   └── Toast.tsx                     # Bildirim bileşeni
├── contexts/
│   └── ToastContext.tsx              # Bildirim context'i
├── lib/
│   ├── books.ts                      # Kitap yönetimi
│   ├── cart.ts                       # Sepet yönetimi
│   ├── orders.ts                     # Sipariş yönetimi
│   └── users.ts                      # Kullanıcı yönetimi
├── types/
│   └── next-auth.d.ts               # NextAuth.js tip tanımları
└── middleware.ts                     # Sayfa koruma middleware'i
```

## 🎯 Kullanım

### Giriş Yapma ve Kayıt Olma
- `/login` sayfasından mevcut hesabınızla giriş yapın veya yeni hesap oluşturun
- Başarılı girişten sonra dashboard'a yönlendirilirsiniz

### Kitap Mağazası (Dashboard)
- `/dashboard` sayfası sadece giriş yapmış kullanıcılar tarafından görüntülenebilir
- Kitapları inceleyin, sepete ekleyin, miktar güncelleyin
- Sepet durumunu alt barda takip edin

### Sepet Yönetimi
- `/cart` sayfasından sepetinizi görüntüleyin
- Ürün miktarlarını güncelleyin veya ürünleri çıkarın
- Siparişi tamamlayın

### Profil ve Admin Paneli
- `/profile` sayfasından kullanıcı bilgilerinizi görüntüleyin
- Admin kullanıcıları: yeni kitap ekleyin, kullanıcıları silin
- Sipariş geçmişinizi takip edin

### Çıkış Yapma
- Herhangi bir sayfadaki "Çıkış Yap" butonuna tıklayarak çıkış yapabilirsiniz
- Ana sayfaya yönlendirilirsiniz

## 🔒 Güvenlik

- **Middleware** ile sayfa koruması
- **JWT** tabanlı oturum yönetimi
- **Credentials Provider** ile güvenli kimlik doğrulama
- **Admin rol kontrolü** ile yetkilendirme
- **Environment variables** ile hassas bilgi koruması

## 🚀 Production Deployment

1. **Ortam değişkenlerini güncelleyin:**
   - `NEXTAUTH_SECRET` güçlü bir secret kullanın
   - `NEXTAUTH_URL` production URL'inizi kullanın

2. **Build alın:**
   ```bash
   npm run build
   ```

3. **Production sunucusunu başlatın:**
   ```bash
   npm start
   ```

## 📚 Teknolojiler

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** TailwindCSS v4
- **Authentication:** NextAuth.js v4, Credentials Provider
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
3. NextAuth.js dokümantasyonunu inceleyin

## 🔄 Güncellemeler

- **v1.0.0** - İlk sürüm, temel kimlik doğrulama sistemi
- **v1.1.0** - Kitap mağazası özellikleri eklendi
- **v1.2.0** - Sepet yönetimi ve sipariş sistemi
- **v1.3.0** - Admin paneli ve kullanıcı yönetimi
- NextAuth.js v4 desteği
- Credentials provider entegrasyonu
- Modern UI/UX tasarımı
