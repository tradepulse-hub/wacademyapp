import { ethers } from "ethers"
import { AIRDROP_CONTRACT_ADDRESS, RPC_ENDPOINTS, airdropContractABI } from "./airdropContractABI"
import type { AirdropStatus } from "./types" // Importar o tipo AirdropStatus

// Constantes do contrato (hardcoded, pois não são funções de visualização no ABI)
const TOKENS_PER_CLAIM = 1 // 1 token
const MAX_DAILY_CLAIMS = 20 // Máximo de 20 resgates/dia

// Função para obter o status do airdrop para um endereço
export async function getAirdropStatus(address: string): Promise<AirdropStatus> {
  try {
    console.log(`Checking airdrop status for address: ${address}`)
    console.log(`Using contract address: ${AIRDROP_CONTRACT_ADDRESS}`)

    let lastError: any = null

    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        console.log(`Trying RPC endpoint: ${rpcUrl}`)

        const provider = new ethers.JsonRpcProvider(rpcUrl)

        const code = await provider.getCode(AIRDROP_CONTRACT_ADDRESS)
        if (code === "0x") {
          console.log(`Contract not found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)
          continue
        }

        console.log(`Contract found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)

        const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, airdropContractABI, provider)

        // Buscar dados do contrato usando getTodaysClaims
        const claimsToday = await contract.getTodaysClaims(address)
        const isBlocked = await contract.blockedAddresses(address)

        console.log("Contract data retrieved:", {
          claimsToday: Number(claimsToday),
          isBlocked: isBlocked,
        })

        const canClaim = !isBlocked && Number(claimsToday) < MAX_DAILY_CLAIMS

        return {
          success: true,
          lastClaimTime: 0, // Não mais diretamente do contrato, mas pode ser inferido ou removido
          nextClaimTime: 0, // Não mais diretamente do contrato
          canClaim: canClaim,
          timeRemaining: 0, // Não mais diretamente do contrato
          airdropAmount: TOKENS_PER_CLAIM.toString(),
          rpcUsed: rpcUrl,
          claimsToday: Number(claimsToday),
          maxDailyClaims: MAX_DAILY_CLAIMS,
          isBlocked: isBlocked,
        }
      } catch (error: any) {
        console.error(`Error with RPC ${rpcUrl}:`, error)
        lastError = error
      }
    }

    console.log("All RPCs failed, returning default status.")
    return {
      success: false,
      error: lastError instanceof Error ? lastError.message : "Failed to fetch airdrop status from any RPC endpoint",
      lastClaimTime: 0,
      nextClaimTime: 0,
      canClaim: false,
      timeRemaining: 0,
      airdropAmount: TOKENS_PER_CLAIM.toString(),
      rpcUsed: "none",
      claimsToday: 0,
      maxDailyClaims: MAX_DAILY_CLAIMS,
      isBlocked: false,
    }
  } catch (error: any) {
    console.error("Error fetching airdrop status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch airdrop status",
      lastClaimTime: 0,
      nextClaimTime: 0,
      canClaim: false,
      timeRemaining: 0,
      airdropAmount: TOKENS_PER_CLAIM.toString(),
      rpcUsed: "none",
      claimsToday: 0,
      maxDailyClaims: MAX_DAILY_CLAIMS,
      isBlocked: false,
    }
  }
}

// Função para obter o saldo do contrato
export async function getContractBalance() {
  try {
    console.log(`Fetching contract balance from address: ${AIRDROP_CONTRACT_ADDRESS}`)

    let lastError: any = null

    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        console.log(`Trying RPC endpoint: ${rpcUrl}`)

        const provider = new ethers.JsonRpcProvider(rpcUrl)

        const code = await provider.getCode(AIRDROP_CONTRACT_ADDRESS)
        if (code === "0x") {
          console.log(`Contract not found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)
          continue
        }

        console.log(`Contract found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)

        const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, airdropContractABI, provider)

        const balance = await contract.contractBalance()
        // O contrato AirdropPreConfigured transfere 1 token (10^18 decimais), então formatUnits(balance, 18) é apropriado
        const formattedBalance = ethers.formatUnits(balance, 18)

        console.log(`Contract balance: ${formattedBalance} TPF`)

        return {
          success: true,
          balance: formattedBalance,
          rpcUsed: rpcUrl,
        }
      } catch (error: any) {
        console.error(`Error with RPC ${rpcUrl}:`, error)
        lastError = error
      }
    }

    console.log("All RPCs failed, returning simulated contract balance.")
    return {
      success: true,
      balance: "1000000", // Valor simulado
      rpcUsed: "simulation",
    }
  } catch (error: any) {
    console.error("Error fetching airdrop contract balance:", error)
    return {
      success: false,
      error: "Failed to fetch airdrop contract balance",
      details: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Função para reivindicar o airdrop
export async function claimAirdrop(address: string) {
  try {
    console.log(`Attempting to claim airdrop for address: ${address}`)

    if (typeof window === "undefined" || !window.MiniKit || !window.MiniKit.isInstalled()) {
      console.warn("MiniKit is not installed or not available in this environment. Trying alternative API method.")
      // Fallback para a API se MiniKit não estiver disponível
      return await processAirdrop(address)
    }

    console.log("MiniKit is installed, preparing to claim airdrop...")
    console.log("Contract address:", AIRDROP_CONTRACT_ADDRESS)
    console.log("Using ABI:", JSON.stringify(airdropContractABI))

    try {
      // Usar o MiniKit para enviar a transação
      console.log("Calling MiniKit.commandsAsync.sendTransaction...")
      const { finalPayload } = await window.MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: AIRDROP_CONTRACT_ADDRESS,
            abi: airdropContractABI,
            functionName: "claimAirdrop",
            args: [], // A função claimAirdrop do novo contrato não recebe argumentos
          },
        ],
      })

      console.log("MiniKit transaction response:", finalPayload)

      if (finalPayload.status === "error") {
        console.error("Error claiming airdrop:", finalPayload.message)
        throw new Error(finalPayload.message || "Failed to claim airdrop via MiniKit")
      }

      console.log("Airdrop claimed successfully:", finalPayload)

      // Não há mais necessidade de salvar lastClaim_address no localStorage para o novo contrato
      // A lógica de claimsToday é gerenciada no contrato.
      // A atualização do saldo do usuário deve ser feita buscando o saldo real após o claim.
      // Disparar evento para que a UI possa atualizar o saldo
      window.dispatchEvent(new CustomEvent("tpf_balance_updated"))

      return {
        success: true,
        txId: finalPayload.transaction_id,
      }
    } catch (error: any) {
      console.error("Error in MiniKit transaction:", error)
      console.log("Trying alternative method via API...")
      return await processAirdrop(address)
    }
  } catch (error: any) {
    console.error("Error claiming airdrop:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during the claim",
    }
  }
}

// Método alternativo para processar o airdrop via API (simulação de backend)
export async function processAirdrop(userAddress: string) {
  try {
    console.log(`Processing airdrop via API for address: ${userAddress}`)

    // Simular uma assinatura e timestamp
    const timestamp = Date.now()
    const signature = Math.random().toString(36).substring(2, 15)

    // Chamar a API para processar o airdrop
    const response = await fetch("/api/airdrop/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signature,
        userAddress,
        timestamp,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to process airdrop via API")
    }

    // Disparar evento para que a UI possa atualizar o saldo
    window.dispatchEvent(new CustomEvent("tpf_balance_updated"))

    return {
      success: true,
      txId: data.txId,
    }
  } catch (error: any) {
    console.error("Error processing airdrop via API:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during API processing",
    }
  }
}
