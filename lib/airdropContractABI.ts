import { ethers } from "ethers"

// NOVO Endereço do contrato de airdrop na Worldchain
export const AIRDROP_CONTRACT_ADDRESS = "0x1015996F31A318aEe1dd25a03D190A6B962447a5"

// Endereço do token TPF (mantido do projeto anterior, assumindo que é o token de recompensa)
export const TPF_TOKEN_ADDRESS = "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45"

// Lista de RPCs para World Chain
export const RPC_ENDPOINTS = [
  "https://worldchain-mainnet.g.alchemy.com/public", // RPC principal da World Chain
  "https://rpc.worldcoin.org",
  "https://worldchain-testnet.g.alchemy.com/public",
  "https://rpc-testnet.worldcoin.org",
]

// ABI completa do NOVO contrato de airdrop (extraída do Solidity fornecido)
export const airdropContractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "AirdropClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "AddressBlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "AddressUnblocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newToken",
        type: "address",
      },
    ],
    name: "RewardTokenChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "blockedAddresses",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "blockAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimAirdrop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "claimsToday",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getTodaysClaims",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lastClaimDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newToken",
        type: "address",
      },
    ],
    name: "setRewardToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "unblockAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawExcessTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

// Criar uma instância do contrato
export const getAirdropContract = async () => {
  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl)

      // Verificar se o contrato existe
      const code = await provider.getCode(AIRDROP_CONTRACT_ADDRESS)
      if (code === "0x") {
        console.log(`Contract not found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)
        continue // Tentar próximo RPC
      }

      console.log(`Contract found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)
      return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, airdropContractABI, provider)
    } catch (error) {
      console.error(`Error with RPC ${rpcUrl}:`, error)
      // Continuar para o próximo RPC
    }
  }

  throw new Error("Failed to connect to any RPC endpoint")
}
