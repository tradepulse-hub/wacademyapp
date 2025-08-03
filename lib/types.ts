export interface Transaction {
  id: string
  hash: string
  type: "send" | "receive"
  amount: string
  tokenSymbol: string
  tokenAddress: string
  from: string
  to: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
  blockNumber: number
}

export interface TokenBalance {
  symbol: string
  address: string
  balance: string
  decimals: number
  name: string
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  balances: Record<string, string>
}

export interface AirdropStatus {
  success: boolean
  lastClaimTime: number // Mantido para compatibilidade, mas não usado diretamente pelo novo contrato
  nextClaimTime: number // Mantido para compatibilidade, mas não usado diretamente pelo novo contrato
  canClaim: boolean
  timeRemaining: number // Mantido para compatibilidade, mas não usado diretamente pelo novo contrato
  airdropAmount: string
  rpcUsed: string
  claimsToday: number // Novo campo para o novo contrato
  maxDailyClaims: number // Novo campo para o novo contrato
  isBlocked: boolean // Novo campo para o novo contrato
}
