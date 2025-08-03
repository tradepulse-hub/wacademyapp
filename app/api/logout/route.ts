import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  cookies().delete("siwe") // Limpa o cookie do nonce SIWE
  cookies().delete("worldAcademySession") // Limpa o cookie de sessão da aplicação

  return NextResponse.json({ message: "Logged out" }, { status: 200 })
}
