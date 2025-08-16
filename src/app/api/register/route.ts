import { NextRequest, NextResponse } from "next/server";
import { addUser, isUsernameTaken, isEmailTaken } from "@/lib/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email, name } = body;

    // Validasyon
    if (!username || !password || !email || !name) {
      return NextResponse.json(
        { error: "Tüm alanlar gerekli" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Kullanıcı adı kontrolü
    if (isUsernameTaken(username)) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Email kontrolü
    if (isEmailTaken(email)) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const newUser = addUser({ username, password, email, name });

    // Şifreyi gizle
    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as { password?: string }).password;

    return NextResponse.json({
      message: "Kullanıcı başarıyla oluşturuldu",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
