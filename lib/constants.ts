// World Chain Network Configuration
export const WORLD_CHAIN_CONFIG = {
  chainId: 480, // 0x1e0
  name: "World Chain Mainnet",
  shortName: "wc",
  rpcUrl: "https://worldchain-mainnet.g.alchemy.com/public",
  blockExplorer: "https://worldscan.org",
  bridge: "https://worldchain-mainnet.bridge.alchemy.com",
  statusPage: "https://worldchain-mainnet-status.alchemy.com",
  gasLimit: 30_000_000,
  gasTarget: 15_000_000,
  blockTime: 2, // seconds
}

// WAY Token Configuration
export const WAY_TOKEN_CONFIG = {
  address: "0xb8dE16B8ED23760AB3699D5c7F6F889f1707a978",
  symbol: "WAY",
  decimals: 18,
  name: "WAY Token",
}

// ERC-20 ABI for token balance queries and transfer
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
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: false, // transfer is a state-changing function
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
]
