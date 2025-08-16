// Global users array'i yönetimi
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Global users array - development server'da memory space ayrımını önlemek için
declare global {
  var users: User[];
}

// Global users array'i başlat
if (!global.users) {
  global.users = [
    {
      id: "1",
      username: "kayra",
      password: "kayra123",
      name: "Kayra Export",
      email: "kayraExport@merhaba.com",
      role: "admin"
    }
  ];
}

// Users array'ini getir
export function getUsers(): User[] {
  return global.users;
}

// Yeni kullanıcı ekle (sadece user rolü ile)
export function addUser(user: Omit<User, 'id' | 'role'>): User {
  const newUser = {
    ...user,
    id: Date.now().toString(),
    role: 'user' as const // Yeni kayıt olan her kullanıcı user rolünde
  };
  global.users.push(newUser);
  
  // Debug için console.log ekle
  console.log("Yeni kullanıcı eklendi:", newUser.username, "Rol:", newUser.role);
  console.log("Toplam kullanıcı sayısı:", global.users.length);
  console.log("Mevcut kullanıcılar:", global.users.map(u => ({ username: u.username, id: u.id, role: u.role })));
  
  return newUser;
}

// Kullanıcı bul
export function findUser(username: string, password: string): User | undefined {
  // Debug için console.log ekle
  console.log("Kullanıcı aranıyor:", username);
  console.log("Toplam kullanıcı sayısı:", global.users.length);
  console.log("Mevcut kullanıcılar:", global.users.map(u => ({ username: u.username, id: u.id, role: u.role })));
  
  const user = global.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    console.log("Kullanıcı bulundu:", user.username, "Rol:", user.role);
  } else {
    console.log("Kullanıcı bulunamadı:", username);
  }
  
  return user;
}

// Kullanıcı adı kontrolü
export function isUsernameTaken(username: string): boolean {
  return global.users.some(u => u.username === username);
}

// Email kontrolü
export function isEmailTaken(email: string): boolean {
  return global.users.some(u => u.email === email);
}

// Admin kullanıcısı var mı kontrol et
export function hasAdminUser(): boolean {
  return global.users.some(u => u.role === 'admin');
}

// Admin kullanıcısını getir
export function getAdminUser(): User | undefined {
  return global.users.find(u => u.role === 'admin');
}
