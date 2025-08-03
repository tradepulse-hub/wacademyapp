import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { WORLD_CHAIN_CONFIG, WAY_TOKEN_ADDRESS, ERC20_ABI } from "@/lib/constants"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ success: false, error: "Address parameter is required" }, { status: 400 })
    }

    console.log(`🔍 API: Getting WAY balance for ${address}`)

    // Create provider for World Chain
    const provider = new ethers.JsonRpcProvider(WORLD_CHAIN_CONFIG.rpcUrl)

    // Create contract instance
    const contract = new ethers.Contract(WAY_TOKEN_ADDRESS, ERC20_ABI, provider)

    // Get balance and decimals
    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(address),
      contract.decimals(),
      contract.symbol(),
    ])

    // Format balance
    const formattedBalance = ethers.formatUnits(balance, decimals)

    console.log(`✅ API: WAY balance retrieved: ${formattedBalance}`)

    return NextResponse.json({
      success: true,
      balance: formattedBalance,
      symbol: symbol,
      address: address,
      tokenAddress: WAY_TOKEN_ADDRESS,
    })
  } catch (error) {
    console.error("❌ API Error getting WAY balance:", error)

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
