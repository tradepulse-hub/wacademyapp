// World Chain Network Configuration
export const WORLD_CHAIN_RPC_URL = "https://worldchain-mainnet.g.alchemy.com/public"
export const WORLD_CHAIN_ID = 480

// WAY Token Address on World Chain
export const WAY_TOKEN_ADDRESS = "0xb8dE16B8ED23760AB3699D5c7F6F889f1707a978"

// ERC-20 ABI for balance queries
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
]
