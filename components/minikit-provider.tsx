"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { type ReactNode, useEffect } from "react"

export function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === "undefined") return

    try {
      // Configurar o MiniKit apenas se não estiver já instalado
      if (!MiniKit.isInstalled()) {
        MiniKit.install({
          // Use o App ID do seu Developer Portal
          appId: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
          enableTelemetry: true,
        })
        console.log("MiniKit installed successfully")
      } else {
        console.log("MiniKit already installed")
      }
    } catch (error) {
      console.error("Error installing MiniKit:", error)
    }
  }, [])

  return <>{children}</>
}
