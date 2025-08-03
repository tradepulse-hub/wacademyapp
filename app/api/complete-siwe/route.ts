import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { type MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export const POST = async (req: NextRequest) => {
  const { payload, nonce }: IRequestPayload = await req.json()

  const siweCookie = cookies().get("siwe")?.value

  if (nonce !== siweCookie) {
    return NextResponse.json(
      {
        status: "error",
        isValid: false,
        message: "Invalid nonce",
      },
      { status: 400 },
    )
  }

  try {
    const validMessage = await verifySiweMessage(payload, nonce)
    // Em uma aplicação real, você salvaria o estado de autenticação do usuário aqui (ex: no banco de dados)
    // e talvez emitiria um token de sessão.
    return NextResponse.json(
      {
        status: "success",
        isValid: validMessage.isValid,
        walletAddress: payload.address, // Retorna o endereço da carteira para o cliente
      },
      { status: 200 },
    )
  } catch (error) {
    const err = error as Error
    console.error("Error verifying SIWE message:", err)
    return NextResponse.json(
      {
        status: "error",
        isValid: false,
        message: err.message,
      },
      { status: 500 },
    )
  }
}
