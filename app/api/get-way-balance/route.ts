import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { WAY_TOKEN_ADDRESS, WORLD_CHAIN_RPC_URL, ERC20_ABI } from "@/lib/constants"

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

    console.log(`🔍 Fetching WAY balance for address: ${address}`)
    console.log(`📍 Token address: ${WAY_TOKEN_ADDRESS}`)
    console.log(`🌐 RPC URL: ${WORLD_CHAIN_RPC_URL}`)

    // Create provider for World Chain
    const provider = new ethers.JsonRpcProvider(WORLD_CHAIN_RPC_URL)

    // Create contract instance
    const contract = new ethers.Contract(WAY_TOKEN_ADDRESS, ERC20_ABI, provider)

    // Get balance and decimals
    const [balance, decimals] = await Promise.all([contract.balanceOf(address), contract.decimals()])

    // Format balance
    const formattedBalance = ethers.formatUnits(balance, decimals)

    console.log(`✅ WAY balance fetched: ${formattedBalance}`)

    return NextResponse.json({
      success: true,
      balance: formattedBalance,
      tokenAddress: WAY_TOKEN_ADDRESS,
      decimals: Number(decimals),
    })
  } catch (error) {
    console.error("❌ Error fetching WAY balance:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch WAY balance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
