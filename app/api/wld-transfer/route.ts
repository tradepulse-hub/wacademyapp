import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { WORLD_CHAIN_CONFIG, ERC20_ABI } from "@/lib/constants"

// Endereço do token WLD na World Chain
const WLD_TOKEN_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003" // Endereço WLD fornecido

export async function POST(req: Request) {
  try {
    const { recipientAddress, amount } = await req.json()

    if (!recipientAddress || !amount) {
      return NextResponse.json({ error: "Recipient address and amount are required" }, { status: 400 })
    }

    // Criar uma interface para o contrato ERC-20 para codificar a chamada da função
    const iface = new ethers.Interface(ERC20_ABI)

    // Converter o valor para BigNumber com 18 decimais (padrão para a maioria dos tokens ERC-20)
    const amountWei = ethers.parseUnits(amount.toString(), 18)

    // Codificar a chamada da função 'transfer'
    const data = iface.encodeFunctionData("transfer", [recipientAddress, amountWei])

    // Retornar os dados da transação para o cliente
    return NextResponse.json({
      to: WLD_TOKEN_ADDRESS,
      data: data,
      value: "0x0", // 0 ETH/WLD para uma transferência de token ERC-20
      chainId: WORLD_CHAIN_CONFIG.chainId,
    })
  } catch (error) {
    console.error("Error preparing WLD transfer transaction:", error)
    return NextResponse.json({ error: "Failed to prepare WLD transfer transaction" }, { status: 500 })
  }
}
