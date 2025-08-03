// World Chain Network Configuration
export const WORLD_CHAIN_CONFIG = {
  chainId: 480,
  name: "World Chain Mainnet",
  rpcUrl: "https://worldchain-mainnet.g.alchemy.com/public",
  blockExplorer: "https://worldscan.org",
  bridge: "https://worldchain-mainnet.bridge.alchemy.com",
}

// WAY Token Address on World Chain
export const WAY_TOKEN_ADDRESS = "0xb8dE16B8ED23760AB3699D5c7F6F889f1707a978"

// ERC-20 ABI for token balance queries
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
]
