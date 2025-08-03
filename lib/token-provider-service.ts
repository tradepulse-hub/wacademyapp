import { ethers } from "ethers"
import { WORLD_CHAIN_CONFIG, WAY_TOKEN_ADDRESS, ERC20_ABI } from "./constants"

class TokenProviderService {
  private provider: ethers.JsonRpcProvider | null = null
  private initialized = false

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize()
    }
  }

  private async initialize() {
    if (this.initialized) return

    try {
      console.log("🔗 Initializing World Chain provider...")

      // Create provider for World Chain
      this.provider = new ethers.JsonRpcProvider(WORLD_CHAIN_CONFIG.rpcUrl)

      // Test connection
      const blockNumber = await this.provider.getBlockNumber()
      console.log(`✅ Connected to World Chain, current block: ${blockNumber}`)

      this.initialized = true
    } catch (error) {
      console.error("❌ Failed to initialize World Chain provider:", error)
    }
  }

  // Get WAY token balance for a wallet address
  async getWAYBalance(walletAddress: string): Promise<string> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.provider || !walletAddress) {
        throw new Error("Provider not initialized or wallet address missing")
      }

      console.log(`🔍 Getting WAY balance for: ${walletAddress}`)

      // Create contract instance
      const contract = new ethers.Contract(WAY_TOKEN_ADDRESS, ERC20_ABI, this.provider)

      // Get balance and decimals
      const [balance, decimals] = await Promise.all([contract.balanceOf(walletAddress), contract.decimals()])

      // Format balance
      const formattedBalance = ethers.formatUnits(balance, decimals)

      console.log(`💰 WAY balance: ${formattedBalance}`)
      return formattedBalance
    } catch (error) {
      console.error("❌ Error getting WAY balance:", error)
      throw error
    }
  }

  // Get token info
  async getTokenInfo(): Promise<{ name: string; symbol: string; decimals: number }> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.provider) {
        throw new Error("Provider not initialized")
      }

      const contract = new ethers.Contract(WAY_TOKEN_ADDRESS, ERC20_ABI, this.provider)

      const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()])

      return { name, symbol, decimals: Number(decimals) }
    } catch (error) {
      console.error("❌ Error getting token info:", error)
      throw error
    }
  }
}

// Export singleton instance
export const tokenProviderService = new TokenProviderService()
