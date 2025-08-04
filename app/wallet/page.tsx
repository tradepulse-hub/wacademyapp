"use client"

import MiniWallet from "@/components/mini-wallet"

export default function WalletPage() {
  // Mock wallet address for demonstration purposes
  const mockWalletAddress = "0xMockWalletAddress1234567890abcdef"

  // These functions are not used in this mocked version, but kept for interface consistency
  const handleMinimize = () => {
    console.log("Minimize action (mocked)")
  }

  const handleDisconnect = () => {
    console.log("Disconnect action (mocked)")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <MiniWallet walletAddress={mockWalletAddress} onMinimize={handleMinimize} onDisconnect={handleDisconnect} />
    </div>
  )
}
