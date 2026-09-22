import { NextResponse } from "next/server";
import { adminAuth } from "@/services/firebase/admin";

export async function GET() {
  try {
    const email = "keylancossa@gmail.com";
    
    // Check if user exists without catch
    const user = await adminAuth.getUserByEmail(email);
    
    // Change password to 12345678
    await adminAuth.updateUser(user.uid, {
      password: "password123"
    });
    
    return NextResponse.json({ 
      status: "Usuário encontrado e senha redefinida!",
      email: user.email,
      nova_senha: "password123",
      uid: user.uid
    });

  } catch (error: any) {
    return NextResponse.json({ error_message: error.message, error_code: error.code }, { status: 500 });
  }
}
