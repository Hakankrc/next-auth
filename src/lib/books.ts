// Global books array'i yönetimi
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
}

// Global books array - development server'da memory space ayrımını önlemek için
declare global {
  var books: Book[];
}

// Global books array'i başlat - Default 3 kitap
if (!global.books) {
  global.books = [
    {
      id: "1",
      title: "Futbol Zekası",
      author: "Hakan Kırca",
      price: 100
    },
    {
      id: "2",
      title: "Kalp Şifası",
      author: "Ateş Hekimoğlu",
      price: 150
    },
    {
      id: "3",
      title: "Deha",
      author: "Devran Karan",
      price: 200
    }
  ];
}

// Tüm kitapları getir
export function getBooks(): Book[] {
  return global.books;
}

// ID'ye göre kitap getir
export function getBookById(id: string): Book | undefined {
  return global.books.find(book => book.id === id);
}

// Yeni kitap ekle (admin için)
export function addBook(book: Omit<Book, 'id'>): Book {
  const newBook = {
    ...book,
    id: Date.now().toString()
  };
  global.books.push(newBook);
  return newBook;
}

// Kitap güncelle (admin için)
export function updateBook(id: string, updates: Partial<Book>): Book | null {
  const bookIndex = global.books.findIndex(book => book.id === id);
  if (bookIndex === -1) return null;
  
  global.books[bookIndex] = { ...global.books[bookIndex], ...updates };
  return global.books[bookIndex];
}

// Kitap sil (admin için)
export function deleteBook(id: string): boolean {
  const bookIndex = global.books.findIndex(book => book.id === id);
  if (bookIndex === -1) return false;
  
  global.books.splice(bookIndex, 1);
  return true;
}

