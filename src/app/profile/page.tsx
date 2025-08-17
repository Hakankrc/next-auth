"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getOrders } from "@/lib/orders";
import { addBook } from "@/lib/books";
import { getUsers } from "@/lib/users";
import { signOut } from "next-auth/react";
import { useToast } from "@/contexts/ToastContext";
import ConfirmationModal from "@/components/ConfirmationModal";

interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: ''
  });
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && (session.user as any)?.id) {
      const userOrders = getOrders((session.user as any).id as string);
      setOrders(userOrders);
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleAddBook = async () => {
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.price.trim()) {
      showToast('Lütfen tüm alanları doldurun!', 'warning');
      return;
    }

    const price = parseFloat(newBook.price);
    if (isNaN(price) || price <= 0) {
      showToast('Lütfen geçerli bir fiyat girin!', 'warning');
      return;
    }

    setIsAddingBook(true);
    try {
      addBook({
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        price: price
      });
      
      // Formu temizle
      setNewBook({ title: '', author: '', price: '' });
      setShowAddBookModal(false);
      showToast('Kitap başarıyla eklendi!', 'success');
    } catch (error) {
      showToast('Kitap eklenirken hata oluştu!', 'error');
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Confirmation modal'ı göster
    setUserToDelete(userId);
    setShowConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeletingUser(true);
    try {
      // API route üzerinden kullanıcı sil
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userToDelete })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // API'den güncel kullanıcı listesini al
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
        showToast('Kullanıcı başarıyla silindi!', 'success');
      } else {
        showToast(data.error || 'Kullanıcı silinemedi!', 'error');
      }
    } catch (error) {
      showToast('Kullanıcı silinirken hata oluştu!', 'error');
    } finally {
      setIsDeletingUser(false);
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const openDeleteUserModal = async () => {
    setShowDeleteUserModal(true);
    
    try {
      // API route'dan kullanıcıları getir
      const response = await fetch('/api/users');
      const data = await response.json();
      
      setUsers(data.users || []);
    } catch (error) {
      setUsers([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <button
                onClick={() => router.push('/dashboard')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Kitap Mağazasına Dön
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100">
                  <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {session.user?.name || 'İsimsiz Kullanıcı'}
                </h2>
                <p className="text-gray-600">{session.user?.email}</p>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isAdmin 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isAdmin ? 'Admin' : 'Kullanıcı'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Toplam Sipariş:</span>
                    <span className="font-medium text-gray-900">{orders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Toplam Harcama:</span>
                    <span className="font-medium text-gray-900">
                      {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)} ₺
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Üyelik Tarihi:</span>
                    <span className="font-medium text-gray-900">Bugün</span>
                  </div>
                </div>
                
                {/* Admin Özel Butonları */}
                {isAdmin && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Admin Yetkileri</h4>
                                         <button
                       onClick={() => setShowAddBookModal(true)}
                       className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 mb-3"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                       </svg>
                       <span>Satışa Kitap Ekle</span>
                     </button>
                     
                     <button
                       onClick={openDeleteUserModal}
                       className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                       <span>Kullanıcı Sil</span>
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Geçmiş Satın Alımlar
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tüm siparişlerinizi buradan takip edebilirsiniz
                </p>
              </div>
              
              {orders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Henüz sipariş yok</h3>
                  <p className="mt-2 text-gray-500">İlk siparişinizi vermek için Kitap Mağazasına gidin.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Kitap Mağazasına Git
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <div key={order.id} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Sipariş #{order.id.slice(-6)}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-indigo-600">
                            {order.total.toFixed(2)} ₺
                          </span>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status === 'completed' ? 'Tamamlandı' : 
                               order.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{item.title}</span>
                              <span className="text-gray-500 ml-2">({item.author})</span>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-600">
                              <span>{item.quantity} adet</span>
                              <span>{item.price} ₺</span>
                              <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ₺</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Kitap Ekleme Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Yeni Kitap Ekle</h3>
              <button
                onClick={() => setShowAddBookModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Kitap Adı *
                </label>
                                 <input
                   type="text"
                   id="bookTitle"
                   value={newBook.title}
                   onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
                   placeholder="Kitap adını girin"
                 />
              </div>
              
              <div>
                <label htmlFor="bookAuthor" className="block text-sm font-medium text-gray-700 mb-1">
                  Yazar *
                </label>
                                 <input
                   type="text"
                   id="bookAuthor"
                   value={newBook.author}
                   onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
                   placeholder="Yazar adını girin"
                 />
              </div>
              
              <div>
                <label htmlFor="bookPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat (₺) *
                </label>
                                 <input
                   type="number"
                   id="bookPrice"
                   value={newBook.price}
                   onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
                   placeholder="0.00"
                   min="0"
                   step="0.01"
                 />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowAddBookModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                İptal
              </button>
              <button
                onClick={handleAddBook}
                disabled={isAddingBook}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isAddingBook ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Ekleniyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Kitap Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>
                 </div>
       )}

       {/* Kullanıcı Silme Modal */}
       {showDeleteUserModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-medium text-gray-900">Kullanıcı Sil</h3>
               <button
                 onClick={() => setShowDeleteUserModal(false)}
                 className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             
                           {users.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Silinecek kullanıcı yok</h3>
                  <p className="mt-2 text-gray-500">Şu anda sistemde sadece admin kullanıcısı bulunuyor.</p>
                  
                  
                </div>
              ) : (
               <div className="space-y-3">
                 <div className="text-sm text-gray-600 mb-4">
                   <p>⚠️ <strong>Dikkat:</strong> Kullanıcı silindikten sonra geri alınamaz!</p>
                   <p>📝 Admin kullanıcıları silinemez.</p>
                 </div>
                 
                 {users.map((user) => (
                   <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                     <div className="flex-1">
                       <div className="flex items-center space-x-3">
                         <div className="flex-shrink-0">
                           <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                             <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                             </svg>
                           </div>
                         </div>
                         <div>
                           <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                           <p className="text-xs text-gray-500">{user.email}</p>
                           <p className="text-xs text-gray-500">@{user.username}</p>
                         </div>
                       </div>
                     </div>
                     
                     <button
                       onClick={() => handleDeleteUser(user.id)}
                       disabled={isDeletingUser}
                       className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                     >
                       {isDeletingUser ? (
                         <>
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                           <span>Siliniyor...</span>
                         </>
                       ) : (
                         <>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                           <span>Sil</span>
                         </>
                       )}
                     </button>
                   </div>
                 ))}
               </div>
             )}
             
             <div className="mt-6 flex justify-end">
               <button
                 onClick={() => setShowDeleteUserModal(false)}
                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
               >
                 Kapat
               </button>
             </div>
           </div>
         </div>
               )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Kullanıcı Silme Onayı"
          message="Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
          confirmText="Evet, Sil"
          cancelText="İptal"
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
          type="danger"
        />
      </div>
    );
  }
