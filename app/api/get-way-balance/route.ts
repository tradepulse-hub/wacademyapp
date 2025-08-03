import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { WORLD_CHAIN_CONFIG, WAY_TOKEN_CONFIG, ERC20_ABI } from "@/lib/constants"

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
    console.log(`📡 Using RPC: ${WORLD_CHAIN_CONFIG.rpcUrl}`)
    console.log(`🪙 WAY Token: ${WAY_TOKEN_CONFIG.address}`)

    // Create provider for World Chain
    const provider = new ethers.JsonRpcProvider(WORLD_CHAIN_CONFIG.rpcUrl)

    // Create contract instance for WAY token
    const contract = new ethers.Contract(WAY_TOKEN_CONFIG.address, ERC20_ABI, provider)

    // Get balance
    const balance = await contract.balanceOf(address)
    console.log(`📊 Raw balance: ${balance.toString()}`)

    // Convert from wei to readable format
    const formattedBalance = ethers.formatUnits(balance, WAY_TOKEN_CONFIG.decimals)
    console.log(`✅ Formatted balance: ${formattedBalance} WAY`)

    return NextResponse.json({
      success: true,
      balance: formattedBalance,
      address: address,
      token: WAY_TOKEN_CONFIG.symbol,
      network: WORLD_CHAIN_CONFIG.name,
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
