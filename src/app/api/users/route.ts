import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { getUsers } from "@/lib/users";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
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
