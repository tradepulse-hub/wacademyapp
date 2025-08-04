"use client"

import { useState } from "react"
import { ArrowLeft, Send, Download, History, ArrowLeftRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WalletPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("send")

  const tabs = [
    { id: "send", label: "Send", icon: Send },
    { id: "receive", label: "Receive", icon: Download },
    { id: "history", label: "History", icon: History },
    { id: "swap", label: "Swap", icon: ArrowLeftRight },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "send":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>WLD</option>
                <option>USDC</option>
                <option>ETH</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Send Transaction
            </button>
          </div>
        )

      case "receive":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">QR Code</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Scan this QR code to receive tokens</p>
              <div className="bg-gray-100 p-3 rounded-lg break-all text-sm">
                0x1234567890abcdef1234567890abcdef12345678
              </div>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Copy Address
              </button>
            </div>
          </div>
        )

      case "history":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Send className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sent WLD</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">-10.5 WLD</p>
                    <p className="text-sm text-gray-500">$42.00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "swap":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="0.00"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>WLD</option>
                  <option>USDC</option>
                  <option>ETH</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeftRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="0.00"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <select className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>USDC</option>
                  <option>WLD</option>
                  <option>ETH</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">Exchange Rate: 1 WLD = 4.2 USDC</p>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Swap Tokens
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Wallet</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-blue-100 mb-2">Total Balance</p>
          <p className="text-3xl font-bold mb-4">$1,234.56</p>
          <div className="flex space-x-4 text-sm">
            <div>
              <p className="text-blue-200">WLD</p>
              <p className="font-medium">125.5</p>
            </div>
            <div>
              <p className="text-blue-200">USDC</p>
              <p className="font-medium">500.0</p>
            </div>
            <div>
              <p className="text-blue-200">ETH</p>
              <p className="font-medium">0.25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">{renderTabContent()}</div>
      </div>
    </div>
  )
}
