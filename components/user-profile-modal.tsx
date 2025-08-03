"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/use-i18n"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { Loader2, Wallet, RefreshCw } from "lucide-react"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  level: number
  xpPercentage: number
}

export default function UserProfileModal({ isOpen, onClose, level, xpPercentage }: UserProfileModalProps) {
  const { t } = useI18n()
  const { isAuthenticated, walletAddress, userName, login, logout, isAuthenticating } = useAuth()
  const [loginStatusMessage, setLoginStatusMessage] = useState<string | null>(null)
  const [loginStatusType, setLoginStatusType] = useState<"success" | "error" | null>(null)
  const [wayBalance, setWayBalance] = useState<string | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)

  // Function to fetch WAY balance
  const fetchWAYBalance = async (address: string) => {
    setIsLoadingBalance(true)
    setBalanceError(null)

    try {
      console.log(`🔍 Fetching WAY balance for: ${address}`)

      const response = await fetch(`/api/get-way-balance?address=${address}`)
      const data = await response.json()

      if (data.success) {
        setWayBalance(data.balance)
        console.log(`✅ WAY balance loaded: ${data.balance}`)
      } else {
        throw new Error(data.error || "Failed to fetch balance")
      }
    } catch (error) {
      console.error("❌ Error fetching WAY balance:", error)
      setBalanceError("Failed to load balance")
      setWayBalance(null)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  // Load balance when modal opens and wallet is connected
  useEffect(() => {
    if (isOpen && isAuthenticated && walletAddress) {
      fetchWAYBalance(walletAddress)
    } else {
      setWayBalance(null)
      setBalanceError(null)
    }
  }, [isOpen, isAuthenticated, walletAddress])

  // Log the userName when the modal opens or userName changes
  useEffect(() => {
    if (isOpen) {
      console.log("UserProfileModal: Current userName from useAuth:", userName)
    }
  }, [isOpen, userName])

  const handleConnectWallet = async () => {
    if (userName) {
      setLoginStatusMessage(null)
      setLoginStatusType(null)
      console.log("UserProfileModal: Attempting to connect wallet with userName:", userName)
      const result = await login(userName)
      if (result.success) {
        setLoginStatusMessage(result.message)
        setLoginStatusType("success")
      } else {
        setLoginStatusMessage(result.message)
        setLoginStatusType("error")
      }
    } else {
      const message = t("user_name_missing_for_wallet_connect")
      setLoginStatusMessage(message)
      setLoginStatusType("error")
      console.warn("UserProfileModal: User name not available for wallet connection. Button is disabled.")
    }
  }

  const handleDisconnectWallet = async () => {
    await logout()
    setLoginStatusMessage(null)
    setLoginStatusType(null)
    setWayBalance(null)
    setBalanceError(null)
    console.log("Wallet disconnected.")
  }

  const handleRefreshBalance = () => {
    if (walletAddress) {
      fetchWAYBalance(walletAddress)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{t("user_profile_title")}</DialogTitle>
          <DialogDescription className="text-center text-gray-600">{t("user_profile_description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-xl font-semibold">
              {t("name")}: {userName || "Guest"}
            </h3>
            <div className="w-full flex flex-col items-center gap-1">
              <span className="text-sm text-gray-700">
                {t("level")} {level}
              </span>
              <Progress value={xpPercentage} className="w-full h-3 bg-gray-200" indicatorClassName="bg-yellow-400" />
              <span className="text-xs text-gray-500">{xpPercentage.toFixed(2)}% XP</span>
            </div>
          </div>

          {/* Wallet Balance Section */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">{t("way_balance")}</h3>
            </div>

            {isAuthenticated && walletAddress ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="bg-gray-50 p-3 rounded-lg w-full">
                  <p className="text-xs text-gray-500 text-center mb-1">Wallet Address</p>
                  <p className="text-sm text-gray-800 font-mono text-center">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 mb-1">WAY Token Balance</p>
                      {isLoadingBalance ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm text-blue-600">Loading...</span>
                        </div>
                      ) : balanceError ? (
                        <p className="text-sm text-red-600">{balanceError}</p>
                      ) : (
                        <p className="text-lg font-bold text-blue-800">
                          {wayBalance ? `${Number.parseFloat(wayBalance).toLocaleString()} WAY` : "0 WAY"}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleRefreshBalance}
                      variant="ghost"
                      size="sm"
                      disabled={isLoadingBalance}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleDisconnectWallet} className="bg-red-600 hover:bg-red-700 text-white mt-2">
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isAuthenticating || !userName}
              >
                {isAuthenticating ? "Connecting..." : t("connect_wallet")}
              </Button>
            )}

            {loginStatusMessage && (
              <p
                className={`mt-2 text-center text-sm ${loginStatusType === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {loginStatusMessage}
              </p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-center">{t("achievements")}</h3>
            <div className="h-24 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-sm">
              {t("no_achievements_yet")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
