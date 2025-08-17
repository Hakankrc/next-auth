"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function OrderSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const userRole = (session.user as any)?.role || "user";
  const isAdmin = userRole === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Sipariş Başarılı!</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Merhaba, {session.user?.name || session.user?.email}
                {isAdmin && (
                  <span className="ml-2 text-sm text-red-600 font-medium">(Admin)</span>
                )}
              </span>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Kitap Mağazası
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Success Message */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Siparişiniz Başarıyla Alındı!
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Teşekkür ederiz! Siparişiniz başarıyla işlendi.
          </p>
          <p className="mt-2 text-gray-500">
            Sipariş detaylarını profil sayfanızdan görüntüleyebilirsiniz.
          </p>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200"
              >
                Kitap Mağazasına Git
              </button>
            <button
              onClick={() => router.push('/profile')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200"
            >
              Profilimi Görüntüle
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sipariş Hakkında
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Siparişiniz sistemimize kaydedildi</p>
                <p>• Bu bir test uygulamasıdır, gerçek ödeme yapılmamıştır</p>
                <p>• Sipariş geçmişinizi profil sayfanızdan takip edebilirsiniz</p>
                <p>• Herhangi bir sorun yaşarsanız admin ile iletişime geçin</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
