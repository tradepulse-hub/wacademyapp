import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { airdropContractABI, AIRDROP_CONTRACT_ADDRESS, RPC_ENDPOINTS } from "@/lib/airdropContractABI"

// Constantes do contrato (hardcoded, pois não são funções de visualização no ABI)
const MAX_DAILY_CLAIMS = 20
const TOKENS_PER_CLAIM = 1 // 1 token

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: "Address parameter is required",
        },
        { status: 400 },
      )
    }

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

        // Buscar dados do contrato usando getTodaysClaims e blockedAddresses
        const [claimsToday, isBlocked] = await Promise.all([
          contract.getTodaysClaims(address),
          contract.blockedAddresses(address),
        ])

        console.log("Contract data retrieved:", {
          claimsToday: Number(claimsToday),
          isBlocked: isBlocked,
        })

        const canClaim = !isBlocked && Number(claimsToday) < MAX_DAILY_CLAIMS

        return NextResponse.json({
          success: true,
          lastClaimTime: 0, // Não mais diretamente do contrato
          nextClaimTime: 0, // Não mais diretamente do contrato
          canClaim: canClaim,
          timeRemaining: 0, // Não mais diretamente do contrato
          airdropAmount: TOKENS_PER_CLAIM.toString(),
          rpcUsed: rpcUrl,
          claimsToday: Number(claimsToday),
          maxDailyClaims: MAX_DAILY_CLAIMS,
          isBlocked: isBlocked,
        })
      } catch (error: any) {
        console.error(`Error with RPC ${rpcUrl}:`, error)
        lastError = error
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch airdrop status from any RPC endpoint",
        details: lastError instanceof Error ? lastError.message : "Unknown error",
      },
      { status: 500 },
    )
  } catch (error: any) {
    console.error("Error fetching airdrop status:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch airdrop status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
