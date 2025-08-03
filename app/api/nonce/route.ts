import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export function GET() {
  // Gera um nonce aleatório e o armazena em um cookie HTTP-only para segurança
  const nonce: string = crypto.randomUUID().replace(/-/g, "")
  cookies().set("siwe", nonce, { secure: process.env.NODE_ENV === "production", httpOnly: true, path: "/" })
  return NextResponse.json({ nonce })
}
