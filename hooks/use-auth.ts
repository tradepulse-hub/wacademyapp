"use client"

import { useState, useEffect, useCallback } from "react"
import { MiniKit, type WalletAuthInput, type MiniAppWalletAuthSuccessPayload } from "@worldcoin/minikit-js"

interface AuthState {
  isAuthenticated: boolean
  walletAddress: string | null
  userName: string | null
  isAuthenticating: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    walletAddress: null,
    userName: null,
    isAuthenticating: false,
  })

  // Carregar estado de autenticação do localStorage ao montar
  useEffect(() => {
    const storedUserName = localStorage.getItem("worldAcademyUserName")
    const storedWalletAddress = localStorage.getItem("worldAcademyWalletAddress")
    const storedIsAuthenticated = localStorage.getItem("worldAcademyIsAuthenticated") === "true"

    setAuthState({
      isAuthenticated: storedIsAuthenticated,
      walletAddress: storedWalletAddress,
      userName: storedUserName,
      isAuthenticating: false,
    })
  }, [])

  // Salvar estado de autenticação no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("worldAcademyIsAuthenticated", authState.isAuthenticated.toString())
    if (authState.walletAddress) {
      localStorage.setItem("worldAcademyWalletAddress", authState.walletAddress)
    } else {
      localStorage.removeItem("worldAcademyWalletAddress")
    }
    if (authState.userName) {
      localStorage.setItem("worldAcademyUserName", authState.userName)
    } else {
      localStorage.removeItem("worldAcademyUserName")
    }
  }, [authState])

  const login = useCallback(async (name: string) => {
    console.log("Attempting login with wallet...")
    const isMiniKitInstalled = MiniKit.isInstalled()
    console.log("MiniKit.isInstalled():", isMiniKitInstalled)

    if (!isMiniKitInstalled) {
      console.error("World App (MiniKit) is not installed. Proceeding without wallet connection.")
      setAuthState({
        isAuthenticated: true,
        walletAddress: null,
        userName: name,
        isAuthenticating: false,
      })
      return { success: true, message: "Logged in without wallet (MiniKit not installed)." }
    }

    setAuthState((prev) => ({ ...prev, isAuthenticating: true }))

    try {
      // 1. Obter nonce do backend
      console.log("Fetching nonce from backend...")
      const nonceRes = await fetch("/api/nonce")
      if (!nonceRes.ok) {
        const errorText = await nonceRes.text()
        throw new Error(`Failed to fetch nonce: ${nonceRes.status} ${nonceRes.statusText} - ${errorText}`)
      }
      const { nonce } = await nonceRes.json()
      console.log("Nonce fetched:", nonce)

      // 2. Chamar walletAuth do MiniKit
      console.log("Calling MiniKit.commandsAsync.walletAuth...")
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: "0", // Opcional
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Expira em 7 dias
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Válido desde 24h atrás
        statement: "Sign in to World Academy to learn and earn!",
      } as WalletAuthInput)

      console.log("MiniKit walletAuth finalPayload:", finalPayload)

      if (finalPayload.status === "error") {
        console.error("Wallet Auth failed:", finalPayload)
        setAuthState((prev) => ({ ...prev, isAuthenticating: false }))
        return { success: false, message: finalPayload.message || "Wallet Auth failed." }
      }

      // 3. Enviar payload para verificação no backend
      console.log("Sending payload to backend for SIWE verification...")
      const verifyRes = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload as MiniAppWalletAuthSuccessPayload, nonce }),
      })

      const verifyData = await verifyRes.json()
      console.log("Backend SIWE verification response:", verifyData)

      if (verifyRes.ok && verifyData.status === "success" && verifyData.isValid) {
        setAuthState({
          isAuthenticated: true,
          walletAddress: verifyData.walletAddress,
          userName: name,
          isAuthenticating: false,
        })
        console.log("Wallet connected and verified successfully!")
        return { success: true, message: "Wallet connected and verified!" }
      } else {
        console.error("Backend SIWE verification failed:", verifyData)
        setAuthState((prev) => ({ ...prev, isAuthenticating: false }))
        return { success: false, message: verifyData.message || "Backend verification failed." }
      }
    } catch (error) {
      console.error("Error during wallet authentication process:", error)
      setAuthState((prev) => ({ ...prev, isAuthenticating: false }))
      return { success: false, message: (error as Error).message || "An unexpected error occurred." }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      setAuthState({
        isAuthenticated: false,
        walletAddress: null,
        userName: null,
        isAuthenticating: false,
      })
      // Limpar localStorage no cliente também
      localStorage.removeItem("worldAcademyUserName")
      localStorage.removeItem("worldAcademyWalletAddress")
      localStorage.removeItem("worldAcademyIsAuthenticated")
      console.log("Logged out successfully.")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }, [])

  return { ...authState, login, logout }
}
