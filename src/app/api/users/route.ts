import { NextResponse } from "next/server";
import { getUsers } from "@/lib/users";

export async function GET() {
  try {
    const users = getUsers();
    
    // Admin olmayan kullanıcıları filtrele
    const nonAdminUsers = users.filter(user => user.role !== 'admin');
    
    // Şifreleri gizle
    const usersWithoutPasswords = nonAdminUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return NextResponse.json({
      users: usersWithoutPasswords,
      total: usersWithoutPasswords.length
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Kullanıcılar getirilemedi" },
      { status: 500 }
    );
  }
}
