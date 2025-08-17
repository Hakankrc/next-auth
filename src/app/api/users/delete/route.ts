import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/lib/users";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID gerekli" },
        { status: 400 }
      );
    }

    const success = deleteUser(userId);
    
    if (success) {
      return NextResponse.json({
        message: "Kullanıcı başarıyla silindi",
        success: true
      });
    } else {
      return NextResponse.json(
        { error: "Kullanıcı silinemedi! Admin kendini silemez." },
        { status: 400 }
      );
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
