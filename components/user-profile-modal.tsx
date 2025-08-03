"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/use-i18n"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react" // Import useEffect

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

  // Log the userName when the modal opens or userName changes
  useEffect(() => {
    if (isOpen) {
      console.log("UserProfileModal: Current userName from useAuth:", userName)
    }
  }, [isOpen, userName])

  const handleConnectWallet = async () => {
    if (userName) {
      setLoginStatusMessage(null) // Clear previous message
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
    setLoginStatusMessage(null) // Clear message on disconnect
    setLoginStatusType(null)
    console.log("Wallet disconnected.")
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
            <h3 className="text-lg font-semibold">{t("way_balance")}</h3>
            {isAuthenticated && walletAddress ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-base text-gray-800 font-medium">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
                <p className="text-base text-gray-800 font-medium">0 WAY</p> {/* Placeholder for WAY balance */}
                <Button onClick={handleDisconnectWallet} className="bg-red-600 hover:bg-red-700 text-white mt-2">
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isAuthenticating || !userName} // Button is disabled if userName is null/empty
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
