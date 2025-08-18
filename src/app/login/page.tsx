"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: ""
  });

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
      [e.target.name]: e.target.value
    });
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
        showToast("Kullanıcı adı veya şifre hatalı!", "error");
        setError("Kullanıcı adı veya şifre hatalı!");
      } else {
        router.push("/dashboard");
      }
    } catch {
      showToast("Giriş yapılırken bir hata oluştu!", "error");
      setError("Giriş yapılırken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Kayıt başarılı! Şimdi giriş yapabilirsiniz.", "success");
        setSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setFormData({ username: "", password: "", name: "", email: "" });
        setIsLoginMode(true);
      } else {
        const errorData = await response.json();
        const msg = errorData.error || errorData.message || "Kayıt olurken bir hata oluştu!";
        showToast(msg, "error");
        setError(msg);
      }
    } catch {
      showToast("Kayıt olurken bir hata oluştu!", "error");
      setError("Kayıt olurken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
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
          {/* Admin Giriş Bilgileri */}
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

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
            {!isLoginMode && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
                    placeholder="Ad Soyad"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
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
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
                placeholder="Kullanıcı adı"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
                placeholder="Şifre (en az 6 karakter)"
              />
            </div>

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

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
                setSuccess("");
                setFormData({ username: "", password: "", name: "", email: "" });
              }}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              {isLoginMode 
                ? "Hesabınız yok mu? Kayıt olun"
                : "Zaten hesabınız var mı? Giriş yapın"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
