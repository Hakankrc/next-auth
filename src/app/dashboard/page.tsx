"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { getBooks } from "@/lib/books";
import { getCart, addToCart, removeFromCart, updateCartQuantity, getCartTotal } from "@/lib/cart";

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);



  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && (session.user as any)?.id) {
      // Kitapları yükle
      const allBooks = getBooks();
      setBooks(allBooks);
      
      // Sepeti yükle
      const userCart = getCart((session.user as any).id as string);
      setCart(userCart.items);
      setCartTotal(getCartTotal((session.user as any).id as string, allBooks));
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleAddToCart = (bookId: string) => {
    if (session?.user && (session.user as any)?.id) {
      addToCart((session.user as any).id as string, bookId);
      const userCart = getCart((session.user as any).id as string);
      setCart(userCart.items);
      setCartTotal(getCartTotal((session.user as any).id as string, books));
      
      const book = books.find(b => b.id === bookId);
      if (book) {
        showToast(`${book.title} sepete eklendi!`, 'success');
      }
    }
  };

  const handleRemoveFromCart = (bookId: string) => {
    if (session?.user && (session.user as any)?.id) {
      removeFromCart((session.user as any).id as string, bookId);
      const userCart = getCart((session.user as any).id as string);
      setCart(userCart.items);
      setCartTotal(getCartTotal((session.user as any).id as string, books));
      
      const book = books.find(b => b.id === bookId);
      if (book) {
        showToast(`${book.title} sepetten çıkarıldı!`, 'info');
      }
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

  const getCartItemQuantity = (bookId: string): number => {
    const item = cart.find(item => item.bookId === bookId);
    return item ? item.quantity : 0;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Kitap Mağazası</h1>
              {isAdmin && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Merhaba, {session.user?.name || session.user?.email}
                {isAdmin && (
                  <span className="ml-2 text-sm text-red-600 font-medium">(Admin)</span>
                )}
              </span>
              
              {/* Sepete Git Butonu */}
              <button
                onClick={() => router.push('/cart')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>Sepete Git ({cart.length} ürün)</span>
              </button>
              
              {/* Profil Butonu */}
              <button
                onClick={() => router.push('/profile')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Profil
              </button>
              
              {/* Çıkış Yap Butonu */}
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Kitap Mağazası Başlığı */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Kitap Mağazası
            </h2>
            <p className="text-gray-600">
              En yeni ve popüler kitapları keşfedin
            </p>
          </div>



          {/* Kitaplar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 9.246 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz kitap yok</h3>
                  <p className="mt-1 text-sm text-gray-500">Kitaplar yükleniyor...</p>
                </div>
              </div>
            ) : (
              books.map((book) => {
                const cartQuantity = getCartItemQuantity(book.id);
                const isInCart = cartQuantity > 0;
                
                return (
                  <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    {/* Kitap Resmi */}
                    <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                      <svg className="w-20 h-20 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 9.246 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                      </svg>
                    </div>
                    
                    {/* Kitap Bilgileri */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        <span className="font-medium">Yazar:</span> {book.author}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-indigo-600">
                          {book.price} ₺
                        </span>
                        {isInCart && (
                          <span className="text-sm text-green-600 font-medium">
                            Sepette: {cartQuantity} adet
                          </span>
                        )}
                      </div>
                      
                      {/* Sepet İşlemleri */}
                      <div className="space-y-2">
                        {!isInCart ? (
                          <button
                            onClick={() => handleAddToCart(book.id)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            Sepete Ekle
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(book.id, cartQuantity - 1)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center font-medium">
                              {cartQuantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(book.id, cartQuantity + 1)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                              +
                            </button>
                          </div>
                        )}
                        
                        {isInCart && (
                          <button
                            onClick={() => handleRemoveFromCart(book.id)}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            Sepetten Çıkar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

                  </div>
        
        {/* Bottom bar için alt boşluk */}
        {cart.length > 0 && <div className="h-20"></div>}
      </main>

             {/* Sabit Sepet Bottom Bar */}
       {cart.length > 0 && (
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
           <div className="max-w-7xl mx-auto px-4 py-2">
             <div className="flex items-center justify-center">
               <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                   <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                   </svg>
                   <span className="text-sm font-medium text-gray-700">
                     {cart.length} ürün
                   </span>
                 </div>
                 <div className="text-sm text-gray-600">
                   Toplam: <span className="font-semibold text-indigo-600">{cartTotal} ₺</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
