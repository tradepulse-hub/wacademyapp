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
  lastClaimTime: number
  nextClaimTime: number
  canClaim: boolean
  timeRemaining: number
  airdropAmount: string
  rpcUsed: string
}
