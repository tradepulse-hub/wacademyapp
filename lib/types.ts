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
}

export interface WalletInfo {
  address: string
  balances: TokenBalance[]
  transactions: Transaction[]
}
