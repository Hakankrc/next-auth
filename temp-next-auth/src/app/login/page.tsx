"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("auth0", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hoş Geldiniz
          </h1>
          <p className="text-gray-600">
            Hesabınıza giriş yapmak için devam edin
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Giriş yapılıyor...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Auth0 ile Giriş Yap</span>
                </div>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Giriş yaparak{" "}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
                Kullanım Şartları
              </a>{" "}
              ve{" "}
              <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                Gizlilik Politikası
              </a>{" "}
              kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


