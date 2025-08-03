import { type NextRequest, NextResponse } from "next/server"
import { verifyCloudProof, type IVerifyResponse, type ISuccessResult } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: ISuccessResult
  action: string
  signal: string | undefined
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as IRequestPayload

  // O APP_ID deve ser o mesmo configurado no MiniKitProvider e no Developer Portal
  // Certifique-se de que esta variável de ambiente esteja definida no Vercel
  const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`

  if (!app_id) {
    console.error("NEXT_PUBLIC_APP_ID is not defined in environment variables.")
    return NextResponse.json(
      { success: false, message: "Server configuration error: APP_ID missing." },
      { status: 500 },
    )
  }

  try {
    const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse

    if (verifyRes.success) {
      // Aqui você pode realizar ações de backend após a verificação bem-sucedida,
      // como marcar o usuário como "verificado" em um banco de dados.
      console.log("Proof verified successfully on backend.")
      return NextResponse.json({ verifyRes, status: 200 })
    } else {
      // Lidar com erros da verificação do World ID (ex: usuário já verificou)
      console.error("World ID verification failed on backend:", verifyRes)
      return NextResponse.json({ verifyRes, status: 400 })
    }
  } catch (error) {
    console.error("Error during backend verification:", error)
    return NextResponse.json({ success: false, message: "Internal server error during verification." }, { status: 500 })
  }
}
