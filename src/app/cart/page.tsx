"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } from "@/lib/cart";
import { getBooks } from "@/lib/books";
import { addOrder } from "@/lib/orders";
import { signOut } from "next-auth/react";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
}

interface CartItem {
  bookId: string;
  quantity: number;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && (session.user as any)?.id) {
      const allBooks = getBooks();
      setBooks(allBooks);
      
      const userCart = getCart((session.user as any).id as string);
      setCart(userCart.items);
      setCartTotal(getCartTotal((session.user as any).id as string, allBooks));
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleRemoveFromCart = (bookId: string) => {
    if (session?.user && (session.user as any)?.id) {
      removeFromCart((session.user as any).id as string, bookId);
      const userCart = getCart((session.user as any).id as string);
      setCart(userCart.items);
      setCartTotal(getCartTotal((session.user as any).id as string, books));
    }
  };

  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    if (session?.user && (session.user as any)?.id) {
      updateCartQuantity((session.user as any).id as string, bookId, quantity);
      const userCart = getCart((session.user as any).id as string);
      setCart(userCart.items);
      setCartTotal(getCartTotal((session.user as any).id as string, books));
    }
  };

  const handleCheckout = async () => {
    if (session?.user && (session.user as any)?.id) {
      setIsCheckingOut(true);
      
      try {
        // Siparişi oluştur
        const orderItems = cart.map(item => {
          const book = books.find(b => b.id === item.bookId);
          return {
            bookId: item.bookId,
            title: book?.title || '',
            author: book?.author || '',
            price: book?.price || 0,
            quantity: item.quantity
          };
        });

        await addOrder({
          userId: (session.user as any).id,
          items: orderItems,
          total: cartTotal,
          status: 'completed',
          orderDate: new Date().toISOString()
        });

        // Sepeti temizle
        clearCart((session.user as any).id);
        
        // Başarı sayfasına yönlendir
        router.push('/order-success');
             } catch (error) {
         showToast('Sipariş oluşturulurken bir hata oluştu!', 'error');
         setIsCheckingOut(false);
       }
    }
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
    return null;
  }

  const userRole = (session.user as any)?.role || "user";
  const isAdmin = userRole === "admin";

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ← Kitap Mağazasına Dön
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Sepet</h1>
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

        {/* Empty Cart */}
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Sepetiniz boş</h3>
            <p className="mt-2 text-gray-500">Alışverişe başlamak için Kitap Mağazasına gidin.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Kitap Mağazasına Git
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Dashboard'a Dön
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Sepet</h1>
              <span className="text-sm text-gray-500">({cart.length} ürün)</span>
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
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Cart Items */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sepet Ürünleri</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {cart.map((item) => {
              const book = books.find(b => b.id === item.bookId);
              if (!book) return null;
              
              return (
                <div key={item.bookId} className="px-6 py-4 flex items-center space-x-4">
                  {/* Book Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center rounded">
                      <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 9.246 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-500">Yazar: {book.author}</p>
                    <p className="text-lg font-semibold text-indigo-600">{book.price} ₺</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleUpdateQuantity(book.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium text-gray-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(book.id, item.quantity + 1)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Total Price for this item */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {(book.price * item.quantity).toFixed(2)} ₺
                    </p>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromCart(book.id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Cart Summary */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-lg text-gray-700">
                <span className="font-medium">Toplam:</span> {cartTotal.toFixed(2)} ₺
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Siparişi Tamamla</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
