import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/services/supabase/server";

export async function POST() {
  return NextResponse.json({ status: "success" }, { status: 200 });
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    const cookieStore = await cookies();
    cookieStore.delete("__session");
  } catch (err) {
    console.error("Session delete error", err);
  }
  return NextResponse.json({ status: "success" }, { status: 200 });
}
