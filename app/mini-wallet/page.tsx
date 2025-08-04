"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, History, ArrowLeftRight, ArrowLeft } from "lucide-react"

export default function MiniWalletPage() {
  const router = useRouter()
  const [sendAmount, setSendAmount] = useState("")
  const [sendAddress, setSendAddress] = useState("")
  const [receiveAmount, setReceiveAmount] = useState("")

  const mockBalance = "1,234.56"
  const mockTransactions = [
    { id: 1, type: "send", amount: "50.00", address: "0x1234...5678", date: "2024-01-15" },
    { id: 2, type: "receive", amount: "100.00", address: "0x9876...4321", date: "2024-01-14" },
    { id: 3, type: "swap", amount: "25.00", pair: "ETH/USDC", date: "2024-01-13" },
  ]

  const handleSend = () => {
    console.log("Sending", sendAmount, "to", sendAddress)
    // Implement send logic
  }

  const handleReceive = () => {
    console.log("Generating receive address for", receiveAmount)
    // Implement receive logic
  }

  const handleSwap = () => {
    console.log("Initiating swap")
    // Implement swap logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Mini Wallet</h1>
          <div></div>
        </div>

        {/* Balance Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Balance</CardTitle>
            <p className="text-3xl font-bold text-green-600">${mockBalance}</p>
          </CardHeader>
        </Card>

        {/* Wallet Functions */}
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="receive">Receive</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Send Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="send-amount">Amount</Label>
                  <Input
                    id="send-amount"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="send-address">Recipient Address</Label>
                  <Input
                    id="send-address"
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                  />
                </div>
                <Button onClick={handleSend} className="w-full">
                  Send
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownLeft className="h-5 w-5" />
                  Receive Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="receive-amount">Expected Amount (Optional)</Label>
                  <Input
                    id="receive-amount"
                    placeholder="0.00"
                    value={receiveAmount}
                    onChange={(e) => setReceiveAmount(e.target.value)}
                  />
                </div>
                <div className="rounded-lg bg-gray-100 p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Your Wallet Address:</p>
                  <p className="font-mono text-sm break-all">0x1234567890abcdef1234567890abcdef12345678</p>
                </div>
                <Button onClick={handleReceive} className="w-full">
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        {tx.type === "send" && <ArrowUpRight className="h-4 w-4 text-red-500" />}
                        {tx.type === "receive" && <ArrowDownLeft className="h-4 w-4 text-green-500" />}
                        {tx.type === "swap" && <ArrowLeftRight className="h-4 w-4 text-blue-500" />}
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${tx.amount}</p>
                        {tx.address && <p className="text-sm text-gray-500">{tx.address}</p>}
                        {tx.pair && <p className="text-sm text-gray-500">{tx.pair}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  Token Swap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>From</Label>
                    <div className="flex gap-2">
                      <Input placeholder="0.00" className="flex-1" />
                      <Button variant="outline" className="px-3 bg-transparent">
                        ETH
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>To</Label>
                    <div className="flex gap-2">
                      <Input placeholder="0.00" className="flex-1" />
                      <Button variant="outline" className="px-3 bg-transparent">
                        USDC
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex justify-between text-sm">
                    <span>Exchange Rate:</span>
                    <span>1 ETH = 2,500 USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fee:</span>
                    <span>0.3%</span>
                  </div>
                </div>

                <Button onClick={handleSwap} className="w-full">
                  Swap Tokens
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
