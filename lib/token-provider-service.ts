import { ethers } from "ethers"

// Configuração da rede Worldchain
const WORLDCHAIN_RPC = "https://worldchain-mainnet.g.alchemy.com/public"

// Endereços dos tokens conhecidos
const KNOWN_TOKENS = {
  WAY: "0xb8dE16B8ED23760AB3699D5c7F6F889f1707a978",
  WLD: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
  DNA: "0xED49fE44fD4249A09843C2Ba4bba7e50BECa7113",
  CASH: "0xbfdA4F50a2d5B9b864511579D7dfa1C72f118575",
  WDD: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
  WETH: "0x4200000000000000000000000000000000000006",
  USDCe: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
}

// ERC-20 ABI mínima
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
]

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
      console.log("Initializing TokenProvider service...")

      // Criar provider do ethers
      this.provider = new ethers.JsonRpcProvider(WORLDCHAIN_RPC)

      // Verificar se está funcionando
      const blockNumber = await this.provider.getBlockNumber()
      console.log(`Connected to Worldchain, current block: ${blockNumber}`)

      this.initialized = true
      console.log("TokenProvider service initialized successfully")
    } catch (error) {
      console.error("Failed to initialize TokenProvider service:", error)
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

      console.log("Getting token balances for:", walletAddress)

      const formattedBalances: Record<string, string> = {}

      // Obter saldos de todos os tokens conhecidos
      for (const [symbol, address] of Object.entries(KNOWN_TOKENS)) {
        try {
          const contract = new ethers.Contract(address, ERC20_ABI, this.provider)
          const [balance, decimals] = await Promise.all([contract.balanceOf(walletAddress), contract.decimals()])

          const formatted = ethers.formatUnits(balance, decimals)
          formattedBalances[symbol] = formatted
          console.log(`${symbol} balance: ${formatted}`)
        } catch (error) {
          console.error(`Error getting ${symbol} balance:`, error)
          formattedBalances[symbol] = "0"
        }
      }

      return formattedBalances
    } catch (error) {
      console.error("Error getting token balances:", error)
      return {}
    }
  }

  // Obter endereços dos tokens conhecidos
  getKnownTokens() {
    return KNOWN_TOKENS
  }
}

// Exportar instância única
export const tokenProviderService = new TokenProviderService()
