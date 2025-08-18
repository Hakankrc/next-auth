// Sepet yönetimi
export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

// Global cart array'i yönetimi
declare global {
  var carts: Cart[];
}

// Global cart array'i başlat
if (!global.carts) {
  global.carts = [];
}

// Kullanıcının sepetini getir
export function getCart(userId: string): Cart {
  let cart = global.carts.find(c => c.userId === userId);
  if (!cart) {
    cart = { userId, items: [] };
    global.carts.push(cart);
  }
  return cart;
}

// Sepete kitap ekle
export function addToCart(userId: string, bookId: string, quantity: number = 1): Cart {
  const cart = getCart(userId);
  const existingItem = cart.items.find(item => item.bookId === bookId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ bookId, quantity });
  }
  
  return cart;
}

// Sepetten kitap çıkar
export function removeFromCart(userId: string, bookId: string): Cart {
  const cart = getCart(userId);
  cart.items = cart.items.filter(item => item.bookId !== bookId);
  return cart;
}

// Sepet miktarını güncelle
export function updateCartQuantity(userId: string, bookId: string, quantity: number): Cart {
  const cart = getCart(userId);
  const item = cart.items.find(item => item.bookId === bookId);
  
  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.bookId !== bookId);
    } else {
      item.quantity = quantity;
    }
  }
  
  return cart;
}

// Sepeti temizle
export function clearCart(userId: string): Cart {
  const cart = getCart(userId);
  cart.items = [];
  return cart;
}

// Sepet toplam fiyatını hesapla
export function getCartTotal(userId: string, books: any[]): number {
  const cart = getCart(userId);
  return cart.items.reduce((total, item) => {
    const book = books.find(b => b.id === item.bookId);
    return total + (book ? book.price * item.quantity : 0);
  }, 0);
}


