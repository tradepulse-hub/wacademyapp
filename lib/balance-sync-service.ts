// Serviço para sincronização de saldos de tokens
class BalanceSyncService {
  private static instance: BalanceSyncService

  static getInstance(): BalanceSyncService {
    if (!BalanceSyncService.instance) {
      BalanceSyncService.instance = new BalanceSyncService()
    }
    return BalanceSyncService.instance
  }

  updateWAYBalance(walletAddress: string, balance: number): void {
    try {
      console.log(`🔄 Updating WAY balance: ${balance.toLocaleString()} WAY`)

      const balanceStr = balance.toString()
      localStorage.setItem(`way_balance_${walletAddress}`, balanceStr)
      localStorage.setItem("current_way_balance", balanceStr)
      localStorage.setItem("way_balance_timestamp", Date.now().toString())

      // Dispatch events
      const event = new CustomEvent("way_balance_updated", {
        detail: { walletAddress, wayBalance: balance, timestamp: Date.now() },
      })
      window.dispatchEvent(event)

      console.log(`✅ WAY Balance updated: ${balance.toLocaleString()} WAY`)
    } catch (error) {
      console.error("❌ Error updating WAY balance:", error)
    }
  }

  getCurrentWAYBalance(walletAddress: string): number {
    try {
      const balance =
        localStorage.getItem(`way_balance_${walletAddress}`) || localStorage.getItem("current_way_balance")

      if (balance && balance !== "0" && balance !== "null") {
        const numBalance = Number.parseFloat(balance)
        if (!isNaN(numBalance) && numBalance >= 0) {
          console.log(`✅ Found cached WAY balance: ${numBalance}`)
          return numBalance
        }
      }

      console.log("📊 No cached WAY balance found")
      return 0
    } catch (error) {
      console.error("❌ Error getting WAY balance:", error)
      return 0
    }
  }

  async forceBalanceUpdate(walletAddress: string): Promise<number> {
    try {
      console.log("🔄 Force balance update - fetching real WAY balance...")

      const response = await fetch(`/api/get-way-balance?address=${walletAddress}`)
      const data = await response.json()

      if (data.success) {
        const balance = Number.parseFloat(data.balance)
        this.updateWAYBalance(walletAddress, balance)
        return balance
      } else {
        throw new Error(data.error || "Failed to fetch balance")
      }
    } catch (error) {
      console.error("❌ Error forcing balance update:", error)
      return 0
    }
  }

  onBalanceChange(callback: (balance: number) => void): () => void {
    const handleBalanceUpdate = (event: CustomEvent) => {
      if (event.detail?.wayBalance !== undefined) {
        callback(event.detail.wayBalance)
      }
    }

    window.addEventListener("way_balance_updated", handleBalanceUpdate as EventListener)

    return () => {
      window.removeEventListener("way_balance_updated", handleBalanceUpdate as EventListener)
    }
  }
}

export const balanceSyncService = BalanceSyncService.getInstance()
