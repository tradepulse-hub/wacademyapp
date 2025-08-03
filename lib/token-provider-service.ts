import { ethers } from "ethers"
import { WORLD_CHAIN_CONFIG, WAY_TOKEN_CONFIG, ERC20_ABI } from "./constants"

// Endereços dos tokens conhecidos na World Chain
const KNOWN_TOKENS = {
  WAY: WAY_TOKEN_CONFIG.address,
  WLD: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
  TPF: "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45",
  DNA: "0xED49fE44fD4249A09843C2Ba4bba7e50BECa7113",
  CASH: "0xbfdA4F50a2d5B9b864511579D7dfa1C72f118575",
  WDD: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
  WETH: "0x4200000000000000000000000000000000000006",
  USDCe: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
}

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
      console.log("🔄 Initializing TokenProvider service...")
      console.log(`📡 Connecting to: ${WORLD_CHAIN_CONFIG.rpcUrl}`)

      // Criar provider do ethers para World Chain
      this.provider = new ethers.JsonRpcProvider(WORLD_CHAIN_CONFIG.rpcUrl)

      // Verificar se está funcionando
      const blockNumber = await this.provider.getBlockNumber()
      console.log(`✅ Connected to ${WORLD_CHAIN_CONFIG.name}, current block: ${blockNumber}`)

      this.initialized = true
      console.log("✅ TokenProvider service initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize TokenProvider service:", error)
    }
  }

  // Obter saldo de um token específico
  async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<string> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.provider || !walletAddress || !tokenAddress) {
        throw new Error("TokenProvider not initialized or missing parameters")
      }

      console.log(`🔍 Getting token balance for ${walletAddress} on token ${tokenAddress}`)

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)
      const balance = await contract.balanceOf(walletAddress)

      // Assumindo 18 decimais para a maioria dos tokens
      const formatted = ethers.formatUnits(balance, 18)
      console.log(`✅ Token balance: ${formatted}`)

      return formatted
    } catch (error) {
      console.error("❌ Error getting token balance:", error)
      return "0"
    }
  }

  // Obter saldos de múltiplos tokens para uma carteira
  async getTokenBalances(walletAddress: string): Promise<Record<string, string>> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.provider || !walletAddress) {
        throw new Error("TokenProvider not initialized or wallet address missing")
      }

      console.log("🔍 Getting token balances for:", walletAddress)

      const formattedBalances: Record<string, string> = {}

      // Obter saldos de todos os tokens conhecidos
      for (const [symbol, address] of Object.entries(KNOWN_TOKENS)) {
        try {
          const balance = await this.getTokenBalance(walletAddress, address)
          formattedBalances[symbol] = balance
          console.log(`✅ ${symbol} balance: ${balance}`)
        } catch (error) {
          console.error(`❌ Error getting ${symbol} balance:`, error)
          formattedBalances[symbol] = "0"
        }
      }

      return formattedBalances
    } catch (error) {
      console.error("❌ Error getting token balances:", error)
      return {}
    }
  }

  // Obter endereços dos tokens conhecidos
  getKnownTokens() {
    return KNOWN_TOKENS
  }

  // Obter configuração da rede
  getNetworkConfig() {
    return WORLD_CHAIN_CONFIG
  }
}

// Exportar instância única
export const tokenProviderService = new TokenProviderService()
