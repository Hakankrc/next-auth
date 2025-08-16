"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Kullanıcı adı veya şifre hatalı!");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Giriş yapılırken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Basit validasyon
      if (!formData.username || !formData.password || !formData.email || !formData.name) {
        setError("Tüm alanları doldurun!");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Şifre en az 6 karakter olmalıdır!");
        setIsLoading(false);
        return;
      }

      // API'ye kayıt isteği gönder
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Kayıt olurken bir hata oluştu!");
        setIsLoading(false);
        return;
      }

      // Başarılı kayıt sonrası giriş yap
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Kayıt başarılı ama giriş yapılamadı!");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Kayıt olurken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ username: "", password: "", email: "", name: "" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isLoginMode ? "Hoş Geldiniz" : "Kayıt Ol"}
          </h1>
          <p className="text-gray-600">
            {isLoginMode 
              ? "Hesabınıza giriş yapmak için devam edin"
              : "Yeni hesap oluşturmak için bilgilerinizi girin"
            }
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
            {!isLoginMode && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ornek@email.com"
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Kullanıcı adınız"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Şifreniz"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isLoginMode ? "Giriş yapılıyor..." : "Kayıt olunuyor..."}</span>
                </div>
              ) : (
                <span>{isLoginMode ? "Giriş Yap" : "Kayıt Ol"}</span>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={toggleMode}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              {isLoginMode 
                ? "Hesabınız yok mu? Kayıt olun" 
                : "Zaten hesabınız var mı? Giriş yapın"
              }
            </button>
          </div>
          
          {/* Admin Kullanıcı Bilgileri - Sadece giriş modunda göster */}
          {isLoginMode && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Admin Giriş Bilgileri
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Kullanıcı Adı:</span> kayra</p>
                <p><span className="font-medium">Şifre:</span> kayra123</p>
                <p><span className="font-medium">E-posta:</span> kayraExport@merhaba.com</p>
                <p><span className="font-medium">Ad Soyad:</span> Kayra Export</p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {isLoginMode ? "Giriş yaparak" : "Kayıt olarak"}{" "}
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
