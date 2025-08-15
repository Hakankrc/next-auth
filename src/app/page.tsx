import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">NextAuth.js App</h1>
            <nav className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Giriş Yap
              </Link>
              <Link
                href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            NextAuth.js ile
            <span className="text-indigo-600"> Güvenli Kimlik Doğrulama</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Modern web uygulamaları için güvenli, özelleştirilebilir ve kullanıcı dostu 
            kimlik doğrulama sistemi. Auth0 entegrasyonu ile profesyonel çözümler.
          </p>
          
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200"
            >
              Hemen Başla
            </Link>
            <Link
              href="/dashboard"
              className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200"
            >
              Demo Görüntüle
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Güvenli</h3>
            <p className="text-gray-600">
              Endüstri standardı güvenlik protokolleri ile korunan kimlik doğrulama sistemi.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hızlı</h3>
            <p className="text-gray-600">
              Optimize edilmiş performans ile hızlı yükleme ve yanıt süreleri.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı Dostu</h3>
            <p className="text-gray-600">
              Modern ve sezgisel kullanıcı arayüzü ile kolay kullanım deneyimi.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            
          </div>
        </div>
      </footer>
    </div>
  );
}
