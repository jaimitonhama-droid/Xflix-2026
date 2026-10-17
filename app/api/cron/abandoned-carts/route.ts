import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  return NextResponse.json({ message: "Nenhum carrinho abandonado encontrado." });
}
